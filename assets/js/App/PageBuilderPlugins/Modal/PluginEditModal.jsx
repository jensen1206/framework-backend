import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import TinyMce from "../../AppComponents/TinyMce";
import Col from "react-bootstrap/Col";
import {Row} from "react-bootstrap";
import {v5 as uuidv5} from 'uuid';
import Form from 'react-bootstrap/Form';
import BackendSpacer from "./utils/BackendSpacer";
import BackendButton from "./utils/BackendButton";
import BackendMedienSlider from "./utils/BackendMedienSlider";
import BackendMedienCarousel from "./utils/BackendMedienCarousel";
import BackendDividingLine from "./utils/BackendDividingLine";
import PluginTinyMce from "../Sections/utils/PluginTinyMce";
import BackendUnfilteredHTML from "./utils/BackendUnfilteredHTML";
import BackendSingleImage from "./utils/BackendSingleImage";
import BackendDividingTextLine from "./utils/BackendDividingTextLine";
import BackendMedienGallery from "./utils/BackendMedienGallery";
import BackendLoopTitle from "./utils/BackendLoopTitle";
import BackendLoopExcerpt from "./utils/BackendLoopExcerpt";
import BackendLoopDate from "./utils/BackendLoopDate";
import BackendLoopPostImage from "./utils/BackendLoopPostImage";
import BackendPostGallery from "./utils/BackendPostGallery";
import BackendPostLoop from "./utils/BackendPostLoop";
import BackendCategoryTitle from "./utils/BackendCategoryTitle";
import BackendCategoryDescription from "./utils/BackendCategoryDescription";
import BackendCategoryImage from "./utils/BackendCategoryImage";
import BackendMenu from "./utils/BackendMenu";
import BackendPostSlider from "./utils/BackendPostSlider";
import BackendIcon from "./utils/BackendIcon";
import BackendGmapsApi from "./utils/BackendGmapsApi";
import BackenGmapsIframe from "./utils/BackenGmapsIframe";
import BackenOSMIframe from "./utils/BackenOSMIframe";
import BackenOSMLeaflet from "./utils/BackenOSMLeaflet";
import BackendForms from "./utils/BackendForms";
import BackendAccordion from "./utils/BackendAccordion";
import InputGroup from 'react-bootstrap/InputGroup';
import Collapse from 'react-bootstrap/Collapse';

const v5NameSpace = '98883431-a40f-4385-ba51-b8112ae97729';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import BackendCustomFields from "./utils/BackendCustomFields";
import BackendVideo from "./utils/BackendVideo";


