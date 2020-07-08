import React from 'react';
import ReactDOM from 'react-dom';

import './options.css';
import './options.html';
import DriveScriptsManager from '../common/drive_scripts_manager.js';
import GapiLibsAndAuth from '../common/gapi_auth.js';
import keys from '../../keys.json';

const AUTH_STATUS = {
    'LOADING': 0,
    'FAILED': 1,
    'SUCCESSFUL': 2
};

class Options extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'authStatus': AUTH_STATUS.LOADING,
            'scripts': null
        };
    }

    componentDidMount()
    {
        GapiLibsAndAuth.loadAndAuthNoUi(['picker'])
            .then(() => {
                if (GapiLibsAndAuth.getAuthToken() === null)
                {
                    this.setState({'authStatus': AUTH_STATUS.FAILED});
                    return;
                }

                this._onAuthSuccessLoadAndShowUi();
            });
    }

    render()
    {
        return (
            <div>
                <h1>Site Script Storage Options</h1>
                <p>Manage scripts for Site Script Storage.</p>
                {this._getContentUsingAuthStatus()}
            </div>
        );
    }

    _getContentUsingAuthStatus = () =>
    {
        switch (this.state.authStatus)
        {
        case AUTH_STATUS.LOADING:
            return <div><p>Authenticating...</p></div>;
        case AUTH_STATUS.FAILED:
            return (
                <div>
                    <p>Authentication failed. Click button below to allow access to the extension.</p>
                    <button onClick={this._handleAllowAccessButtonClick}>Allow access</button>
                </div>
            );
        case AUTH_STATUS.SUCCESSFUL:
            return (
                <div>
                    <h2>Manage Existing Scripts</h2>
                    <div>{this._createScriptsDiv()}</div>
                    <h2>Import Scripts from Drive</h2>
                    <button onClick={this._handleImportButtonClick}>Import</button>
                </div>
            );
        }
    }

    _onAuthSuccessLoadAndShowUi = () =>
    {
        this.setState({'authStatus': AUTH_STATUS.SUCCESSFUL});
        DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
        DriveScriptsManager.loadScripts();
    }

    _handleAllowAccessButtonClick = () =>
    {
        GapiLibsAndAuth.auth(true).then(this._onAuthSuccessLoadAndShowUi);
    }

    // The "google" variable is loaded by the gapi.load('picker') call, which is loaded in GapiLibsAndAuth.load. 
    // Unfortunately, making it an external in webpack messes with the module imports since "google" isn't defined yet,
    // so we end up with a magical global variable.
    _handleImportButtonClick = () =>
    {
        let view = new google.picker.DocsView()
            .setIncludeFolders(true)
            .setSelectFolderEnabled(false)
            .setMode(google.picker.DocsViewMode.GRID)
            .setMimeTypes('text/javascript');
        let picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(keys.APP_ID)
            .setOAuthToken(GapiLibsAndAuth.getAuthToken())
            .addView(view)
            .setDeveloperKey(keys.API_KEY)
            .setCallback(this._handlePickerCallback)
            .build();
        picker.setVisible(true);
    }

    _handlePickerCallback = (data) =>
    {
        if (data[google.picker.Response.ACTION] != google.picker.Action.PICKED)
        {
            return;
        }

        const scripts = data[google.picker.Response.DOCUMENTS].map((doc) => {
            return {
                'id': doc.id,
                'name': doc.name,
                'description': doc.description
            };
        });
        DriveScriptsManager.addScripts(scripts);
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
}

ReactDOM.render(<Options />, document.getElementById('options'));
