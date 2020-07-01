import gapi from 'gapi';

import './popup.html';
import keys from '../keys.json';

window.onload = () => {
    document.querySelector('button').addEventListener('click', () => {
        gapi.client.init({
            apiKey: keys.API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        }).then(
            gapiAuth,
            (error) => console.log('error', error)
        );
    });
};

function gapiAuth()
{
    console.log('gapi initialized');
    chrome.identity.getAuthToken({interactive: true}, (token) => {
        gapi.auth.setToken({'access_token': token});
        console.log('token set');
    });
}