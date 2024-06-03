import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import Form from "react-bootstrap/Form";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const v5NameSpace = '81d05974-bb67-4be0-aafb-96e7aa1d1cef';
export default class AddMenuModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            showAddModal: false,
            select: [],
            catEdit: {
                slug: '',
                title: '',
                description: '',
                type: ''
            }
        }
        this.onSetShowModal = this.onSetShowModal.bind(this);
        this.onGetModal = this.onGetModal.bind(this);
        this.onUpdateCatEdit = this.onUpdateCatEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);



    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.getAddModal) {
            this.setState({
                select: [],
                catEdit: {
                    slug: '',
                    title: '',
                    description: '',
                    type: ''
                }
            })
            this.onGetModal();
            // this.onSetShowModal(true);
            this.props.onSetGetAddModal(false);
        }

    }

    onUpdateCatEdit(e, type) {
        let upd = this.state.catEdit;
        upd[type] = e;
        this.setState({
            catEdit: upd
        })

        if(type === 'title') {
            let formData = {
                'method': 'make_slug',
                'title': e
            }
            this.sendAxiosFormdata(formData).then()
        }
    }

    onSetShowModal(state) {
        this.setState({
            showAddModal: state
        })
    }

    onGetModal() {
        let formData = {
            'method': 'get_modal_menu',
            'id': this.props.id || ''
        }

        this.sendAxiosFormdata(formData).then()
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'add_menu',
            'menu': JSON.stringify(this.state.catEdit)
        }
        this.props.sendAxiosFormdata(formData)
        this.setState({
            showAddModal: false
        })
    }

    async sendAxiosFormdata(formData, isFormular = false, url = menuSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, menuSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_modal_menu':
                            if (data.status) {
                                this.setState({
                                    showAddModal: true,
                                    select: data.select
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }

                            break;
                        case 'make_slug':
                              if(data.status) {
                                  let upd = this.state.catEdit;
                                  upd['slug'] = data.slug
                                  this.setState({
                                      catEdit: upd
                                  })
                              }
                            break;


                    }
                }).catch(err => console.error(err));
        }
    }


    render() {
        return (
            <>
                <Modal className="form-builder-modal"
                       animation={true}
                       scrollable={true}
                       show={this.state.showAddModal}
                       onHide={() => this.onSetShowModal(false)}
                    //size="xl"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header className="bg-body-tertiary pb-2 fs-6 align-items-start text-body" closeButton>
                            <div className="d-flex flex-column w-100">
                                <Modal.Title className="fs-6">
                                    <i className="bi bi-node-plus me-2"></i>
                                    {trans['system']['Add menu']}
                                </Modal.Title>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="g-2">
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectType', v5NameSpace)}
                                        label={`${trans['system']['Menu type']} *`}>
                                        <Form.Select
                                            required={true}
                                            className="no-blur"
                                            value={this.state.catEdit.type || ''}
                                            onChange={(e) => this.onUpdateCatEdit(e.currentTarget.value, 'type')}
                                            aria-label={trans['system']['Menu type']}>
                                            {this.state.select.map((s, index) =>
                                                <option value={s.id}
                                                        key={index}>{s.label}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('inputDesignation', v5NameSpace)}
                                        required={true}
                                        label={`${trans['Designation']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.state.catEdit.title || ''}
                                            onChange={(e) => this.onUpdateCatEdit(e.currentTarget.value, 'title')}
                                            type="text"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('inputSlug', v5NameSpace)}
                                        required={true}
                                        label={`${trans['system']['Slug']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.state.catEdit.slug || ''}
                                            onChange={(e) => this.onUpdateCatEdit(e.currentTarget.value, 'slug')}
                                            type="text"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('inputDescription', v5NameSpace)}
                                        required={false}
                                        label={`${trans['system']['Description']} `}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.state.catEdit.description || ''}
                                            onChange={(e) => this.onUpdateCatEdit(e.currentTarget.value, 'description')}
                                            as="textarea"
                                            style={{height: '100px'}}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => this.onSetShowModal(false)}>
                                {trans['swal']['Cancel']}
                            </Button>
                            <Button
                                variant="success-custom dark"
                                type="submit"
                            >
                                {this.props.id ? trans['system']['Save changes'] : trans['system']['Add menu']}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    }
}