const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class PluginEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            showEditModal: false,
            elementDesignation: '',
            generalCol: true,
            animationCol: false,
            saveCol: false,
            editSlideModal: false,
            overviewSlideModal: true,
            postGallerySliderCol: false,
            colOsmLeaflet: false,
            editImage: {},
            edit: {
                type: '',
                data: {},
                config: {},
                options: {},
                images: [],
                backend: []
            },
            editorOptions: {
                height: 400,
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
            },

        }

        this.setShowEditModal = this.setShowEditModal.bind(this);
        this.onGetEditPlugin = this.onGetEditPlugin.bind(this);

        //Carousel
        this.onChangeCarouselImage = this.onChangeCarouselImage.bind(this);


        this.editorCallbackContent = this.editorCallbackContent.bind(this);
        this.onSetDataInput = this.onSetDataInput.bind(this);
        this.onSetConfig = this.onSetConfig.bind(this);
        this.onSetStateConfig = this.onSetStateConfig.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.toggleSliderCollapse = this.toggleSliderCollapse.bind(this);
        this.onSetAnimation = this.onSetAnimation.bind(this);
        this.onSetMapCustomPin = this.onSetMapCustomPin.bind(this);
        this.onAddMapCustomPin = this.onAddMapCustomPin.bind(this);
        this.onSetColOsmLeaflet = this.onSetColOsmLeaflet.bind(this);
        this.onSetOsmLeaflet = this.onSetOsmLeaflet.bind(this);

        //Element
        this.onSaveElement = this.onSaveElement.bind(this);
        this.onSetData = this.onSetData.bind(this);
        //Sortable Media
        this.onSetSliderSortable = this.onSetSliderSortable.bind(this);
        this.onSetCarouselSortable = this.onSetCarouselSortable.bind(this);


        //Images
        this.onSetImages = this.onSetImages.bind(this);
        this.onDeleteImage = this.onDeleteImage.bind(this);
        this.onSetSliderImage = this.onSetSliderImage.bind(this);
        this.onGetSliderImage = this.onGetSliderImage.bind(this);
        this.onDeleteSliderImage = this.onDeleteSliderImage.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadPluginEditModal) {
            this.onGetEditPlugin()
            this.props.setLoadPluginEditModal(false);
        }
    }

    editorCallbackContent(content) {

        this.state.edit.data.input = content;

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

    onSetColOsmLeaflet(state) {
        this.setState({
            colOsmLeaflet: state
        })
    }

    onSetSliderSortable(newState) {

        this.state.edit.images = newState;
        this.setState({
            edit: this.state.edit
        })
    }

    onSetCarouselSortable(newState) {
        this.state.edit.images = newState;
        this.setState({
            edit: this.state.edit
        })
    }


    onSetSliderImage(e, type, id) {
        const updEdit = [...this.state.edit.images];
        const findEdit = this.findArrayElementById(updEdit, id);
        findEdit[type] = e;
        this.state.edit.images = updEdit;

        let upd = this.state.editImage;
        upd[type] = e;
        this.setState({
            editImage: upd
        })
    }

    onGetSliderImage(id) {
        //console.log( this.findArrayElementById([...this.state.edit.images], id))
        this.setState({
            editImage: this.findArrayElementById([...this.state.edit.images], id)
        })

        this.toggleSliderCollapse('edit')
    }


    onDeleteSliderImage(id) {
        this.state.edit.images = this.filterArrayElementById([...this.state.edit.images], id)
        this.setState({
            edit: this.state.edit
        })
    }


    onToggleCollapse(target) {
        let general = false;
        let save = false;
        let animation = false;
        switch (target) {
            case 'general':
                general = true;
                break;
            case 'save':
                save = true;
                break;
            case 'animation':
                animation = true;
                break;
        }

        this.setState({
            generalCol: general,
            saveCol: save,
            animationCol: animation
        })

    }

    toggleSliderCollapse(target) {
        let overview = false;
        let edit = false;
        switch (target) {
            case 'overview':
                overview = true;
                break;
            case 'edit':
                edit = true;
                break;
        }
        this.setState({
            editSlideModal: edit,
            overviewSlideModal: overview,
        })
    }

    onSetData(e, type) {
        this.state.edit.data[type] = e;
        this.setState({
            edit: this.state.edit
        })
    }

    onSetConfig(e, type) {
        this.state.edit.config[type] = e;
    }

    onSetStateConfig(e, type) {
        if (type === 'action') {
            if (e !== 'url') {
                this.state.edit.config.page = '';
            }
        }
        if (type === 'carousel') {
            if (e) {
                this.onChangeCarouselImage(e)
            }
        }
        this.state.edit.config[type] = e;
        this.setState({
            edit: this.state.edit
        })
    }

    onSetAnimation(e, type) {
        this.state.edit.animation[type] = e;
        this.setState({
            edit: this.state.edit
        })
    }

    onChangeCarouselImage(e) {
        let formData = {
            'method': 'get_carousel_images',
            'carousel': e,
            'edit': this.state.edit.id
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSetImages(arr, add = null) {
        if (add) {
            arr.map((a, index) => {
                this.state.edit.images = [...this.state.edit.images, a]
            })
        } else {
            this.state.edit.images = arr;
        }

        this.setState({
            edit: this.state.edit
        })
    }

    onDeleteImage(id) {
        this.state.edit.images = this.filterArrayElementById([...this.state.edit.images], id);
        this.setState({
            edit: this.state.edit
        })
    }

    onSetDataInput(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'set_edit_plugin',
            'id': this.props.id,
            'site_id': this.props.site_id || '',
            'catId': this.props.catId || '',
            'group': this.props.loadEditPlugin.group,
            'grid': this.props.loadEditPlugin.grid,
            'input': this.props.loadEditPlugin.input,
            'edit': JSON.stringify(this.state.edit),
        }
        this.sendAxiosFormdata(formData).then()
    }

    setShowEditModal(state) {
        this.setState({
            showEditModal: state
        })
    }

    onGetEditPlugin() {
        let formData = {
            'method': 'get_edit_plugin',
            'id': this.props.id,
            'group': this.props.loadEditPlugin.group,
            'grid': this.props.loadEditPlugin.grid,
            'input': this.props.loadEditPlugin.input,
        }
        this.sendAxiosFormdata(formData).then(() => {
        })


    }

    onSaveElement(handle) {
        if (!this.state.elementDesignation) {
            AppTools.warning_message(trans['plugins']['No designation found'])
            return false;
        }
        let formData = {
            'method': 'save_element',
            'designation': this.state.elementDesignation,
            'handle': handle,
            'edit': JSON.stringify(this.state.edit),
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSetMapCustomPin(e, type, id, handle) {
        let upd = this.state.edit;
        const pins = [...upd['pins']]
        if (handle === 'update') {
            const find = this.findArrayElementById(pins, id)
            find[type] = e;
        }

        if (handle === 'delete') {
            upd['pins'] = this.filterArrayElementById(pins, id);
        }

        this.setState({
            edit: upd
        })
    }

    onAddMapCustomPin(method) {
        let formData = {
            'method': method,
        }

        this.sendAxiosFormdata(formData).then()
    }

    onSetOsmLeaflet(pins) {
       let upd = this.state.edit;
       upd['pins'] = pins
        this.setState({
            edit: upd
        })
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_edit_plugin':
                            if (data.status) {
                                this.setState({
                                    edit: data.record,
                                    showEditModal: true,
                                    colOsmLeaflet: false,
                                    editImage: {}
                                })
                                this.onToggleCollapse('general')
                                this.toggleSliderCollapse('overview')
                            } else {
                                AppTools.warning_message(data.msg)
                            }

                            break;
                        case 'set_edit_plugin':
                            if (data.status) {
                                this.setState({
                                    showEditModal: false,
                                    edit: {
                                        type: '',
                                        data: {},
                                        config: {},
                                        options: {},
                                        editImage: {},
                                        backend: []
                                    },
                                })
                                this.props.callbackPluginEditModal(data.record, data.input, data.grid, data.group)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'save_element':
                            if (data.status) {
                                this.setState({
                                    elementDesignation: ''
                                })
                                this.onToggleCollapse('general')
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'get_carousel_images':
                            if (data.status) {
                                this.state.edit.images = data.record;
                                this.setState({
                                    edit: this.state.edit
                                })
                            }
                            break;
                        case 'add_gmaps_pin':
                            if (data.status) {
                                let edit = this.state.edit;
                                edit['pins'] = [...edit['pins'], data.record]
                                this.setState({
                                    edit: edit
                                })
                            }
                            break;
                        case 'search_osm_address':
                             if(data.status){
                               //  let edit = this.state.edit;
                                // edit['pins'] = [...edit['pins'], data.record]
                                 console.log(this.state.edit)

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
                <Modal className="form-builder-modal"
                       animation={true}
                       scrollable={true}
                       show={this.state.showEditModal}
                       onHide={() => this.setShowEditModal(false)}
                       size="lg"
                       backdrop="static"
                       keyboard={false}
                >
                    <Form className="modal-form" onSubmit={this.onSetDataInput}>
                        <Modal.Header className="bg-body-tertiary py-3 text-body align-items-baseline" closeButton>
                            <div className="d-flex flex-column w-100">
                                <Modal.Title className="fw-normal fs-6">
                                    <i className="bi bi-tools  me-2"></i>
                                    {this.state.edit.designation} <span className="fw-light"> {trans['edit']}</span>
                                </Modal.Title>
                                <div className="d-flex align-items-center mt-3 flex-wrap">
                                    <Button
                                        onClick={() => this.onToggleCollapse('general')}
                                        type="button"
                                        size="sm"
                                        variant={`switch-blue-outline me-1 dark ${this.state.generalCol ? 'active' : ''}`}>
                                        {trans['plugins']['General settings']}
                                    </Button>
                                    {this.state.edit.animation ?
                                        <Button
                                            onClick={() => this.onToggleCollapse('animation')}
                                            type="button"
                                            size="sm"
                                            variant={`switch-blue-outline dark ${this.state.animationCol ? 'active' : ''}`}>
                                            {trans['animate']['Animation']}
                                        </Button> : ''}
                                    <div className="ms-auto">
                                        <Button
                                            onClick={() => this.onToggleCollapse('save')}
                                            type="button"
                                            size="sm"
                                            variant={`switch-blue-outline dark ${this.state.saveCol ? 'active' : ''}`}>
                                            <i title={trans['plugins']['Save element']}
                                               className="bi bi-cloud-arrow-up"></i>
                                        </Button>
                                    </div>
                                </div>
                                <Collapse in={this.state.saveCol}>
                                    <div id={uuidv5('collapseSave', v5NameSpace)}>
                                        <hr/>
                                        <InputGroup>
                                            <Form.Control
                                                className="no-blur"
                                                id={uuidv5('element', v5NameSpace)}
                                                placeholder={trans['plugins']['Element Designation']}
                                                value={this.state.elementDesignation}
                                                onChange={(e) => this.setState({elementDesignation: e.target.value})}
                                                aria-label={trans['plugins']['Element Designation']}
                                                aria-describedby="save-addon"
                                            />
                                            <Button
                                                onClick={() => this.onSaveElement('element')}
                                                type="button"
                                                variant="switch-blue dark" id="button-addon2">
                                                <i className="bi bi-save2 me-2"></i>
                                                {trans['plugins']['Save element']}
                                            </Button>
                                        </InputGroup>
                                        <hr/>
                                    </div>
                                </Collapse>
                            </div>
                        </Modal.Header>

                        <Modal.Body>
                            <Collapse in={this.state.generalCol}>
                                <div id={uuidv5('collapseStart', v5NameSpace)}>
                                    {this.state.edit.type === 'tinymce' ?
                                        <div className="iframe-padding">
                                            <PluginTinyMce
                                                editorCallbackContent={this.editorCallbackContent}
                                                initialValue={this.state.edit.data.input || ''}
                                                content={this.state.edit.data.input || ''}
                                                editorOptions={this.state.editorOptions}
                                            />
                                        </div>
                                        : ''}
                                    {this.state.edit.type === 'single_image' ?
                                        <React.Fragment>
                                            <BackendSingleImage
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                                onSetImages={this.onSetImages}
                                                onDeleteImage={this.onDeleteImage}
                                            />

                                        </React.Fragment>
                                        : ''}

                                    {this.state.edit.type === 'post-loop' ?
                                        <BackendPostLoop
                                            edit={this.state.edit}
                                            builderType={this.props.builderType}
                                            onSetStateConfig={this.onSetStateConfig}
                                        />
                                        : ''}
                                    {this.state.edit.type === 'post-title' ?
                                        <React.Fragment>
                                            <BackendLoopTitle
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'forms' ?
                                        <React.Fragment>
                                            <BackendForms
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'bs-accordion' ?
                                        <React.Fragment>
                                            <BackendAccordion
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}

                                    {this.state.edit.type === 'icon' ?
                                        <React.Fragment>
                                            <BackendIcon
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'gmaps-api' ?
                                        <React.Fragment>
                                            <BackendGmapsApi
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                                onSetMapCustomPin={this.onSetMapCustomPin}
                                                onAddMapCustomPin={this.onAddMapCustomPin}
                                            />
                                        </React.Fragment>
                                        : ''}

                                    {this.state.edit.type === 'gmaps-iframe' ?
                                        <React.Fragment>
                                            <BackenGmapsIframe
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'osm' ?
                                        <React.Fragment>
                                            <BackenOSMIframe
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'osm-leaflet' ?
                                        <React.Fragment>
                                            <BackenOSMLeaflet
                                                edit={this.state.edit}
                                                colOsmLeaflet={this.state.colOsmLeaflet}
                                                onSetStateConfig={this.onSetStateConfig}
                                                onSetOsmLeaflet={this.onSetOsmLeaflet}
                                                onSetColOsmLeaflet={this.onSetColOsmLeaflet}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'post-excerpt' ?
                                        <React.Fragment>
                                            <BackendLoopExcerpt
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'post-date' ?
                                        <React.Fragment>
                                            <BackendLoopDate
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                            />
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'medien-slider' ?
                                        <React.Fragment>
                                            <div style={{minHeight: '6rem'}}
                                                 className="d-flex align-items-center justify-content-center">
                                                <BackendMedienSlider
                                                    edit={this.state.edit}
                                                    editImage={this.state.editImage}
                                                    editSlideModal={this.state.editSlideModal}
                                                    overviewSlideModal={this.state.overviewSlideModal}
                                                    onSetImages={this.onSetImages}
                                                    onDeleteImage={this.onDeleteImage}
                                                    onSetSliderSortable={this.onSetSliderSortable}
                                                    onSetStateConfig={this.onSetStateConfig}
                                                    onSetSliderImage={this.onSetSliderImage}
                                                    onDeleteSliderImage={this.onDeleteSliderImage}
                                                    toggleSliderCollapse={this.toggleSliderCollapse}
                                                    onGetSliderImage={this.onGetSliderImage}
                                                />
                                            </div>
                                        </React.Fragment>
                                        : ''}

                                    {this.state.edit.type === 'medien-gallery' ?
                                        <React.Fragment>
                                            <div style={{minHeight: '6rem'}}
                                                 className="d-flex align-items-center justify-content-center">
                                                <BackendMedienGallery
                                                    edit={this.state.edit}
                                                    editImage={this.state.editImage}
                                                    editSlideModal={this.state.editSlideModal}
                                                    overviewSlideModal={this.state.overviewSlideModal}
                                                    onSetImages={this.onSetImages}
                                                    onDeleteImage={this.onDeleteImage}
                                                    onSetSliderSortable={this.onSetSliderSortable}
                                                    onSetStateConfig={this.onSetStateConfig}
                                                    onSetSliderImage={this.onSetSliderImage}
                                                    onDeleteSliderImage={this.onDeleteSliderImage}
                                                    toggleSliderCollapse={this.toggleSliderCollapse}
                                                    onGetSliderImage={this.onGetSliderImage}
                                                />
                                            </div>
                                        </React.Fragment>
                                        : ''}
                                    {this.state.edit.type === 'dividing-line' ?
                                        <BackendDividingLine
                                            edit={this.state.edit}
                                            onSetStateConfig={this.onSetStateConfig}
                                            selects={this.props.selects}
                                        />
                                        : ''}
                                    {this.state.edit.type === 'dividing-with-text' ?
                                        <BackendDividingTextLine
                                            edit={this.state.edit}
                                            onSetStateConfig={this.onSetStateConfig}
                                            selects={this.props.selects}
                                        />
                                        : ''}

                                    {this.state.edit.type === 'unfiltered-html' ?
                                        <BackendUnfilteredHTML
                                            edit={this.state.edit}
                                            onSetStateConfig={this.onSetStateConfig}
                                        />
                                        : ''}
                                    {this.state.edit.type === 'medien-carousel' ?
                                        <React.Fragment>
                                            <BackendMedienCarousel
                                                edit={this.state.edit}
                                                onSetStateConfig={this.onSetStateConfig}
                                                onSetCarouselSortable={this.onSetCarouselSortable}

                                            />
                                        </React.Fragment>

                                        : ''}
                                    {this.state.edit.type === 'spacer' ?
                                        <BackendSpacer
                                            onSetData={this.onSetData}
                                            edit={this.state.edit}

                                        />
                                        : ''}

                                    <Row className="g-2 mt-1">
                                        {this.state.edit && this.state.edit.backend.includes('source') ?
                                            <React.Fragment>
                                                <Col xs={12}>
                                                    <Form.Check
                                                        type="radio"
                                                        inline
                                                        checked={this.state.edit.config.source === 'mediathek' || false}
                                                        onChange={() => this.onSetStateConfig('mediathek', 'source')}
                                                        id={uuidv5('srcMediathek', v5NameSpace)}
                                                        label={trans['plugins']['Mediathek']}
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        inline
                                                        checked={this.state.edit.config.source === 'extern' || false}
                                                        onChange={() => this.onSetStateConfig('extern', 'source')}
                                                        id={uuidv5('srcExtern', v5NameSpace)}
                                                        label={trans['plugins']['Extern']}
                                                    />
                                                </Col>
                                                {this.state.edit.config.source === 'extern' ?
                                                    <Col xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('externalUrl', v5NameSpace)}
                                                            label={`${trans['plugins']['External URL']}`}
                                                        >
                                                            <Form.Control
                                                                required={true}
                                                                defaultValue={this.state.edit.config.external_url || ''}
                                                                onChange={(e) => this.onSetConfig(e.currentTarget.value, 'external_url')}
                                                                className="no-blur"
                                                                type="url"
                                                                placeholder={trans['plugins']['External URL']}/>
                                                        </FloatingLabel>
                                                    </Col>
                                                    : ''}
                                            </React.Fragment>
                                            : ''}

                                        {this.state.edit.type === 'post-gallery' ?
                                            <Col xs={12}>
                                                <Form.Check
                                                    type="radio"
                                                    inline
                                                    checked={this.state.edit.config.output_type === 'gallery'}
                                                    onChange={(e) => this.onSetStateConfig('gallery', 'output_type')}
                                                    id={uuidv5('checkPostGallery', v5NameSpace)}
                                                    label={trans['Gallery']}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    inline
                                                    checked={this.state.edit.config.output_type === 'slider'}
                                                    onChange={(e) => this.onSetStateConfig('slider', 'output_type')}
                                                    id={uuidv5('checkPostSlider', v5NameSpace)}
                                                    label={trans['Gallery-Slider']}
                                                />
                                            </Col>
                                            : ''}
                                        {this.state.edit.options.slider && this.state.edit.options.slider.length ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('selectSlider', v5NameSpace)}
                                                    label={`${trans['plugins']['Slider']}`}>
                                                    <Form.Select
                                                        disabled={this.state.edit.config.source === 'extern' || this.state.edit.config.output_type === 'gallery'}
                                                        className="no-blur"
                                                        required={true}
                                                        defaultValue={this.state.edit.config.slider || ''}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'slider')}
                                                        aria-label={trans['plugins']['Slider']}>
                                                        <option value="">{trans['system']['select']}...</option>
                                                        {this.state.edit.options.slider.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}


                                        {/*}
                                        {this.state.edit.options['gallery-select'] && this.state.edit.options['gallery-select'].length ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('selectPostGallery', v5NameSpace)}
                                                    label={`${trans['gallery']['Post gallery']}`}>
                                                    <Form.Select
                                                        //disabled={this.state.edit.config.output_type === 'slider'}
                                                        className="no-blur"
                                                        required={true}
                                                        defaultValue={this.state.edit.config.gallery_id || ''}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'gallery_id')}
                                                        aria-label={trans['gallery']['Post gallery']}>
                                                        <option value="">{trans['system']['select']}...</option>
                                                        {this.state.edit.options['gallery-select'].map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}
                                            {*/}
                                        {this.state.edit && this.state.edit.backend.includes('sizes') ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('selectSize', v5NameSpace)}
                                                    label={`${trans['system']['Image size']}`}>
                                                    <Form.Select
                                                        disabled={this.state.edit.config.source === 'extern' || this.state.edit.config.output_type === 'gallery'}
                                                        className="no-blur"
                                                        defaultValue={this.state.edit.config.size || ''}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'size')}
                                                        aria-label={trans['system']['Image size']}>
                                                        {this.state.edit.options.sizes.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}
                                        {this.state.edit.type === 'post-slider' ?
                                            <BackendPostSlider
                                                onSetStateConfig={this.onSetStateConfig}
                                                edit={this.state.edit}
                                            />
                                            : ''}
                                        {this.state.edit && this.state.edit.backend.includes('link') ?
                                            <React.Fragment>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('selectLink', v5NameSpace)}
                                                        label={`${trans['plugins']['Action on click']}`}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            defaultValue={this.state.edit.config.action || ''}
                                                            onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'action')}
                                                            aria-label={trans['plugins']['Action on click']}>
                                                            {this.state.edit.options.link.map((s, index) =>
                                                                <option value={s.id} key={index}>{s.label}</option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>

                                            </React.Fragment>
                                            : ''}
                                        {this.state.edit && this.state.edit.backend.includes('align') ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('alignSelect', v5NameSpace)}
                                                    label={`${trans['plugins']['Alignment']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        defaultValue={this.state.edit.config.align || 'center'}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'align')}
                                                        aria-label={trans['plugins']['Alignment']}>
                                                        {this.state.edit.options.align.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}

                                        {this.state.edit && this.state.edit.backend.includes('pages') ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('selectPage', v5NameSpace)}
                                                    label={`${trans['plugins']['Select page']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        disabled={this.state.edit.config.action !== 'url' || this.state.edit.config.post_button}
                                                        defaultValue={this.state.edit.config.page || ''}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'page')}
                                                        aria-label={trans['plugins']['Select page']}>
                                                        {this.state.edit.options.pages.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}

                                        {this.state.edit.type === 'single_image' ?
                                            <React.Fragment>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('imgWidth', v5NameSpace)}
                                                        label={`${trans['plugins']['Width']} (px)`}
                                                    >
                                                        <Form.Control
                                                            required={false}
                                                            defaultValue={this.state.edit.config.width || ''}
                                                            onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'width')}
                                                            className="no-blur"
                                                            type="number"
                                                            placeholder={trans['plugins']['Width']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('imgHeight', v5NameSpace)}
                                                        label={`${trans['plugins']['Height']} (px)`}
                                                    >
                                                        <Form.Control
                                                            required={false}
                                                            defaultValue={this.state.edit.config.height || ''}
                                                            onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'height')}
                                                            className="no-blur"
                                                            type="number"
                                                            placeholder={trans['plugins']['Height']}/>
                                                    </FloatingLabel>
                                                </Col>
                                            </React.Fragment>
                                            : ''}
                                        {this.state.edit && this.state.edit.backend.includes('btn_variant') ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('selectVariant', v5NameSpace)}
                                                    label={`${trans['plugins']['Button variant']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        defaultValue={this.state.edit.config.variant || ''}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'variant')}
                                                        aria-label={trans['plugins']['Button variant']}>
                                                        {this.state.edit.options.btn_variant.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}

                                        {this.state.edit && this.state.edit.backend.includes('button_size') ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('selectBtnSize', v5NameSpace)}
                                                    label={`${trans['plugins']['Button size']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        defaultValue={this.state.edit.config.size || ''}
                                                        onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'size')}
                                                        aria-label={trans['plugins']['Button size']}>
                                                        {this.state.edit.options.button_size.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            : ''}

                                        {
                                            this.state.edit.type === 'button' ?
                                                <BackendButton
                                                    onSetStateConfig={this.onSetStateConfig}
                                                    onSetData={this.onSetData}
                                                    edit={this.state.edit}
                                                />
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'featured-image' ?
                                                <React.Fragment>
                                                    <BackendLoopPostImage
                                                        edit={this.state.edit}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'post-gallery' ?
                                                <React.Fragment>
                                                    <BackendPostGallery
                                                        edit={this.state.edit}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'menu' ?
                                                <React.Fragment>
                                                    <BackendMenu
                                                        edit={this.state.edit}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'video' ?
                                                <React.Fragment>
                                                    <BackendVideo
                                                        edit={this.state.edit}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'post-category' ?
                                                <React.Fragment>
                                                    <BackendCategoryTitle
                                                        edit={this.state.edit}
                                                        builderType={this.props.builderType}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'post-category-description' ?
                                                <React.Fragment>
                                                    <BackendCategoryDescription
                                                        edit={this.state.edit}
                                                        builderType={this.props.builderType}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'post-category-image' ?
                                                <React.Fragment>
                                                    <BackendCategoryImage
                                                        edit={this.state.edit}
                                                        builderType={this.props.builderType}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }
                                        {
                                            this.state.edit.type === 'custom-fields' ?
                                                <React.Fragment>
                                                    <BackendCustomFields
                                                        edit={this.state.edit}
                                                        builderType={this.props.builderType}
                                                        onSetStateConfig={this.onSetStateConfig}
                                                    />
                                                </React.Fragment>
                                                : ''
                                        }

                                        <Col xs={12}>
                                            <FloatingLabel
                                                style={{zIndex: 0}}
                                                controlId={uuidv5('pluginId', v5NameSpace)}
                                                label={`${trans['plugins']['Element-ID']}`}
                                            >
                                                <Form.Control
                                                    required={false}
                                                    defaultValue={this.state.edit.config.container_id || ''}
                                                    onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'container_id')}
                                                    className="no-blur"
                                                    type="text"
                                                    placeholder={trans['plugins']['Element-ID']}/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['plugins']['Enter element ID (Note make sure it is unique and valid according to w3c specification).']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                style={{zIndex: 0}}
                                                controlId={uuidv5('pluginCss', v5NameSpace)}
                                                label={`${trans['plugins']['CSS class name (without dot or hash in front)']}`}
                                            >
                                                <Form.Control
                                                    required={false}
                                                    defaultValue={this.state.edit.config.css_class || ''}
                                                    onChange={(e) => this.onSetStateConfig(e.currentTarget.value, 'css_class')}
                                                    className="no-blur"
                                                    type="text"
                                                    placeholder={trans['plugins']['CSS class name (without dot or hash in front)']}/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                            <Collapse in={this.state.animationCol}>
                                <div id={uuidv5('collapseAniMate', v5NameSpace)}>
                                    <Row className="g-2">
                                        {this.props.selects.animation ?
                                            <React.Fragment>
                                                <div className="text-muted my-1">
                                                    <b className={`d-block fw-semibold animate__animated animate__${this.state.edit.animation && this.state.edit.animation.type ? this.state.edit.animation.type : ''}`}>
                                                        {trans['animate']['Animation']}
                                                    </b>
                                                </div>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('selectAnimation', v5NameSpace)}
                                                        label={`${trans['animate']['Select animation']}`}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            value={this.state.edit.animation && this.state.edit.animation.type ? this.state.edit.animation.type : ''}
                                                            onChange={(e) => this.onSetAnimation(e.currentTarget.value, 'type')}
                                                            aria-label={trans['animate']['Select animation']}>
                                                            <option value="">{trans['system']['select']}...</option>
                                                            {this.props.selects.animation.map((s, index) =>
                                                                <option
                                                                    disabled={s.divider && s.divider === true}
                                                                    key={index} value={s.animate}>{s.animate}
                                                                </option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                            </React.Fragment>
                                            : ''}
                                        <Col xl={6} xs={12}></Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('aniIteration', v5NameSpace)}
                                                label={`${trans['animate']['Repeats']} *`}
                                            >
                                                <Form.Control
                                                    disabled={this.state.edit.animation && this.state.edit.animation.type === ''}
                                                    required={this.state.edit.animation && this.state.edit.animation.type !== ''}
                                                    className="no-blur"
                                                    value={this.state.edit.animation ? this.state.edit.animation.iteration : ''}
                                                    onChange={(e) => this.onSetAnimation(e.currentTarget.value, 'iteration')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['animate']['Number of repetitions of the animation. (infinite for infinite)']}
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('aniDuration', v5NameSpace)}
                                                label={`${trans['animate']['Duration of the animation']} *`}
                                            >
                                                <Form.Control
                                                    disabled={this.state.edit.animation && this.state.edit.animation.type === ''}
                                                    required={this.state.edit.animation && this.state.edit.animation.type !== ''}
                                                    className="no-blur"
                                                    value={this.state.edit.animation ? this.state.edit.animation.duration : ''}
                                                    onChange={(e) => this.onSetAnimation(e.currentTarget.value, 'duration')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['animate']['Change the duration of the animation. (e.g. 2s)']}
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('aniDelay', v5NameSpace)}
                                                label={`${trans['animate']['Delay']} *`}
                                            >
                                                <Form.Control
                                                    disabled={this.state.edit.animation && this.state.edit.animation.type === ''}
                                                    required={this.state.edit.animation && this.state.edit.animation.type !== ''}
                                                    className="no-blur"
                                                    value={this.state.edit.animation ? this.state.edit.animation.delay : ''}
                                                    onChange={(e) => this.onSetAnimation(e.currentTarget.value, 'delay')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['animate']['Delay before the animation starts. (e.g. 3s)']}
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('aniOffset', v5NameSpace)}
                                                label={`${trans['animate']['Start of the animation']} *`}
                                            >
                                                <Form.Control
                                                    disabled={this.state.edit.animation && this.state.edit.animation.type === ''}
                                                    required={this.state.edit.animation && this.state.edit.animation.type !== ''}
                                                    className="no-blur"
                                                    value={this.state.edit.animation ? this.state.edit.animation.offset : ''}
                                                    onChange={(e) => this.onSetAnimation(e.currentTarget.value, 'offset')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['animate']['Distance to the start of the animation (in relation to the bottom edge of the browser).']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Check
                                                label={trans['animate']['No replay']}
                                                type="switch"
                                                checked={this.state.edit.animation ? this.state.edit.animation.no_repeat : false}
                                                onChange={(e) => this.onSetAnimation(e.currentTarget.checked, 'no_repeat')}
                                                id={uuidv5('checkRepeat', v5NameSpace)}
                                            />
                                            <div className="form-text lh-12">
                                                {trans['animate']['If active, the animation is not repeated after scrolling.']}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => this.setShowEditModal(false)}>
                                {trans['swal']['Close']}
                            </Button>
                            <Button
                                variant="success-custom dark"
                                type="submit"
                            >
                                {trans['system']['Save changes']}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}