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

const v5NameSpace = '5678803a-f63a-11ee-a11e-325096b39f47';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class AddCustomFieldModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
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
            'method': 'add_custom_field',
            'designation': this.props.addField.designation || '',
            'type': this.props.addField.type || ''
        }

        this.props.sendAxiosFormdata(formData)
    }


    render() {
        return (
            <Modal
                show={this.props.addCustomFieldModal}
                onHide={() => this.props.setShowAddCustomFieldModal(false)}
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
                            {trans['system']['Add Custom Field']}
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
                                        value={this.props.addField.designation || ''}
                                        onChange={(e) => this.props.onSetAddCustomFieldValue(e.currentTarget.value, 'designation')}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['Designation']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('feldType', v5NameSpace)}
                                    label={`${trans['Field type']} *`}>
                                    <Form.Select
                                        className="no-blur"
                                        required={true}
                                        value={this.props.addField.type || ''}
                                        onChange={(e) => this.props.onSetAddCustomFieldValue(e.currentTarget.value, 'type')}
                                        aria-label={trans['Field type']}>
                                        {this.props.selectType.map((s, index) =>
                                            <option value={s.id} key={index}>{s.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={() => this.props.setShowAddCustomFieldModal(false)}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {trans['system']['Add Custom Field']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

