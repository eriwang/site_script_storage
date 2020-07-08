import React from 'react';

import {CrossButton, DropdownButton, EditButton} from '../common/svg_buttons.js';
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
                {this._createScriptsManagementContents()}
                <h2>Import Scripts from Drive</h2>
                <p className="help">You can select multiple .js files at once by using ctrl/ shift.</p>
                <button onClick={this._handleImportButtonClick}>Import</button>
            </div>
        );
    }

    _createScriptsManagementContents = () =>
    {
        if (this.state.scripts === null)
        {
            return <p>Loading scripts data...</p>;
        }
        if (this.state.scripts.length === 0)
        {
            return <p>No scripts, add scripts by importing from drive.</p>;
        }

        const scriptElements = this.state.scripts.map((s) => (
            <Script key={s.id} scriptObj={s} />
        ));
        return (
            <div>
                <p className="help">
                    Editing name/ description is done by editing the file entry in Drive. 
                    You will need to refresh to see changes.
                </p>
                {scriptElements}
            </div>
        );
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
        this.state = {
            'showDetails': false
        };
    }

    render()
    {
        const script = this.props.scriptObj;
        const dropdownContents = (!this.state.showDetails) ? null : (
            <p>{(script.description === undefined) ? 'Script has no description.' : script.description}</p>
        );

        return (
            <div className="script-row">
                <div className="script-row-shown">
                    <p>{script.name}</p>
                    <div className="script-row-shown-buttons">
                        <EditButton onClick={() => window.open(script.webViewLink, '_blank')}/>
                        <CrossButton />
                        <DropdownButton isDropped={this.state.showDetails} 
                            onClick={() => this.setState((prevState) => ({'showDetails': !prevState.showDetails}))}/>
                    </div>
                </div>
                <div className="script-row-hidden">
                    {dropdownContents}
                </div>
            </div>
        );
    }
}

export default OptionsAuthSuccessful;
