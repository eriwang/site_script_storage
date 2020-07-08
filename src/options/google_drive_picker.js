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
            .setCallback((data) => resolve(_convertPickerDocsToScriptObjects(data)))
            .build();
        picker.setVisible(true);
    });
}

function _convertPickerDocsToScriptObjects(data)
{
    if (data[google.picker.Response.ACTION] != google.picker.Action.PICKED)
    {
        return null;
    }

    return data[google.picker.Response.DOCUMENTS].map((doc) => {
        return {
            'id': doc.id,
            'name': doc.name,
            'description': doc.description
        };
    });
}

export default launchGoogleDrivePicker;