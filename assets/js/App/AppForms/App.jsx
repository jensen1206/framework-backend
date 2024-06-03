import * as React from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from "uuid";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import * as AppTools from "../AppComponents/AppTools";
import {Card, CardBody, CardHeader, ButtonGroup, Col} from "react-bootstrap";
import SetAjaxResponse from "../AppComponents/SetAjaxResponse";
import FormsTable from "./Sections/FormsTable";
import AppForms from "./FormBuilder/AppForms";
import EmailSettings from "./Sections/EmailSettings";
import AddFormsBuilderModal from "./Sections/AddFormsBuilderModal";
import ShowSentEmail from "../SentEmail/Sections/ShowSentEmail";
import EmailPublicSentTable from "./Sections/EmailPublicSentTable";

const reactSwal = withReactContent(Swal);
import DropzoneUpload from "../PageBuilder/utils/DropzoneUpload";

const v5NameSpace = '0545d810-0cf0-4091-9e78-b131de2456bd';

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            drawTable: false,
            drawSentTable: false,
            load_email_data: false,
            sendEmailId: '',
            recordsTotal: '',
            colTable: true,
            colBuilder: false,
            colPostInput: false,
            colEmailSettings: false,
            colEmailDetails: false,
            colUploadBuilder: false,
            showAddBuilderModal: false,
            editBuilder: {},
            builderId: '',
            getBuilder: false,
            editEmailSettings: {},
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.setDrawTable = this.setDrawTable.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetShowAddBuilderModal = this.onSetShowAddBuilderModal.bind(this);
        this.onSetEditBuilder = this.onSetEditBuilder.bind(this);
        this.onSetEmailSettings = this.onSetEmailSettings.bind(this);
        this.onDeleteAllEmails = this.onDeleteAllEmails.bind(this);
        this.onSetRecordsTotal = this.onSetRecordsTotal.bind(this);
        this.onSetGetEmailData = this.onSetGetEmailData.bind(this);
        this.onGetShowEmail = this.onGetShowEmail.bind(this);
        this.onToggleSeCollapse = this.onToggleSeCollapse.bind(this);
        this.onSetDrawSentTable = this.onSetDrawSentTable.bind(this);
        this.onUpdateBuilder = this.onUpdateBuilder.bind(this);


        //Builder
        this.setGetBuilder = this.setGetBuilder.bind(this);
        this.onGetBuilder = this.onGetBuilder.bind(this);


    }

    setDrawTable(state) {
        this.setState({
            drawTable: state
        })
    }

    onSetDrawSentTable(state) {
        this.setState({
            drawSentTable: state
        })
    }

    onSetGetEmailData(state) {
        this.setState({
            load_email_data: state
        })
    }

    onDeleteAllEmails() {
        let swal = {
            'title': `${trans['swal']['Delete email']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete email']
        }

        let formData = {
            'method': 'delete_all_email',
        }

        this.onDeleteSwalHandle(formData, swal)
    }

    onSetRecordsTotal(total) {
        this.setState({
            recordsTotal: total
        })
    }


    onGetBuilder(id) {
        this.setState({
            builderId: id,
            getBuilder: true
        })
    }

    setGetBuilder(state) {
        this.setState({
            getBuilder: state
        })
    }

    onSetEditBuilder(e, type) {
        let upd = this.state.editBuilder;
        upd[type] = e;
        this.setState({
            editBuilder: upd
        })
    }

    onUpdateBuilder(e,type,id) {
        let upd = this.state.editBuilder;
        upd.id = id;
        upd[type] = e;
        this.setState({
            editBuilder: upd,
            showAddBuilderModal: true
        })

    }

    onSetShowAddBuilderModal(state) {
        this.setState({
            showAddBuilderModal: state
        })
    }

    onSetEmailSettings(e, type) {
        let upd = this.state.editEmailSettings;
        upd[type] = e;
        this.setState({
            editEmailSettings: upd
        })
        let formData = {
            'method': 'update_email_settings',
            'settings': JSON.stringify(this.state.editEmailSettings)
        }

        this.sendAxiosFormdata(formData).then()
    }

    onToggleCollapse(target, draw = false, getEmail = false) {
        let table = false;
        let builder = false;
        let postInput = false;
        let emailSettings = false;
        let emailDetails = false;
        switch (target) {
            case 'table':
                table = true;
                break;
            case 'builder':
                builder = true;
                break;
            case 'post-input':
                postInput = true;
                this.setState({
                    drawSentTable: true
                })
                break;
            case 'email-settings':
                emailSettings = true;
                break;
            case 'email-details':
                emailDetails = true;
                break;
        }

        if (getEmail) {
            let formData = {
                'method': 'get_email_settings'
            };

            this.sendAxiosFormdata(formData).then()
            return false;
        }
        this.setState({
            drawTable: draw,
            colTable: table,
            colBuilder: builder,
            colPostInput: postInput,
            colEmailSettings: emailSettings,
            colEmailDetails: emailDetails
        })
    }

    onToggleSeCollapse(target) {
        this.onToggleCollapse('post-input')
    }

    onGetShowEmail(id) {
        this.setState({
            sendEmailId: id,
            load_email_data: true,
        })
        this.onToggleCollapse('email-details')
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

    async sendAxiosFormdata(formData, isFormular = false, url = formsSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, formsSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'builder_handle':
                            if (data.status) {
                                this.setState({
                                    showAddBuilderModal: false,
                                    drawTable: true,
                                    getBuilder: true,
                                    editBuilder: {}
                                })
                                if (data.handle === 'insert') {
                                    AppTools.swalAlertMsg(data)
                                } else {
                                    AppTools.success_message(data.msg)
                                }
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_form_builder':
                            AppTools.swalAlertMsg(data);
                            if (data.status) {
                                this.setState({
                                    drawTable: true,
                                })
                            }
                            break;
                        case 'get_email_settings':
                            if (data.status) {
                                this.setState({
                                    editEmailSettings: data.record
                                })
                                this.onToggleCollapse('email-settings')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_email':
                        case 'delete_all_email':

                            if (data.status) {
                                AppTools.swalAlertMsg(data)
                                this.setState({
                                    drawSentTable: true
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'import_page_builder':
                            if (data.status) {
                                AppTools.swalAlertMsg(data)
                                this.setState({
                                    drawTable: true
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'duplicate_forms':
                              if(data.status){
                                  this.setState({
                                      drawTable: true,
                                      colUploadBuilder: false
                                  })
                                  AppTools.success_message(data.msg)
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
                <h3 className="fw-semibold text-body pb-3">
                    {trans['forms']['Forms']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['forms']['Create and edit']}
                    </small>
                </h3>
                {formsSettings.add_forms ?
                    <div className="d-flex flex-wrap">
                        <button onClick={() => this.setState({showAddBuilderModal: true})}
                                className="btn btn-success-custom my-1 me-1 dark">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['forms']['Create form']}
                        </button>
                        <div className="ms-auto">
                            <button onClick={() => this.setState({colUploadBuilder: !this.state.colUploadBuilder})}
                                    className="btn btn-switch-blue my-1 me-1 dark">
                                <i className="bi bi-upload me-2"></i>
                                {trans['builder']['Import layout']}
                            </button>
                        </div>
                    </div> : ''}
                <hr/>
                <Collapse in={this.state.colUploadBuilder}>
                    <div id={uuidv5('collapseUpload', v5NameSpace)}>
                        <DropzoneUpload
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                        <hr/>
                    </div>
                </Collapse>
                <ButtonGroup className="flex-wrap" aria-label="Basic example">
                    <Button onClick={() => this.onToggleCollapse('table')}
                            variant={`switch-blue-outline dark ${this.state.colTable ? 'active' : ''}`}>
                        {trans['forms']['Forms']}
                    </Button>
                    <Button onClick={() => this.onToggleCollapse('post-input')}
                            variant={`switch-blue-outline dark ${this.state.colPostInput || this.state.colEmailDetails ? 'active' : ''}`}>
                        {trans['forms']['Incoming mail']}
                        <sup  className="small-xl px-1 py-2 text-body rounded ms-1 d-inline-block border">
                            {this.state.recordsTotal}
                        </sup>
                    </Button>
                    <Button onClick={() => this.onToggleCollapse('email-settings', false, true)}
                            variant={`switch-blue-outline dark ${this.state.colEmailSettings ? 'active' : ''}`}>
                        {trans['forms']['E-mail settings']}
                    </Button>
                </ButtonGroup>
                <hr/>
                <Collapse in={this.state.colTable}>
                    <div id={uuidv5('collapseTable', v5NameSpace)}>
                        <FormsTable
                            drawTable={this.state.drawTable}
                            setDrawTable={this.setDrawTable}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            onGetBuilder={this.onGetBuilder}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colBuilder}>
                    <div id={uuidv5('collapseBuilder', v5NameSpace)}>
                        <AppForms
                            getBuilder={this.state.getBuilder}
                            id={this.state.builderId}
                            setGetBuilder={this.setGetBuilder}
                            onToggleCollapse={this.onToggleCollapse}
                            onUpdateBuilder={this.onUpdateBuilder}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colPostInput}>
                    <div id={uuidv5('collapsePostInput', v5NameSpace)}>
                        <EmailPublicSentTable
                            drawSentTable={this.state.drawSentTable}
                            recordsTotal={this.state.recordsTotal}
                            onSetDrawSentTable={this.onSetDrawSentTable}
                            onDeleteAllEmails={this.onDeleteAllEmails}
                            onSetRecordsTotal={this.onSetRecordsTotal}
                            onGetShowEmail={this.onGetShowEmail}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colEmailDetails}>
                    <div id={uuidv5('collapseEmailDetails', v5NameSpace)}>
                        <ShowSentEmail
                            id={this.state.sendEmailId}
                            load_email_data={this.state.load_email_data}
                            onSetGetEmailData={this.onSetGetEmailData}
                            onToggleSeCollapse={this.onToggleSeCollapse}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colEmailSettings}>
                    <div id={uuidv5('collapseEmailSettings', v5NameSpace)}>
                        <EmailSettings
                            editEmailSettings={this.state.editEmailSettings}
                            onSetEmailSettings={this.onSetEmailSettings}
                        />
                    </div>
                </Collapse>
                <AddFormsBuilderModal
                    showAddBuilderModal={this.state.showAddBuilderModal}
                    editBuilder={this.state.editBuilder}
                    onSetShowAddBuilderModal={this.onSetShowAddBuilderModal}
                    onSetEditBuilder={this.onSetEditBuilder}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />
            </React.Fragment>
        )
    }

}