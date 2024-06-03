import * as React from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import Collapse from 'react-bootstrap/Collapse';
import TinyMce from "../../../AppComponents/TinyMce";
export default class FormEmailSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            responderOpen: false,
            editorOptions: {
                height: 650,
                menubar: true,
                promotion: false,
                branding: false,
                language: 'de',
                image_advtab: true,
                image_uploadtab: true,
                image_caption: true,
                importcss_append: false,
                browser_spellcheck: true,
                toolbar_sticky: true,
                toolbar_mode: 'wrap',
                statusbar: true,
                draggable_modal: true,
                relative_urls: true,
                remove_script_host: false,
                convert_urls: false,
                //content_css: '/css/bs-tiny/bootstrap.min.css',
                content_css: false,
                valid_elements: '*[*]',
                schema: "html5",
                verify_html: false,
                valid_children: "+a[div], +div[*]",
                extended_valid_elements: "div[*]",
                file_picker_types: 'image',
            }
        };
        this.onSaveFormEmailSettings = this.onSaveFormEmailSettings.bind(this);
        this.editorCallbackContent = this.editorCallbackContent.bind(this);
    }

    editorCallbackContent(content, handle) {

        this.props.onUpdateFormEmailSettings(content, handle, 'message')
    }

    onSetPlaceholder(e, value, tiny) {
        $(e).addClass('text-muted')
        tinymce.activeEditor.selection.setContent(value)
      // tinymce.get(tiny).selection.setContent(value);
    }

    onToggleResponder(open) {
        this.setState({
            responderOpen: open
        })
    }

    onSaveFormEmailSettings(event) {

        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {

            let formData = {
                'method': 'update_form_email_settings',
                'form_id': this.props.formData.form_id,
                'data': JSON.stringify(this.props.email_settings),
               // 'email_content': tinymce.get("tinyEmailNachricht").getContent(),
               // 'responder_content': tinymce.get("tinyEmailResponder").getContent(),
            }
            this.props.sendAxiosFormdata(formData)
        }
    }



    render() {
        return (

            <div className="card shadow-sm ">
                <div className="card-header fs-5 fw-semibold py-3">
                    <i className="bi bi-envelope text-blue me-2"></i>
                    {trans['forms']['E-mail settings']}
                </div>
                <div className="card-body">
                    <div className="col-xxl-10 col-xl-12 col-12 mx-auto">
                        {this.props.email_settings.email_select_active ? (
                            <div className="text-danger flicker-animation ms-2 py-2">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {trans['forms']['The e-mail is sent to the selected recipient.']}
                            </div>
                        ) : (<></>)}
                        <div className="p-3 border rounded">
                            <Form onSubmit={this.onSaveFormEmailSettings}>
                                <div className="row g-3">
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={trans['forms']['Send e-mail to'] + (this.props.email_settings.email_select_active ? '' : ' *')}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                required={!this.props.email_settings.email_select_active}
                                                value={this.props.email_settings.email.recipient || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'recipient')}
                                                type="email"
                                                placeholder="name@example.com"/>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={trans['forms']['Subject'] + ' *'}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                required={true}
                                                value={this.props.email_settings.email.subject || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'subject')}
                                                type="text"
                                                placeholder="Subject"/>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Cc.."
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                type="text"
                                                value={this.props.email_settings.email.cc || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'cc')}
                                                placeholder="Cc.."/>
                                        </FloatingLabel>
                                        <div className="form-text">
                                            {trans['forms']['Separate multiple recipients with a comma or semicolon.']}
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Bcc.."
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                type="text"
                                                value={this.props.email_settings.email.bcc || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'bcc')}
                                                placeholder="Bcc.."/>
                                        </FloatingLabel>
                                        <div className="form-text">
                                            {trans['forms']['Separate multiple recipients with a comma or semicolon.']}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-3 fs-5 fw-semibold">
                                            {trans['forms']['Message']}:
                                        </div>
                                        <h6>{trans['forms']['Available form placeholders']}:</h6>
                                        <div className="d-flex flex-wrap">
                                            {this.props.inputFields.map((f, index) => {
                                                return (
                                                    <div key={index}>
                                                        {index > 0 ? (
                                                            <span className="mx-1 text-muted">•</span>) : (<></>)}
                                                        <span
                                                            onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{${f.slug}}`, 'tinyEmailNachricht')}
                                                            className="text-blue cursor-pointer"
                                                        >
                                                     {`{${f.slug}}`}
                                                     </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <span
                                            onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{summary}`, 'tinyEmailNachricht')}
                                            className="mt-2 fw-semibold text-blue d-inline-block mb-3 cursor-pointer"
                                        >
                                          <span className="text-success d-inline-block">{`{summary}`}</span>
                                         </span>
                                        {/*} <div id="tinyEmailNachricht"></div> {*/}

                                        <TinyMce
                                            editorCallbackContent={this.editorCallbackContent}
                                            initialValue=""
                                            handle="email"
                                            content={this.props.email_settings.email.message || ''}
                                            editorOptions={this.state.editorOptions}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-switch-blue dark">
                                            <i className="bi bi-save2 me-2"></i>
                                            {trans['system']['Save']}
                                        </button>
                                    </div>
                                    <hr/>
                                </div>
                            </Form>


                            <div className="row g-2">
                                <div className="col-12">
                                    <div className="fs-5 fw-semibold">
                                        {trans['forms']['Automatic reply']}
                                        <small
                                            className={"d-block fw-normal fs-6 small-xl mt-1" + (this.props.email_settings.responder.active ? ' text-success' : ' text-danger')}>
                                            {this.props.email_settings.responder.active ? (trans['forms']['active']) : (trans['forms']['not active'])}
                                        </small>
                                    </div>
                                    <button onClick={() => this.onToggleResponder(!this.state.responderOpen)}
                                            aria-controls="responder-edit"
                                            aria-expanded={this.state.responderOpen}
                                            className="btn btn-switch-blue-outline mt-2 btn-sm">
                                        <i className="bi bi-toggle-on me-2"></i>
                                        {this.state.responderOpen ? trans['forms']['hide'] : trans['forms']['show']}
                                    </button>
                                    <Collapse in={this.state.responderOpen}>
                                        <div id="responder-edit">
                                            <Form onSubmit={this.onSaveFormEmailSettings}>
                                                <hr/>
                                                <div className="fs-5 fw-semibold">
                                                    {trans['forms']['Autoresponder settings']}
                                                </div>
                                                <hr/>
                                                {/*}  {this.props.email_settings.email_select_active ? (
                                                    <div className="text-danger flicker-animation mb-2 py-2">
                                                        <i className="bi bi-exclamation-circle me-2"></i>
                                                        {trans['forms']['The e-mail is sent to the selected recipient.']}
                                                    </div>
                                                ) : (<></>)} {*/}
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    id="custom-switch"
                                                    checked={this.props.email_settings.responder.active || ''}
                                                    onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.checked, 'responder', 'active')}
                                                    label={trans['forms']['active']}
                                                />
                                                <div className="col-12 mb-3">
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={trans['forms']['Subject'] + ' *'}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            required={true}
                                                            value={this.props.email_settings.responder.subject || ''}
                                                            onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'responder', 'subject')}
                                                            type="text"
                                                            placeholder="Subject"/>
                                                    </FloatingLabel>
                                                </div>
                                                <div className="mb-3 fs-5 fw-semibold">
                                                    {trans['forms']['Message']}:
                                                </div>
                                                <h6>{trans['forms']['Available form placeholders']}:</h6>
                                                <div className="d-flex flex-wrap mb-3">
                                                    {this.props.inputFields.map((f, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {index > 0 ? (
                                                                    <span
                                                                        className="mx-1 text-muted">•</span>) : (<></>)}
                                                                <span
                                                                    onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{${f.slug}}`, 'tinyEmailResponder')}
                                                                    className="text-blue cursor-pointer"
                                                                >
                                                          {`{${f.slug}}`}
                                                          </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <span
                                                    onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{summary}`, 'tinyEmailResponder')}
                                                    className="mt-2 fw-semibold text-blue d-block mb-3 cursor-pointer"
                                                >
                                                  <span className="text-success d-inline-block">{`{summary}`}</span>
                                                 </span>
                                                {/*}<div id="tinyEmailResponder"></div> {*/}
                                                <TinyMce
                                                    editorCallbackContent={this.editorCallbackContent}
                                                    initialValue=""
                                                    handle="responder"
                                                    content={this.props.email_settings.responder.message || ''}
                                                    editorOptions={this.state.editorOptions}
                                                />
                                                <div className="col-12">
                                                    <button type="submit"
                                                            className="btn btn-switch-blue-outline mt-3">
                                                        <i className="bi bi-save2 me-2"></i>
                                                        {trans['forms']['Save autoresponder']}
                                                    </button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Collapse>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}