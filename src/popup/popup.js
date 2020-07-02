import gapi from 'gapi';

import './popup.html';
import keys from '../../keys.json';

// TODO: lots of unused code in this file. Pretty much only thing that'll stay is the execution.
window.onload = () => {
    gapi.load('picker');  // takes a callback too

    document.getElementById('press').addEventListener('click', () => {
        gapi.client.init({
            apiKey: keys.API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        }).then(
            gapiAuth,
            (error) => console.error(error)
        );
    });
};

function gapiAuth()
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
            .setCallback(echoFile)
            .build();
        picker.setVisible(true);
    });
}

function echoFile(data)
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