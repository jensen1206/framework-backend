import * as React from "react";
import parser from "react-html-parser";
export default class HtmlType extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }

    render() {
        return (
            <>
                <div className="html-output">
                     {parser(this.props.form.config.default)}
                </div>
            </>
        )
    }


}