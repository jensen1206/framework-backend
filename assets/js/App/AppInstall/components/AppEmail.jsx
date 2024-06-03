import * as React from "react";
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import * as AppTools from "../../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, Col, FloatingLabel, Form, Row} from "react-bootstrap";


const v5NameSpace = '4218f272-1a6c-11ef-b218-325096b39f47';
export default class AppEmail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onSubmitNext = this.onSubmitNext.bind(this);
    }


    onSubmitNext(event) {
        event.preventDefault();
        event.stopPropagation();

        this.props.collapseToggle('drei');

    }

    render() {
        return (
            <React.Fragment>
                <div className="fs-5 mb-3">
                    {trans['install']['Email']}
                    <small className="small-lg d-block">
                        <b className="fw-semibold d-inline-block me-1">DSN:</b>
                        {`${this.props.email.type}://${this.props.email.username}:${this.props.email.pw}@${this.props.email.host}:${this.props.email.port}`}
                    </small>
                </div>
                <Form onSubmit={this.onSubmitNext}>
                    <Row className="g-2">
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('emailAbsender', v5NameSpace)}
                                label={`${trans['install']['Sender e-mail']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.email.abs_email || ''}
                                    onChange={(e) => this.props.onSetEmail(e.target.value, 'abs_email')}
                                    aria-required={true}
                                    required={true}
                                    type="email"
                                    placeholder={trans['install']['Sender e-mail']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('emailAbsenderName', v5NameSpace)}
                                label={`${trans['install']['Sender name']}`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.email.abs_name || ''}
                                    onChange={(e) => this.props.onSetEmail(e.target.value, 'abs_name')}
                                    aria-required={true}
                                    required={false}
                                    type="text"
                                    placeholder={trans['install']['Sender name']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('emailUsername', v5NameSpace)}
                                label={`${trans['install']['User name']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.email.username || ''}
                                    onChange={(e) => this.props.onSetEmail(e.target.value, 'username')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['User name']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('emailPassword', v5NameSpace)}
                                label={`${trans['install']['Password']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.email.pw || ''}
                                    onChange={(e) => this.props.onSetEmail(e.target.value, 'pw')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Database user']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('emailHost', v5NameSpace)}
                                label={`${trans['install']['Hostname']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.email.host || ''}
                                    onChange={(e) => this.props.onSetEmail(e.target.value, 'host')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Hostname']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('emailPort', v5NameSpace)}
                                label={`${trans['install']['Port']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.email.port || ''}
                                    onChange={(e) => this.props.onSetEmail(e.target.value, 'port')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Port']}/>
                            </FloatingLabel>
                        </Col>

                        <Col xs={12}>
                            <hr/>
                            <button onClick={() => this.props.collapseToggle('eins')}
                                type="button" className="btn btn-secondary me-2">
                                <i className="bi bi-arrow-left me-1"></i>
                                {trans['install']['back']}
                            </button>
                            <button type="submit" className="btn btn-secondary">{trans['install']['next']}
                                <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }
}