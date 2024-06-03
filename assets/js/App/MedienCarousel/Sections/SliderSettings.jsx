import * as React from "react";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Col from "react-bootstrap/Col";
import {ReactSortable} from "react-sortablejs";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonLoop from "./loops/ButtonLoop";
import FirstTitle from "./items/FirstTitle";
import HeadLine from "./items/HeadLine";
import SubTitle from "./items/SubTitle";

const v5NameSpace = '3b4c448a-b9fb-4d20-bd19-42729333439d';

export default class SliderSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            editId: '',
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
            selectedImage: '',
            didUpdateManager: false,
            fileManagerShow: false,
            fmOptions: {
                multiSelect: false,
                fileType: 'image',
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
        }

        this.onDeleteSlider = this.onDeleteSlider.bind(this);
        this.addSlider = this.addSlider.bind(this);
        this.addButton = this.addButton.bind(this);
        this.onSetActive = this.onSetActive.bind(this);

        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);

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
                    image: i.fileName,
                    imgId: i.id,
                    type: i.type,
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
            if (add.length) {
                this.props.onSetSlider(add[0], 'image', this.state.editId)
                // console.log(add[0])
            }

            // this.props.onSetImages(add, true)
            this.setState({
                selectedImage: '',
                editId: ''
            })
        }
    }

    onSetAppImage(type, id) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true,
            editId: id
        })
    }

    onDeleteSlider(id) {
        let swal = {
            'title': `${trans['swal']['Delete slider']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete slider']
        }

        let formData = {
            'method': 'delete_carousel_slider',
            'id': id,
            'carousel': this.props.carouselEdit.id
        }
        this.props.onDeleteSwalHandle(formData, swal)
    }

    addSlider() {
        let formData = {
            'method': 'add_slider',
            'id': this.props.carouselEdit.id
        }

        this.props.sendAxiosFormdata(formData)
    }

    addButton(slider) {
        let formData = {
            'method': 'add_button',
            'id': this.props.carouselEdit.id,
            'slider': slider
        }

        this.props.sendAxiosFormdata(formData)
    }

    onSetActive(e) {
        let currentActive = e.currentTarget.classList.contains('active');
        $('.header-item').removeClass('active')
        if (!currentActive) {
            e.currentTarget.classList.add('active')
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="d-flex align-items-center">
                    <button
                        onClick={() => this.props.onToggleCollapse('overview')}
                        className="btn btn-switch-blue mb-3 me-2 btn-sm dark">
                        <i className="bi bi-reply-all me-2"></i>
                        {trans['back']}
                    </button>
                    <button
                        onClick={this.addSlider}
                        className="btn btn-warning-custom  mb-3 me-2 btn-sm dark">
                        <i className="bi bi-node-plus me-2"></i>
                        {trans['carousel']['Add slider']}
                    </button>
                </div>
                {this.props.carouselEdit.carousel.slider ?
                    <Accordion className="overflow-hidden">
                        <ReactSortable
                            list={this.props.carouselEdit.carousel.slider}
                            handle=".cursor-move"
                            setList={(newState) => this.props.onSetSliderSortable(newState, this.props.carouselEdit.id)}
                            {...this.state.sortableOptions}
                        >
                            {this.props.carouselEdit.carousel.slider.map((s, index) => {
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
                                                    onClick={() => this.onDeleteSlider(s.id)}
                                                    className="h-100 cursor-pointer slider-edit-icon border-end d-flex align-items-center justify-content-center"
                                                    style={{width: '2.75rem'}}>
                                                    <i className="bi bi-trash text-danger"></i>
                                                </div>
                                            </div>
                                            <Accordion.Header>
                                                <div className="slider-edit-item">
                                                <span
                                                    className="fw-semibold me-2">{trans['carousel']['Carousel']}:</span>

                                                    {this.props.carouselEdit.carousel.designation}
                                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                                    <span
                                                        className="fw-semibold me-2">{trans['carousel']['Slider']}:</span> {s.id}
                                                </div>
                                            </Accordion.Header>
                                        </div>
                                        <Accordion.Body>
                                            <Card className="shadow-sm">
                                                <CardHeader className="bg-body-tertiary py-3 fs-5">
                                                    {trans['Settings']}
                                                </CardHeader>
                                                <CardBody>
                                                    <Col xxl={8} lg={10} xs={12} className="mx-auto">
                                                        <Card>
                                                            <CardBody>
                                                                <Row className="g-2">
                                                                    <Col xs={12}>
                                                                        <div className="text-muted text-center mb-2">
                                                                            {trans['carousel']['Select or change image for slider']}
                                                                        </div>
                                                                        <div
                                                                            className="d-flex flex-column align-items-center justify-content-center">
                                                                            {s.image.imgId ?
                                                                                <div className="p-1 rounded border"
                                                                                     style={{
                                                                                         width: '150px',
                                                                                         height: '150px'
                                                                                     }}>
                                                                                    <img
                                                                                        className="rounded img-fluid"
                                                                                        src={`${s.image.type === 'data' ? publicSettings.public_mediathek + '/' + s.image.image : publicSettings.thumb_url + '/' + s.image.image}`}
                                                                                        alt={s.image.title}/>
                                                                                </div>
                                                                                :
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px'
                                                                                }}
                                                                                     className="placeholder-account-image p-1 border rounded"></div>
                                                                            }
                                                                            <div className="mt-2">
                                                                                <button
                                                                                    onClick={() => this.onSetAppImage('single_image', s.id)}
                                                                                    className="btn btn-switch-blue dark btn-sm">
                                                                                    {s.image.imgId ? trans['app']['Change image'] : trans['app']['Select image']}
                                                                                </button>
                                                                                {s.image.imgId ?
                                                                                    <button
                                                                                        className="btn btn-danger dark ms-2 btn-sm">
                                                                                        <i className="bi bi-trash"></i>
                                                                                    </button> : ''}
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12}>
                                                                        <hr/>
                                                                        <Accordion>
                                                                            <Accordion.Item eventKey="0">
                                                                                <Accordion.Header>
                                                                                    <i className="bi bi-gear me-2"></i>
                                                                                    {trans['carousel']['Slider Settings']}
                                                                                </Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    <Row className="g-2">
                                                                                        <Col xs={12}>
                                                                                            <Form.Check
                                                                                                type="switch"
                                                                                                id={uuidv4()}
                                                                                                checked={s.active || false}
                                                                                                onChange={(e) => this.props.onSetSlider(e.currentTarget.checked, 'active', s.id)}
                                                                                                label={trans['carousel']['Slider active']}
                                                                                            />
                                                                                        </Col>
                                                                                        <Col xs={12}>
                                                                                            <Form.Check
                                                                                                type="switch"
                                                                                                id={uuidv4()}
                                                                                                checked={s.title_hover_active || false}
                                                                                                onChange={(e) => this.props.onSetSlider(e.currentTarget.checked, 'title_hover_active', s.id)}
                                                                                                label={trans['carousel']['Show title on hover']}
                                                                                            />
                                                                                        </Col>
                                                                                        <Col xs={12}>
                                                                                            <Form.Check
                                                                                                type="switch"
                                                                                                id={uuidv4()}
                                                                                                checked={s.caption_mobil_active || false}
                                                                                                onChange={(e) => this.props.onSetSlider(e.currentTarget.checked, 'caption_mobil_active', s.id)}
                                                                                                label={trans['carousel']['Show caption on mobile devices']}
                                                                                            />
                                                                                            <div className="form-text">
                                                                                                {trans['carousel']['If active, the entered captions are displayed on mobile devices.']}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <hr/>
                                                                                        <Col xl={6} xs={12}>
                                                                                            <FloatingLabel
                                                                                                controlId={uuidv4()}
                                                                                                label={`${trans['carousel']['Alt Tag']}`}
                                                                                            >
                                                                                                <Form.Control
                                                                                                    required={false}
                                                                                                    value={s.alt}
                                                                                                    onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'alt', s.id)}
                                                                                                    className="no-blur"
                                                                                                    type="text"
                                                                                                    placeholder={trans['carousel']['Alt Tag']}/>
                                                                                            </FloatingLabel>
                                                                                            <div className="form-text">
                                                                                                {trans['carousel']['This entry overwrites the image alt tag.']}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xl={6} xs={12}>
                                                                                            <FloatingLabel
                                                                                                controlId={uuidv4()}
                                                                                                label={`${trans['carousel']['Title Tag']}`}
                                                                                            >
                                                                                                <Form.Control
                                                                                                    required={false}
                                                                                                    disabled={!s.title_hover_active}
                                                                                                    value={s.title_tag}
                                                                                                    onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'title_tag', s.id)}
                                                                                                    className="no-blur"
                                                                                                    type="text"
                                                                                                    placeholder={trans['carousel']['Title Tag']}/>
                                                                                            </FloatingLabel>
                                                                                            <div className="form-text">
                                                                                                {trans['carousel']['This entry overwrites the image title tag.']}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xl={6} xs={12}>
                                                                                            <FloatingLabel
                                                                                                controlId={uuidv4()}
                                                                                                label={`${trans['carousel']['Slider Interval (msec)']}`}
                                                                                            >
                                                                                                <Form.Control
                                                                                                    required={true}
                                                                                                    value={s.interval}
                                                                                                    onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'interval', s.id)}
                                                                                                    className="no-blur"
                                                                                                    type="number"
                                                                                                    placeholder={trans['carousel']['Slider Interval (msec)']}/>
                                                                                            </FloatingLabel>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                            <Accordion.Item eventKey="1">
                                                                                <Accordion.Header>
                                                                                    <i className="bi bi-gear me-2"></i>
                                                                                    {trans['carousel']['Button Settings']}
                                                                                </Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    <button
                                                                                        onClick={() => this.addButton(s.id)}
                                                                                        className="btn btn-switch-blue dark btn-sm">
                                                                                        <i className="bi bi-node-plus me-2"></i>
                                                                                        {trans['carousel']['Add button']}
                                                                                    </button>
                                                                                    <ButtonLoop
                                                                                        s={s}
                                                                                        selects={this.props.selects}
                                                                                        onSetSliderButton={this.props.onSetSliderButton}
                                                                                        carouselId={this.props.carouselEdit.id}
                                                                                        onDeleteSwalHandle={this.props.onDeleteSwalHandle}
                                                                                    />
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                            <Accordion.Item eventKey="2">
                                                                                <Accordion.Header>
                                                                                    <i className="bi bi-fonts me-2"></i>
                                                                                    {trans['carousel']['First Title']}
                                                                                </Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    <FirstTitle
                                                                                        s={s}
                                                                                        onSetSlider={this.props.onSetSlider}
                                                                                        selects={this.props.selects}
                                                                                    />
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                            <Accordion.Item eventKey="3">
                                                                                <Accordion.Header>
                                                                                    <i className="bi bi-fonts me-2"></i>
                                                                                    {trans['carousel']['Headline']}
                                                                                </Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    <HeadLine
                                                                                        s={s}
                                                                                        onSetSlider={this.props.onSetSlider}
                                                                                        selects={this.props.selects}
                                                                                    />
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                            <Accordion.Item eventKey="4">
                                                                                <Accordion.Header>
                                                                                    <i className="bi bi-fonts me-2"></i>
                                                                                    {trans['carousel']['Subtitle']}
                                                                                </Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    <SubTitle
                                                                                        s={s}
                                                                                        onSetSlider={this.props.onSetSlider}
                                                                                        selects={this.props.selects}
                                                                                    />
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                        </Accordion>
                                                                    </Col>
                                                                </Row>

                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </CardBody>
                                            </Card>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })}
                        </ReactSortable>
                    </Accordion>
                    : ''}
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