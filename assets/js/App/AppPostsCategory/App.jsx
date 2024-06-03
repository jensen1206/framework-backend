import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import PostCategoryTable from "./Sections/PostCategoryTable";
import PostCategoryModal from "./Sections/PostCategoryModal";

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import PostCategoryDetails from "./Sections/PostCategoryDetails";
import PostFormBuilder from "./Sections/PostFormBuilder";
import AlertMsg from "../AppComponents/AlertMsg";
const v5NameSpace = '61c7afb8-3e8a-475e-a428-8c8c2ffc2360';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            catId: '',
            postCategoryDraw: false,
            alertShow: false,
            alertVariant: 'danger',
            alert: {
               title: '',
               msg: ''
            },
            showCatTable: true,
            showCatDetails: false,
            showBuilder: false,
            showCategoryModal: false,
            getFormBuilderData: false,
            builderSelect: [],
            selectHeader: [],
            selectFooter: [],
            builderType: '',
            formBuilder: null,
            category: {},
            catSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.setPostCategoryDraw = this.setPostCategoryDraw.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.sortableCallback = this.sortableCallback.bind(this);
        this.onToggleCategoryCollapse = this.onToggleCategoryCollapse.bind(this);
        this.setShowCategoryModal = this.setShowCategoryModal.bind(this);
        this.onSetCategory = this.onSetCategory.bind(this);
        this.onAlertShow = this.onAlertShow.bind(this);
        this.onUpdateFooterHeader = this.onUpdateFooterHeader.bind(this);


        this.addFormBuilderSelect = this.addFormBuilderSelect.bind(this);
        this.onSetFormBuilderData = this.onSetFormBuilderData.bind(this);
        this.onSetBuilder = this.onSetBuilder.bind(this);

    }

    addFormBuilderSelect(id, label) {
        this.setState({
            builderSelect: [...this.state.builderSelect, {
                id: id,
                label: label
            }]
        })
    }
    onAlertShow(state){
        this.setState({
            alertShow: state
        })
    }

    onSetBuilder(id) {
     /*   this.setState({
            formBuilder: id,
            getFormBuilderData: true
        })*/

        let formData = {
            'method': 'update_category_builder',
            'type': this.state.builderType,
            'id': id,
            'cat_id': this.state.catId
        }

        this.sendAxiosFormdata(formData).then()
    }

    onSetFormBuilderData(state) {
        this.setState({
            getFormBuilderData: state
        })
    }

    setShowCategoryModal(state) {
        this.setState({
            showCategoryModal: state
        })
    }

    setPostCategoryDraw(state, toggle = false) {
        this.setState({
            postCategoryDraw: state
        })

        if (toggle) {
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
        if (type === 'title') {
            let formData = {
                'method': 'urlizer_slug',
                'post': e
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
                'method': 'update_post_category',
                'category': JSON.stringify(_this.state.category),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onUpdateFooterHeader(e, type) {

     let upd = this.state.category;
     upd[type] = e;
     this.setState({
         category: upd
     })

        let formData = {
            'method': 'set_header_footer_builder',
            'category': JSON.stringify(this.state.category),
            'id': this.state.catId
        }

        this.sendAxiosFormdata(formData).then()
    }

    onToggleCategoryCollapse(target, draw = false) {
        let table = false;
        let details = false;
        let builder = false;
        switch (target) {
            case 'table':
                table = true;
                break;
            case 'details':
                details = true;
                break;
            case 'builder':
                builder = true;
                break;
        }

        this.setState({
            showCatTable: table,
            showCatDetails: details,
            showBuilder: builder,
            postCategoryDraw: draw,
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

    async sendAxiosFormdata(formData, isFormular = false, url = postSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, postSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_post_category':
                            if (data.status) {
                                this.setState({
                                    category: data.record
                                })
                                this.onToggleCategoryCollapse('details')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_post_category':
                            AppTools.swalAlertMsg(data);
                            if (data.status) {
                                this.setState({
                                    postCategoryDraw: true
                                })
                            }
                            break;
                        case 'update_post_category':
                            this.setState({
                                catSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'urlizer_slug':
                            if (data.status) {
                                let upd = this.state.category;
                                upd['slug'] = data.slug;
                                this.setState({
                                    category: upd
                                })
                            }
                            break;
                        case 'add_category_seo':
                            if (data.status) {
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
                        case 'get_category_design':
                            if (data.status) {
                                this.setState({
                                    builderSelect: data.builder_select,
                                    builderType: data.builder_type,
                                    formBuilder: data.builder,
                                    category: data.category,
                                    selectHeader: data.select_header,
                                    selectFooter: data.select_footer,
                                    getFormBuilderData: true,
                                    catId: data.id
                                })
                                this.onToggleCategoryCollapse('builder')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_category_builder':
                             if(data.status){
                                 this.setState({
                                     alertShow: false,
                                     formBuilder: data.id,
                                     getFormBuilderData: true
                                 })
                             } else {
                                 if(data.show_alert) {
                                     this.setState({
                                         alertShow: true,
                                         alert: {
                                             title: data.title,
                                             msg: data.msg
                                         },
                                     })
                                 } else {
                                     AppTools.warning_message(data.msg)
                                 }

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
                    {trans['Post categories']}
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
                        <PostCategoryTable
                            postCategoryDraw={this.state.postCategoryDraw}
                            setPostCategoryDraw={this.setPostCategoryDraw}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            sortableCallback={this.sortableCallback}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.showCatDetails}>
                    <div id={uuidv5('collapseCatDetails', v5NameSpace)}>
                        <PostCategoryDetails
                            category={this.state.category}
                            spinner={this.state.catSpinner}
                            onToggleCategoryCollapse={this.onToggleCategoryCollapse}
                            onSetCategory={this.onSetCategory}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.showBuilder}>
                    <div id={uuidv5('collapseBuilder', v5NameSpace)}>
                        {this.state.alertShow ?
                        <div className="mb-3">
                            <AlertMsg
                               alert={this.state.alert}
                               alertShow={this.state.alertShow}
                               alertVariant={this.state.alertVariant}
                               onAlertShow={this.onAlertShow}
                            />
                        </div>: ''}
                        <PostFormBuilder
                            onSetBuilder={this.onSetBuilder}
                            addFormBuilderSelect={this.addFormBuilderSelect}
                            onSetFormBuilderData={this.onSetFormBuilderData}
                            onToggleCategoryCollapse={this.onToggleCategoryCollapse}
                            onSetCategory={this.onSetCategory}
                            onUpdateFooterHeader={this.onUpdateFooterHeader}
                            builderSelect={this.state.builderSelect}
                            selectHeader={this.state.selectHeader}
                            selectFooter={this.state.selectFooter}
                            builderType={this.state.builderType}
                            formBuilder={this.state.formBuilder}
                            category={this.state.category}
                            getFormBuilderData={this.state.getFormBuilderData}
                            catId={this.state.catId}
                        />
                    </div>
                </Collapse>
                <PostCategoryModal
                    showCategoryModal={this.state.showCategoryModal}
                    onToggleCategoryCollapse={this.onToggleCategoryCollapse}
                    setShowCategoryModal={this.setShowCategoryModal}
                    setSiteCategoryDraw={this.setPostCategoryDraw}
                />
            </React.Fragment>
        )
    }
}