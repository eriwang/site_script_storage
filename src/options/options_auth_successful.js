import React from 'react';

import DriveScriptsManager from '../common/drive_scripts_manager.js';
import launchGoogleDrivePicker from './google_drive_picker.js';

class OptionsAuthSuccessful extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'scripts': null
        };
    }

    componentDidMount()
    {
        DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
        DriveScriptsManager.loadScripts();
    }

    render()
    {
        return (
            <div>
                <h2>Manage Existing Scripts</h2>
                <div>{this._createScriptsDiv()}</div>
                <h2>Import Scripts from Drive</h2>
                <button onClick={this._handleImportButtonClick}>Import</button>
            </div>
        );
    }

    _createScriptsDiv = () =>
    {
        if (this.state.scripts === null)
        {
            return 'Loading scripts data...';
        }
        if (this.state.scripts.length === 0)
        {
            return 'No scripts, add scripts by importing from drive.';
        }

        const scriptElements = this.state.scripts.map((s) => (
            <p key={s.id}>Script: {s.name}, id: {s.id}, desc: {s.description}</p>
        ));
        return <div>{scriptElements}</div>;
    }

    _handleImportButtonClick = () =>
    {
        launchGoogleDrivePicker()
            .then((scripts) => {
                if (scripts === null)
                {
                    return;
                }

                DriveScriptsManager.addScripts(scripts);
            });
    }
}

export default OptionsAuthSuccessful;