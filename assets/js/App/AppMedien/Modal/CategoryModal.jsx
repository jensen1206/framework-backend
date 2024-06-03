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

export default class CategoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            showCategoryModal: false,
            designation: '',
            description: '',
            user_id: '',
            userSelect: []
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onGetCategoryData = this.onGetCategoryData.bind(this);
        this.onCloseCategoryModal = this.onCloseCategoryModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadCategoryModalData) {
            this.onGetCategoryData()

            this.props.onSetLoadCategoryModalData(false);
        }
    }

    onGetCategoryData() {
        let formData = {
            'method': 'get_media_category',
            'id': this.props.id || '',
            'handle': this.props.id ? 'update' : 'insert'
        }

        this.sendAxiosFormdata(formData).then()
    }

    onCloseCategoryModal() {
        this.setState({
            designation: '',
            description: '',
            user_id: '',
            userSelect: [],
            showCategoryModal: false
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
            'method': 'media_category_handle',
            'handle': this.props.id ? 'update' : 'insert',
            'id': this.props.id || '',
            'designation': this.state.designation,
            'description': this.state.description,
            'user_id': this.state.user_id,
        }

        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = uploadSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, uploadSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_media_category':
                            if (data.status) {
                                this.setState({
                                    showCategoryModal: true,
                                    designation: data.designation,
                                    description: data.description,
                                    user_id: data.user_id,
                                    userSelect: data.user_selects,
                                })
                            }
                            break;
                        case 'media_category_handle':
                              if(data.status){
                                  this.setState({
                                      designation: '',
                                      description: '',
                                      user_id: '',
                                      userSelect: [],
                                      showCategoryModal: false
                                  })
                                  AppTools.success_message(data.msg)
                                  this.props.addCategoryCallback(data.id, data.label);
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
                show={this.state.showCategoryModal}
                onHide={this.onCloseCategoryModal}
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
                            {this.props.id ? trans['medien']['Edit category'] : trans['medien']['Create category']}
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
                                        value={this.state.designation}
                                        onChange={(e) => this.setState({designation: e.target.value})}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['Designation']}/>
                                </FloatingLabel>
                            </Col>
                            {publicSettings.su ? (
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('ownerInput', v5NameSpace)}
                                    label={`${trans['media']['Owner']} *`}>
                                    <Form.Select
                                        aria-label={`${trans['media']['Owner']} *`}
                                        className="no-blur"
                                        value={this.state.user_id}
                                        onChange={(e) => this.setState({user_id: e.target.value})}
                                    >
                                        {this.state.userSelect.map((user, index) =>
                                            <option value={user.id} key={index}>{user.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>) : ''}

                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('descriptionInput', v5NameSpace)}
                                    label={trans['system']['Description']}>
                                    <Form.Control
                                        as="textarea"
                                        className="no-blur"
                                        placeholder={trans['system']['Description']}
                                        style={{height: '100px'}}
                                        value={this.state.description}
                                        onChange={(e) => this.setState({description: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={this.onCloseCategoryModal}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {this.props.id ? trans['system']['Save changes'] : trans['medien']['Create category']}

                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

