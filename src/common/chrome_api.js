import chrome from 'chrome';

class ChromeStorage
{
    static get(key)
    {
        return new Promise((resolve) => {
            chrome.storage.sync.get([key], (result) => {
                _validateChromeLastError();
                resolve(result[key]);
            });
        });
    }
    
    static set(key, value)
    {
        return new Promise((resolve) => {
            let newStorageObject = {};
            newStorageObject[key] = value;
            chrome.storage.sync.set(newStorageObject, () => {
                _validateChromeLastError();
                resolve();
            });
        });
    }   
}

class ChromeIdentity
{
    static getAuthToken(interactive)
    {
        return new Promise((resolve) => {
            chrome.identity.getAuthToken({'interactive': interactive}, (result) => {
                _validateChromeLastError();
                resolve(result);
            });
        });
    }
}

class ChromeTabs
{
    static executeScript(code)
    {
        return new Promise((resolve) => {
            chrome.tabs.executeScript({'code': code}, () => {
                _validateChromeLastError();
                resolve();
            });
        });
    }
}

function _validateChromeLastError()
{
    if (chrome.runtime.lastError !== undefined)
    {
        throw chrome.runtime.lastError;
    }
}

export {ChromeStorage, ChromeIdentity, ChromeTabs};