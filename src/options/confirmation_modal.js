import React from 'react';

import {CheckButton, CrossButton} from '../common/svg_buttons.js';

class ConfirmationModal extends React.Component
{
    render()
    {
        return (
            <div className="modal">
                <div className="modal-content">
                    <h3>{this.props.header}</h3>
                    <p className="confirm-text">{this.props.text}</p>
                    <div className="confirm-buttons">
                        <CheckButton onClick={() => this.props.onConfirm(true)} />
                        <CrossButton onClick={() => this.props.onConfirm(false)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmationModal;
