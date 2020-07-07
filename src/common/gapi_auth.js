import gapi from 'gapi';

import {ChromeIdentity} from './chrome_api.js';
import keys from '../../keys.json';

class GapiLibsAndAuthClass
{
    constructor()
    {
        this._gapiClientInitialized = false;
        this._authToken = null;
    }

    // This call may not succeed if the user hasn't granted the extension permissions yet. Users of the method should
    // check the auth token is not null before using the token.
    loadAndAuthNoUi = (nonClientLibs) =>
    {
        if (this._gapiClientInitialized)
        {
            throw 'Trying to initalize load and auth multiple times, should use the auth() method instead';
        }

        let libs = nonClientLibs;
        libs.push('client');
        return new Promise((resolve) => {
            gapi.load(libs.join(':'), () => {
                let initArgs = {
                    apiKey: keys.API_KEY,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                };
                gapi.client.init(initArgs)
                    .then(() => this._gapiClientInitialized = true)
                    .then(() => this.auth(false))
                    .then(() => resolve());
            });
        });
    }

    auth = (showUi) =>
    {
        if (!this._gapiClientInitialized)
        {
            throw 'Tried to authenticate without loading gapi libs first';
        }
        if (this._authToken !== null)
        {
            throw 'Tried to auth when already authenticated';
        }

        return ChromeIdentity.getAuthToken(showUi)
            .then((token) => {
                if (token === undefined)
                {
                    return;
                }

                this._authToken = token;
                gapi.auth.setToken({'access_token': token});
            });
    }

    getAuthToken = () =>
    {
        return this._authToken;
    }
}

let GapiLibsAndAuth = new GapiLibsAndAuthClass();
export default GapiLibsAndAuth;
