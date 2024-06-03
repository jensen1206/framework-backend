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

const v5NameSpace = '39acf152-393e-40f2-99f6-b50dbd15e87c';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class HeaderFooterModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }

        let formData = {
            'method': 'add_header_footer',
            'designation': this.props.edit.designation,
            'id': this.props.edit.id || '',
            'handle': this.props.edit.id ? 'update' : 'insert',
            'type': this.props.type,
        }

        this.props.sendAxiosFormdata(formData)

    }


    render() {
        let editType;
        if(this.props.type === 'header') {
            if(this.props.edit.id) {
                editType = trans['builder']['Edit header']
            } else {
                editType = trans['builder']['Create header']
            }
        } else {
            if(this.props.edit.id) {
                editType =  trans['builder']['Edit footer']
            } else {
                editType =  trans['builder']['Create footer']
            }
        }

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
                            className="fw-normal"
                        >
                          {editType}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('titleInput', v5NameSpace)}
                                    label={`${trans['Designation']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.props.edit.designation || ''}
                                        onChange={(e) => this.props.setEditModal(e.target.value, 'designation')}
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
                            {this.props.edit.id ? trans['system']['Save changes'] : editType}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

