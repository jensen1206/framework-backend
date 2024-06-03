import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v5 as uuidv5} from 'uuid';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";

const v5NameSpace = '6e6c885a-38fe-4c0a-873c-1773ab536a8f';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class SendBackupModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            showSendModal: false,
            recipient: '',
            description: '',
            size: '',
            file: ''

        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onGetModalData = this.onGetModalData.bind(this);
        this.onCloseSendModal = this.onCloseSendModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadSendBackupModalData) {
            this.onGetModalData()
            this.props.onSetLoadBackupModalData(false);
        }
    }
    onGetModalData() {
        let formData = {
            'method': 'get_send_modal',
            'id': this.props.id
        }
        this.sendAxiosFormdata(formData).then()
    }

    onCloseSendModal() {
        this.setState({
            showSendModal: false,
            recipient: '',
            size: '',
            file: '',
            description: ''
        })
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            let formData = {
                'method': 'send_backup_email',
                'id': this.props.id,
                'recipient': this.state.recipient,
                'description': this.state.description,
            }
            this.sendAxiosFormdata(formData).then()
        }
    }

    async sendAxiosFormdata(formData, isFormular = false, url = backupSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, backupSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_send_modal':
                            if (data.status) {
                                this.setState({
                                    showSendModal: true,
                                    recipient: data.recipient,
                                    size: data.record.fileSize,
                                    file: data.record.fileName
                                })
                            }
                            break;
                        case 'send_backup_email':
                            if (data.status) {
                               this.onCloseSendModal()
                            }
                            AppTools.swalAlertMsg(data)
                            break;

                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <Modal
                show={this.state.showSendModal}
                onHide={this.onCloseSendModal}
                backdrop="static"
                keyboard={false}
                //size="lg"
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header
                        closeButton
                        className="bg-body-tertiary"
                    >
                        <Modal.Title
                            className="fw-normal"
                        >
                            <i className="bi bi-envelope-arrow-up me-2"></i>
                            {trans['backup']['Send database file']}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col xs={12}>
                                <small className="text-center d-block fw-light text-muted">
                                    <i title={this.state.file} className="bi bi-info-circle me-2"></i>
                                    <span className="fw-semibold me-1">
                                        {trans['backup']['Dump File']}:
                                    </span>
                                    {this.state.file} (<span className="text-primary fw-normal small">{this.state.size}</span>)
                                </small>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('emailInput', v5NameSpace)}
                                    label={`${trans['email']['Recipient']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.state.recipient || ''}
                                        onChange={(e) => this.setState({recipient: e.target.value})}
                                        className="no-blur"
                                        type="email"
                                        placeholder={trans['email']['Recipient']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('descriptionInput', v5NameSpace)}
                                    label={trans['system']['Description']}>
                                    <Form.Control
                                        as="textarea"
                                        className="no-blur"
                                        placeholder={trans['system']['Description']}
                                        style={{height: '80px'}}
                                        value={this.state.description || ''}
                                        onChange={(e) => this.setState({description: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={this.onCloseSendModal}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {trans['backup']['Send e-mail']}

                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}