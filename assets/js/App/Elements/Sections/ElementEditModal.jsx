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

const v5NameSpace = 'de60c21a-b62e-11ee-9eff-325096b39f47';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class ElementEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            showElementModal: false,
            designation: '',
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onGetBuilderData = this.onGetBuilderData.bind(this);
        this.onCloseBuilderModal = this.onCloseBuilderModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadElementModalData) {
            this.onGetBuilderData()

            this.props.onSetLoadElementModalData(false, this.props.id);
        }
    }

    onGetBuilderData() {
        let formData = {
            'method': 'get_form_element',
            'id': this.props.id || '',
        }

        this.sendAxiosFormdata(formData).then()
    }

    onCloseBuilderModal() {
        this.setState({
            designation: '',
            showElementModal: false
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
            'method': 'update_element_title',
            'designation': this.state.designation,
            'id': this.props.id,
        }

        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_form_element':
                            if (data.status) {
                                //console.log(data.record.designation)
                                this.setState({
                                    showElementModal: true,
                                    designation: data.record.designation,
                                })
                            }
                            break;
                        case 'update_element_title':
                            if(data.status){
                                this.setState({
                                    designation: '',
                                    showElementModal: false
                                })
                                this.props.onSetDrawElementsTable(true)
                                AppTools.success_message(data.msg)
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
                show={this.state.showElementModal}
                onHide={this.onCloseBuilderModal}
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
                            { trans['builder']['Page-Builder']} <span className="fw-light fw-light">{trans['plugins']['Element']}</span>
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
                        <Button variant="secondary dark" onClick={this.onCloseBuilderModal}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {trans['system']['Save changes']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

