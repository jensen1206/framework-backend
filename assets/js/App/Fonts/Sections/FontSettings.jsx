import * as React from "react";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
const v5NameSpace = 'fb9d4972-fe57-44b6-ae8f-87b88d80a584';
export default class FontSettings extends React.Component {
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
                <Card className="shadow-sm">
                    <CardHeader className="bg-body-tertiary fs-5 py-3 d-flex flex-wrap">
                        <div>
                            <i className="bi bi-fonts me-2"></i>
                            {trans['design']['Font settings']}

                        </div>
                        <div className="ms-auto">
                            <div
                                className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                            <small>
                                <SetAjaxResponse
                                    status={this.props.spinner.ajaxStatus}
                                    msg={this.props.spinner.ajaxMsg}
                                />
                            </small>
                        </div>
                    </CardHeader>
                    <Col xxl={6} xl={8} lg={10} xs={12} className="mx-auto my-4">

                        <Card>
                        <CardHeader className="fs-5 d-flex align-items-center flex-wrap">
                            <span className="fw-light">{trans['design']['Font']}</span> {this.props.editFont.full_name || ''}

                        </CardHeader>
                            <CardBody>
                                <Row className="g-2">
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv5('fontStyle', v5NameSpace)}
                                            label={trans['design']['Font-Style']}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.editFont.font_style || ''}
                                                onChange={(e) => this.props.onSetEditFont(e.target.value, 'font_style')}

                                                type="text"
                                                placeholder={trans['design']['Font-Style']}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv5('fontWeight', v5NameSpace)}
                                            label={trans['design']['Font-Weight']}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.editFont.font_weight || ''}
                                                onChange={(e) => this.props.onSetEditFont(e.target.value, 'font_weight')}
                                                type="text"
                                                placeholder={trans['design']['Font-Weight']}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                    </Col>
                </Card>
            </React.Fragment>
        )
    }
}