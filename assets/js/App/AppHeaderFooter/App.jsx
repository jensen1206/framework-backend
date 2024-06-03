import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import * as AppTools from "../AppComponents/AppTools";
import HeaderFooterTable from "./Sections/HeaderFooterTable";
import HeaderFooterModal from "./Sections/HeaderFooterModal";
import HeaderFooterFormBuilder from "./Sections/HeaderFooterFormBuilder";

const v5NameSpace = 'b1812d8e-e61c-11ee-adea-325096b39f47';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            drawTable: false,
            colTable: true,
            colBuilder: false,
            showAddModal: false,
            getFormBuilderData: false,
            site: {},
            builderSelect: [],
            formBuilder: null,
            edit: {
                designation: '',
                id: ''
            },
            type: '',
            siteSpinner: {
                showAjaxWait: true,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);

        this.setDrawTable = this.setDrawTable.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.setShowAddModal = this.setShowAddModal.bind(this);
        this.setEditModal = this.setEditModal.bind(this);

        this.onSetFormBuilderData = this.onSetFormBuilderData.bind(this);
        this.onSetSite = this.onSetSite.bind(this);
        this.addFormBuilderSelect = this.addFormBuilderSelect.bind(this);

    }

    componentDidMount() {
        this.setState({
            type: this.props.type
        })
    }

    onSetFormBuilderData(state) {
        this.setState({
            getFormBuilderData: state
        })
    }

    setShowAddModal(state) {
        this.setState({
            showAddModal: state
        })
    }

    setEditModal(e, type) {
        let upd = this.state.edit;
        upd[type] = e
        this.setState({
            edit: upd
        })
    }

    setDrawTable(state) {
        this.setState({
            drawTable: state
        })
    }

    onToggleCollapse(target, builderHide = false) {
        let table = false;
        let builder = false;
        switch (target) {
            case 'table':
                table = true;
                break;
            case 'builder':
                builder = true;
                break;
        }

        this.setState({
            colTable: table,
            colBuilder: builder,
        })
    }

    onSetSite(e, type) {
        let upd = this.state.site;
        upd[type] = e;
        this.setState({
            site: upd,
            siteSpinner: {
                showAjaxWait: true
            }
        })

        if (type === 'formBuilder') {
            this.setState({
                getFormBuilderData: true
            })
        }
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_header_footer_site',
                'site': JSON.stringify(_this.state.site),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    addFormBuilderSelect(id, label) {
        this.setState({
            builderSelect: [...this.state.builderSelect, {
                id: id,
                label: label
            }]
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

    async sendAxiosFormdata(formData, isFormular = false, url = sitesSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, sitesSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'add_header_footer':
                            AppTools.swalAlertMsg(data)
                            if (data.status) {
                                this.setState({
                                    drawTable: true,
                                    showAddModal: false,
                                    edit: {
                                        designation: '',
                                        id: ''
                                    },
                                })
                            }
                            break;
                        case 'get_footer_header':
                            if (data.status) {
                                this.setState({
                                    showAddModal: true,
                                    edit: data.record
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_footer_header':
                            AppTools.swalAlertMsg(data)
                            if (data.status) {
                                this.setState({
                                    drawTable: true,
                                })
                            }
                            break;
                        case 'get_site_header_footer':
                            if (data.status) {
                                this.setState({
                                    site: data.site,
                                    builderSelect: data.builder_select,
                                    formBuilder: data.site.formBuilder,
                                    getFormBuilderData: true
                                })
                                 this.onToggleCollapse('builder')
                            }

                            break;
                        case 'update_header_footer_site':
                            if (data.status) {
                                this.setState({
                                    getFormBuilderData: true
                                })
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
                    {this.state.type === 'header' ? trans['builder']['Header'] : trans['builder']['Footer']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['builder']['Layouts']}
                    </small>
                </h3>
                <div className="d-flex align-items-center flex-wrap">
                    <div>
                        <button onClick={() => this.setState({showAddModal: true})}
                                className="btn btn-success-custom ms-auto dark">
                            <i className="bi bi-node-plus me-2"></i>
                            {this.state.type === 'header' ? trans['builder']['Create header'] : trans['builder']['Create footer']}
                        </button>
                    </div>
                </div>
                <hr/>
                <Collapse in={this.state.colTable}>
                    <div id={uuidv5('collapseTable', v5NameSpace)}>
                        <HeaderFooterTable
                            drawTable={this.state.drawTable}
                            type={this.props.type}
                            setDrawTable={this.setDrawTable}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colBuilder}>
                    <div id={uuidv5('collapseBuilder', v5NameSpace)}>
                        <HeaderFooterFormBuilder
                            site={this.state.site}
                            type={this.props.type}
                            title={this.state.site.custom}
                            spinner={this.state.siteSpinner}
                            builderSelect={this.state.builderSelect}
                            formBuilder={this.state.formBuilder}
                            getFormBuilderData={this.state.getFormBuilderData}
                            onToggleSiteCollapse={this.onToggleCollapse}
                            onSetSite={this.onSetSite}
                            addFormBuilderSelect={this.addFormBuilderSelect}
                            onSetFormBuilderData={this.onSetFormBuilderData}
                        />
                    </div>
                </Collapse>

                <HeaderFooterModal
                    showAddModal={this.state.showAddModal}
                    edit={this.state.edit}
                    type={this.props.type}
                    setShowAddModal={this.setShowAddModal}
                    setEditModal={this.setEditModal}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />
            </React.Fragment>
        )
    }
}