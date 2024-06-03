import * as React from "react";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import Form from "react-bootstrap/Form";

import {Card, CardBody, CardHeader, Row, Col} from "react-bootstrap";

const v5NameSpace = 'faa7a782-e3af-11ee-9f9f-325096b39f47';
export default class FontInfo extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={() => this.props.onToggleCollapse('start')}
                        className="btn btn-warning-custom dark btn-sm">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['back']}
                </button>
                <hr/>
                {this.props.fontInfo && this.props.fontInfo.info ?
                    <Card className="shadow-sm">
                        <CardHeader className="bg-body-tertiary d-flex align-items-center fs-5 py-3">
                            <div>
                                <i className="bi bi-fonts me-2"></i>
                                {trans['design']['Font details']}
                            </div>
                            <div className="ms-auto fw-normal">
                                {this.props.fontName}
                            </div>
                        </CardHeader>
                        <CardBody>
                            <h5>{trans['design']['Font styles']}</h5>
                            <ul>
                                {this.props.localName.map((d, index) => {
                                    return (
                                        <li key={index}>
                                            {d}
                                        </li>
                                    )
                                })}
                            </ul>
                        </CardBody>
                        <CardHeader className="py-3 fs-5 bg-body-tertiary">
                            <i className="bi bi-fonts me-2"></i>
                            {trans['design']['Font']}-{this.props.fontName}
                        </CardHeader>
                        <CardBody>
                            <Row className="g-3">
                                {this.props.fontInfo.info.map((i, index) => {
                                    return (
                                        <Col className={`${i.id===10 ? 'order-last' : 'order-'+index}`} xs={12} xl={i.id===10 ? 12 : 6} key={index}>
                                            <div className={`border rounded px-3 py-2 h-100`}>
                                                <h5 className="lh-1 fw-semibold text-body">
                                                    {i.label}
                                                </h5>
                                                <span>{i.value}</span>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
            </React.Fragment>
        )
    }
}