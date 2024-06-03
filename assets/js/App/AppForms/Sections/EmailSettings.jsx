import * as React from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import InputGroup from 'react-bootstrap/InputGroup';
//import * as formik from 'formik';
//import * as yup from 'yup';
export default class EmailSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsForm = React.createRef();
        this.state = {
            validated: false
        }

        this.onChangeInput = this.onChangeInput.bind(this);
        this.onCheckSmtpSettings = this.onCheckSmtpSettings.bind(this);
        //
    }

    onChangeInput(value, type, event) {

        let currentTarget = event.currentTarget;
        if (currentTarget.hasAttribute('required') && !value) {
            currentTarget.classList.add('is-invalid')
        } else {
            currentTarget.classList.remove('is-invalid')
        }
        //   this.props.onChangeSmtpSettings(value,type)
    }

    onCheckSmtpSettings() {
        let formData = {
            'method': 'smtp_test',
        }

        //  this.props.sendAxiosFormdata(formData)
        //
    }

    render() {
        return (
            <>
                <div style={{minHeight: '53vh'}}
                     className="bg-custom-gray position-relative border rounded mt-1 mb-3 p-3">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">
                            <i className="text-blue bi bi-gear me-2"></i>
                            {trans['app']['E-mail settings']}
                        </h5>
                    </div>
                    <hr/>
                    <div className="col-xxl-9 col-xl-10 col-12 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <Form ref={this.settingsForm}>
                                    <div className="row g-2">
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={trans['forms']['Name or company of the sender']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="text"
                                                    value={this.props.editEmailSettings.abs_name || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'abs_name')}
                                                    placeholder={trans['forms']['Name or company of the sender']}/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['forms']['If the entry remains empty, the page title is used.']}
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={trans['forms']['Reply-To']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="email"
                                                    value={this.props.editEmailSettings.reply_to || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'reply_to')}
                                                    placeholder={trans['forms']['Reply-To']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={trans['forms']['Sender e-mail'] + ' *'}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="email"
                                                    value={this.props.editEmailSettings.abs_email || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'abs_email')}
                                                    required={true}
                                                    placeholder={trans['forms']['Sender e-mail']}/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['forms']['In most cases, the provider e-mail must be entered here.']}
                                            </div>
                                        </div>
                                        {/*}
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['SMTP Host'] + ' *'}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="text"
                                                    disabled={!this.props.smtpSettings.active}
                                                    value={this.props.smtpSettings.smtp_host || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'smtp_host', e)}
                                                    required={true}
                                                    placeholder={bsFormBuild.lang['SMTP Host']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['SMTP Port'] + ' *'}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="number"
                                                    disabled={!this.props.smtpSettings.active}
                                                    value={this.props.smtpSettings.smtp_port || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'smtp_port', e)}
                                                    required={true}
                                                    placeholder={bsFormBuild.lang['SMTP Port']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['SMTP Secure'] + ' *'}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    className="no-blur"
                                                    disabled={!this.props.smtpSettings.active}
                                                    value={this.props.smtpSettings.smtp_secure || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'smtp_secure',e)}
                                                    required={true}
                                                    placeholder={bsFormBuild.lang['SMTP Secure']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['Username'] + ' *'}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    className="no-blur"
                                                    disabled={!this.props.smtpSettings.active}
                                                    value={this.props.smtpSettings.email_username || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'email_username',e)}
                                                    required={true}
                                                    placeholder={bsFormBuild.lang['Username']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['Password']}
                                            >
                                                <Form.Control
                                                    type="password"
                                                    className="no-blur"
                                                    disabled={!this.props.smtpSettings.active}
                                                    value={this.props.smtpSettings.email_password || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'email_password',e)}
                                                    required={true}
                                                    placeholder={bsFormBuild.lang['Password']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-12">
                                            <Form.Check
                                                className="no-blur mt-1"
                                                type="switch"
                                                id={uuidv4()}
                                                disabled={!this.props.smtpSettings.active}
                                                checked={this.props.smtpSettings.smtp_auth_active || false}
                                                onChange={(e) => this.props.onChangeSmtpSettings(e.currentTarget.checked, 'smtp_auth_active')}
                                                label={bsFormBuild.lang['SMTP Authentication']}
                                            />
                                        </div>
                                        {*/}

                                        <div className="col-12">
                                            <hr/>
                                            <div className="d-flex flex-wrap">
                                                <Form.Check
                                                    className="no-blur me-4"
                                                    type="switch"
                                                    id={uuidv4()}
                                                    checked={this.props.editEmailSettings.email_save_active || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.checked, 'email_save_active')}
                                                    label={trans['forms']['Save e-mail active']}
                                                />
                                                {/*}  <Form.Check
                                                    className="no-blur me-4"
                                                    type="switch"
                                                    disabled={!this.props.editEmailSettings.email_save_active}
                                                    id={uuidv4()}
                                                    checked={this.props.editEmailSettings.save_attachment || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.checked, 'save_attachment')}
                                                    label={trans['forms']['Save attachments']}
                                                /> {*/}
                                                <Form.Check
                                                    className="no-blur"
                                                    type="switch"
                                                    id={uuidv4()}
                                                    checked={this.props.editEmailSettings.async_active || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.checked, 'async_active')}
                                                    label={trans['app']['Send e-mail asynchronously']}
                                                />
                                            </div>
                                        </div>

                                        {/*}
                                        <div className="col-12">
                                            <hr className="mt-1"/>
                                            <div className="fs-5 fw-semibold">
                                                <i className="bi bi-gear text-blue me-2"></i>
                                                {bsFormBuild.lang['File Upload Settings']}
                                            </div>
                                            <Form.Check
                                                className="no-blur mt-2"
                                                type="switch"
                                                id={uuidv4()}
                                                checked={this.props.smtpSettings.file_upload_active || false}
                                                onChange={(e) => this.props.onChangeSmtpSettings(e.currentTarget.checked, 'file_upload_active')}
                                                label={bsFormBuild.lang['File upload active']}
                                            />
                                            <hr className="mb-1"/>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['Maximum file size (MB)'] + ' *'}
                                            >
                                                <Form.Control
                                                    type="number"
                                                    value={this.props.smtpSettings.file_max_size || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'file_max_size',e)}
                                                    className="no-blur"
                                                    required={true}
                                                    disabled={!this.props.smtpSettings.file_upload_active}
                                                    placeholder={bsFormBuild.lang['Maximum file size (MB)']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['maximum total upload size (MB)'] + ' *'}
                                            >
                                                <Form.Control
                                                    type="number"
                                                    value={this.props.smtpSettings.file_max_all_size || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'file_max_all_size',e)}
                                                    className="no-blur"
                                                    required={true}
                                                    disabled={!this.props.smtpSettings.file_upload_active}
                                                    placeholder={bsFormBuild.lang['maximum total upload size (MB)']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['Max. Files per e-mail'] + ' *'}
                                            >
                                                <Form.Control
                                                    type="number"
                                                    value={this.props.smtpSettings.upload_max_files || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'upload_max_files',e)}
                                                    className="no-blur"
                                                    required={true}
                                                    disabled={!this.props.smtpSettings.file_upload_active}
                                                    placeholder={bsFormBuild.lang['Max. Files per e-mail']}/>
                                            </FloatingLabel>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={bsFormBuild.lang['File Upload MimeTypes'] + ' *'}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    value={this.props.smtpSettings.upload_mime_types || ''}
                                                    onChange={(e) => this.onChangeInput(e.currentTarget.value, 'upload_mime_types',e)}
                                                    className="no-blur"
                                                    required={true}
                                                    disabled={!this.props.smtpSettings.file_upload_active}
                                                    placeholder={bsFormBuild.lang['File Upload MimeTypes']}/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {bsFormBuild.lang['Separate MimeTypes with comma or semicolon.']}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Form.Check
                                                className="no-blur mt-1"
                                                type="switch"
                                                id={uuidv4()}
                                                disabled={!this.props.smtpSettings.file_upload_active}
                                                checked={this.props.smtpSettings.multi_uploads_active || false}
                                                onChange={(e) => this.props.onChangeSmtpSettings(e.currentTarget.checked, 'multi_uploads_active')}
                                                label={bsFormBuild.lang['Multiple uploads active']}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <hr className="mt-1"/>
                                            {this.props.smtpSettings.active ? (<>
                                            <i className={`bi me-2 ${this.props.smtpSettings.smtp_test_success ? 'text-success bi-check-circle' : 'text-danger bi-exclamation-circle'}`}></i>
                                               <span className={`fw-semibold ${this.props.smtpSettings.smtp_test_success ? 'text-success' : 'text-danger'}`}>{this.props.smtpSettings.smtp_test_msg}</span>
                                                <hr /></>) : ''}
                                            <button onClick={this.onCheckSmtpSettings}
                                                type="button"
                                                disabled={!this.props.smtpSettings.active}
                                                className="btn btn-primary btn-sm">
                                                <i className="bi bi-gear me-1"></i>
                                                {bsFormBuild.lang['SMTP Test']}
                                            </button>
                                        </div>
                                          {*/}
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}