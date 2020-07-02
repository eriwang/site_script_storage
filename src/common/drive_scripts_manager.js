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

    /* TODO: 
     * I'd like to store just the ID/ domains (i.e. extension-specific info) here. If I want the name/ description of
     * the script I need to query the Drive API. However, if I'm not authenticated, need to make sure the user knows,
     * probably by way of some text in the "manage" section telling user to auth.
     */
    loadScripts = () =>
    {
        chrome.storage.sync.get(['scripts'], (result) => {
            if (chrome.runtime.lastError !== undefined)
            {
                throw chrome.runtime.lastError;
            }

            this._setScripts(('scripts' in result) ? result['scripts'] : []);
        });
    }

    // TODO: promises
    addScripts = (scripts) =>
    {
        chrome.storage.sync.get(['scripts'], (result) => {
            if (chrome.runtime.lastError !== undefined)
            {
                throw chrome.runtime.lastError;
            }
            const storageScripts = ('scripts' in result) ? result['scripts'] : [];
            const newScriptsSet = new Set(storageScripts);
            scripts.forEach((s) => newScriptsSet.add(s['id']));

            const newScriptsArray = Array.from(newScriptsSet);
            chrome.storage.sync.set({'scripts':newScriptsArray}, () => {
                if (chrome.runtime.lastError !== undefined)
                {
                    throw chrome.runtime.lastError;
                }

                this._setScripts(newScriptsArray);
            });
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
