import React from 'react';

// SVG sourced from https://feathericons.com/
class SvgButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            'mouseInside': false,
        };
    }

    render()
    {
        let fillColor = (this.state.mouseInside) ? 'black' : 'none';
        let opacity = (this.props.opacity === undefined) ? 1 : this.props.opacity;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" 
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                fill={fillColor} opacity={opacity}
                onMouseEnter={() => this.setState({'mouseInside': true})}
                onMouseLeave={() => this.setState({'mouseInside': false})}
                onClick={this.props.onClick}>
                {this.props.children}
            </svg>
        );
    }
}

// x-square feather icon
class CloseButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
            </SvgButton>
        );
    }
}

// play feather icon
class PlayButton extends React.Component
{
    render()
    {
        let opacity = (this.props.isRunning) ? 0.5 : 1;
        return (
            <SvgButton onClick={this.props.onClick} opacity={opacity}>
                <polygon points="5 3 19 12 5 21 5 3" />
            </SvgButton>
        );
    }
}

// triangle feather icon
class DropdownButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <SvgButton onClick={this.props.onClick}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </SvgButton>
        );
    }
}

export {CloseButton, PlayButton, DropdownButton};
