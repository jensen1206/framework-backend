import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import MedienDesignationModal from "../AppComponents/MedienDesignationModal";
import CarouselSettings from "./Sections/CarouselSettings";
import SliderSettings from "./Sections/SliderSettings";
import SetAjaxResponse from "../AppComponents/SetAjaxResponse"

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader} from "react-bootstrap";

const v5NameSpace = '1aaee866-8a3a-437c-8d59-84dc3ca19195';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colOverview: true,
            colCarousel: false,
            colSlider: false,
            carousel: [],
            sliderEdit: {},
            carouselEdit: {
                carousel: {}
            },
            id: '',
            showMedienModal: false,
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            selects: {
                select_image_size: [],
                select_source: [],
                select_link_options: [],
                select_button_variant: [],
                site_selects: [],
                animate_selects: [],
                select_carousel_type: [],
                select_button_size: []
            }
        }


        this.onGetCarousel = this.onGetCarousel.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetShowModal = this.onSetShowModal.bind(this);
        this.deleteCarousel = this.deleteCarousel.bind(this);

        //EDIT
        this.onGetEditCarousel = this.onGetEditCarousel.bind(this);
        this.onGetEditSlider = this.onGetEditSlider.bind(this);
        this.onSetCarousel = this.onSetCarousel.bind(this);
        this.onSetSlider = this.onSetSlider.bind(this);
        this.onSetSliderButton = this.onSetSliderButton.bind(this);

        //Sortable
        this.onSetSliderSortable = this.onSetSliderSortable.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);


    }

    componentDidMount() {
        this.onGetCarousel()
    }

    onSetSliderSortable(setState, id) {
        this.state.carouselEdit.carousel.slider = setState;
        this.setState({
            carouselEdit: this.state.carouselEdit,
            spinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_carousel',
                'carousel': JSON.stringify(_this.state.carouselEdit),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
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

    onGetEditCarousel(id, target) {

        this.setState({
            carouselEdit: this.findArrayElementById([...this.state.carousel], id),
        })

        this.onToggleCollapse(target)
    }

    onGetEditSlider(id) {

    }

    onSetCarousel(e, type) {
        this.state.carouselEdit.carousel[type] = e;
        this.setState({
            carouselEdit: this.state.carouselEdit,
            spinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_carousel',
                'carousel': JSON.stringify(_this.state.carouselEdit),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onSetSlider(e, type, id) {
        const upd = [...this.state.carouselEdit.carousel.slider]
        const find = this.findArrayElementById(upd, id);
        find[type] = e;
        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_carousel_slider',
                'slider': JSON.stringify(find),
                'carousel': _this.state.carouselEdit.id
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onSetSliderButton(e, type, slider, id) {
        const upd = [...this.state.carouselEdit.carousel.slider]
        const find = this.findArrayElementById(upd, slider);
        const updBtn = [...find.slide_button]
        const btn = this.findArrayElementById(updBtn, id);
        btn[type] = e

        this.setState({
            carouselEdit: this.state.carouselEdit,
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_carousel_slider',
                'slider': JSON.stringify(find),
                'carousel': _this.state.carouselEdit.id
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onGetCarousel() {
        let formData = {
            'method': 'get_carousel'
        }

        this.sendAxiosFormdata(formData).then()
    }

    onSetShowModal(state, id) {
        this.setState({
            showMedienModal: state,
            id: id,
        })
    }

    onToggleCollapse(target) {
        let overview = false;
        let carousel = false;
        let slider = false;
        switch (target) {
            case 'overview':
                overview = true;
                break;
            case 'carousel':
                carousel = true;
                break;
            case 'slider':
                slider = true;
                break;
        }

        this.setState({
            colOverview: overview,
            colCarousel: carousel,
            colSlider: slider,
        })
    }

    deleteCarousel(id) {
        let swal = {
            'title': `${trans['swal']['Delete carousel']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete carousel']
        }

        let formData = {
            'method': 'delete_carousel',
            'id': id,
        }
        this.onDeleteSwalHandle(formData, swal)

    }

    onDeleteSwalHandle(formData, swal) {
        reactSwal.fire({
            title: swal.title,
            reverseButtons: true,
            html: `<span class="swal-delete-body">${swal.msg}</span>`,
            confirmButtonText: swal.btn,
            cancelButtonText: trans['swal']['Cancel'],
            customClass: {
                popup: 'swal-delete-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.sendAxiosFormdata(formData).then()
            }
        });
    }

    async sendAxiosFormdata(formData, isFormular = false, url = mediaGallery.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, mediaGallery))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_carousel':
                            if (data.status) {
                                this.setState({
                                    carousel: data.record,
                                    selects: data.selects
                                })
                                this.onToggleCollapse('overview')
                            }
                            break;
                        case 'create_carousel':
                            if (data.status) {
                                this.setState({
                                    carousel: [...this.state.carousel, data.record]
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'update_carousel':
                            if (data.status) {

                            }
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'add_slider':
                            if (data.status) {
                                this.state.carouselEdit.carousel.slider = [...this.state.carouselEdit.carousel.slider, data.record];
                                this.setState({
                                    carouselEdit: this.state.carouselEdit
                                })
                            }
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_carousel_slider':
                            if (data.status) {
                                this.state.carouselEdit.carousel.slider = this.filterArrayElementById([...this.state.carouselEdit.carousel.slider], data.id);
                                this.setState({
                                    carouselEdit: this.state.carouselEdit
                                })
                            }
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_carousel':
                            if (data.status) {
                                this.setState({
                                    carousel: this.filterArrayElementById([...this.state.carousel], data.id)
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'update_carousel_slider':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'add_button':
                            if (data.status) {
                                const slider = [...this.state.carouselEdit.carousel.slider];
                                const find = this.findArrayElementById(slider, data.slider);
                                find.slide_button = [...find.slide_button, data.record]
                                this.state.carouselEdit.carousel.slider = slider;
                                this.setState({
                                    carouselEdit: this.state.carouselEdit
                                })
                            }
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_carousel_slider_button':
                             if(data.status) {
                                 const slider = [...this.state.carouselEdit.carousel.slider];
                                 const find = this.findArrayElementById(slider, data.slider);
                                 find.slide_button = this.filterArrayElementById([...find.slide_button], data.id)
                                 this.state.carouselEdit.carousel.slider = slider;
                                 this.setState({
                                     carouselEdit: this.state.carouselEdit
                                 })
                             }
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['carousel']['Medien Carousel']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <div className="d-flex align-items-center flex-wrap">
                    <button
                        onClick={() => this.setState({showMedienModal: true})}
                        className="btn btn-success-custom dark">
                        <i className="bi bi-node-plus me-2"></i>
                        {trans['carousel']['Create carousel']}
                    </button>
                    <div className="ms-auto">
                        <div
                            className={`ajax-spinner text-muted ${this.state.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                        <small>
                            <SetAjaxResponse
                                status={this.state.spinner.ajaxStatus}
                                msg={this.state.spinner.ajaxMsg}
                            />
                        </small>
                    </div>
                </div>
                <hr/>
                <Collapse in={this.state.colOverview}>
                    <div id={uuidv5('collapseOverview', v5NameSpace)}>
                        {this.state.carousel.length ?
                            <React.Fragment>
                                {this.state.carousel.map((c, index) => {
                                    return (
                                        <Card className="mb-3" key={index}>
                                            <CardHeader className="bg-body-tertiary py-3 fs-5">
                                                {trans['carousel']['Carousel']}
                                                <i className="bi bi-arrow-right-short mx-1"></i>
                                                <span className="fw-light">
                                                {c.carousel.designation}
                                                </span>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <button
                                                        onClick={() => this.onGetEditCarousel(c.id, 'carousel')}
                                                        className="btn btn-switch-blue me-1 my-1 dark">
                                                        <i className="bi bi-tools me-2"></i>
                                                        {trans['carousel']['Carousel Settings']}

                                                    </button>
                                                    <button
                                                        onClick={() => this.onGetEditCarousel(c.id, 'slider')}
                                                        className="btn btn-warning-custom me-1 my-1 dark">
                                                        <i className="bi bi-arrow-left-right me-2"></i>
                                                        {trans['carousel']['Slider Settings']}
                                                        <i className="bi bi-arrows-collapse ms-2"></i>
                                                    </button>
                                                    <div className="ms-md-auto">
                                                        <button
                                                            onClick={() => this.deleteCarousel(c.id)}
                                                            className="btn btn-danger my-1 dark">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )
                                })}
                            </React.Fragment>
                            :
                            <div className="fs-5 text-danger text-center">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['carousel']['No carousel available']}
                            </div>
                        }

                    </div>
                </Collapse>
                <Collapse in={this.state.colCarousel}>
                    <div id={uuidv5('collapseCarousel', v5NameSpace)}>
                        <CarouselSettings
                            carouselEdit={this.state.carouselEdit}
                            selects={this.state.selects}
                            onSetCarousel={this.onSetCarousel}
                            onToggleCollapse={this.onToggleCollapse}

                        />

                    </div>
                </Collapse>
                <Collapse in={this.state.colSlider}>
                    <div id={uuidv5('collapseSlider', v5NameSpace)}>
                        <SliderSettings
                            carouselEdit={this.state.carouselEdit}
                            selects={this.state.selects}
                            onToggleCollapse={this.onToggleCollapse}
                            onSetSliderSortable={this.onSetSliderSortable}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            onSetSlider={this.onSetSlider}
                            onSetSliderButton={this.onSetSliderButton}
                        />
                    </div>
                </Collapse>

                <MedienDesignationModal
                    showMedienModal={this.state.showMedienModal}
                    title={trans['carousel']['Create media carousel']}
                    method='create_carousel'
                    onSetShowModal={this.onSetShowModal}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />
            </React.Fragment>
        )
    }
}