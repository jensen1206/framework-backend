import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import SiteTable from "./Sections/SiteTable";
import SiteSeo from "./Sections/SiteSeo";
import SiteDetails from "./Sections/SiteDetails";
import AddSiteModal from "./Sections/AddSiteModal";

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';


const v5NameSpace = '4460ad3e-c1d6-11ee-8b2d-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            siteTableDraw: false,
            showAddSiteModal: false,
            formGrid: [],
            formSettings: {},
            builderVersion: '',
            showSiteTable: true,
            showSiteSeo: false,
            showSiteDetails: false,
            getFormBuilderData: false,
            categorySelect: [],
            selectSiteStatus: [],
            categorySiteSelect: [],
            xCardTypesSelect: [],
            ogTypesSelect: [],
            builderSelect: [],
            selectHeader: [],
            selectFooter: [],
            formBuilder: null,
            site: {},
            seo: {},
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            siteSpinner: {
                showAjaxWait: true,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.setSiteTableDraw = this.setSiteTableDraw.bind(this);
        this.onToggleSiteCollapse = this.onToggleSiteCollapse.bind(this);
        this.sortableCallback = this.sortableCallback.bind(this);
        this.onSetCategorySelect = this.onSetCategorySelect.bind(this);
        this.onSetSiteSeo = this.onSetSiteSeo.bind(this);
        this.onSetSite = this.onSetSite.bind(this);
        this.addFormBuilderSelect = this.addFormBuilderSelect.bind(this);
        this.onSetFormBuilderData = this.onSetFormBuilderData.bind(this);
        this.setShowAddSiteModal = this.setShowAddSiteModal.bind(this);

    }

    addFormBuilderSelect(id, label) {
        this.setState({
            builderSelect: [...this.state.builderSelect, {
                id: id,
                label: label
            }]
        })
    }

    setShowAddSiteModal(state) {
        this.setState({
            showAddSiteModal: state
        })
    }

    onSetFormBuilderData(state) {
        this.setState({
            getFormBuilderData: state
        })
    }

    setSiteTableDraw(state) {
        this.setState({
            siteTableDraw: state
        })
    }

    sortableCallback(options) {
        let formData = {
            'method': 'set_site_position',
            'ids': JSON.stringify(options),
        }

        this.sendAxiosFormdata(formData).then()
    }

    onSetCategorySelect(cats) {
        this.setState({
            categorySelect: cats
        })
    }

    onSetSiteSeo(e, type) {
        let upd = this.state.seo;
        upd[type] = e;
        this.setState({
            seo: upd,
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_seo',
                'seo': JSON.stringify(_this.state.seo),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
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

        if(type === 'formBuilder'){
            this.setState({
                getFormBuilderData: true
            })
        }

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_site',
                'site': JSON.stringify(_this.state.site),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onToggleSiteCollapse(target, draw = false) {
        let table = false;
        let seo = false;
        let details = false;
        switch (target) {
            case 'table':
                table = true;
                break;
            case 'seo':
                seo = true;
                break;
            case 'details':
                details = true;
                break;
        }

        this.setState({
            siteTableDraw: draw,
            showSiteTable: table,
            showSiteSeo: seo,
            showSiteDetails: details,
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            siteSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },

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
                        case 'get_site':
                            if (data.status) {
                                this.setState({
                                    categorySiteSelect: data.category_selects,
                                    xCardTypesSelect: data.xCardTypesSelect,
                                    ogTypesSelect: data.ogTypesSelect,
                                    selectSiteStatus: data.selectSiteStatus,
                                    selectHeader: data.select_header,
                                    selectFooter: data.select_footer,
                                    site: data.site,
                                    seo: data.seo,
                                    builderSelect: data.builder_select,
                                    formBuilder: data.site.formBuilder
                                })
                                switch (data.handle) {
                                    case 'seo':
                                        this.onToggleSiteCollapse('seo')
                                        break;
                                    case 'site':
                                        if(data.site.formBuilder) {
                                            this.setState({
                                                getFormBuilderData: true
                                            })
                                        }
                                        this.onToggleSiteCollapse('details')
                                        break;
                                }

                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;

                        case 'update_seo':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'update_site':
                            this.setState({
                                siteSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_site':
                            if(data.status) {
                                this.setState({
                                    siteTableDraw: true
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
                    {trans['system']['Websites']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <div className="d-flex align-items-center">
                    <button
                        onClick={() => this.setShowAddSiteModal(true)}
                        className="btn btn-success-custom dark">
                        <i className="bi bi-node-plus me-2"></i>
                        {trans['system']['Create new page']}
                    </button>
                    <div className="ms-auto">
                        {this.state.showSiteDetails ?
                            <div className="text-muted fw-semibold small">
                                {this.state.site.builderActive ? trans['builder']['Page-Builder'] : trans['builder']['Editor']}
                                <span className="fw-normal ms-1">
                                    {trans['active']}
                                </span>
                            </div> : ''}
                    </div>
                </div>
                <hr/>
                <Collapse in={this.state.showSiteTable}>
                    <div id={uuidv5('collapseSiteTable', v5NameSpace)}>
                        <SiteTable
                            siteTableDraw={this.state.siteTableDraw}
                            categorySelect={this.state.categorySelect}
                            setSiteTableDraw={this.setSiteTableDraw}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            sortableCallback={this.sortableCallback}
                            onSetCategorySelect={this.onSetCategorySelect}
                            sendAxiosFormdata={this.sendAxiosFormdata}

                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.showSiteSeo}>
                    <div id={uuidv5('collapseSeo', v5NameSpace)}>
                        <SiteSeo
                            seo={this.state.seo}
                            xCardTypesSelect={this.state.xCardTypesSelect}
                            ogTypesSelect={this.state.ogTypesSelect}
                            spinner={this.state.spinner}
                            onSetSiteSeo={this.onSetSiteSeo}
                            onToggleSiteCollapse={this.onToggleSiteCollapse}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.showSiteDetails}>
                    <div id={uuidv5('collapseDetails', v5NameSpace)}>
                        <SiteDetails
                            site={this.state.site}
                            title={this.state.seo.seoTitle}
                            categorySelect={this.state.categorySiteSelect}
                            selectSiteStatus={this.state.selectSiteStatus}
                            selectHeader={this.state.selectHeader}
                            selectFooter={this.state.selectFooter}
                            spinner={this.state.siteSpinner}
                            builderSelect={this.state.builderSelect}
                            formBuilder={this.state.formBuilder}
                            getFormBuilderData={this.state.getFormBuilderData}
                            onToggleSiteCollapse={this.onToggleSiteCollapse}
                            onSetSite={this.onSetSite}
                            addFormBuilderSelect={this.addFormBuilderSelect}
                            onSetFormBuilderData={this.onSetFormBuilderData}
                        />
                    </div>
                </Collapse>
                <AddSiteModal
                    showAddSiteModal={this.state.showAddSiteModal}
                    categorySelect={this.state.categorySelect}
                    onToggleSiteCollapse={this.onToggleSiteCollapse}
                    setShowAddSiteModal={this.setShowAddSiteModal}
                />
            </React.Fragment>
        )
    }
}