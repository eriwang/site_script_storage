import gapi from 'gapi';
import React from 'react';
import ReactDOM from 'react-dom';

import './options.html';
import DriveScriptsManager from '../common/drive_scripts_manager.js';
import keys from '../../keys.json';

// The "google" variable is loaded by the gapi.load('picker') call. Unfortunately, making it an external in webpack
// messes with the module imports since "google" isn't defined yet, so we go with a magical global variable instead.

class Options extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'importButtonEnabled': false,
            'scripts': []
        };
    }

    componentDidMount()
    {
        gapi.load('picker', () => this.setState({'importButtonEnabled': true}));
        DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
        DriveScriptsManager.loadScripts();
    }

    handleImportButtonClick = () =>
    {
        gapi.client.init({
            apiKey: keys.API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        }).then(
            this.gapiAuth,
            (error) => console.error(error)
        );
    }

    // TODO: poor naming. split/ make a promise maybe
    // TODO: would be nice to make a chrome promise wrapper function, and just use that everywhere
    gapiAuth = () =>
    {
        chrome.identity.getAuthToken({interactive: true}, (token) => {
            if (chrome.runtime.lastError !== undefined)
            {
                throw chrome.runtime.lastError;
            }

            gapi.auth.setToken({'access_token': token});
            let view = new google.picker.DocsView()
                .setIncludeFolders(true)
                .setSelectFolderEnabled(false)
                .setMode(google.picker.DocsViewMode.GRID)
                .setMimeTypes('text/javascript');
            let picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(keys.APP_ID)
                .setOAuthToken(token)
                .addView(view)
                .setDeveloperKey(keys.API_KEY)
                .setCallback(this.handleSelectedFiles)
                .build();
            picker.setVisible(true);
        });
    }

    handleSelectedFiles = (data) =>
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

    render()
    {
        // TODO: poor naming, even though it works code wise
        let scriptsElement = (this.state.scripts.length === 0) ? 
            'No scripts, add scripts by importing from drive.' :
            this.state.scripts.map((script) => (
                <p key={script}>Script: {script} (id: {script})</p>
            ));

        return (
            <div>
                <h1>Site Script Storage Options</h1>
                <p>Manage scripts for Site Script Storage.</p>
                <h2>Manage Existing Scripts</h2>
                <div>{scriptsElement}</div>
                <h2>Import Scripts from Drive</h2>
                <button disabled={!this.state.importButtonEnabled}
                    onClick={this.handleImportButtonClick}>Import</button>
            </div>
        );
    }
}

ReactDOM.render(<Options />, document.getElementById('options'));
