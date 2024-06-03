import * as React from "react";
import {Fragment} from "react";
export default class HiddenType extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }
    render() {
        return (
            <Fragment>
                <input type="hidden" value={this.props.form.config.default}/>
            </Fragment>
        )
    }
}