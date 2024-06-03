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

const v5NameSpace = '1e63ac81-9312-4db3-8d06-5e45305a2f85';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class AddFormsBuilderModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {

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
            'method': 'builder_handle',
            'designation': this.props.editBuilder.designation,
            'id': this.props.editBuilder.id || ''
        }

        this.props.sendAxiosFormdata(formData).then()
    }



    render() {
        return (
            <Modal
                show={this.props.showAddBuilderModal}
                onHide={() => this.props.onSetShowAddBuilderModal(false)}
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
                            {this.props.editBuilder.id ? trans['forms']['Edit form'] : trans['forms']['Create form']}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('designationInput', v5NameSpace)}
                                    label={`${trans['Designation']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.props.editBuilder.designation || ''}
                                        onChange={(e) => this.props.onSetEditBuilder(e.currentTarget.value, 'designation')}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['Designation']}/>
                                </FloatingLabel>
                            </Col>
                            {/*}<Col xs={12}>
                                <FloatingLabel controlId={uuidv5('selectSiteCategory', v5NameSpace)}
                                               label={`${trans['Page-Builder Type']} *`}>
                                    <Form.Select
                                        required={true}
                                        className="no-blur"
                                        value={this.props.addBuilder.type || ''}
                                        onChange={(e) => this.props.onSetAddBuilderForm(e.currentTarget.value, 'type')}
                                        aria-label={trans['system']['Category']}>
                                        <option value="">{trans['system']['select']}</option>
                                        <option value="page">{trans['Page']}</option>
                                        <option value="post">{trans['posts']['Post']}</option>
                                        <option value="category">{trans['system']['Category']}</option>
                                        <option value="loop">{trans['loop']}</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col> {*/}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={() => this.props.onSetShowAddBuilderModal(false)}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {this.props.editBuilder.id ? trans['system']['Save changes'] : trans['forms']['Create form']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

