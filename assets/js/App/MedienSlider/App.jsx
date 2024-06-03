import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import MedienDesignationModal from "../AppComponents/MedienDesignationModal";

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import SliderLoop from "./Sections/SliderLoop";
import SliderDetails from "./Sections/SliderDetails";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';


const v5NameSpace = '180c4d8c-c77c-11ee-a214-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            showMedienModal: false,
            colOverview: true,
            colDetails: false,
            sliders: [],
            details: {},
            editId: '',
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }
        this.onSetShowModal = this.onSetShowModal.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onGetSlider = this.onGetSlider.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onGetEditSlider = this.onGetEditSlider.bind(this);
        this.onSetDetails = this.onSetDetails.bind(this);
        this.onSetBreakpoint = this.onSetBreakpoint.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        /*  this.setBuilderTableDraw = this.setBuilderTableDraw.bind(this);
         */
    }

    componentDidMount() {
        this.onGetSlider()
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

    onSetShowModal(state, id = '') {
        this.setState({
            showMedienModal: state,
            id: id,
        })
    }

    onToggleCollapse(target) {
        let overview = false;
        let details = false;
        switch (target) {
            case 'overview':
                overview = true;
                this.setState({
                    details: {},
                    editId: ''
                })
                break;
            case 'details':
                details = true;
                break;
        }

        this.setState({
            colOverview: overview,
            colDetails: details,
        })
    }

    onGetSlider() {
        let formData = {
            'method': 'get_slider'
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGetEditSlider(id) {
        let details = this.findArrayElementById([...this.state.sliders], id)
        this.setState({
            details: details.slider,
            editId: id
        })

        this.onToggleCollapse('details')
    }

    onSetDetails(e, type, handle = null) {
        let upd = this.state.details;
        if (handle) {
            if (handle === 'padding') {
                upd['padding'][type] = e
            }
        } else {
            upd[type] = e
        }

        this.setState({
            details: upd,
            spinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_slider',
                'slider': JSON.stringify(_this.state.details),
                'id': _this.state.editId
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onSetBreakpoint(e, type, id, handle = null) {
        let upd = this.state.details;
        const updBreak = [...upd.breakpoints];
        const findBreak = this.findArrayElementById(updBreak, id)
        if (handle) {
            findBreak[handle][type] = e;
        } else {
            findBreak[type] = e;
        }

        upd.breakpoints = updBreak;
        this.setState({
            details: upd
        })

        this.setState({
            details: upd,
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_slider',
                'slider': JSON.stringify(_this.state.details),
                'id': _this.state.editId
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

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
                        case 'get_slider':
                            if (data.status) {
                                this.setState({
                                    sliders: data.record
                                })
                            }
                            break;
                        case 'create_slider':
                            if (data.status) {
                                this.setState({
                                    sliders: [...this.state.sliders, data.record]
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'update_slider':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                },
                            })
                            break;
                        case 'add_breakpoint':
                            if (data.status) {
                                const upd = this.state.details;
                               upd.breakpoints = [...upd.breakpoints, data.record]

                                this.setState({
                                    details: upd,
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    },
                                })
                            }
                            break;
                        case 'delete_slider':
                             if(data.status) {
                                 this.setState({
                                     sliders: this.filterArrayElementById([...this.state.sliders], data.id)
                                 })
                             }
                             AppTools.swalAlertMsg(data)
                            break;
                        case 'delete_breakpoint':
                            if(data.status) {
                                const upd = [...this.state.sliders]
                                const findUpd = this.findArrayElementById(upd, data.id)
                                findUpd.slider.breakpoints = this.filterArrayElementById([...findUpd.slider.breakpoints], data.breakpoint)
                                this.setState({
                                    sliders: upd
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['mediaSlider']['Medien Slider']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <button
                    onClick={() => this.setState({showMedienModal: true})}
                    className="btn btn-success-custom ms-auto dark">
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['mediaSlider']['Create SLider']}
                </button>
                <hr/>
                <Collapse in={this.state.colOverview}>
                    <div id={uuidv5('collapseOverview', v5NameSpace)}>
                        {this.state.sliders.length ?
                        <SliderLoop
                            sliders={this.state.sliders}
                            onGetEditSlider={this.onGetEditSlider}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                        /> :
                            <div className="fs-5 text-danger text-center">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['mediaSlider']['No sliders available']}
                            </div>
                        }
                        <hr/>
                    </div>
                </Collapse>
                <Collapse in={this.state.colDetails}>
                    <div id={uuidv5('collapseDetails', v5NameSpace)}>
                        <SliderDetails
                            details={this.state.details}
                            spinner={this.state.spinner}
                            id={this.state.editId}
                            onToggleCollapse={this.onToggleCollapse}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            onSetDetails={this.onSetDetails}
                            onSetBreakpoint={this.onSetBreakpoint}
                            sendAxiosFormdata={this.sendAxiosFormdata}

                        />
                    </div>
                </Collapse>

                <MedienDesignationModal
                    showMedienModal={this.state.showMedienModal}
                    title={trans['mediaSlider']['Create media slider']}
                    method='create_slider'
                    onSetShowModal={this.onSetShowModal}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />
            </React.Fragment>
        )
    }
}