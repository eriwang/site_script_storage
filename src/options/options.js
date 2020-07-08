import React from 'react';
import ReactDOM from 'react-dom';

import '../common/common.css';
import './options.css';
import './options.html';
import GapiLibsAndAuth from '../common/gapi_auth.js';
import OptionsAuthSuccessful from './options_auth_successful.js';

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
                const authStatus = (GapiLibsAndAuth.getAuthToken() === null) 
                    ? AUTH_STATUS.FAILED 
                    : AUTH_STATUS.SUCCESSFUL;
                this.setState({'authStatus': authStatus});
            });
    }

    render()
    {
        return (
            <div>
                <h1>Site Script Storage Options</h1>
                <p className="help">Manage scripts for Site Script Storage.</p>
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
            return <OptionsAuthSuccessful/>;
        default:
            throw `Unknown authStatus ${this.state.authStatus}`;
        }
    }

    _handleAllowAccessButtonClick = () =>
    {
        GapiLibsAndAuth.auth(true)
            .then(() => this.setState({'authStatus': AUTH_STATUS.SUCCESSFUL}));
    }
}

ReactDOM.render(<Options />, document.getElementById('options'));
