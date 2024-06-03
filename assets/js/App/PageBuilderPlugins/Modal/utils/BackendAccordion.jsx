import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Accordion from 'react-bootstrap/Accordion';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {ReactSortable} from "react-sortablejs";
import AppIcons from "../../../AppIcons/AppIcons";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const v5NameSpace = '06c30322-ef77-11ee-a466-325096b39f47';
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";
import TinyMce from "../../../AppComponents/TinyMce";

export default class BackendAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            addElement: '',
            init: '',
            sortableOptions: {
                animation: 300,
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
            editorOptions: {
                height: 450,
                menubar: true,
                promotion: false,
                branding: false,
                language: 'de',
                image_advtab: true,
                image_uploadtab: true,
                image_caption: true,
                importcss_append: false,
                browser_spellcheck: true,
                toolbar_sticky: true,
                toolbar_mode: 'wrap',
                statusbar: true,
                draggable_modal: true,
                relative_urls: true,
                remove_script_host: false,
                convert_urls: false,
                content_css: '/css/bs-tiny/bootstrap.min.css',
                //content_css: false,
                valid_elements: '*[*]',
                schema: "html5",
                verify_html: false,
                valid_children: "+a[div], +div[*]",
                extended_valid_elements: "div[*]",
                file_picker_types: 'image',
            }
        }


        this.addItem = this.addItem.bind(this);
        this.onChangeAccordion = this.onChangeAccordion.bind(this);
        this.editorCallbackContent = this.editorCallbackContent.bind(this);
        this.setInit = this.setInit.bind(this);
        this.onSetAccordionSortable = this.onSetAccordionSortable.bind(this);
        this.onSetActive = this.onSetActive.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    onChangeAccordion(e, type, id) {
        const accordion = [...this.props.edit.config.accordion]
        const find = this.findArrayElementById(accordion, id);
        find[type] = e;
        this.props.onSetStateConfig(accordion, 'accordion')
    }

    addItem() {
        let formData = {
            'method': 'add_accordion_item',
            'count': this.props.edit.config.accordion.length + 1
        }
        this.sendAxiosFormdata(formData).then()
    }

    setInit(id) {
        const accordion = [...this.props.edit.config.accordion]
        const find = this.findArrayElementById(accordion, id);
        tinymce.get(id).setContent(find['body']);
    }

    editorCallbackContent(cont, handle) {

        //let content = tinymce.activeEditor.getContent();
        const accordion = [...this.props.edit.config.accordion]
        const find = this.findArrayElementById(accordion, handle);
        find['body'] = cont;
        this.props.onSetStateConfig(accordion, 'accordion')
    }

    onSetActive(e) {
        let currentActive = e.currentTarget.classList.contains('active');
        $('.header-item').removeClass('active')
        if (!currentActive) {
            e.currentTarget.classList.add('active')
        }
    }

    onDeleteItem(id) {
        const accordion = this.filterArrayElementById([...this.props.edit.config.accordion], id);
        this.props.onSetStateConfig(accordion, 'accordion')
    }

    onSetAccordionSortable(newState) {
        this.props.onSetStateConfig(newState, 'accordion')
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'add_accordion_item':
                            if (data.status) {
                                let accordion = [...this.props.edit.config.accordion, data.record]
                                this.props.onSetStateConfig(accordion, 'accordion')
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
            <React.Fragment>
                <Row className="g-2 overflow-hidden">
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv5('headerCss', v5NameSpace)}
                            label={`${trans['plugins']['Header extra CSS']} `}>
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.header_css || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'header_css')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['Header extra CSS']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv5('bodyCss', v5NameSpace)}
                            label={`${trans['plugins']['Body extra CSS']} `}>
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.body_css || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'body_css')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['Body extra CSS']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12}>
                        <Form.Check
                            type="switch"
                            checked={this.props.edit.config.parent_element || false}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'parent_element')}
                            id={uuidv5('checkParent', v5NameSpace)}
                            label={trans['plugins']['Only ever open one element']}
                        />
                    </Col>
                    <Col xs={12}>
                        <hr/>
                        <button onClick={this.addItem}
                                className="btn btn-success-custom dark" type="button">
                            <i className="bi bi-distribute-vertical me-2"></i>
                            {trans['plugins']['Add accordion element']}
                        </button>
                    </Col>
                    <Col xs={12}>
                        <hr/>
                        {this.props.edit.config.accordion && this.props.edit.config.accordion.length ?
                            <Accordion>
                                <ReactSortable
                                    list={this.props.edit.config.accordion}
                                    handle=".cursor-move"
                                    setList={(newState) => this.onSetAccordionSortable(newState)}
                                    {...this.state.sortableOptions}
                                >
                                    {this.props.edit.config.accordion.map((a, index) => {
                                        return (
                                            <Accordion.Item key={a.id} eventKey={a.id}>
                                                <div onClick={(e) => this.onSetActive(e)}
                                                     className="position-relative header-item">
                                                    <div
                                                        className="slider-edit-box d-flex align-items-center justify-content-center bg-body-tertiary h-100">
                                                        <div
                                                            className="border-end cursor-move slider-edit-icon d-flex align-items-center justify-content-center h-100"
                                                            style={{width: '2.75rem'}}>
                                                            <i className="bi bi-arrows-move"></i>
                                                        </div>
                                                        <div
                                                            onClick={() => this.onDeleteItem(a.id)}
                                                            className="h-100 cursor-pointer slider-edit-icon border-end d-flex align-items-center justify-content-center"
                                                            style={{width: '2.75rem'}}>
                                                            <i className="bi bi-trash text-danger"></i>
                                                        </div>
                                                    </div>
                                                    <Accordion.Header
                                                        onClick={() => this.setInit(a.id)}
                                                    >
                                                        <div className="slider-edit-item">
                                                            {a.header}
                                                            {a.open ?
                                                                <small
                                                                    className="ms-3 d-inline-block small text-blue">open</small>
                                                                : ''}
                                                        </div>
                                                    </Accordion.Header>
                                                </div>
                                                <Accordion.Body>
                                                    <Row className="g-2">
                                                        <Col xs={12}>
                                                            <Form.Check
                                                                type="switch"
                                                                checked={a.open || false}
                                                                onChange={(e) => this.onChangeAccordion(e.currentTarget.checked, 'open', a.id)}
                                                                id={uuidv4()}
                                                                label={trans['plugins']['expanded']}
                                                            />
                                                        </Col>
                                                        <Col xs={12}>
                                                            <FloatingLabel
                                                                controlId={uuidv4()}
                                                                label={`${trans['plugins']['Accordion Header']} `}>
                                                                <Form.Control
                                                                    required={false}
                                                                    value={a.header || ''}
                                                                    onChange={(e) => this.onChangeAccordion(e.currentTarget.value, 'header', a.id)}
                                                                    className="no-blur"
                                                                    type="text"
                                                                    placeholder={trans['plugins']['Accordion Header']}/>
                                                            </FloatingLabel>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <div className="fs-6">
                                                                {trans['plugins']['Accordion Body']}
                                                            </div>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <div className="iframe-padding">
                                                                <TinyMce
                                                                    editorCallbackContent={this.editorCallbackContent}
                                                                    initialValue=""
                                                                    id={a.id}
                                                                    handle={a.id}
                                                                    content={a.body}
                                                                    editorOptions={this.state.editorOptions}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
                                    })}
                                </ReactSortable>
                            </Accordion>
                            :
                            <div className="fs-6 text-danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['plugins']['no items available']}
                            </div>
                        }
                        <hr/>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}