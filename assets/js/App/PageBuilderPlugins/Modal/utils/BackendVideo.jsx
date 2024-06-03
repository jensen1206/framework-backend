import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Accordion from 'react-bootstrap/Accordion';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {ReactSortable} from "react-sortablejs";
import AppIcons from "../../../AppIcons/AppIcons";
import AppPopover from "../../../AppComponents/AppPopover";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const v5NameSpace = '43161a8c-f826-11ee-8691-325096b39f47';
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class BackendVideo extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showModalIcons: false,
            showColExtern: false,
            showColCarouselOption: false,
            externVideo: {},
            editVideoId: '',
            didUpdateManager: false,
            btnDisabled: true,
            fileManagerShow: false,
            colOverview: true,
            selectedImage: '',
            fileManagerOption: {},
            fmOptions: {
                multiSelect: false,
                fileType: 'image',
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
            fmVideoOptions: {
                multiSelect: true,
                fileType: 'video',
                maxSelect: 100,
                fmTitle: trans['app']['Select video'],
                fmButtonTxt: trans['app']['Insert video'],
            },
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
        }

        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);
        this.onSetAppVideo = this.onSetAppVideo.bind(this);
        this.addExternVideo = this.addExternVideo.bind(this);
        this.setExternVideoValue = this.setExternVideoValue.bind(this);
        this.onSetExternesVideo = this.onSetExternesVideo.bind(this);
        this.onSetActive = this.onSetActive.bind(this);
        this.onDeleteVideo = this.onDeleteVideo.bind(this);
        this.onChangeVideoValue = this.onChangeVideoValue.bind(this);
        this.onToggleCarouselOptions = this.onToggleCarouselOptions.bind(this);
        this.onSetCarouselOptions = this.onSetCarouselOptions.bind(this);

        //Icon
        this.onSetShowModalIcons = this.onSetShowModalIcons.bind(this);
        this.onIconCallback = this.onIconCallback.bind(this);

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

    onSetShowModalIcons(state) {
        this.setState({
            showModalIcons: state
        })
    }

    onIconCallback(icon) {
        this.props.onSetStateConfig(icon, 'play_icon')
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

    setExternVideoValue(e, type) {
        let extern = this.state.externVideo;
        extern[type] = e;
        this.setState({
            externVideo: extern
        })

        sleep(500).then(() => {
            let btnStatus = true;
            if (extern.extern_type && extern.extern_id || extern.extern_type && extern.extern_url) {
                btnStatus = false;
            }
            this.setState({
                btnDisabled: btnStatus
            })
        })
    }


    fileManagerCallback(files) {
        if (this.state.selectedImage === 'video') {
            let video = [...this.props.edit.config.videos];
            if (files.length) {
                files.map((i, index) => {
                    let title = i.title;
                    if (!i.title) {
                        title = i.original
                    }
                    let addVideo = {
                        id: AppTools.randomChar(12),
                        video_url: `${publicSettings.public_mediathek}/${i.fileName}`,
                        media_id: i.id,
                        video_title: title,
                        extern_type: '',
                        extern_id: '',
                        extern_cover: false,
                        extern_poster: '',
                        cover_url: '',
                        mime_type: i.mime
                    }
                    video.push(addVideo)
                })
                this.props.onSetStateConfig(video, 'videos')
            }
        } else {
            if (files.length) {
                let file = files[0];
                let imgUrl;
                if (file.type === 'image') {
                    imgUrl = file['urls']['large']['url'];
                } else {
                    imgUrl = `${publicSettings.public_mediathek}/${file.fileName}`;
                }
                this.onChangeVideoValue(imgUrl, 'cover_url', this.state.editVideoId)
            }
        }
    }

    addExternVideo(state) {
        this.setState({
            showColExtern: state,
            externVideo: {},
            btnDisabled: true,
            showColCarouselOption: false,
        })
    }

    onSetAppImage(id) {
        this.setState({
            selectedImage: 'image',
            editVideoId: id,
            didUpdateManager: true,
            fileManagerShow: true,
            fileManagerOption: this.state.fmOptions
        })
    }

    onSetAppVideo() {
        this.setState({
            selectedImage: 'video',
            didUpdateManager: true,
            fileManagerShow: true,
            fileManagerOption: this.state.fmVideoOptions
        })
    }

    onSetExternesVideo() {
        let extern = this.state.externVideo;
        let poster;
        let url;
        let title;
        let externCover = false;
        if (extern.extern_type === 'youtube' || extern.extern_type === 'vimeo') {
            externCover = true;
            if (extern.extern_type === 'youtube') {
                url = `https://www.youtube.com/watch?v=${extern.extern_id}`;
                poster = `https://img.youtube.com/vi/${extern.extern_id}/maxresdefault.jpg`;
                title = trans['app']['YouTube Video']
            }
            if (extern.extern_type === 'vimeo') {
                url = `https://vimeo.com/${extern.extern_id}`;
                poster = `https://vumbnail.com/${extern.extern_id}.jpg`;
                title = trans['app']['Vimeo Video']
            }
        } else {
            url = extern.extern_url;
            title = trans['app']['External video']
        }
        let addVideo = {
            id: AppTools.randomChar(12),
            video_url: url,
            media_id: '',
            video_title: title,
            extern_type: extern.extern_type,
            extern_id: extern.extern_id,
            extern_cover: externCover,
            extern_poster: poster,
            cover_url: poster,
            mime_type: 'text/html'
        }
        const videos = [...this.props.edit.config.videos, addVideo]
        this.props.onSetStateConfig(videos, 'videos')

        this.setState({
            showColExtern: false,
            externVideo: {},
            btnDisabled: true
        })

    }

    onSetActive(e) {
        let currentActive = e.currentTarget.classList.contains('active');
        $('.header-item').removeClass('active')
        if (!currentActive) {
            e.currentTarget.classList.add('active')
        }
    }

    onDeleteVideo(id) {
        const delVideo = this.filterArrayElementById([...this.props.edit.config.videos], id);
        this.props.onSetStateConfig(delVideo, 'videos')
    }

    onChangeVideoValue(e, type, id) {
        const upd = [...this.props.edit.config.videos];
        const find = this.findArrayElementById(upd, id);
        find[type] = e;
        this.props.onSetStateConfig(upd, 'videos')
    }

    onToggleCarouselOptions(target) {
        this.setState({
            showColExtern: false,
            showColCarouselOption: target,
        })
    }

    onSetCarouselOptions(e, type) {
        let opt = this.props.edit.config.carouselOptions;
        opt[type] = e;
        this.props.onSetStateConfig(opt, 'carouselOptions')
    }

    render() {
        const popover = ((text) => {
            return (
                <Popover id="popover-basic">
                    <Popover.Header as="h3">{trans['video']['Carousel Option']}</Popover.Header>
                    <Popover.Body>
                        {text}
                    </Popover.Body>
                </Popover>
            )
        });
        return (
            <React.Fragment>
                <Row className="g-2">
                    {/*} <Col xs={12}>
                        <Form.Check
                            label={trans['carousel']['Carousel']}
                            type="switch"
                            checked={this.props.edit.config.carousel || false}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'carousel')}
                            id={uuidv5('checkCarousel', v5NameSpace)}
                        />
                    </Col> {*/}
                    <Col xl={12}>
                        <hr className="mt-0 mb-2"/>
                        <button onClick={this.onSetAppVideo}
                                type="button"
                                className="btn btn-success-custom dark me-1 btn-sm">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['app']['Add video from media library']}
                        </button>
                        <button onClick={() => this.addExternVideo(!this.state.showColExtern)}
                                type="button"
                                className="btn btn-switch-blue me-1 dark btn-sm">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['app']['Add external video']}
                        </button>
                        <button onClick={() => this.onToggleCarouselOptions(!this.state.showColCarouselOption)}
                                type="button"
                                className={`btn dark btn-sm ${this.props.edit.config.videos.length > 1 ? 'btn-warning-custom' : 'btn-outline-secondary pe-none'}`}>
                            <i className="bi bi-gear me-2"></i>
                            {trans['app']['Carousel options']}
                        </button>
                    </Col>
                    <Collapse in={this.state.showColCarouselOption}>
                        <div id={uuidv5('collapseCarouselOptions', v5NameSpace)}>
                            <hr className="mb-2 mt-0"/>
                            <div className="fs-5 mb-2"> {trans['app']['Carousel options']}</div>
                            <Row className="g-2">
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('slideIndex', v5NameSpace)}
                                        label={`Index`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={this.state.externVideo.extern_type !== 'url'}
                                            value={this.props.edit.config.carouselOptions.index || 0}
                                            onChange={(e) => this.onSetCarouselOptions(e.currentTarget.value, 'index')}
                                            type="number"
                                            placeholder='Index'
                                        />
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['video']['The starting index as integer.']}
                                    </div>
                                </Col>
                                <Col className="g-0" xl={6} xs={12}></Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('slideRtl', v5NameSpace)}
                                        label={`${trans['video']['slide show Direction']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            required={this.props.edit.config.videos.length > 1}
                                            value={this.props.edit.config.carouselOptions.slideshowDirection || ''}
                                            onChange={(e) => this.onSetCarouselOptions(e.currentTarget.value, 'slideshowDirection')}
                                            aria-label={trans['video']['slide show Direction']}>
                                            <option value="">{trans['system']['select']}</option>
                                            {this.props.edit.options.rtl.map((s, index) =>
                                                <option value={s.id} key={index}>{s.label}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['video']['The direction the slides are moving ltr=LeftToRight or rtl=RightToLeft']}
                                    </div>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('slideInterval', v5NameSpace)}
                                        label={`${trans['video']['Slide show Interval']}`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={this.state.externVideo.extern_type !== 'url'}
                                            value={this.props.edit.config.carouselOptions.slideshowInterval || ''}
                                            onChange={(e) => this.onSetCarouselOptions(e.currentTarget.value, 'slideshowInterval')}
                                            type="text"
                                            placeholder={trans['video']['Slide show Interval']}
                                        />
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['video']['Delay in milliseconds between slides for the automatic slideshow']}
                                    </div>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('transitionDuration', v5NameSpace)}
                                        label={`${trans['video']['Transition Duration']}`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={this.state.externVideo.extern_type !== 'url'}
                                            value={this.props.edit.config.carouselOptions.transitionDuration || ''}
                                            onChange={(e) => this.onSetCarouselOptions(e.currentTarget.value, 'transitionDuration')}
                                            type="number"
                                            placeholder={trans['video']['Transition Duration']}
                                        />
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['video']['The transition duration between slide changes in milliseconds']}
                                    </div>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('slideshowTransitionDuration', v5NameSpace)}
                                        label={`${trans['video']['Slide show Transition Duration']}`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={this.state.externVideo.extern_type !== 'url'}
                                            value={this.props.edit.config.carouselOptions.slideshowTransitionDuration || ''}
                                            onChange={(e) => this.onSetCarouselOptions(e.currentTarget.value, 'slideshowTransitionDuration')}
                                            type="number"
                                            placeholder={trans['video']['Slide show Transition Duration']}
                                        />
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['video']['The transition duration for automatic slide changes, set to an integer greater 0 to override the default transition duration']}
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <hr className="mb-2"/>
                                    <div className="d-flex flex-wrap">
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.startSlideshow || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'startSlideshow')}
                                                       type="checkbox" id={uuidv5('startAutoSlide', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('startAutoSlide', v5NameSpace)}>
                                                    {trans['video']['Start Slide show automatically']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Start with the automatic slideshow.'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col  xl={6} xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.clearSlides || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'clearSlides')}
                                                       type="checkbox" id={uuidv5('clearSlides', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('clearSlides', v5NameSpace)}>
                                                    {trans['video']['clear Slides']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Defines if the gallery slides are cleared from the gallery modal, or reused for the next gallery initialization'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.toggleControlsOnEnter || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'toggleControlsOnEnter')}
                                                       type="checkbox" id={uuidv5('toggleControlsOnEnter', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('toggleControlsOnEnter', v5NameSpace)}>
                                                    {trans['video']['toggle Controls On Enter']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Toggle the controls on pressing the Enter key'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.toggleSlideshowOnSpace || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'toggleSlideshowOnSpace')}
                                                       type="checkbox" id={uuidv5('toggleSlideshowOnSpace', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('toggleSlideshowOnSpace', v5NameSpace)}>
                                                    {trans['video']['toggle Slide show On Space']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Toggle the automatic slideshow interval on pressing the Space key'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.enableKeyboardNavigation || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'enableKeyboardNavigation')}
                                                       type="checkbox" id={uuidv5('enableKeyboardNavigation', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('enableKeyboardNavigation', v5NameSpace)}>
                                                    {trans['video']['enable Keyboard Navigation']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Navigate the gallery by pressing the ArrowLeft and ArrowRight keys'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.closeOnEscape || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'closeOnEscape')}
                                                       type="checkbox" id={uuidv5('closeOnEscape', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('closeOnEscape', v5NameSpace)}>
                                                    {trans['video']['close On Escape']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Close the gallery on pressing the Escape key'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.closeOnSlideClick || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'closeOnSlideClick')}
                                                       type="checkbox" id={uuidv5('closeOnSlideClick', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('closeOnSlideClick', v5NameSpace)}>
                                                    {trans['video']['close on Slide Click']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Close the gallery when clicking on an empty slide area'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.closeOnSwipeUpOrDown || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'closeOnSwipeUpOrDown')}
                                                       type="checkbox" id={uuidv5('closeOnSwipeUpOrDown', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('closeOnSwipeUpOrDown', v5NameSpace)}>
                                                    {trans['video']['close on swipe up or down']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Close the gallery by swiping up or down'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.closeOnHashChange || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'closeOnHashChange')}
                                                       type="checkbox" id={uuidv5('closeOnHashChange', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('closeOnHashChange', v5NameSpace)}>
                                                    {trans['video']['close on hash change']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Close the gallery when the URL hash changes'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.emulateTouchEvents || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'emulateTouchEvents')}
                                                       type="checkbox" id={uuidv5('emulateTouchEvents', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('emulateTouchEvents', v5NameSpace)}>
                                                    {trans['video']['emulate touch events']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Emulate touch events on mouse-pointer devices such as desktop browsers'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.stopTouchEventsPropagation || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'stopTouchEventsPropagation')}
                                                       type="checkbox" id={uuidv5('stopTouchEventsPropagation', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('stopTouchEventsPropagation', v5NameSpace)}>
                                                    {trans['video']['stop touch events propagation']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Stop touch events from bubbling up to ancestor elements of the Gallery'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.hidePageScrollbars || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'hidePageScrollbars')}
                                                       type="checkbox" id={uuidv5('hidePageScrollbars', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('hidePageScrollbars', v5NameSpace)}>
                                                    {trans['video']['hide page scrollbars']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Hide the page scrollbars'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.disableScroll || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'disableScroll')}
                                                       type="checkbox" id={uuidv5('disableScroll', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('disableScroll', v5NameSpace)}>
                                                    {trans['video']['disable scroll']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Stops any touches on the container from scrolling the page'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.continuous || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'continuous')}
                                                       type="checkbox" id={uuidv5('continuous', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('continuous', v5NameSpace)}>
                                                    {trans['video']['continuous']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Allow continuous navigation, moving from last to first and from first to last slide'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xl={6}  xs={12}>
                                            <div className="form-check my-1">
                                                <input className="form-check-input"
                                                       checked={this.props.edit.config.carouselOptions.unloadElements || false}
                                                       onChange={(e) => this.onSetCarouselOptions(e.currentTarget.checked, 'unloadElements')}
                                                       type="checkbox" id={uuidv5('unloadElements', v5NameSpace)}/>
                                                <label className="form-check-label position-relative"
                                                       htmlFor={uuidv5('unloadElements', v5NameSpace)}>
                                                    {trans['video']['unload elements']}
                                                    <sup style={{top: '-.35rem', right: '-.85rem'}} className="position-absolute">
                                                        <OverlayTrigger placement="top"
                                                                        overlay={popover(trans['video']['Remove elements outside of the preload range from the DOM'])}>
                                                            <i style={{fontSize: '13px'}}
                                                               className="cursor-info text-blue fa fa-info-circle"></i>
                                                        </OverlayTrigger>
                                                    </sup>
                                                </label>
                                            </div>
                                        </Col>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.showColExtern}>
                        <div id={uuidv5('collapseAddExtern', v5NameSpace)}>
                            <hr className="mb-2 mt-0"/>
                            <div className="fs-5 mb-2">{trans['app']['External video']}</div>
                            <Row className="g-2">
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('videoSource', v5NameSpace)}
                                        label={`${trans['app']['Video source']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            required={false}
                                            value={this.state.externVideo.extern_type || ''}
                                            onChange={(e) => this.setExternVideoValue(e.currentTarget.value, 'extern_type')}
                                            aria-label={trans['app']['Video source']}>
                                            <option value="">{trans['system']['select']}</option>
                                            {this.props.edit.options.video.map((s, index) =>
                                                <option value={s.id} key={index}>{s.label}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('aniDelay', v5NameSpace)}
                                        label={`${trans['app']['Video URL']}`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={this.state.externVideo.extern_type !== 'url'}
                                            value={this.state.externVideo.extern_url || ''}
                                            onChange={(e) => this.setExternVideoValue(e.currentTarget.value, 'extern_url')}
                                            type="text"
                                            placeholder={trans['app']['Video URL']}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('aniDelay', v5NameSpace)}
                                        label={`${trans['app']['Video ID']} `}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={this.state.externVideo.extern_type === 'url' || !this.state.externVideo.extern_type}
                                            value={this.state.externVideo.extern_id || ''}
                                            onChange={(e) => this.setExternVideoValue(e.currentTarget.value, 'extern_id')}
                                            type="text"
                                            placeholder={trans['app']['Video ID']}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xl={12}>
                                    <button onClick={this.onSetExternesVideo}
                                            type="button"
                                            disabled={this.state.btnDisabled}
                                            className="btn btn-secondary dark btn-sm">
                                        {trans['app']['Add video']}
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                    <Col xs={12}>
                        <hr className="mt-0"/>
                        {this.props.edit.config.videos.length ?
                            <React.Fragment>
                                <Accordion className="overflow-hidden">
                                    <ReactSortable
                                        list={this.props.edit.config.videos}
                                        handle=".cursor-move"
                                        setList={(newState) => this.props.onSetStateConfig(newState, 'videos')}
                                        {...this.state.sortableOptions}
                                    >
                                        {this.props.edit.config.videos.map((v, index) => {
                                            return (
                                                <Accordion.Item key={index} eventKey={index}>
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
                                                                onClick={() => this.onDeleteVideo(v.id)}
                                                                className="h-100 cursor-pointer slider-edit-icon border-end d-flex align-items-center justify-content-center"
                                                                style={{width: '2.75rem'}}>
                                                                <i className="bi bi-trash text-danger"></i>
                                                            </div>
                                                        </div>
                                                        <Accordion.Header>
                                                            <div className="slider-edit-item">
                                                                {v.video_title}
                                                            </div>
                                                        </Accordion.Header>
                                                    </div>
                                                    <Accordion.Body>
                                                        <Row className="g-2">
                                                            <Col xs={12}>
                                                                {v.extern_cover && v.extern_poster ?
                                                                    <div className="">
                                                                        <img className="img-fluid" style={{
                                                                            width: '150px',
                                                                            height: '80px',
                                                                            objectFit: 'cover'
                                                                        }}
                                                                             src={v.extern_poster}
                                                                             alt={v.video_title}/>
                                                                    </div>
                                                                    : ''}
                                                                {!v.extern_cover && v.cover_url ?
                                                                    <div className="">
                                                                        <img className="img-fluid" style={{
                                                                            width: '150px',
                                                                            height: '80px',
                                                                            objectFit: 'cover'
                                                                        }}
                                                                             src={v.cover_url}
                                                                             alt={v.video_title}/>
                                                                    </div>
                                                                    : ''}
                                                            </Col>
                                                            <Col xs={12}>
                                                                <button onClick={() => this.onSetAppImage(v.id)}
                                                                        type="button"
                                                                        disabled={v.extern_cover}
                                                                        className={`btn dark me-1 btn-sm ${v.extern_cover ? 'btn-outline-secondary' : 'btn-warning-custom'}`}>
                                                                    {trans['app']['Video Poster']}
                                                                </button>
                                                                {v.cover_url && !v.extern_cover ?
                                                                    <button
                                                                        onClick={() => this.onChangeVideoValue('', 'cover_url', v.id)}
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm dark">
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                    : ''}
                                                            </Col>
                                                            <Col xs={12}>
                                                                <Form.Check
                                                                    label={trans['app']['Use external cover']}
                                                                    type="switch"
                                                                    checked={v.extern_cover || false}
                                                                    onChange={(e) => this.onChangeVideoValue(e.currentTarget.checked, 'extern_cover', v.id)}
                                                                    id={uuidv4()}
                                                                />
                                                            </Col>
                                                            <Col xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`${trans['app']['External poster URL']} `}
                                                                >
                                                                    <Form.Control
                                                                        className="no-blur"
                                                                        disabled={!v.extern_cover}
                                                                        value={v.extern_poster || ''}
                                                                        onChange={(e) => this.onChangeVideoValue(e.currentTarget.value, 'extern_poster', v.id)}
                                                                        type="text"
                                                                        placeholder={trans['app']['External poster URL']}
                                                                    />
                                                                </FloatingLabel>
                                                            </Col>
                                                            <Col xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`${trans['app']['Video title']} `}
                                                                >
                                                                    <Form.Control
                                                                        className="no-blur"
                                                                        value={v.video_title || ''}
                                                                        onChange={(e) => this.onChangeVideoValue(e.currentTarget.value, 'video_title', v.id)}
                                                                        type="text"
                                                                        placeholder={trans['app']['Video title']}
                                                                    />
                                                                </FloatingLabel>
                                                            </Col>
                                                        </Row>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            )
                                        })}
                                    </ReactSortable>
                                </Accordion>
                                {/*}
                                <div className="d-inline-grid py-2">
                                    {this.props.edit.config.play_icon ?
                                        <div className="text-center mb-2">
                                            <i className={`${this.props.edit.config.play_icon} fs-1`}></i>
                                        </div>
                                        : ''}
                                    <div className="d-flex align-items-center">
                                    <button onClick={() => this.onSetShowModalIcons(true)}
                                            type="button"
                                            className="btn btn-secondary me-1 dark btn-sm">
                                        {trans['video']['Change play icon']}
                                    </button>
                                    {this.props.edit.config.play_icon ?
                                        <button onClick={() =>  this.props.onSetStateConfig('', 'play_icon')}
                                            type="button"
                                                className="btn btn-danger dark btn-sm">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        : ''}
                                    </div>
                                </div> {*/}

                            </React.Fragment>
                            : <div className="fs-5 text-danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['app']['no videos available']}
                            </div>
                        }
                        <hr/>
                    </Col>
                </Row>

                <FileMangerModal
                    didUpdateManager={this.state.didUpdateManager}
                    fileManagerShow={this.state.fileManagerShow}
                    options={this.state.fileManagerOption}
                    fileManagerDidUpdate={this.fileManagerDidUpdate}
                    setFileManagerShow={this.setFileManagerShow}
                    fileManagerCallback={this.fileManagerCallback}
                />
                <AppIcons
                    showModalIcons={this.state.showModalIcons}
                    onSetShowModalIcons={this.onSetShowModalIcons}
                    onIconCallback={this.onIconCallback}
                />
            </React.Fragment>
        )
    }
}