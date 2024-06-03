import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";

const v5NameSpace = '685b860b-08d3-473c-bd2b-e6c183a14e4c';
export default class EmailSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                {systemSettings.manage_email ?
                    <Card className="shadow-sm mt-3">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-envelope-at me-2"></i>
                                {trans['app']['E-mail settings']}
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
                            <Row className="g-2">
                                <Col xs={12}>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <Form.Check
                                            className="no-blur mb-1 me-4"
                                            type="switch"
                                            id={uuidv5('saveEmail', v5NameSpace)}
                                            checked={this.props.email.email_save_active || false}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.checked, 'email_save_active')}
                                            label={trans['app']['Save e-mail active']}
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur mb-1 me-4"
                                            id={uuidv5('asyncActive', v5NameSpace)}
                                            checked={this.props.email.async_active || false}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.checked, 'async_active')}
                                            label={trans['app']['Send e-mail asynchronously']}
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur mb-1"
                                            id={uuidv5('attachmentsActive', v5NameSpace)}
                                            checked={this.props.email.attachment_active || false}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.checked, 'attachment_active')}
                                            label={trans['app']['E-mail attachments active']}
                                        />
                                    </div>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('absEmail', v5NameSpace)}
                                        label={`${trans['install']['Sender e-mail']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.email.abs_email || ''}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.value, 'abs_email')}
                                            type="email"
                                            placeholder={trans['install']['Sender e-mail']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('absName', v5NameSpace)}
                                        label={trans['install']['Sender name']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.email.abs_name || ''}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.value, 'abs_name')}
                                            type="email"
                                            placeholder={trans['install']['Sender name']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                  <h6 className="my-3"> {trans['system']['Email SMTP settings']}</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('smtpSchema', v5NameSpace)}
                                        label={trans['install']['Schema']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.emailDsn.schema || ''}
                                            onChange={(e) => this.props.onChangeEmailDSNSettings(e.target.value, 'schema')}
                                            type="text"
                                            placeholder={trans['install']['Schema']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}></Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('smtpUser', v5NameSpace)}
                                        label={trans['install']['User name']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.emailDsn.user || ''}
                                            onChange={(e) => this.props.onChangeEmailDSNSettings(e.target.value, 'user')}
                                            type="text"
                                            placeholder={trans['install']['User name']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('smtpPw', v5NameSpace)}
                                        label={trans['install']['Password']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.emailDsn.password || ''}
                                            onChange={(e) => this.props.onChangeEmailDSNSettings(e.target.value, 'password')}
                                            type="text"
                                            placeholder={trans['install']['Password']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('smtpPort', v5NameSpace)}
                                        label={trans['install']['Port']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.emailDsn.port || ''}
                                            onChange={(e) => this.props.onChangeEmailDSNSettings(e.target.value, 'port')}
                                            type="number"
                                            placeholder={trans['install']['Port']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('smtpHost', v5NameSpace)}
                                        label={trans['install']['Hostname']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.emailDsn.host || ''}
                                            onChange={(e) => this.props.onChangeEmailDSNSettings(e.target.value, 'host')}
                                            type="text"
                                            placeholder={trans['install']['Hostname']}/>
                                    </FloatingLabel>
                                </Col>

                                <Col xs={12}>
                                    <hr/>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('maxAttach', v5NameSpace)}
                                        label={trans['app']['Maximum number of attachments']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.email.attachment_max_count || ''}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.value, 'attachment_max_count')}
                                            disabled={!this.props.email.attachment_active}
                                            type="number"
                                            placeholder={trans['app']['Maximum number of attachments']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('maxSize', v5NameSpace)}
                                        label={trans['app']['maximum file size (MB)']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.email.attachment_max_size || ''}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.value, 'attachment_max_size')}
                                            disabled={!this.props.email.attachment_active}
                                            type="number"
                                            placeholder={trans['app']['maximum file size (MB)']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('replyTo', v5NameSpace)}
                                        label={trans['app']['ReplyTo']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.email.reply_to || ''}
                                            onChange={(e) => this.props.onChangeEmailSettings(e.target.value, 'reply_to')}
                                            disabled={false}
                                            type="email"
                                            placeholder={trans['app']['ReplyTo']}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
            </React.Fragment>
        )
    }

}