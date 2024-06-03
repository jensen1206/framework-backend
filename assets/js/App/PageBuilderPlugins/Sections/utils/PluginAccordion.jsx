import * as React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {Editor} from '@tinymce/tinymce-react';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import parser from "react-html-parser";

export default class PluginAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }


    render() {
        return (
            <div className="pt-3 pb-2">
                {this.props.plugin.config.accordion && this.props.plugin.config.accordion.length ?
                    <React.Fragment>
                        <Accordion className="pe-none">
                            {this.props.plugin.config.accordion.map((a, index) => {
                                return (
                                    <Accordion.Item key={index} eventKey={index}>
                                        <Accordion.Header>
                                            {parser(a.header || '')}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {parser(a.body || '')}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })}
                        </Accordion>
                    </React.Fragment>
                    :
                    <div className="d-flex flex-column w-100 align-items-center">
                        <div className="w-100">
                            {parser(this.props.plugin.data.input || '')}
                        </div>
                    </div>}
            </div>
        )
    }
}