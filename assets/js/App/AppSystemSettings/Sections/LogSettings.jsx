import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
const v5NameSpace = '72a9ff1c-8909-43c9-a7bf-471ad302aeb8';
export default class LogSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }

    render() {
        return (
            <React.Fragment>
                {systemSettings.manage_log ?
                    <Card className="shadow-sm mt-3">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-collection me-2"></i>
                                {trans['system']['Log settings']}
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
                        </Card.Header>
                        <CardBody>
                            <Row className="g-3">
                                <Col xs={12} xl={3} lg={4} md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('checkLogin', v5NameSpace)}
                                        checked={this.props.log.login || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'login')}
                                        label={trans['log']['Login']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('checkLoginError', v5NameSpace)}
                                        checked={this.props.log.login_error || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'login_error')}
                                        label={trans['log']['Login error']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('checkLogout', v5NameSpace)}
                                        checked={this.props.log.logout || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'logout')}
                                        label={trans['Logout']}
                                    />
                                </Col>
                                <Col xs={12} xl={3} lg={4} md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('checkRegister', v5NameSpace)}
                                        checked={this.props.log.register || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'register')}
                                        label={trans['log']['Register']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('passwordForgot', v5NameSpace)}
                                        checked={this.props.log.forgot_password || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'forgot_password')}
                                        label={trans['log']['Forgotten password']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('passwordChange', v5NameSpace)}
                                        checked={this.props.log.password_change || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'password_change')}
                                        label={trans['log']['Password changed']}
                                    />
                                </Col>
                                <Col xs={12} xl={3} lg={4} md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('accountActivated', v5NameSpace)}
                                        checked={this.props.log.account_activated || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'account_activated')}
                                        label={trans['log']['Account activated']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('accountDeactivated', v5NameSpace)}
                                        checked={this.props.log.account_deactivated || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'account_deactivated')}
                                        label={trans['log']['Account deactivated']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('accountDeleted', v5NameSpace)}
                                        checked={this.props.log.account_deleted || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'account_deleted')}
                                        label={trans['log']['Account deleted']}
                                    />

                                </Col>
                                <Col xs={12} xl={3} lg={4} md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('backupCreated', v5NameSpace)}
                                        checked={this.props.log.backup_created || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'backup_created')}
                                        label={trans['log']['Backup created']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('backupDeleted', v5NameSpace)}
                                        checked={this.props.log.backup_deleted || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'backup_deleted')}
                                        label={trans['log']['Backup deleted']}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={uuidv5('emailSend', v5NameSpace)}
                                        checked={this.props.log.email_send || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'email_send')}
                                        label={trans['log']['E-mail sent']}
                                    />
                                    {/*} <Form.Check
                                        type="checkbox"
                                        id={uuidv5('system_email_send', v5NameSpace)}
                                        checked={this.props.log.system_email_send || false}
                                        onChange={(e) => this.props.onChangeLogSettings(e.target.checked, 'system_email_send')}
                                        label={trans['log']['System e-mail sent']}
                                    />{*/}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
            </React.Fragment>
        )
    }
}