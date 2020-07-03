import gapi from 'gapi';
import React from 'react';
import ReactDOM from 'react-dom';

import './popup.html';
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

    // TODO: duplicated from options.js
    componentDidMount()
    {
        gapi.load('client', () => {
            gapi.client.init({
                apiKey: keys.API_KEY,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            }).then(() => {
                chrome.identity.getAuthToken({interactive: true}, (token) => {
                    if (chrome.runtime.lastError !== undefined)
                    {
                        throw chrome.runtime.lastError;
                    }
        
                    gapi.auth.setToken({'access_token': token});
                    DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
                    DriveScriptsManager.loadScripts();
                });
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
            .then((data) => {
                chrome.tabs.executeScript({
                    'code': data['body']
                });
            });
    }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
