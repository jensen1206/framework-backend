import * as React from "react";
import reactCSS from 'reactcss'
import {SketchPicker} from 'react-color'

export default class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            displayColorPicker: false,
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick = () => {
        this.setState({displayColorPicker: !this.state.displayColorPicker})
    };

    handleClose = () => {
        this.setState({displayColorPicker: false})
    };

    handleChange = (color) => {
        this.props.callback(color.rgb, this.props.handle, this.props.id || '')
    };



    render() {

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '24px',
                    position: 'relative',
                    borderRadius: '.2rem',
                    background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b}, ${this.props.color.a})`,
                },
                swatch: {
                    padding: '0',
                    position: 'relative',
                    background: 'rgb(var(--bs-tertiary-bg-rgb))',
                    //border: '1px solid var(--bs-border-color)',
                  //  borderRadius: '.15rem',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '1031',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        return (
            <React.Fragment>
                <div className="color-picker">
                    <div className="position-relative picker-wrapper" style={styles.swatch} onClick={this.handleClick}>
                        <div className="picker-bg-img"></div>
                        <div className="picker-item" style={styles.color}/>
                    </div>
                    {this.state.displayColorPicker ? <div className="color-popover" style={styles.popover}>
                        <div style={styles.cover} onClick={this.handleClose}/>
                        <SketchPicker color={this.props.color} onChange={this.handleChange}/>
                    </div> : null}
                </div>
            </React.Fragment>
        )
    }
}