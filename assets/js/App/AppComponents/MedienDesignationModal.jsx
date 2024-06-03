import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v5 as uuidv5} from 'uuid';

const v5NameSpace = 'de60c21a-b62e-11ee-9eff-325096b39f47';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class MedienDesignationModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            showModal: false,
            designation: ''
        }


        this.onCloseModal = this.onCloseModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       if(this.props.showMedienModal){
           this.setState({
               showModal: true,
               designation: ''
           })
           this.props.onSetShowModal(false);
       }
    }

    onCloseModal() {
        this.setState({
            showModal: false
        })
    }

    handleSubmit(event){
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': this.props.method,
            'designation': this.state.designation
        }
        this.setState({
            showModal: false
        })
        this.props.sendAxiosFormdata(formData)
    }


    render() {
        return (
            <Modal
                show={this.state.showModal}
                onHide={this.onCloseModal}
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
                            {this.props.title}
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
                                        value={this.state.designation || ''}
                                        onChange={(e) => this.setState({designation: e.target.value})}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['Designation']}/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={this.onCloseModal}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {this.props.title}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

