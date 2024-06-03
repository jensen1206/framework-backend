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

export default class AddPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            designation: '',
            slug: '',
            category: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeDesignation = this.onChangeDesignation.bind(this);

    }
    handleSubmit(event){
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }

        let formData = {
            'method': 'add_post',
            'title': this.state.designation,
            'slug': this.state.slug,
            'category': this.state.category,
        }

        this.sendAxiosFormdata(formData).then()
    }

    onChangeDesignation(e) {

        this.setState({
            designation: e
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'urlizer_slug',
                'post': e
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

    }

    async sendAxiosFormdata(formData, isFormular = false, url = postSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, postSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'add_post':
                              if(data.status){
                                  this.setState({
                                      designation: '',
                                      route: '',
                                      slug: '',
                                      category: ''
                                  })
                                  this.props.setToggleCollapse('table', true);
                                  this.props.setShowAddPostModal(false)
                                  AppTools.success_message(data.msg)
                              } else {
                                  AppTools.warning_message(data.msg)
                              }
                            break;
                        case 'urlizer_slug':
                               if(data.status) {
                                   this.setState({
                                       slug: data.slug
                                   })
                               }
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <Modal
                show={this.props.showAddPostModal}
                onHide={() => this.props.setShowAddPostModal(false)}
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
                            {trans['posts']['Create new post']}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-2">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('designation', v5NameSpace)}
                                    label={`${trans['system']['Title']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.state.designation}
                                        onChange={(e) => this.onChangeDesignation(e.target.value)}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['system']['Title']}/>
                                </FloatingLabel>
                            </Col>

                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('slug', v5NameSpace)}
                                    label={`${trans['system']['Slug']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.state.slug}
                                        onChange={(e) => this.setState({slug: e.target.value})}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['system']['Slug']}/>
                                </FloatingLabel>
                            </Col>

                            <Col xs={12}>
                                <FloatingLabel controlId={uuidv5('selectSiteCategory', v5NameSpace)}
                                               label={`${trans['system']['Category']} *`}>
                                    <Form.Select
                                        required={true}
                                        className="no-blur"
                                        value={this.state.category}
                                        onChange={(e) => this.setState({category: e.target.value})}
                                        aria-label={trans['system']['Category']}>
                                        <option value="">{trans['system']['select']}</option>
                                        {(this.props.categorySelect).map((select, index) =>
                                            <option key={index} value={select.site_id}>
                                                {select.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={() => this.props.setShowAddPostModal(false)}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button type="submit" variant="switch-blue dark">
                            {trans['posts']['Create post']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

