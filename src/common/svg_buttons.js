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
        // TODO: The isActive is a bit confusing. Should consider reevaluating how it's done.
        let fillColor, opacity;
        if (this.props.isActive !== undefined && this.props.isActive)
        {
            fillColor = 'gray';
            opacity = 0.5;
        }
        else
        {
            opacity = 1;
            fillColor = (this.state.mouseInside) ? 'gray' : 'none';
        }

        // Setting only width is a hack. For my use case, keeping the height at 24 means the element stays centered when
        // I decrease the size. A better solution would be to allow setting of width/ height/ viewbox.
        const size = (this.props.size === undefined) ? 24 : this.props.size;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height="24" viewBox="0 0 24 24" stroke="currentColor" 
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
class CrossButton extends React.Component
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
            <SvgButton size="16" onClick={this.props.onClick}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </SvgButton>
        );
    }
}

// play feather icon
class PlayButton extends React.Component
{
    render()
    {
        return (
            <SvgButton onClick={this.props.onClick} isActive={this.props.isRunning}>
                <polygon points="5 3 19 12 5 21 5 3" />
            </SvgButton>
        );
    }
}

export {CrossButton, DropdownButton, PlayButton};
