import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import DropzoneUpload from "./utils/DropzoneUpload";

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import BuilderTable from "./Sections/BuilderTable";
import FormBuilder from "./FormBuilder/FormBuilder";
import DesignationModal from "./Sections/DesignationModal";
import AddBuilderModal from "./Sections/AddBuilderModal";

const v5NameSpace = '59b46d26-eaee-4dcf-a9b1-59225f49cfa4';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            addBuilder: {
                title: '',
                type: ''
            },
            typeSelects: [],
            builderTableDraw: false,
            builderId: null,
            collImportBuilder: false,
            colTable: true,
            loadBuilderModalData: false,
            showAddBuilderModal: false
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.setBuilderTableDraw = this.setBuilderTableDraw.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onCreateLayout = this.onCreateLayout.bind(this);
        this.onSetLoadBuilderModalData = this.onSetLoadBuilderModalData.bind(this);
        this.onSetShowAddBuilderModal = this.onSetShowAddBuilderModal.bind(this);
        this.onSetAddBuilderForm = this.onSetAddBuilderForm.bind(this);
        this.setTypeSelects = this.setTypeSelects.bind(this);


    }

    setBuilderTableDraw(state) {
        this.setState({
            builderTableDraw: state,

        })
    }

    setTypeSelects(selects) {
        this.setState({
            typeSelects: selects
        })
    }

    onSetShowAddBuilderModal(state) {
        this.setState({
            showAddBuilderModal: state
        })
    }

    onSetAddBuilderForm(e, type) {
       let upd = this.state.addBuilder;
       upd[type] = e;
       this.setState({
           addBuilder: upd
       })
    }

    onSetLoadBuilderModalData(state, id=null) {
        this.setState({
            loadBuilderModalData: state,
            builderId: id
        })
    }

    onCreateLayout() {
        let formData = {
            'method': 'create_layout',
            'bezeichnung': this.state.addBuilder.title,
            'type': this.state.addBuilder.type
        }
        this.sendAxiosFormdata(formData).then()
    }

    onToggleCollapse(target, draw = false) {
        let table = false;
        let details = false;
        switch (target) {
            case 'table':
                table = true;
                break;
            case 'details':
                details = true
                break;
        }

        this.setState({
            colTable: table,
            colDetails: details,
            collImportBuilder: false,
            builderTableDraw: draw
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

    async sendAxiosFormdata(formData, isFormular = false, url = builderSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'import_page_builder':
                            if (data.status) {
                                this.setState({
                                    builderTableDraw: true,
                                    collImportBuilder: false,
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'create_layout':
                            if (data.status) {
                                this.setState({
                                    builderTableDraw: true,
                                    showAddBuilderModal: false,
                                    addBuilder: {
                                        title: '',
                                        type: ''
                                    },
                                })
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }

                            break;
                        case 'duplicate_builder':
                            if (data.status) {
                                this.setState({
                                    builderTableDraw: true,
                                })
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_form_builder':
                              if(data.status){
                                  this.setState({
                                      builderTableDraw: true,
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
                <DesignationModal
                    loadBuilderModalData={this.state.loadBuilderModalData}
                    id={this.state.builderId}
                    onSetLoadBuilderModalData={this.onSetLoadBuilderModalData}
                    setBuilderTableDraw={this.setBuilderTableDraw}

                />
                <h3 className="fw-semibold text-body pb-3">
                    {trans['builder']['Page-Builder']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['builder']['Layouts']}
                    </small>
                </h3>
                <div className="d-flex align-items-center flex-wrap">
                    <div>
                        <button
                           // onClick={() => this.onCreateLayout()}
                            onClick={() => this.setState({showAddBuilderModal: true})}
                            className="btn btn-success-custom ms-auto dark">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['builder']['Create layout']}
                        </button>
                    </div>
                    <button
                        onClick={() => this.setState({collImportBuilder: !this.state.collImportBuilder})}
                        className="btn btn-switch-blue ms-auto dark">
                        <i className="bi bi-upload me-2"></i>
                        {trans['builder']['Import layout']}
                    </button>
                </div>
                <hr/>
                <Collapse in={this.state.collImportBuilder}>
                    <div id={uuidv5('collapseImport', v5NameSpace)}>
                        <DropzoneUpload
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                        <hr/>
                    </div>
                </Collapse>
                <Collapse in={this.state.colTable}>
                    <div id={uuidv5('colTable', v5NameSpace)}>
                        <BuilderTable
                            builderTableDraw={this.state.builderTableDraw}
                            typeSelects={this.state.typeSelects}
                            setBuilderTableDraw={this.setBuilderTableDraw}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onSetLoadBuilderModalData={this.onSetLoadBuilderModalData}
                            setTypeSelects={this.setTypeSelects}
                        />
                    </div>
                </Collapse>
                <AddBuilderModal
                    showAddBuilderModal={this.state.showAddBuilderModal}
                    addBuilder={this.state.addBuilder}
                    onSetShowAddBuilderModal={this.onSetShowAddBuilderModal}
                    onSetAddBuilderForm={this.onSetAddBuilderForm}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />

            </React.Fragment>
        )
    }
}