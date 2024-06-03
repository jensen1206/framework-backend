import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import MedienDesignationModal from "../AppComponents/MedienDesignationModal";
import GalleryDetails from "./Sections/GalleryDetails";
const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import GalleryLoop from "./Sections/GalleryLoop";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';

const v5NameSpace = '43c1553a-dd84-11ee-bb4f-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            gallery: [],
            selects:{},
            edit:{},
            showAddModal: false,
            colOverview: true,
            colDetails: false,
            showMedienModal: false,
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this. getGallery = this. getGallery.bind(this)
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetShowModal = this.onSetShowModal.bind(this);
        this.onSetEdit = this.onSetEdit.bind(this);
        this.onSetBreakpoint = this.onSetBreakpoint.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    componentDidMount() {
        this.getGallery()
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
    onSetEdit(e, type) {
        let upd = this.state.edit;
        upd[type] = e;
        this.setState({
            edit: upd,
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_gallery',
                'edit': JSON.stringify(_this.state.edit),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onSetBreakpoint(e, type, id) {
        let upd = this.state.edit.breakpoints;
        upd[id][type] = e;
        this.state.edit.breakpoints = upd
        this.setState({
            edit: this.state.edit,
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_gallery',
                'edit': JSON.stringify(_this.state.edit),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    getGallery() {
        let formData = {
            'method': 'get_gallery'
        }
        this.sendAxiosFormdata(formData).then()
    }

    onToggleCollapse(target, reload = false) {
        let overview = false;
        let details = false;
        switch (target){
            case 'overview':
                 overview = true;
                break;
            case 'details':
                 details = true;
                break;
        }

        this.setState({
            colOverview: overview,
            colDetails: details
        })
        if(reload){
            this.getGallery()
        }
    }

    onSetShowModal(state) {
        this.setState({
            showMedienModal: state
        })
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
                        case 'get_gallery':
                            if (data.status) {
                                this.setState({
                                    gallery: data.record,
                                    selects: data.selects
                                })
                            }
                            break;
                        case 'add_gallery':
                              if(data.status){
                                  this.setState({
                                      gallery: [...this.state.gallery, {
                                          id: data.record.id,
                                          label: data.record.label
                                      }]
                                  })
                              }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'delete_gallery':
                            if(data.status){
                                this.setState({
                                    gallery: this.filterArrayElementById([...this.state.gallery], data.id)
                                })
                            }
                            AppTools.swalAlertMsg(data);
                            break;
                        case 'get_edit_gallery':
                               if(data.status){
                                    this.setState({
                                        edit: data.record
                                    })
                                   this.onToggleCollapse('details')
                               } else {
                                   AppTools.warning_message(data.msg)
                               }
                            break;
                        case 'update_gallery':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                },
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
                    {trans['gallery']['Media gallery']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <button
                    onClick={() => this.setState({showMedienModal: true})}
                    className="btn btn-success-custom ms-auto dark">
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['gallery']['Create gallery']}
                </button>
                <hr/>
                <Collapse in={this.state.colOverview}>
                    <div id={uuidv5('collapseLoop', v5NameSpace)}>
                        <GalleryLoop
                            gallery={this.state.gallery}
                            onToggleCollapse={this.onToggleCollapse}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colDetails}>
                    <div id={uuidv5('collapseDetails', v5NameSpace)}>
                        <GalleryDetails
                            selects={this.state.selects}
                            spinner={this.state.spinner}
                            edit={this.state.edit}
                            onToggleCollapse={this.onToggleCollapse}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onSetEdit={this.onSetEdit}
                            onSetBreakpoint={this.onSetBreakpoint}
                        />
                    </div>
                </Collapse>


                <MedienDesignationModal
                    showMedienModal={this.state.showMedienModal}
                    title= {trans['gallery']['Create gallery']}
                    method='add_gallery'
                    onSetShowModal={this.onSetShowModal}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />
            </React.Fragment>
        )
  }
}