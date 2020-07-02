import React from 'react';
import ReactDOM from 'react-dom';

import './options.html';

class Options extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return 'hello friends';
    }
}

ReactDOM.render(<Options />, document.getElementById('options'));
