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

const v5NameSpace = '98883431-a40f-4385-ba51-b8112ae97729';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class AddMapProtectionModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            designation: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);


    }
    handleSubmit(event){
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }

        let formData = {
            'method': 'map_protection_handle',
            'handle': 'insert',
            'data_type': 'protection',
            'designation': this.state.designation,
        }

        this.sendAxiosFormdata(formData).then()
    }

    onChangeDesignation(e){
        this.setState({
            designation: e
        })
    }



    async sendAxiosFormdata(formData, isFormular = false, url = mediaGallery.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, mediaGallery))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'map_protection_handle':
                              if(data.status){
                                  this.setState({
                                      designation: '',
                                  })
                                  this.props.onToggleCollapse('table', true);
                                  this.props.setShowAddModal(false)
                                  AppTools.swalAlertMsg(data)
                              } else {
                                  AppTools.warning_message(data.msg)
                              }
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <Modal
                show={this.props.showAddModal}
                onHide={() => this.props.setShowAddModal(false)}
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
                            className="fw-normal fs-6"
                        >
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['Add data protection']}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-2">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('designation', v5NameSpace)}
                                    label={`${trans['Designation']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.state.designation}
                                        onChange={(e) => this.onChangeDesignation(e.target.value)}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['Designation']}/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={() => this.props.setShowAddModal(false)}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {trans['system']['Create new']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

