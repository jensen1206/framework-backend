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


const v5NameSpace = '63db005c-19f0-11ef-9d4b-325096b39f47';
export default class AppDb extends React.Component {
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

        this.props.collapseToggle('zwei');

    }

    render() {
        return (
            <React.Fragment>
                <div className="fs-5 mb-3">
                    {trans['install']['Database']}
                    <small className="small-lg d-block">
                        <b className="fw-semibold d-inline-block me-1">DSN:</b>
                        {`mysql://${this.props.db.user}:${this.props.db.password}@${this.props.db.host}:${this.props.db.port}/${this.props.db.dbname}?serverVersion=${this.props.db.serverVersion}&charset=${this.props.db.charset}`}
                    </small>
                </div>
                <Form onSubmit={this.onSubmitNext}>
                    <Row className="g-2">
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('dbName', v5NameSpace)}
                                label={`${trans['install']['Database name']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.dbname || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'dbname')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Database name']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('dbUser', v5NameSpace)}
                                label={`${trans['install']['Database user']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.user || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'user')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Database user']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xl={12}>
                            <FloatingLabel
                                controlId={uuidv5('password', v5NameSpace)}
                                label={`${trans['install']['Database password']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.password || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'password')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Database password']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('dbHost', v5NameSpace)}
                                label={`${trans['install']['Database hostname']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.host || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'host')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Database hostname']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('dbPort', v5NameSpace)}
                                label={`${trans['install']['Database port']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.port || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'port')}
                                    aria-required={true}
                                    required={true}
                                    type="number"
                                    placeholder={trans['install']['Database port']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('dbCharset', v5NameSpace)}
                                label={`${trans['install']['Charset']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.charset || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'charset')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Charset']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('dbServerVer', v5NameSpace)}
                                label={`${trans['install']['Server version']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.db.serverVersion || ''}
                                    onChange={(e) => this.props.onSetDatabase(e.target.value, 'serverVersion')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Server version']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12}>
                            <Form.Check
                                type="switch"
                                className="no-blur mt-3"
                                id={uuidv5('createDatabase', v5NameSpace)}
                                checked={this.props.db.create_database || false}
                                onChange={(e) => this.props.onSetDatabase(e.target.checked, 'create_database')}
                                label={trans['install']['Create database']}
                            />
                        </Col>
                        <Col xs={12}>
                            <hr/>
                            <button type="submit" className="btn btn-secondary">{trans['install']['next']}<i
                                className="bi bi-arrow-right ms-1"></i></button>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }
}