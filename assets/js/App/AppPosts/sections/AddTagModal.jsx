import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v5 as uuidv5} from 'uuid';


const v5NameSpace = '0218e9d2-749b-408c-ae37-d14628ff04f6';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";

export default class AddTagModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            designation: '',
            error: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeTag = this.onChangeTag.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.resetName) {
            if(this.props.tagId){
                this.setState({
                    designation: this.props.tagDesignation
                })
            } else {
                this.setState({
                    designation: ''
                })

            }
            this.props.setResetName(false)
        }
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false || this.state.error) {
            return false;
        }

        let formData = {
            'method': this.props.tagId ? 'update_tag' : 'add_tag',
            'post': this.props.site.id,
            'id': this.props.tagId,
            'designation': this.state.designation
        }

        this.sendAxiosFormdata(formData).then()
    }

    onChangeTag(e) {
        this.setState({
            designation: e,
            error: false
        })
    }

    async sendAxiosFormdata(formData, isFormular = false, url = postSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, postSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'add_tag':
                            this.setState({
                                error: !data.check_tag
                            })
                            if (data.status) {
                                this.props.onCreatedTag(data.record)
                                this.props.setShowAddTagModal(false)
                                AppTools.success_message(data.msg)
                            } else {
                                if(data.check_tag) {
                                    AppTools.warning_message(data.msg)
                                }
                            }
                            break;
                        case 'update_tag':
                            this.setState({
                                error: !data.check_tag
                            })
                            if (data.status) {
                                this.props.setShowAddTagModal(false)
                                this.props.onUpdateTag(data.record)
                                AppTools.success_message(data.msg)
                            } else {
                                if(data.check_tag){
                                    AppTools.warning_message(data.msg)
                                }

                            }
                            break;

                    }
                }).catch(err => console.error(err));
        }
    }


    render() {
        return (
            <Modal
                show={this.props.showAddTagModal}
                onHide={() => this.props.setShowAddTagModal(false)}
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
                            <i className="bi bi-tag me-2"></i>
                            {this.props.tagId ? trans['system']['Tag update'] : trans['system']['Create tag']}
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
                                        onChange={(e) => this.onChangeTag(e.target.value)}
                                        className="no-blur"
                                        type="text"
                                        isInvalid={this.state.error}
                                        placeholder={trans['system']['Title']}/>
                                </FloatingLabel>
                                    <Form.Control.Feedback className={`${this.state.error ? 'd-block' : ''}`} type="invalid">
                                        {trans['system']['Tag already exists']}
                                    </Form.Control.Feedback>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary dark" onClick={() => this.props.setShowAddTagModal(false)}>
                            {trans['swal']['Close']}
                        </Button>
                        <Button
                            type="submit" variant="switch-blue dark">
                            {this.props.tagId ? trans['system']['Save changes'] : trans['system']['Create tag']}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

