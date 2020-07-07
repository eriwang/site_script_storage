import gapi from 'gapi';
import React from 'react';
import ReactDOM from 'react-dom';

import './popup.html';
import {ChromeTabs} from '../common/chrome_api.js';
import DriveScriptsManager from '../common/drive_scripts_manager.js';
import GapiLibsAndAuth from '../common/gapi_auth.js';

class Popup extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'failedAuth': false,
            'scripts': null
        };
    }

    componentDidMount()
    {
        GapiLibsAndAuth.loadAndAuthNoUi([])
            .then(() => {
                if (GapiLibsAndAuth.getAuthToken() === null)
                {
                    this.setState({'failedAuth': true});
                    return;
                }

                DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
                DriveScriptsManager.loadScripts();
            });
    }

    render()
    {
        if (this.state.failedAuth)
        {
            return 'Extension authentication failed. Allow extension access in the options page.';
        }
        if (this.state.scripts === null)
        {
            return 'Loading scripts data...';
        }
        if (this.state.scripts.length === 0)
        {
            return 'No scripts. Try registering scripts in the options page.';
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
