import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'


const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import PostTable from "./sections/PostTable";
import AddPostModal from "./sections/AddPostModal";
import SiteSeo from "../AppSites/Sections/SiteSeo";
import PostDetails from "./sections/PostDetails";
const v5NameSpace = 'c21db5fa-2d43-4af1-b660-0f5e39eb6a83';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            seo: {},
            site: {},
            xCardTypesSelect: [],
            ogTypesSelect: [],
            builderActive: true,
            galleryActive:false,
            categorySelect: [],
            postLayoutSelect: [],
            selectHeader: [],
            selectFooter: [],
            showAddPostModal: false,
            colTable: true,
            colEdit: false,
            colSeo: false,
            drawTable: false,
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

        this.onSetDrawTable = this.onSetDrawTable.bind(this);
        this.setToggleCollapse = this.setToggleCollapse.bind(this);
        this.onSetCategorySelect = this.onSetCategorySelect.bind(this);
        this.sortableCallback = this.sortableCallback.bind(this);
        this.setShowAddPostModal = this.setShowAddPostModal.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onSetSiteSeo = this.onSetSiteSeo.bind(this);
        this.onSetPost = this.onSetPost.bind(this);
        this.onToggleBuilder = this.onToggleBuilder.bind(this);
        this.onSetGallerySortable = this.onSetGallerySortable.bind(this);

    }

    onToggleBuilder(target){
        let builder = false;
        let gallery = false;
        switch (target){
            case 'builder':
                  builder = true;
                break;
            case 'gallery':
                  gallery = true;
                break;
        }

        this.setState({
            builderActive: builder,
            galleryActive: gallery,
        })
    }

    onSetDrawTable(state){
        this.setState({
            drawTable: state
        })
    }
    onSetCategorySelect(cat) {
        this.setState({
            categorySelect: cat
        })
    }

    setShowAddPostModal(state) {
        this.setState({
            showAddPostModal: state
        })
    }

    sortableCallback(list){
        let formData = {
            'method': 'set_site_position',
            'ids': JSON.stringify(list),
        }

        this.sendAxiosFormdata(formData).then()
    }

    onSetPost(e, type) {

        let upd = this.state.site;
        upd[type] = e;
        this.setState({
            site: upd,
            spinner: {
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
                'method': 'update_post',
                'site': JSON.stringify(_this.state.site),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onSetGallerySortable(state) {
        let upd = this.state.site;
        upd['postGallery'] = state;
        this.setState({
            site: upd
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
    setToggleCollapse(target, draw = false){
        let table= false;
        let details = false;
        let seo = false;
        switch (target) {
            case 'table':
                  table = true;
                break;
            case 'details':
                details = true;
                break;
            case 'seo':
                 seo = true;
                break;
        }

        this.setState({
            colTable: table,
            colEdit: details,
            colSeo: seo,
            drawTable: draw
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
                        case 'get_site':
                            if (data.status) {
                                this.setState({
                                    categorySiteSelect: data.category_selects,
                                    xCardTypesSelect: data.xCardTypesSelect,
                                    ogTypesSelect: data.ogTypesSelect,
                                    selectHeader: data.select_header,
                                    selectFooter: data.select_footer,
                                    postLayoutSelect: data.select_post_design,
                                    selectSiteStatus: data.selectSiteStatus,
                                    site: data.site,
                                    seo: data.seo,
                                })
                                this.onToggleBuilder('builder')
                                switch (data.handle) {
                                    case 'seo':
                                        this.setToggleCollapse('seo')
                                        break;
                                    case 'site':

                                        this.setToggleCollapse('details')
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
                        case 'delete_post':
                              if(data.status){
                                this.setState({
                                    drawTable: true
                                })
                              }
                              AppTools.swalAlertMsg(data)
                            break;
                        case 'update_post':
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
        return(
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['posts']['Posts']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <div className="d-flex align-items-center">
                    <button
                        onClick={() => this.setShowAddPostModal(true)}
                        className="btn btn-success-custom dark">
                        <i className="bi bi-node-plus me-2"></i>
                        {trans['posts']['Create new post']}
                    </button>
                    <div className="ms-auto">

                    </div>
                </div>
                <hr/>
                <Collapse in={this.state.colTable}>
                    <div id={uuidv5('collapsePostTable', v5NameSpace)}>
                        <PostTable
                            drawTable={this.state.drawTable}
                            categorySelect={this.state.categorySelect}
                            onSetDrawTable={this.onSetDrawTable}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            sortableCallback={this.sortableCallback}
                            onSetCategorySelect={this.onSetCategorySelect}
                            onSetSiteSeo={this.onSetSiteSeo}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colSeo}>
                    <div id={uuidv5('collapseSeo', v5NameSpace)}>
                        <SiteSeo
                            seo={this.state.seo}
                            xCardTypesSelect={this.state.xCardTypesSelect}
                            ogTypesSelect={this.state.ogTypesSelect}
                            spinner={this.state.spinner}
                            onSetSiteSeo={this.onSetSiteSeo}
                            onToggleSiteCollapse={this.setToggleCollapse}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colEdit}>
                    <div id={uuidv5('collapseDetails', v5NameSpace)}>
                        <PostDetails
                            site={this.state.site}
                            title={this.state.seo.seoTitle}
                            categorySelect={this.state.categorySiteSelect}
                            selectSiteStatus={this.state.selectSiteStatus}
                            postLayoutSelect={this.state.postLayoutSelect}
                            selectHeader={this.state.selectHeader}
                            selectFooter={this.state.selectFooter}
                            spinner={this.state.spinner}
                            builderActive={this.state.builderActive}
                            galleryActive={this.state.galleryActive}
                            onToggleSiteCollapse={this.setToggleCollapse}
                            onSetPost={this.onSetPost}
                            onSetSiteSeo={this.onSetSiteSeo}
                            onToggleBuilder={this.onToggleBuilder}
                            onSetGallerySortable={this.onSetGallerySortable}
                        />
                    </div>
                </Collapse>

                <AddPostModal
                    showAddPostModal={this.state.showAddPostModal}
                    categorySelect={this.state.categorySelect}
                    setShowAddPostModal={this.setShowAddPostModal}
                    setToggleCollapse={this.setToggleCollapse}
                />
            </React.Fragment>
        )
    }
}