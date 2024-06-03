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

const v5NameSpace = '032f1953-0bef-4518-bbe7-056bef05643c';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class SiteCategoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            title: '',
            description: '',
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
            'method': 'add_site_category',
            'title': this.state.title,
            'description': this.state.description,
        }

        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = sitesSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, sitesSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'add_site_category':
                              if(data.status){
                                  this.setState({
                                      title: '',
                                      description: '',
                                  })

                                  this.props.onToggleCategoryCollapse('table', true);
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
                show={this.props.showCategoryModal}
                onHide={() => this.props.setShowCategoryModal(false)}
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
                            {trans['medien']['Create category']}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('titleInput', v5NameSpace)}
                                    label={`${trans['system']['Title']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.state.title}
                                        onChange={(e) => this.setState({title: e.target.value})}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['system']['Title']}/>
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
                                        style={{height: '100px'}}
                                        value={this.state.description}
                                        onChange={(e) => this.setState({description: e.target.value})}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={() => this.props.setShowCategoryModal(false)}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {trans['medien']['Create category']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

