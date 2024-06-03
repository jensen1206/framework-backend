import * as React from "react";
import TinyMce from "../AppComponents/TinyMce";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import Container from 'react-bootstrap/Container';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import FileMangerModal from "../AppMedien/Modal/FileMangerModal";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import * as AppTools from "../AppComponents/AppTools";

const v5NameSpace = 'cb6f851c-8369-427c-bb67-a01c29e9dafe';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            attachments: [],
            send_mail: {
                recipient: '',
                subject: '',
                cc: '',
                bcc: '',
                content: '',
                signature: false,
            },

            fmOptions: {
                multiSelect: true,
                maxSelect: publicSettings.emailSettings.attachment_max_count,
                fmTitle: trans['fm']['Select attachment'],
                fmButtonTxt: trans['fm']['Insert attachments'],
            },
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
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.editorCallbackContent = this.editorCallbackContent.bind(this);
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onDeleteAttachment = this.onDeleteAttachment.bind(this);
        this.onSubmitSendEmail = this.onSubmitSendEmail.bind(this);
        this.onSetEmailForm = this.onSetEmailForm.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    editorCallbackContent(content) {
        this.state.send_mail.content = content;
        this.setState({
            send_mail: this.state.send_mail
        })
    }

    fileManagerDidUpdate(state) {
        this.setState({
            didUpdateManager: state
        })
    }

    setFileManagerShow(state) {
        this.setState({
            fileManagerShow: state
        })
    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    fileManagerCallback(files) {
        let max = parseFloat(publicSettings.emailSettings.attachment_max_size) * 1024 * 1024;
        let attachments = [...this.state.attachments]
        files.map((f, index) => {
            if(attachments.length + 1 <=  this.state.fmOptions.maxSelect && parseInt(f.size) < max) {
                let add = {
                    'id': f.id,
                    'original': f.original,
                    'ext': f.extension
                }
                attachments.push(add)
            }
        })
        this.setState({
            attachments: attachments
        })
    }

    onDeleteAttachment(id){
        this.setState({
            attachments: this.filterArrayElementById([...this.state.attachments], id)
        })
    }

    onSetEmailForm(e, type){
       let upd = this.state.send_mail;
       upd[type] = e;
       this.setState({
           send_mail: upd
       })
    }

    onSubmitSendEmail(event){
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
           let formData = {
                'method': 'send_email',
                'email': JSON.stringify(this.state.send_mail),
                'attachments': JSON.stringify(this.state.attachments)
           }

           this.sendAxiosFormdata(formData).then()
        }
    }

    async sendAxiosFormdata(formData, url = emailSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, false, emailSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'send_email':
                            if(data.status) {
                                this.setState({
                                    attachments: [],
                                    send_mail: {}
                                })
                            }
                            AppTools.swalAlertMsg(data)
                          break;
                    }
                })
        }
    }

    render() {

        return (
            <React.Fragment>

                <Container>
                    <h3 className="fw-semibold text-body">
                        {trans['system']['Email']}
                        <small className="d-block fw-normal mt-2 text-secondary small-lg">
                            <i className="bi bi-caret-right me-1"></i>
                            {trans['email']['Send e-mail']}
                        </small>
                    </h3>
                    <hr/>
                    <Col xl={12} xs={12} className="mx-auto">
                        <Form onSubmit={this.onSubmitSendEmail}>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-body-tertiary py-3 fs-5 fw-semibold">
                                    <i className="bi-envelope-plus me-2"></i>
                                    {trans['email']['Send e-mail']}
                                </Card.Header>
                                <CardBody>
                                    <Row className="g-2">
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('sentEmail', v5NameSpace)}
                                                label={`${trans['email']['Recipient e-mail']} *`}
                                            >
                                                <Form.Control
                                                    required={true}
                                                    className="no-blur"
                                                    value={this.state.send_mail.recipient || ''}
                                                    onChange={(e) => this.onSetEmailForm(e.target.value, 'recipient')}
                                                    type="email"
                                                    placeholder="name@example.com"/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('subject', v5NameSpace)}
                                                label={`${trans['email']['Subject']} *`}
                                            >
                                                <Form.Control
                                                    required={true}
                                                    className="no-blur"
                                                    value={this.state.send_mail.subject || ''}
                                                    onChange={(e) => this.onSetEmailForm(e.target.value, 'subject')}
                                                    type="text"
                                                    placeholder={trans['email']['Subject']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('emailCc', v5NameSpace)}
                                                label={`${trans['email']['Cc']}`}
                                            >
                                                <Form.Control
                                                    required={false}
                                                    className="no-blur"
                                                    value={this.state.send_mail.cc || ''}
                                                    onChange={(e) => this.onSetEmailForm(e.target.value, 'cc')}
                                                    type="text"
                                                    placeholder={trans['email']['Cc']}/>
                                            </FloatingLabel>
                                            <Form.Text>
                                                {trans['email']['Separate multiple recipients with a comma or semicolon.']}
                                            </Form.Text>
                                        </Col>
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('emailBcc', v5NameSpace)}
                                                label={`${trans['email']['Bcc']}`}
                                            >
                                                <Form.Control
                                                    required={false}
                                                    className="no-blur"
                                                    value={this.state.send_mail.bcc || ''}
                                                    onChange={(e) => this.onSetEmailForm(e.target.value, 'bcc')}
                                                    type="text"
                                                    placeholder={trans['email']['Bcc']}/>
                                            </FloatingLabel>
                                            <Form.Text>
                                                {trans['email']['Separate multiple recipients with a comma or semicolon.']}
                                            </Form.Text>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Check
                                                className="no-blur"
                                                type="switch"
                                                 checked={this.state.send_mail.signature || ''}
                                                onChange={(e) => this.onSetEmailForm(e.target.checked, 'signature')}
                                                id={uuidv5('signatureActive', v5NameSpace)}
                                                label={trans['system']['Email signature']}
                                            />
                                        </Col>
                                        {publicSettings.su || publicSettings.emailSettings.attachment_active ?
                                        <Col xs={12}>
                                            <hr className="mt-1 mb-2"/>
                                            <div className="small text-muted mb-2">
                                                {trans['medien']['maximal']} {publicSettings.emailSettings.attachment_max_count}  {trans['medien']['Files']} - {trans['medien']['File size']} {trans['medien']['maximal']} {publicSettings.emailSettings.attachment_max_size}MB</div>
                                            <button
                                                onClick={() => this.fileManagerDidUpdate(true)}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                <i className="bi bi-node-plus me-2"></i>
                                                {trans['email']['Add attachment']}
                                            </button>
                                            <hr className="mb-1 mt-2"/>
                                            <div className="d-flex align-items-center flex-wrap">
                                                {this.state.attachments.map((f, index) => {
                                                    return (
                                                        <div key={index}
                                                             style={{minHeight: '2rem'}}
                                                             className="px-1 mb-1 h-100 d-flex align-items-center small me-2 border rounded overflow-hidden position-relative">
                                                            <i className={`bs-file-file me-2 ms-1 text-secondary file ext_${f.ext}`}></i>
                                                            <div className="pe-2 border-end">
                                                                {f.original}
                                                            </div>
                                                            <span
                                                                onClick={() => this.onDeleteAttachment(f.id)}
                                                                className="cursor-pointer ps-1 text-center d-inline-block hover-scale">
                                                             <i className="bi bi-trash text-danger dark"></i>
                                                         </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                            : ''}
                                        <Col xs={12}>
                                            <div className="iframe-padding-">
                                                <TinyMce
                                                    editorCallbackContent={this.editorCallbackContent}
                                                    initialValue=""
                                                    content={this.state.send_mail.content || ''}
                                                    editorOptions={this.state.editorOptions}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <button
                                                type="submit"
                                                className="btn btn-success-custom my-2 dark">
                                                {trans['email']['Send e-mail']}
                                            </button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Form>
                    </Col>
                </Container>
                <FileMangerModal
                    didUpdateManager={this.state.didUpdateManager}
                    fileManagerShow={this.state.fileManagerShow}
                    options={this.state.fmOptions}
                    fileManagerDidUpdate={this.fileManagerDidUpdate}
                    setFileManagerShow={this.setFileManagerShow}
                    fileManagerCallback={this.fileManagerCallback}
                />
            </React.Fragment>
        )
    }
}