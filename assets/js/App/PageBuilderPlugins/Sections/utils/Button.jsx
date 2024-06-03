import * as React from "react";
import parser from "react-html-parser";


export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <div className={`${this.props.plugin.config.css_class} ${this.props.plugin.config.block ? 'd-grid gap-2' : ''}`}>
                    <button
                        disabled={this.props.plugin.config.disabled}
                        className={`my-3 btn btn-${this.props.plugin.config.outline}${this.props.plugin.config.variant} ${this.props.plugin.config.size}`}>
                        {this.props.plugin.config.icon ?
                            <i className={`${this.props.plugin.config.icon} me-2`}></i>
                            : ''}
                        {parser(this.props.plugin.data.input)}
                    </button>
                </div>
            </React.Fragment>
        )
    }
}