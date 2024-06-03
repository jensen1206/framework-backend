import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import AddMapProtectionModal from "./Sections/AddMapProtectionModal";
import MapProtectionDetails from "./Sections/MapProtectionDetails";
const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import MapProtectionTable from "./Sections/MapProtectionTable";
const v5NameSpace = 'b5ee5688-e961-11ee-a176-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            drawTable: false,
            colTable: true,
            colDetails: false,
            showAddModal: false,
            selectPages: [],
            edit: {},
            id: '',
            designation: '',
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }
        this.onSetDrawTable = this.onSetDrawTable.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.setShowAddModal = this.setShowAddModal.bind(this);
        this.onSetEdit = this.onSetEdit.bind(this);


    }

    onSetDrawTable(state) {
        this.setState({
            drawTable: state
        })
    }
    setShowAddModal(state) {
        this.setState({
            showAddModal: state
        })
    }

    onSetEdit(e, type) {
        if(type === 'designation') {
            this.setState({
                designation: e,
                spinner: {
                    showAjaxWait: true
                }
            })
        } else {
            let upd = this.state.edit;
            upd[type] = e;
            this.setState({
                edit: upd,
                spinner: {
                    showAjaxWait: true
                }
            })
        }
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'map_protection_handle',
                'handle': 'update',
                'designation': _this.state.designation,
                'id': _this.state.id,
                'map_data': JSON.stringify(_this.state.edit),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onToggleCollapse(target, draw = false) {
        let table = false;
        let details = false;
        switch (target) {
            case 'table':
                 table = true;
                break;
            case 'details':
                 details = true;
                break;
        }

        this.setState({
            drawTable: draw,
            colTable: table,
            colDetails: details,
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
                        case 'get_map_protection':
                            if (data.status) {
                                this.setState({
                                    edit: data.record,
                                    id: data.id,
                                    designation: data.designation,
                                    selectPages: data.selectPages
                                })
                               this.onToggleCollapse('details')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_map_protection':
                             if(data.status){
                                 this.setState({
                                     drawTable: true
                                 })
                             }
                             AppTools.swalAlertMsg(data)
                            break;
                        case 'map_protection_handle':
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
                <h3 className="fw-semibold text-body">
                    {trans['Map data protection']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <button onClick={() => this.setState({showAddModal: true})}
                    className="btn btn-success-custom mt-3 dark">
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['Add data protection']}
                </button>
                <hr/>
                <Collapse in={this.state.colTable}>
                    <div id={uuidv5('collapseProtectionTable', v5NameSpace)}>
                        <MapProtectionTable
                            drawTable={this.state.drawTable}
                            onSetDrawTable={this.onSetDrawTable}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colDetails}>
                    <div id={uuidv5('collapseProtectionDetails', v5NameSpace)}>
                        <MapProtectionDetails
                            edit={this.state.edit}
                            designation={this.state.designation}
                            spinner={this.state.spinner}
                            selectPages={this.state.selectPages}
                            onToggleCollapse={this.onToggleCollapse}
                            onSetEdit={this.onSetEdit}
                        />
                    </div>
                </Collapse>

                <AddMapProtectionModal
                    showAddModal={this.state.showAddModal}
                    setShowAddModal={this.setShowAddModal}
                    onToggleCollapse={this.onToggleCollapse}
                />
            </React.Fragment>
        )
    }
}