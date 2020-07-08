import GapiLibsAndAuth from '../common/gapi_auth.js';
import keys from '../../keys.json';

// The "google" variable is loaded by the gapi.load('picker') call, which is loaded by Options in GapiLibsAndAuth.load.
// Unfortunately, making it an external in webpack messes with the module imports since "google" isn't defined yet,
// so we end up with a magical global variable.
function launchGoogleDrivePicker()
{
    return new Promise((resolve) => {
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
            .setCallback((data) => _pickerCallbackResolve(data, resolve))
            .build();
        picker.setVisible(true);
    });
}

function _pickerCallbackResolve(data, resolve)
{
    const action = data[google.picker.Response.ACTION];
    if (action === google.picker.Action.PICKED)
    {
        resolve(data[google.picker.Response.DOCUMENTS].map((doc) => doc.id));
        return;
    }
    if (action === google.picker.Action.CANCEL)
    {
        resolve(null);
        return;
    }
}

export default launchGoogleDrivePicker;