import gapi from 'gapi';

import {ChromeStorage} from '../common/chrome_api.js';

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
        ChromeStorage.get('scripts')
            .then((result) => this._loadAndSetScriptsFromIds((result === undefined) ? [] : result));
    }

    addScripts = (scriptIds) =>
    {
        let newScriptIdsArray = [];
        ChromeStorage.get('scripts')
            .then((result) => {
                const storageScriptIds = (result === undefined) ? [] : result;
                let newScriptIdsSet = new Set(storageScriptIds);
                scriptIds.forEach((sId) => newScriptIdsSet.add(sId));

                newScriptIdsArray = Array.from(newScriptIdsSet);
                return ChromeStorage.set('scripts', newScriptIdsArray);
            })
            .then(() => this._loadAndSetScriptsFromIds(newScriptIdsArray));
    }

    deleteScript = (scriptId) =>
    {
        let newScriptIdsArray = [];
        return ChromeStorage.get('scripts')
            .then((storageScriptIds) => {
                let foundScript = false;
                for (const ssId of storageScriptIds)
                {
                    if (ssId === scriptId)
                    {
                        foundScript = true;
                    }
                    else
                    {
                        newScriptIdsArray.push(ssId);
                    }
                }
                
                if (!foundScript)
                {
                    throw `Did not find script with id ${scriptId} in storage. Scripts present: ${storageScriptIds}`;
                }
                return ChromeStorage.set('scripts', newScriptIdsArray);
            })
            .then(() => this._loadAndSetScriptsFromIds(newScriptIdsArray));
    }

    _loadAndSetScriptsFromIds = (scriptIds) =>
    {
        if (scriptIds.length === 0)
        {
            this._setScripts([]);
            return;
        }

        const getFilePromises = scriptIds.map(
            (sId) => gapi.client.drive.files.get({
                'fileId': sId, 
                'fields': 'name, description, id, webViewLink'
            })
        );

        return Promise.all(getFilePromises).then((results) => {
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
