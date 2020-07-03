import gapi from 'gapi';

class DriveScriptsManagerClass
{
    constructor()
    {
        this._scripts = [];
        this._scriptsChangeHandlers = [];
    }

    addChangeHandler = (handler) =>
    {
        this._scriptsChangeHandlers.push(handler);
    }

    loadScripts = () =>
    {
        chrome.storage.sync.get(['scripts'], (result) => {
            if (chrome.runtime.lastError !== undefined)
            {
                throw chrome.runtime.lastError;
            }

            this._loadAndSetScriptsFromIds(('scripts' in result) ? result.scripts : []);
        });
    }

    // TODO: promises
    addScripts = (scriptIds) =>
    {
        chrome.storage.sync.get(['scripts'], (result) => {
            if (chrome.runtime.lastError !== undefined)
            {
                throw chrome.runtime.lastError;
            }
            const storageScriptIds = ('scripts' in result) ? result.scripts : [];
            const newScriptIdsSet = new Set(storageScriptIds);
            scriptIds.forEach((s) => newScriptIdsSet.add(s.id));

            const newScriptIdsArray = Array.from(newScriptIdsSet);
            chrome.storage.sync.set({'scripts': newScriptIdsArray}, () => {
                if (chrome.runtime.lastError !== undefined)
                {
                    throw chrome.runtime.lastError;
                }

                this._loadAndSetScriptsFromIds(newScriptIdsArray);
            });
        });
    }

    _loadAndSetScriptsFromIds = (scriptIds) =>
    {
        if (scriptIds.length === 0)
        {
            this._setScripts([]);
            return;
        }

        const getFilePromises = scriptIds.map(
            (sId) => gapi.client.drive.files.get({'fileId': sId, 'fields': 'name, description, id'})
        );

        Promise.all(getFilePromises).then((results) => {
            const scripts = results.map((r) => JSON.parse(r.body));
            this._setScripts(scripts);
        });
    }

    _setScripts = (scripts) =>
    {
        this._scripts = scripts;
        for (let handler of this._scriptsChangeHandlers)
        {
            handler(this._scripts);
        }
    }
}

let DriveScriptsManager = new DriveScriptsManagerClass();
export default DriveScriptsManager;
