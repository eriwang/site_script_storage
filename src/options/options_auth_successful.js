import React from 'react';

import {CrossButton, DropdownButton} from '../common/svg_buttons.js';
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
            <Script key={s.id} name={s.name} id={s.id} description={s.description} />
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

class Script extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div>
                <p>Script: {this.props.name}</p>
                <p>Desc: {this.props.description}</p>
                <CrossButton/>
                <DropdownButton/>
            </div>
        );
    }
}

export default OptionsAuthSuccessful;
