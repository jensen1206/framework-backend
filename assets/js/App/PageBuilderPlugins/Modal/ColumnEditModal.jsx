import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";
import Collapse from 'react-bootstrap/Collapse';
import * as AppTools from "../../AppComponents/AppTools";
import ColorPicker from "../../AppComponents/ColorPicker";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";

const v5NameSpace = 'da6aa2de-c59c-11ee-aabf-325096b39f47';
export default class ColumnEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            container: '',
            row_css: '',
            row_id: '',
            collapseStartSettings: true,
            collapseDesignSettings: false,
            collapseAnimate: false,
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

        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeCollapse = this.onChangeCollapse.bind(this);
        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);
        this.onUpdateBgImage = this.onUpdateBgImage.bind(this);
        this.onUpdateAnimate = this.onUpdateAnimate.bind(this);
        this.onSetParallaxActive = this.onSetParallaxActive.bind(this);


        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerColumnEditStart) {
            this.onChangeCollapse('start')
            this.props.onSetTriggerColumnEditStart(false)
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

            this.props.onSetColumnEdit(add[0], this.state.selectedImage)
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

    onUpdateBgImage(e, type) {
        let upd = this.props.editColumn.bg_image;
        upd[type] = e;
        this.props.onSetColumnEdit(upd, 'bg_image');
    }

    onUpdateAnimate(e, type) {
        let upd = this.props.editColumn['animation'];
        upd[type] = e;
        this.props.onSetColumnEdit(upd, 'animation');
    }

    onColorChangeCallback(color, handle) {
        this.props.onSetColumnEdit(color, handle)
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'update_column_edit',
            'id': this.props.id,
            'group': this.props.group,
            'grid': this.props.editColumn.id,
            'edit': JSON.stringify(this.props.editColumn)
        }
        this.props.sendAxiosFormdata(formData)
    }

    onSetParallaxActive(e, type) {
        if (type === 'parallax_active' && e === true) {
            this.props.onSetColumnEdit(false, 'parallax_fixed')
        }
        if (type === 'parallax_fixed' && e === true) {
            this.props.onSetColumnEdit(false, 'parallax_active')
        }

        this.props.onSetColumnEdit(e, type)
    }

    onChangeCollapse(target) {
        let start = false;
        let design = false;
        let animate = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'design':
                design = true;
                break;
            case 'animate':
                animate = true
                break;
        }
        this.setState({
            collapseStartSettings: start,
            collapseDesignSettings: design,
            collapseAnimate: animate
        })
    }

    render() {
        let animation;
        if (this.props.editColumn.animation) {
            animation = this.props.editColumn.animation
        }

        return (
            <React.Fragment>
                <Modal
                    show={this.props.showColumnEditModal}
                    onHide={() => this.props.onSetShowColumnEditModal(false)}
                    backdrop="static"
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
                                    className="fw-normal fs-6"
                                >
                                    {trans['builder']['Page-Builder Column']}
                                </Modal.Title>
                                <div className="d-flex align-items-center mt-3 flex-wrap">
                                    <Button
                                        onClick={() => this.onChangeCollapse('start')}
                                        type="button"
                                        size="sm"
                                        variant={`switch-blue-outline me-1 dark ${this.state.collapseStartSettings ? 'active' : ''}`}>
                                        {trans['plugins']['General settings']}
                                    </Button>
                                    <Button
                                        onClick={() => this.onChangeCollapse('design')}
                                        type="button"
                                        size="sm"
                                        variant={`switch-blue-outline me-1 dark ${this.state.collapseDesignSettings ? 'active' : ''}`}>
                                        {trans['builder']['Design settings']}
                                    </Button>
                                    <Button
                                        onClick={() => this.onChangeCollapse('animate')}
                                        type="button"
                                        size="sm"
                                        variant={`switch-blue-outline dark ${this.state.collapseAnimate ? 'active' : ''}`}>
                                        {trans['animate']['Animation']}
                                    </Button>
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <Collapse in={this.state.collapseStartSettings}>
                                <div id={uuidv5('collapseSettings', v5NameSpace)}>
                                    <Row className="g-2">
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('inputCss', v5NameSpace)}
                                                label={trans['plugins']['CSS class name (without dot or hash in front)']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    value={this.props.editColumn.column_css || ''}
                                                    onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'column_css')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('inputId', v5NameSpace)}
                                                label={trans['plugins']['Element-ID']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    value={this.props.editColumn.column_id || ''}
                                                    onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'column_id')}
                                                    type="text"
                                                />
                                            </FloatingLabel>
                                            <div className="form-text lh-12">
                                                {trans['plugins']['Enter element ID (Note make sure it is unique and valid according to w3c specification).']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <div
                                                className="fs-6 mb-2">{trans['builder']['CSS Column-Inner-Container']}</div>
                                            <FloatingLabel
                                                controlId={uuidv5('inputInnerCss', v5NameSpace)}
                                                label={trans['plugins']['CSS class name (without dot or hash in front)']}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    value={this.props.editColumn.column_inner_css || ''}
                                                    onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'column_inner_css')}
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
                            <Collapse in={this.state.collapseDesignSettings}>
                                <div id={uuidv5('collapseDesign', v5NameSpace)}>
                                    <div
                                        className="my-1">{trans['builder']['Column background colour']}</div>
                                    {this.props.editColumn && this.props.editColumn.bg ?
                                        <ColorPicker
                                            color={this.props.editColumn.bg}
                                            callback={this.onColorChangeCallback}
                                            handle="bg"
                                        /> : ''}
                                    <Col xs={12} xl={6}>
                                        <FloatingLabel
                                            style={{zIndex: 0}}
                                            controlId={uuidv5('inputColZIndex', v5NameSpace)}
                                            label='z-index'
                                            className="mt-2"
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.editColumn.zIndex || ''}
                                                onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'zIndex')}
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
                                            {this.props.editColumn.bg_image && this.props.editColumn.bg_image.id ?
                                                <img
                                                    className="rounded"
                                                    width={100}
                                                    height={100}
                                                    src={`${this.props.editColumn.bg_image === 'data' ? publicSettings.public_mediathek + '/' + this.props.editColumn.bg_image.image : publicSettings.thumb_url + '/' + this.props.editColumn.bg_image.image} `}
                                                    alt=""/> :
                                                <div style={{width: 'auto'}}
                                                     onClick={() => this.onSetAppImage('bg_image')}
                                                     className="placeholder-image-plus p-1 border rounded"></div>
                                            }
                                        </div>
                                        {this.props.editColumn.bg_image && this.props.editColumn.bg_image.id ?
                                            <button onClick={() => this.props.onSetColumnEdit({}, 'bg_image')}
                                                    type="button"
                                                    className="btn align-self-center btn-danger btn-sm dark">
                                                <i className="bi bi-trash"></i>
                                            </button> : ''}
                                    </div>
                                    <div className="mt-auto">
                                        {this.props.editColumn.bg_image && this.props.editColumn.bg_image.id ?
                                            <React.Fragment>
                                                <hr/>
                                                <Row className="g-2">
                                                    <Col xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('selectBgPosition', v5NameSpace)}
                                                            label={`${trans['builder']['Background position']}`}>
                                                            <Form.Select
                                                                className="no-blur"
                                                                value={this.props.editColumn.bg_image.bgPosition || ''}
                                                                onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgPosition')}
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
                                                                value={this.props.editColumn.bg_image.bgStyle || ''}
                                                                onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgStyle')}
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
                                                                value={this.props.editColumn.bg_image.bgZindex || ''}
                                                                onChange={(e) => this.onUpdateBgImage(e.currentTarget.value, 'bgZindex')}
                                                                type="number"
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div
                                                            className="my-1">{trans['builder']['BG-Overlay color']}</div>
                                                        <div className="color-picker-bottom">
                                                            <ColorPicker
                                                                color={this.props.editColumn.bg_image.bgOverlay}
                                                                callback={this.onUpdateBgImage}
                                                                handle="bgOverlay"
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
                                                            checked={this.props.editColumn.parallax_active || false}
                                                            onChange={(e) => this.onSetParallaxActive(e.currentTarget.checked, 'parallax_active')}
                                                            id={uuidv5('parallaxColActive', v5NameSpace)}
                                                            label={trans['plugins']['Parallax active']}
                                                        />
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <Form.Check
                                                            type="switch"
                                                            checked={this.props.editColumn.parallax_fixed || false}
                                                            onChange={(e) => this.onSetParallaxActive(e.currentTarget.checked, 'parallax_fixed')}
                                                            id={uuidv5('parallaxColFixed', v5NameSpace)}
                                                            label={trans['plugins']['Parallax fixed']}
                                                        />
                                                    </Col>
                                                    <Col xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('selectParallaxColType', v5NameSpace)}
                                                            label={`${trans['builder']['Parallax type']}`}>
                                                            <Form.Select
                                                                required={this.props.editColumn.parallax_active}
                                                                disabled={!this.props.editColumn.parallax_active}
                                                                className="no-blur"
                                                                value={this.props.editColumn.parallax_type || ''}
                                                                onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'parallax_type')}
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
                                                            controlId={uuidv5('parallaxColHeight', v5NameSpace)}
                                                            label={`${trans['plugins']['Height']} *`}
                                                            className="mt-2"
                                                        >
                                                            <Form.Control
                                                                required={this.props.editColumn.parallax_active || this.props.editColumn.parallax_fixed}
                                                                disabled={!this.props.editColumn.parallax_active && !this.props.editColumn.parallax_fixed}
                                                                className="no-blur"
                                                                value={this.props.editColumn.parallax_height || ''}
                                                                onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'parallax_height')}
                                                                type="text"
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('parallaxSpeedCol', v5NameSpace)}
                                                            label={`${trans['plugins']['Speed']} *`}
                                                            className="mt-2"
                                                        >
                                                            <Form.Control
                                                                required={this.props.editColumn.parallax_active}
                                                                disabled={!this.props.editColumn.parallax_active}
                                                                className="no-blur"
                                                                value={this.props.editColumn.parallax_speed || ''}
                                                                onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'parallax_speed')}
                                                                type="text"
                                                            />
                                                        </FloatingLabel>
                                                        <div className="form-text">
                                                            {trans['builder']['from -1.0 to 2.0']}
                                                        </div>
                                                    </Col>

                                                    <Col xs={12} xl={6}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('parallaxLeftCol', v5NameSpace)}
                                                            label={`${trans['builder']['Position left']} *`}
                                                        >
                                                            <Form.Control
                                                                required={this.props.editColumn.parallax_active}
                                                                disabled={!this.props.editColumn.parallax_active}
                                                                className="no-blur"
                                                                value={this.props.editColumn.parallax_position_left || ''}
                                                                onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'parallax_position_left')}
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
                                                                required={this.props.editColumn.parallax_active}
                                                                disabled={!this.props.editColumn.parallax_active}
                                                                className="no-blur"
                                                                value={this.props.editColumn.parallax_position_right || ''}
                                                                onChange={(e) => this.props.onSetColumnEdit(e.currentTarget.value, 'parallax_position_right')}
                                                                type="text"
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                            : ''}
                                    </div>

                                </div>
                            </Collapse>
                            <Collapse in={this.state.collapseAnimate}>
                                <div id={uuidv5('collapseAnimate', v5NameSpace)}>
                                    <Row className="g-2">

                                        {this.props.selects.animation ?
                                            <React.Fragment>
                                                <div className="text-muted my-1">
                                                    <b className={`d-block fw-semibold animate__animated animate__${animation && animation.type ? animation.type : ''}`}>
                                                        {trans['animate']['Animation']}
                                                    </b>
                                                </div>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('selectAnimation', v5NameSpace)}
                                                        label={`${trans['animate']['Select animation']}`}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            value={animation && animation.type ? animation.type : ''}
                                                            onChange={(e) => this.onUpdateAnimate(e.currentTarget.value, 'type')}
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
                                            </React.Fragment> : ''}
                                        <Col xl={6} xs={12}></Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('aniIteration', v5NameSpace)}
                                                label={`${trans['animate']['Repeats']} *`}
                                            >
                                                <Form.Control
                                                    disabled={animation && animation.type === ''}
                                                    required={animation && animation.type !== ''}
                                                    className="no-blur"
                                                    value={animation ? animation.iteration : ''}
                                                    onChange={(e) => this.onUpdateAnimate(e.currentTarget.value, 'iteration')}
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
                                                    disabled={animation && animation.type === ''}
                                                    required={animation && animation.type !== ''}
                                                    className="no-blur"
                                                    value={animation ? animation.duration : ''}
                                                    onChange={(e) => this.onUpdateAnimate(e.currentTarget.value, 'duration')}
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
                                                    disabled={animation && animation.type === ''}
                                                    required={animation && animation.type !== ''}
                                                    className="no-blur"
                                                    value={animation ? animation.delay : ''}
                                                    onChange={(e) => this.onUpdateAnimate(e.currentTarget.value, 'delay')}
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
                                                    disabled={animation && animation.type === ''}
                                                    required={animation && animation.type !== ''}
                                                    className="no-blur"
                                                    value={animation ? animation.offset : ''}
                                                    onChange={(e) => this.onUpdateAnimate(e.currentTarget.value, 'offset')}
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
                                                checked={animation ? animation.no_repeat : false}
                                                onChange={(e) => this.onUpdateAnimate(e.currentTarget.checked, 'no_repeat')}
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
                            <Button variant="secondary dark" onClick={() => this.props.onSetShowColumnEditModal(false)}>
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