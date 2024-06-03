import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";
import InputGroup from 'react-bootstrap/InputGroup';
import Collapse from 'react-bootstrap/Collapse';
import ColorPicker from "../../AppComponents/ColorPicker";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../AppComponents/AppTools";

const v5NameSpace = 'e5f3c9f0-c475-11ee-a5e1-325096b39f47';
export default class RowEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                fileType: 'image',
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
            colStartSettings: true,
            coDesignSettings: false,
            row_css: '',
            row_id: '',
            designation: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.addSaveRow = this.addSaveRow.bind(this);
        this.onChangeCollapse = this.onChangeCollapse.bind(this);
        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);
        this.onUpdateBgImage = this.onUpdateBgImage.bind(this);
        this.onColorOverlayChangeCallback = this.onColorOverlayChangeCallback.bind(this);
        this.onChangeParallaxActive = this.onChangeParallaxActive.bind(this);
        this.onDeleteBGImage = this.onDeleteBGImage.bind(this);


        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerRowEditStart) {
            this.onChangeCollapse('start')
            this.props.onSetTriggerRowEditStart(false)
        }
    }

    fileManagerDidUpdate(state) {
        this.setState({
            didUpdateManager: state
        })
    }

    setFileManagerShow(state) {
        this.setState({
            fileManagerShow: state
        })
    }

    fileManagerCallback(files) {
        if (files.length) {
            let add = [];
            files.map((i, index) => {
                let img = {
                    id: AppTools.randomChar(12),
                    image: i.fileName,
                    imgId: i.id,
                    type: i.type,
                    bgStyle: '',
                    bgPosition: '',
                    bgZindex: '',
                    bgOverlay: {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 0
                    },
                    attr: i.sizeData.attr,
                    alt: i.alt,
                    labelling: i.labelling,
                    title: i.title,
                    file_size: i.file_size,
                    customCss: i.customCss,
                    description: i.description,
                    original: i.original,
                    urls: i.urls
                }
                add.push(img)
            })
            //console.log(add[0], this.state.selectedImage)
            this.props.onSetRowEdit(add[0], this.state.selectedImage)
            this.setState({
                selectedImage: ''
            })
        }
    }

    onSetAppImage(type) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true
        })
    }

    onUpdateBgImage(e, type, handle) {
        let upd = this.props.editRow[handle];
        upd[type] = e;
        this.props.onSetRowEdit(upd, handle)
    }

    onColorChangeCallback(color, handle) {

        this.props.onSetRowEdit(color, handle)
    }

    onColorOverlayChangeCallback(color, handle) {
        let upd = this.props.editRow[handle];
        upd['bgOverlay'] = color
        this.props.onSetRowEdit(upd, handle)
    }

    onChangeCollapse(target) {
        let start = false;
        let design = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'design':
                design = true;
                break;
        }
        this.setState({
            colStartSettings: start,
            coDesignSettings: design,
        })
    }

    onChangeParallaxActive(e, type) {

        if (type === 'parallax_container_active' && e === true) {
            this.props.onSetRowEdit(false, 'parallax_container_fixed')
        }
        if (type === 'parallax_container_fixed' && e === true) {
            this.props.onSetRowEdit(false, 'parallax_container_active')
        }
        if (type === 'parallax_inner_active' && e === true) {
            this.props.onSetRowEdit(false, 'parallax_inner_fixed')
        }
        if (type === 'parallax_inner_fixed' && e === true) {
            this.props.onSetRowEdit(false, 'parallax_inner_active')
        }

        this.props.onSetRowEdit(e, type)
    }

    onDeleteBGImage(type) {
        if(type === 'bg_image') {
            this.props.onSetRowEdit(false, 'parallax_container_fixed')
            this.props.onSetRowEdit(false, 'parallax_container_active')
        }

        if(type === 'bg_inner_image'){
            this.props.onSetRowEdit(false, 'parallax_inner_fixed')
            this.props.onSetRowEdit(false, 'parallax_inner_active')
        }


        this.props.onSetRowEdit({}, type)
    }

    addSaveRow() {
        if (this.state.designation) {
            let formData = {
                'method': 'add_row_save',
                'designation': this.state.designation,
                'id': this.props.id,
                'group': this.props.editRow.id,
            }
            this.props.sendAxiosFormdata(formData)

            this.setState({
                designation: ''
            })
        }
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'update_row_edit',
            'id': this.props.id,
            'group': this.props.editRow.id,
            'container': this.props.editRow.container || 'container',
            'row_css': this.props.editRow.row_css,
            'row_id': this.props.editRow.row_id,
            'edit': JSON.stringify(this.props.editRow),
        }
        this.props.sendAxiosFormdata(formData)
    }


    render() {


        return (
            <React.Fragment>
                <Modal
                    show={this.props.showRowEditModal}
                    onHide={() => this.props.onSetShowRowEditModal(false)}
                    backdrop="static"
                    // scrollable={true}
                    keyboard={false}
                    size="lg"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Header
                            closeButton
                            className="bg-body-tertiary py-3 text-body align-items-baseline"
                        >
                            <div className="d-flex flex-column w-100">
                                <Modal.Title
                                    className="fw-normal flex-fill fs-6"
                                >
                                    {trans['builder']['Page-Builder Row']}
                                </Modal.Title>
                                <div className="d-flex align-items-center mt-3 flex-wrap">
                                    <Button
                                        onClick={() => this.onChangeCollapse('start')}
                                        type="button"
                                        size="sm"
                                        variant={`switch-blue-outline me-1 dark ${this.state.colStartSettings ? 'active' : ''}`}>
                                        {trans['plugins']['General settings']}
                                    </Button>
                                    <Button
                                        onClick={() => this.onChangeCollapse('design')}
                                        type="button"
                                        size="sm"
                                        variant={`switch-blue-outline dark ${this.state.coDesignSettings ? 'active' : ''}`}>
                                        {trans['builder']['Design settings']}
                                    </Button>
                                    <div className="ms-auto">
                                        <Button
                                            onClick={() => this.props.onSetSaveRowCollapse(!this.props.showRowSaveCollapse)}
                                            type="button"
                                            size="sm"
                                            variant={`${this.props.showRowSaveCollapse ? 'switch-blue dark' : 'switch-blue-outline dark'}`}>
                                            <i title={trans['plugins']['Save element']}
                                               className="bi bi-cloud-arrow-up me-2"></i>
                                            {trans['system']['Save']}
                                        </Button>
                                    </div>
                                </div>
                                <Collapse in={this.props.showRowSaveCollapse}>
                                    <div id={uuidv5('collapseSave', v5NameSpace)}>
                                        <hr/>
                                        <InputGroup>
                                            <Form.Control
                                                className="no-blur"
                                                id={uuidv5('saveRow', v5NameSpace)}
                                                placeholder={trans['plugins']['Element Designation']}
                                                value={this.state.designation}
                                                onChange={(e) => this.setState({designation: e.target.value})}
                                                aria-label={trans['plugins']['Element Designation']}
                                                aria-describedby="save-addon"
                                            />
                                            <Button
                                                onClick={() => this.addSaveRow('row')}
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
                            <Collapse in={this.state.colStartSettings}>
                                <div id={uuidv5('collapseStart', v5NameSpace)}>
                                    <Row className="g-2">
                                        {this.props.builderType !== 'loop' ?
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('selectContainer', v5NameSpace)}
                                                label={`${trans['builder']['Container']}`}>
                                                <Form.Select
                                                    className="no-blur"
                                                    value={this.props.editRow.container || ''}
                                                    onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'container')}
                                                    aria-label={trans['builder']['Container']}>
                                                    <option value="container">{trans['builder']['Container']}</option>
                                                    <option
                                                        value="container-fluid">{trans['builder']['Container-Fluid']}</option>
                                                    <option
                                                        value="container-full-width">{trans['builder']['Full width']}</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>: ''}

                                        <Col xs={12}>
                                            <FloatingLabel
                                                style={{zIndex: 0}}
                                                controlId={uuidv5('inputCss', v5NameSpace)}
                                                label={trans['plugins']['CSS class name (without dot or hash in front)']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    value={this.props.editRow.row_css || ''}
                                                    onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'row_css')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                style={{zIndex: 0}}
                                                controlId={uuidv5('inputId', v5NameSpace)}
                                                label={trans['plugins']['Element-ID']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    value={this.props.editRow.row_id || ''}
                                                    onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'row_id')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['plugins']['Enter element ID (Note make sure it is unique and valid according to w3c specification).']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <div className="fs-6 mb-2">{trans['builder']['CSS Inner-Container']}</div>
                                            <FloatingLabel
                                                style={{zIndex: 0}}
                                                controlId={uuidv5('inputInnerContainer', v5NameSpace)}
                                                label={trans['plugins']['CSS Inner-Container (without dot or hash in front)']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    value={this.props.editRow.innerContainer || ''}
                                                    onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'innerContainer')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                            <Collapse in={this.state.coDesignSettings}>
                                <div id={uuidv5('collapseDesign', v5NameSpace)}>
                                    <Row className="g-2">
                                        <Col xl={6} xs={12}>
                                            <div className="p-2 border rounded d-flex flex-column h-100">
                                                <div
                                                    className="my-1">{trans['builder']['Container background colour']}</div>
                                                {this.props.editRow && this.props.editRow.cbg ?
                                                    <ColorPicker
                                                        color={this.props.editRow.cbg}
                                                        callback={this.onColorChangeCallback}
                                                        handle="cbg"
                                                    /> : ''}

                                                <Col xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('inputRowZIndex', v5NameSpace)}
                                                        label='z-index'
                                                        className="mt-2"
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={this.props.editRow.zIndex || ''}
                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'zIndex')}
                                                            type="number"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <hr/>
                                                <div style={{width: 'min-content'}}
                                                     className="d-flex text-center align-items-start justify-content-center flex-column">
                                                    <div className="mb-2">
                                                        <div className="mb-2">
                                                            {trans['structure']['Background image']}
                                                        </div>
                                                        {this.props.editRow.bg_image && this.props.editRow.bg_image.id ?
                                                            <img
                                                                className="rounded"
                                                                width={100}
                                                                height={100}
                                                                src={`${this.props.editRow.bg_image === 'data' ? publicSettings.public_mediathek + '/' + this.props.editRow.bg_image.image : publicSettings.thumb_url + '/' + this.props.editRow.bg_image.image} `}
                                                                alt=""/> :
                                                            <div style={{width: 'auto'}}
                                                                 onClick={() => this.onSetAppImage('bg_image')}
                                                                 className="placeholder-image-plus p-1 border rounded"></div>
                                                        }
                                                    </div>
                                                    {this.props.editRow.bg_image && this.props.editRow.bg_image.id ?
                                                        <button onClick={() => this.onDeleteBGImage('bg_image')}
                                                                type="button"
                                                                className="btn align-self-center btn-danger btn-sm dark">
                                                            <i className="bi bi-trash"></i>
                                                        </button> : ''}
                                                </div>
                                                <div className="mt-auto">

                                                    {this.props.editRow.bg_image && this.props.editRow.bg_image.id ?
                                                        <React.Fragment>
                                                            <hr/>
                                                            <Row className="g-2">
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('selectBgPosition', v5NameSpace)}
                                                                        label={`${trans['builder']['Background position']}`}>
                                                                        <Form.Select
                                                                            className="no-blur"
                                                                            value={this.props.editRow.bg_image.bgPosition || ''}
                                                                            onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgPosition', 'bg_image')}
                                                                            aria-label={trans['builder']['Background position']}>
                                                                            {this.props.selects.bg_position.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('selectBgStyle', v5NameSpace)}
                                                                        label={`${trans['builder']['Background style']}`}>
                                                                        <Form.Select
                                                                            className="no-blur"
                                                                            value={this.props.editRow.bg_image.bgStyle || ''}
                                                                            onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgStyle', 'bg_image')}
                                                                            aria-label={trans['builder']['Background style']}>
                                                                            {this.props.selects.bg_style.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        style={{zIndex: 0}}
                                                                        controlId={uuidv5('bgZindex', v5NameSpace)}
                                                                        label="z-index"
                                                                    >
                                                                        <Form.Control
                                                                            className="no-blur"
                                                                            value={this.props.editRow.bg_image.bgZindex || ''}
                                                                            onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgZindex', 'bg_image')}
                                                                            type="number"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <div
                                                                        className="my-1">{trans['builder']['BG-Overlay color']}</div>
                                                                    <div className="color-picker-bottom">
                                                                        <ColorPicker
                                                                            color={this.props.editRow.bg_image.bgOverlay}
                                                                            callback={this.onColorOverlayChangeCallback}
                                                                            handle="bg_image"
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <hr/>
                                                                    <div
                                                                        className="my-1">{trans['plugins']['Parallax']}</div>
                                                                </Col>

                                                                <Col xl={6} xs={12}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        checked={this.props.editRow.parallax_container_active || false}
                                                                        onChange={(e) => this.onChangeParallaxActive(e.currentTarget.checked, 'parallax_container_active')}
                                                                        id={uuidv5('parallaxContainerActive', v5NameSpace)}
                                                                        label={trans['plugins']['Parallax active']}
                                                                    />
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        checked={this.props.editRow.parallax_container_fixed || false}
                                                                        onChange={(e) => this.onChangeParallaxActive(e.currentTarget.checked, 'parallax_container_fixed')}
                                                                        id={uuidv5('parallaxContainerFixed', v5NameSpace)}
                                                                        label={trans['plugins']['Parallax fixed']}
                                                                    />
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('selectParallaxContainerType', v5NameSpace)}
                                                                        label={`${trans['builder']['Parallax type']}`}>
                                                                        <Form.Select
                                                                            required={this.props.editRow.parallax_container_active}
                                                                            disabled={!this.props.editRow.parallax_container_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_container_type || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_container_type')}
                                                                            aria-label={trans['builder']['Parallax type']}>
                                                                            {this.props.selects.selectParallaxType.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxContainerHeight', v5NameSpace)}
                                                                        label={`${trans['plugins']['Height']} *`}
                                                                        className="mt-2"
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_container_active || this.props.editRow.parallax_container_fixed}
                                                                            disabled={!this.props.editRow.parallax_container_active && !this.props.editRow.parallax_container_fixed}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_container_height || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_container_height')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxSpeedContainer', v5NameSpace)}
                                                                        label={`${trans['plugins']['Speed']} *`}
                                                                        className="mt-2"
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_container_active}
                                                                            disabled={!this.props.editRow.parallax_container_active}
                                                                            className="no-blur"
                                                                            min={-1}
                                                                            max={2}
                                                                            value={this.props.editRow.parallax_container_speed || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_container_speed')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                    <div className="form-text lh-12">
                                                                        {trans['builder']['from -1.0 to 2.0']}
                                                                    </div>
                                                                </Col>
                                                                <Col xs={12} xl={6}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxLeftContainer', v5NameSpace)}
                                                                        label={`${trans['builder']['Position left']} *`}
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_container_active}
                                                                            disabled={!this.props.editRow.parallax_container_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_container_position_left || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_container_position_left')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12} xl={6}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxTopContainer', v5NameSpace)}
                                                                        label={`${trans['builder']['Top position']} *`}
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_container_active}
                                                                            disabled={!this.props.editRow.parallax_container_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_container_position_right || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_container_position_right')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                            </Row>
                                                        </React.Fragment>
                                                        : ''}

                                                </div>
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <div className="p-2 border rounded d-flex flex-column h-100">
                                                <div
                                                    className="my-1">{trans['builder']['Inner container background colour']}</div>
                                                {this.props.editRow && this.props.editRow.icbg ?
                                                    <ColorPicker
                                                        color={this.props.editRow.icbg}
                                                        callback={this.onColorChangeCallback}
                                                        handle="icbg"
                                                    /> : ''}
                                                <Col xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('inputRowInnerZIndex', v5NameSpace)}
                                                        label='z-index'
                                                        className="mt-2"
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={this.props.editRow.innerZindex || ''}
                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'innerZindex')}
                                                            type="number"
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <hr/>
                                                <div style={{width: 'min-content'}}
                                                     className="d-flex text-center align-items-start justify-content-center flex-column">
                                                    <div className="mb-2">
                                                        <div className="mb-2">
                                                            {trans['structure']['Background image']}
                                                        </div>
                                                        {this.props.editRow.bg_inner_image && this.props.editRow.bg_inner_image.id ?
                                                            <img
                                                                className="rounded"
                                                                width={100}
                                                                height={100}
                                                                src={`${this.props.editRow.bg_inner_image === 'data' ? publicSettings.public_mediathek + '/' + this.props.editRow.bg_inner_image.image : publicSettings.thumb_url + '/' + this.props.editRow.bg_inner_image.image} `}
                                                                alt=""/> :
                                                            <div style={{width: 'auto'}}
                                                                 onClick={() => this.onSetAppImage('bg_inner_image')}
                                                                 className="placeholder-image-plus p-1 border rounded"></div>
                                                        }
                                                    </div>
                                                    {this.props.editRow.bg_inner_image && this.props.editRow.bg_inner_image.id ?
                                                        <button
                                                            onClick={() => this.onDeleteBGImage('bg_inner_image')}
                                                            type="button"
                                                            className="btn align-self-center btn-danger btn-sm dark">
                                                            <i className="bi bi-trash"></i>
                                                        </button> : ''}
                                                </div>
                                                <div className="mt-auto">
                                                    {this.props.editRow.bg_image && this.props.editRow.bg_inner_image.id ?
                                                        <React.Fragment>
                                                            <hr/>
                                                            <Row className="g-2">
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('selectInnerBgPosition', v5NameSpace)}
                                                                        label={`${trans['builder']['Background position']}`}>
                                                                        <Form.Select
                                                                            className="no-blur"
                                                                            value={this.props.editRow.bg_inner_image.bgPosition || ''}
                                                                            onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgPosition', 'bg_inner_image')}
                                                                            aria-label={trans['builder']['Background position']}>
                                                                            {this.props.selects.bg_position.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('selectInnerBgStyle', v5NameSpace)}
                                                                        label={`${trans['builder']['Background style']}`}>
                                                                        <Form.Select
                                                                            className="no-blur"
                                                                            value={this.props.editRow.bg_inner_image.bgStyle || ''}
                                                                            onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgStyle', 'bg_inner_image')}
                                                                            aria-label={trans['builder']['Background style']}>
                                                                            {this.props.selects.bg_style.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        style={{zIndex: 0}}
                                                                        controlId={uuidv5('bgInnerZindex', v5NameSpace)}
                                                                        label="z-index"
                                                                    >
                                                                        <Form.Control
                                                                            className="no-blur"
                                                                            value={this.props.editRow.bg_inner_image.bgZindex || ''}
                                                                            onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgZindex', 'bg_inner_image')}
                                                                            type="number"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <div
                                                                        className="my-1">{trans['builder']['BG-Overlay color']}</div>
                                                                    <div className="color-picker-bottom">
                                                                        <ColorPicker
                                                                            color={this.props.editRow.bg_inner_image.bgOverlay}
                                                                            callback={this.onColorOverlayChangeCallback}
                                                                            handle="bg_inner_image"
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <hr/>
                                                                    <div
                                                                        className="my-1">{trans['plugins']['Parallax']}</div>

                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        checked={this.props.editRow.parallax_inner_active || false}
                                                                        onChange={(e) => this.onChangeParallaxActive(e.currentTarget.checked, 'parallax_inner_active')}
                                                                        id={uuidv5('parallaxInnerActive', v5NameSpace)}
                                                                        label={trans['plugins']['Parallax active']}
                                                                    />
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        checked={this.props.editRow.parallax_inner_fixed || false}
                                                                        onChange={(e) => this.onChangeParallaxActive(e.currentTarget.checked, 'parallax_inner_fixed')}
                                                                        id={uuidv5('parallaxInnerFixed', v5NameSpace)}
                                                                        label={trans['plugins']['Parallax fixed']}
                                                                    />
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('selectParallaxInnerType', v5NameSpace)}
                                                                        label={`${trans['builder']['Parallax type']}`}>
                                                                        <Form.Select
                                                                            required={this.props.editRow.parallax_inner_active}
                                                                            disabled={!this.props.editRow.parallax_inner_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_inner_type || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_inner_type')}
                                                                            aria-label={trans['builder']['Parallax type']}>
                                                                            {this.props.selects.selectParallaxType.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxInnerHeight', v5NameSpace)}
                                                                        label={`${trans['plugins']['Height']} *`}
                                                                        className="mt-2"
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_inner_active || this.props.editRow.parallax_inner_fixed}
                                                                            disabled={!this.props.editRow.parallax_inner_active && !this.props.editRow.parallax_inner_fixed}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_inner_height || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_inner_height')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxSpeedInner', v5NameSpace)}
                                                                        label={`${trans['plugins']['Speed']} *`}
                                                                        className="mt-2"
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_inner_active}
                                                                            disabled={!this.props.editRow.parallax_inner_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_inner_speed || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_inner_speed')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                    <div className="form-text">
                                                                        {trans['builder']['from -1.0 to 2.0']}
                                                                    </div>
                                                                </Col>
                                                                <Col xs={12} xl={6}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxLeftInner', v5NameSpace)}
                                                                        label={`${trans['builder']['Position left']} *`}
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_inner_active}
                                                                            disabled={!this.props.editRow.parallax_inner_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_inner_position_left || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_inner_position_left')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xs={12} xl={6}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv5('parallaxTopInner', v5NameSpace)}
                                                                        label={`${trans['builder']['Top position']} *`}
                                                                    >
                                                                        <Form.Control
                                                                            required={this.props.editRow.parallax_inner_active}
                                                                            disabled={!this.props.editRow.parallax_inner_active}
                                                                            className="no-blur"
                                                                            value={this.props.editRow.parallax_inner_position_right || ''}
                                                                            onChange={(e) => this.props.onSetRowEdit(e.currentTarget.value, 'parallax_inner_position_right')}
                                                                            type="text"
                                                                        />
                                                                    </FloatingLabel>
                                                                </Col>
                                                            </Row>
                                                        </React.Fragment>
                                                        : ''}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary dark" onClick={() => this.props.onSetShowRowEditModal(false)}>
                                {trans['swal']['Close']}
                            </Button>
                            <Button type="submit" variant="switch-blue dark">
                                {trans['system']['Save changes']}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <FileMangerModal
                    didUpdateManager={this.state.didUpdateManager}
                    fileManagerShow={this.state.fileManagerShow}
                    options={this.state.fmOptions}
                    fileManagerDidUpdate={this.fileManagerDidUpdate}
                    setFileManagerShow={this.setFileManagerShow}
                    fileManagerCallback={this.fileManagerCallback}
                />
            </React.Fragment>
        )
    }

}