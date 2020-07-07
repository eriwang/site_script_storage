import gapi from 'gapi';
import React from 'react';
import ReactDOM from 'react-dom';

import './popup.html';
import {ChromeTabs, ChromeIdentity} from '../common/chrome_api.js';
import DriveScriptsManager from '../common/drive_scripts_manager.js';
import keys from '../../keys.json';

class Popup extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'scripts': null
        };
    }

    // Google auth steps:
    // - load client and possibly picker lib
    // - gapi.client.init
    // - chrome.identity.getAuthToken (interactive: false), have this be a promise
    //      - if token exists, gapi.auth.setToken
    //      - if token undefined, calling class handles
    // - have a path for interactive: true
    // - should be a singleton to make life easy
    // - calling class will call "loadLibsAndAuth". If success, good to use gapi. If not, have a path to auth w/ user

    // TODO: duplicated from options.js
    componentDidMount()
    {
        gapi.load('client', () => {
            let initArgs = {
                'apiKey': keys.API_KEY,
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
            };
            gapi.client.init(initArgs)
                .then(() => ChromeIdentity.getAuthToken(true))
                .then((token) => {
                    gapi.auth.setToken({'access_token': token});
                    DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
                    DriveScriptsManager.loadScripts();
                });
        });
    }

    render()
    {
        if (this.state.scripts === null)
        {
            return 'Loading scripts data...';
        }
        if (this.state.scripts.length === 0)
        {
            return 'No scripts. Try registering scripts in the option spage.';
        }

        const scriptElements = this.state.scripts.map((s) => (
            <div key={s.id}>
                <p>{s.name}</p>
                <button onClick={() => this._runScript(s.id)}>Run Script</button>
            </div>
        ));
        return <div>{scriptElements}</div>;
    }

    // TODO: extension feedback that script execution is running/ done?
    _runScript = (scriptId) =>
    {
        gapi.client.drive.files.get({'fileId': scriptId, 'alt': 'media'})
            .then((data) => ChromeTabs.executeScript(data['body']));
    }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
