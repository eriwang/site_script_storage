import gapi from 'gapi';
import React from 'react';
import ReactDOM from 'react-dom';

import './options.html';
import keys from '../../keys.json';

// The "google" variable is loaded by the gapi.load('picker') call. Unfortunately, making it an external in webpack
// messes with the module imports since "google" isn't defined yet, so we go with a magical global variable instead.

class Options extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'importButtonEnabled': false
        };
    }

    componentDidMount()
    {
        gapi.load('picker', () => this.setState({'importButtonEnabled': true}));
    }

    handleImportButtonClick = () =>
    {
        console.log('clicked');
        gapi.client.init({
            apiKey: keys.API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        }).then(
            this.gapiAuth,
            (error) => console.error(error)
        );
    }

    gapiAuth = () =>
    {
        console.log('gapi initialized');
        chrome.identity.getAuthToken({interactive: true}, (token) => {
            gapi.auth.setToken({'access_token': token});
            console.log('token set');
            let view = new google.picker.DocsView()
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true)
                .setMode(google.picker.DocsViewMode.GRID)
                .setMimeTypes('text/javascript');
            let picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(keys.APP_ID)
                .setOAuthToken(token)
                .addView(view)
                .setDeveloperKey(keys.API_KEY)
                .setCallback(this.echoFile)
                .build();
            picker.setVisible(true);
        });
    }

    echoFile = (data) =>
    {
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED)
        {
            const doc = data[google.picker.Response.DOCUMENTS][0];
            const docId = doc[google.picker.Document.ID];
            console.log(`picked ${docId}`);
            gapi.client.drive.files.get({'fileId': docId, 'alt': 'media'})
                .then((data) => {
                    chrome.tabs.executeScript({
                        'code': data['body']
                    }, () => chrome.tabs.executeScript({'code': 'console.log(a)'}));
                });
        }
    }

    render()
    {
        return (
            <div>
                <h1>Site Script Storage Options</h1>
                <p>Manage scripts for Site Script Storage.</p>
                <h2>Manage Existing Scripts</h2>
                <div>
                    some stuff here
                </div>
                <h2>Import Scripts from Drive</h2>
                <button disabled={!this.state.importButtonEnabled}
                    onClick={this.handleImportButtonClick}>Import</button>
            </div>
        );
    }
}

ReactDOM.render(<Options />, document.getElementById('options'));
