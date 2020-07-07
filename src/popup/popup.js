import gapi from 'gapi';
import React from 'react';
import ReactDOM from 'react-dom';

import './popup.css';
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

                DriveScriptsManager.addChangeHandler((scripts) => {
                    let newState = {'scripts': scripts};
                    scripts.forEach((s) => {
                        newState[`${s.id}_isRunning`] = false;
                    });
                    this.setState(newState);
                });
                DriveScriptsManager.loadScripts();
            });
    }

    render()
    {
        return (
            <div>
                <h2>Site Script Storage Runner</h2>
                {this._createContentDivContents()}
            </div>
        );
    }

    _createContentDivContents = () =>
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
            <div key={s.id} className="scriptPlay">
                <PlayButton isRunning={this.state[`${s.id}_isRunning`]} onClick={() => this._runScript(s.id)}/>
                <p className="scriptParagraph">{s.name}</p>
            </div>
        ));
        return scriptElements;
    }

    _runScript = (scriptId) =>
    {
        let key = `${scriptId}_isRunning`;
        let scriptIdUpdateState = {};
        scriptIdUpdateState[key] = true;
        this.setState(scriptIdUpdateState);

        gapi.client.drive.files.get({'fileId': scriptId, 'alt': 'media'})
            .then((data) => ChromeTabs.executeScript(data['body']))
            .then(() => {
                scriptIdUpdateState[key] = false;
                this.setState(scriptIdUpdateState);
            });
    }
}

// SVG sourced from https://feathericons.com/
class PlayButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            'mouseInside': false,
        };
    }

    render()
    {
        let fillColor, opacity;
        if (this.props.isRunning)
        {
            fillColor = 'black';
            opacity = 0.5;
        }
        else
        {
            fillColor = (this.state.mouseInside) ? 'black' : 'none';
            opacity = 1;
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="2" stroke="black" className="playBtn"
                fill={fillColor} opacity={opacity}
                onMouseEnter={() => this.setState({'mouseInside': true})}
                onMouseLeave={() => this.setState({'mouseInside': false})}
                onClick={this.props.onClick}>
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
        );
    }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
