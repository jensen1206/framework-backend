import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import Collapse from 'react-bootstrap/Collapse';
const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import SiteCategoryTable from "./Sections/SiteCategoryTable";
import SiteCategoryModal from "./Sections/SiteCategoryModal";
import SiteCategoryDetails from "./Sections/SiteCategoryDetails";
import {v5 as uuidv5} from 'uuid';
const v5NameSpace = 'e969c0fb-b14b-47e5-96c3-2a9f6d1aa5af';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            siteCategoryDraw: false,
            showCatTable: true,
            showCatDetails: false,
            showCategoryModal: false,
            builderSelect: [],
            category:{},
            catSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.setSiteCategoryDraw = this.setSiteCategoryDraw.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.sortableCallback = this.sortableCallback.bind(this);
        this.onToggleCategoryCollapse = this.onToggleCategoryCollapse.bind(this);
        this.setShowCategoryModal = this.setShowCategoryModal.bind(this);
        this.onSetCategory = this.onSetCategory.bind(this);
    }


    setShowCategoryModal(state) {
        this.setState({
            showCategoryModal: state
        })
    }
    setSiteCategoryDraw(state, toggle = false) {
        this.setState({
            siteCategoryDraw: state
        })

        if(toggle){
            this.onToggleCategoryCollapse('table');
        }
    }

    sortableCallback(options) {
        let formData = {
            'method': 'set_category_position',
            'ids': JSON.stringify(options),
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSetCategory(e, type) {
        let upd = this.state.category;
        upd[type] = e;
        if(type === 'title') {
           let formData = {
               'method': 'urlizer_slug',
               'site': e
           }

           this.sendAxiosFormdata(formData).then()
        }
        this.setState({
            category: upd
        })

        this.setState({
            log: upd,
            catSpinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_site_category',
                'category': JSON.stringify(_this.state.category),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onToggleCategoryCollapse(target, draw=false) {
        let table = false;
        let details = false;

        switch (target){
            case 'table':
                  table = true;
                break;
            case 'details':
                 details = true;
                break;
        }

        this.setState({
            showCatTable: table,
            showCatDetails: details,
            siteCategoryDraw: draw,
            showCategoryModal: false,
            catSpinner: {
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
                        case 'get_site_category':
                            if (data.status) {
                               this.setState({
                                   category: data.record
                               })
                                this.onToggleCategoryCollapse('details')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_site_category':
                              AppTools.swalAlertMsg(data);
                              if(data.status){
                                  this.setState({
                                      siteCategoryDraw: true
                                  })
                              }
                            break;
                        case 'update_site_category':
                            this.setState({
                                catSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'urlizer_slug':
                              if(data.status) {
                                  let upd = this.state.category;
                                  upd['slug'] = data.slug;
                                  this.setState({
                                      category: upd
                                  })
                              }
                            break;
                        case 'add_category_seo':
                              if(data.status) {
                                  let upd = this.state.category;
                                  upd['seo'] = true;
                                  this.setState({
                                      category: upd
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
                    {trans['Pages Categories']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <button
                    onClick={() => this.setState({showCategoryModal: true})}
                    className="btn btn-success-custom dark">
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['medien']['Create a new category']}
                </button>
                <hr/>
                <Collapse in={this.state.showCatTable}>
                    <div id={uuidv5('collapseCatTable', v5NameSpace)}>
                        <SiteCategoryTable
                            siteCategoryDraw={this.state.siteCategoryDraw}
                            setSiteCategoryDraw={this.setSiteCategoryDraw}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            sortableCallback={this.sortableCallback}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.showCatDetails}>
                    <div id={uuidv5('collapseCatDetails', v5NameSpace)}>
                        <SiteCategoryDetails
                            category={this.state.category}
                            spinner={this.state.catSpinner}
                            onToggleCategoryCollapse={this.onToggleCategoryCollapse}
                            onSetCategory={this.onSetCategory}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                    </div>
                </Collapse>
                <SiteCategoryModal
                    showCategoryModal={this.state.showCategoryModal}
                    onToggleCategoryCollapse={this.onToggleCategoryCollapse}
                    setShowCategoryModal={this.setShowCategoryModal}
                    setSiteCategoryDraw={this.setSiteCategoryDraw}
                />
            </React.Fragment>
        )
    }
}