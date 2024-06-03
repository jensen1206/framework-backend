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


const v5NameSpace = 'e7835a04-1a76-11ef-a945-325096b39f47';
export default class AppUser extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onSubmitNext = this.onSubmitNext.bind(this);
        this.onGeneratePw = this.onGeneratePw.bind(this);

    }


    onSubmitNext(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onAppInstall();
    }

    onGeneratePw() {
        let formData = {
            'method': 'generate_password'
        }
        this.props.sendAxiosFormdata(formData)
    }

    render() {
        return (
            <React.Fragment>
                <div className="fs-5 mb-3">
                    {trans['install']['Super Admin Login']}
                </div>
                <Form onSubmit={this.onSubmitNext}>
                    <Row className="g-2">
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('userEmail', v5NameSpace)}
                                label={`${trans['install']['Email']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.user.email || ''}
                                    onChange={(e) => this.props.onSetUser(e.target.value, 'email')}
                                    aria-required={true}
                                    required={true}
                                    type="email"
                                    placeholder={trans['install']['Email']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}></Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('userPassword', v5NameSpace)}
                                label={`${trans['install']['Password']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.user.pw || ''}
                                    onChange={(e) => this.props.onSetUser(e.target.value, 'pw')}
                                    aria-required={true}
                                    required={true}
                                    min={8}
                                    autoComplete="new-password"
                                    type={this.props.showPw && this.props.user.pw !== '' ? 'text' : 'password'}
                                    placeholder={trans['install']['Password']}/>
                            </FloatingLabel>
                            <div className="d-flex align-items-center mt-2">
                            <button onClick={this.onGeneratePw}
                                type="button" className="btn btn-outline-secondary btn-sm">
                                {trans['install']['Generate password']}
                            </button>
                                <i  onClick={() => this.props.onToggleShowPw(!this.props.showPw)}
                                    className={`ms-3 cursor-pointer ${this.props.showPw && this.props.user.pw !== ''  ? 'bi bi-eye' : 'bi bi-eye-slash'}`}></i>
                            </div>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('userRepeatPw', v5NameSpace)}
                                label={`${trans['install']['Repeat password']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.user.repeat_pw || ''}
                                    onChange={(e) => this.props.onSetUser(e.target.value, 'repeat_pw')}
                                    aria-required={true}
                                    required={true}
                                    min={8}
                                    autoComplete="new-password"
                                    type="password"
                                    placeholder={trans['install']['Repeat password']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12}>
                            <hr/>
                            <div className="d-flex align-items-center">
                            <button onClick={() => this.props.collapseToggle('drei')}
                                type="button" className="btn btn-secondary me-2">
                                <i className="bi bi-arrow-left me-1"></i>
                                {trans['install']['back']}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {trans['install']['Install now']}
                            </button>
                                {this.props.showInstall ?
                                <div className="ms-2 d-flex align-items-center">
                                    <div className="dot-pulse"></div>
                                    <span className="d-block ms-4 flicker-animation">
                                        {trans['install']['App will be installed']}
                                    </span>
                                </div>: ''}
                            </div>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }
}