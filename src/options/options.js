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
            'scripts': null
        };
    }

    componentDidMount()
    {
        gapi.load('client:picker', () => {
            gapi.client.init({
                apiKey: keys.API_KEY,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            }).then(() => {
                /* TODO:
                 * This is a bit of a messy hack. The Drive API requires gapi.auth.setToken to be set before I can
                 * find files, but it's not great for the user to be prompted for auth immediately. I'd like to fix
                 * this weirdness with the auth process rethink.
                 * Ideally, if I'm not authenticated, I'll show the user, and load this after auth is complete.
                 */
                chrome.identity.getAuthToken({interactive: true}, (token) => {
                    if (chrome.runtime.lastError !== undefined)
                    {
                        throw chrome.runtime.lastError;
                    }
        
                    gapi.auth.setToken({'access_token': token});
                    DriveScriptsManager.addChangeHandler((scripts) => this.setState({'scripts': scripts}));
                    DriveScriptsManager.loadScripts();

                    this.setState({'importButtonEnabled': true});
                });
            });
        });
    }

    handleImportButtonClick = () =>
    {
        this.gapiAuth();
    }

    // TODO: Might change after auth rework? Might still be the way to go with getAuthToken to be fair
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

    // TODO: init as loading script data, but change to "no scripts" if there really aren't any
    // TODO: might need to change more with auth
    render()
    {
        return (
            <div>
                <h1>Site Script Storage Options</h1>
                <p>Manage scripts for Site Script Storage.</p>
                <h2>Manage Existing Scripts</h2>
                <div>{this._createScriptsDiv()}</div>
                <h2>Import Scripts from Drive</h2>
                <button disabled={!this.state.importButtonEnabled}
                    onClick={this.handleImportButtonClick}>Import</button>
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
}

ReactDOM.render(<Options />, document.getElementById('options'));
