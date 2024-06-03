import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import Form from "react-bootstrap/Form";
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import MenuSelects from "./Items/MenuSelects";
import MenuTree from "./Items/MenuTree";
import MenuEditCatForm from "./Items/MenuEditCatForm";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse"
import MenuRecursive from "./Items/MenuRecursive";
const v5NameSpace = 'c867d71a-d8c6-492e-8d8e-0746c628177f';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MenuDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.formUpdTimeOut = '';
        this.state = {
            selects: [],
            menu: {},
            groups: [],
            editGroup: {},
            selectSites: [],
            selectPosts: [],
            individuellMenu: {},
            settings: {},
            resetSelect: false,
            colMenuStructure: true,
            colMenuEdit: false,
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }
        this.getMenuData = this.getMenuData.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.setSelectSites = this.setSelectSites.bind(this);
        this.resetSelectSites = this.resetSelectSites.bind(this);
        this.setSelectPosts = this.setSelectPosts.bind(this);
        this.resetSelectPosts = this.resetSelectPosts.bind(this);

        this.setSelectedMenu = this.setSelectedMenu.bind(this);
        this.setIndividuellMenu = this.setIndividuellMenu.bind(this);
        this.addIndividuellMenu = this.addIndividuellMenu.bind(this);
        this.onSetResetSelect = this.onSetResetSelect.bind(this);
        this.onSetMenuGroup = this.onSetMenuGroup.bind(this);
        this.onToggleCollapseMenu = this.onToggleCollapseMenu.bind(this);
        this.onSetMenuCategory = this.onSetMenuCategory.bind(this);
        this.onSetMenuCategorySettings = this.onSetMenuCategorySettings.bind(this);

        this.setSpinner = this.setSpinner.bind(this);
        this.onUpdatePermalinks = this.onUpdatePermalinks.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadDetails) {
            this.getMenuData();
            this.onToggleCollapseMenu('structure')
            this.props.setLoadDetails(false, this.props.id)
        }
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

    onUpdatePermalinks() {
        let formData = {
            'method': 'update_permalinks',
            'id': this.props.id
        }
        this.sendAxiosFormdata(formData).then()
    }

    onToggleCollapseMenu(target) {
        let structure = false;
        let edit = false;
        switch (target) {
            case 'structure':
                structure = true;
                break;
            case 'edit':
                edit = !this.state.colMenuEdit;
                structure= this.state.colMenuEdit
                break;
        }

        this.setState({
            colMenuStructure: structure,
            colMenuEdit: edit
        })
    }

    onSetResetSelect(state) {
        this.setState({
            resetSelect: state
        })
    }

    resetSelectSites() {
        this.setState({
            selectSites: []
        })
    }

    setSelectSites(e, ids, id, type) {
        let upd;
        if (e) {
            upd = [...this.state.selectSites, {
                id: id,
                ids: ids,
                type: type
            }]
        } else {
            upd = this.filterArrayElementById([...this.state.selectSites], id)
        }

        sleep(400).then(() => {
            this.setState({
                selectSites: upd
            })
        })
    }

    setSelectPosts(e, ids, id, type) {
        let upd;
        if (e) {
            upd = [...this.state.selectPosts, {
                id: id,
                ids: ids,
                type: type
            }]
        } else {
            upd = this.filterArrayElementById([...this.state.selectPosts], id)
        }

        sleep(400).then(() => {
            this.setState({
                selectPosts: upd
            })
        })

    }

    resetSelectPosts() {
        this.setState({
            selectPosts: []
        })
    }

    getMenuData() {
        let formData = {
            'method': 'get_menu_details',
            'id': this.props.id
        }
        this.setState({
            selectSites: [],
            groups: []
        })
        sleep(400).then(() => {

            this.sendAxiosFormdata(formData).then()
        })

    }

    setSelectedMenu(type) {
        let menuData = [];
        switch (type) {
            case 'site':
            case 'category':
                menuData = this.state.selectSites
                break;
            case 'individuell':

                break;
            case 'post':
            case 'post-category':
                menuData = this.state.selectPosts
                break;

        }
        if (!menuData.length) {
            return false;
        }
        let formData = {
            'method': 'add_app_menu',
            'menu_id': this.props.id,
            'type': type,
            'menu_data': JSON.stringify(menuData)
        }
        this.sendAxiosFormdata(formData).then()
    }

    setIndividuellMenu(e, type) {
        let upd = this.state.individuellMenu;
        upd[type] = e;
        this.setState({
            individuellMenu: upd
        })
    }

    addIndividuellMenu() {
        let formData = {
            'method': 'add_individuell_menu',
            'menu_id': this.props.id,
            'menu_data': JSON.stringify(this.state.individuellMenu)
        }
        this.sendAxiosFormdata(formData).then()
    }


    onSetMenuGroup(state) {
        this.setState({
            groups:state
        })
    }

    onSetMenuCategory(e, type) {
        let updMenu = this.state.menu;
        updMenu[type] = e;
        this.setState({
            menu: updMenu
        })
        if (type === 'title') {
            let formData = {
                'method': 'make_slug',
                'title': e
            }
            this.sendAxiosFormdata(formData).then()
        }
    }

    onSetMenuCategorySettings(e, type) {
        let upd = this.state.settings;
        upd[type] = e;
        this.setState({
            settings: upd
        })
    }


    setSpinner(show, msg, status) {
        this.setState({
            spinner: {
                showAjaxWait: show,
                ajaxMsg: msg,
                ajaxStatus: status
            }
        })
    }


    async sendAxiosFormdata(formData, isFormular = false, url = menuSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, menuSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_menu_details':
                            if (data.status) {
                                this.setState({
                                    selects: data.selects,
                                    groups: data.record,
                                    menu: data.menu,
                                    settings: data.settings,
                                    editGroup: {}
                                })

                                this.props.onToggleCollapse('details')
                            }
                            break;
                        case 'add_app_menu':
                            if (data.status) {
                                this.setState({
                                    selectSites: [],
                                    selectPosts: [],
                                    resetSelect: true,
                                    groups: data.record
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'make_slug':
                            let upd = this.state.menu;
                            upd['slug'] = data.slug;
                            this.setState({
                                menu: upd
                            })
                            break;
                        case 'update_menu':
                            if (data.status) {
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;

                        case 'delete_app_menu':
                            AppTools.swalAlertMsg(data)
                            if (data.status) {
                                this.setState({
                                    groups: data.record
                                })
                            }
                            break;
                        case 'add_individuell_menu':
                            if (data.status) {
                                this.setState({
                                    individuellMenu: {},
                                    groups: data.record
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_permalinks':
                            if (data.status) {
                                AppTools.success_message(data.msg)
                                this.setState({
                                    groups: data.record
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'sortable_menu':
                                if(data.status) {
                                    this.setState({
                                        groups: data.record
                                    })
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
                <div className="d-flex align-items-center">
                    <button
                        onClick={() => this.props.onToggleCollapse('table', true)}
                        className="btn btn-switch-blue me-2 dark btn-sm">
                        <i className="bi bi-reply-all me-2"></i>
                        {trans['back']}
                    </button>
                    <button
                        onClick={this.onUpdatePermalinks}
                        className="btn btn-warning-custom dark btn-sm">
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        {trans['menu']['Update permalinks']}
                    </button>
                    <div className="ms-auto">
                        <div
                            className={`ajax-spinner text-muted ${this.state.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                        <small>
                            <SetAjaxResponse
                                status={this.state.spinner.ajaxStatus}
                                msg={this.state.spinner.ajaxMsg}
                            />
                        </small>
                    </div>
                </div>
                <hr/>
                <div
                    className="text-center d-flex align-items-center justify-content-center position-relative fs-5 text-muted mb-3">
                    <div onClick={() => this.onToggleCollapseMenu('edit')}
                         className="cursor-pointer d-inline-block hover-scale min"> {this.state.menu.title || ''}
                        <i className="bi bi-gear text-blue ms-2"></i>
                    </div>
                    <div className="position-absolute end-0 small-lg fw-normal">
                        <div className={`text-${this.state.menu.active ? 'green' : 'danger'}`}>
                            {this.state.menu.active ? trans['active'] : trans['Not active']}
                        </div>
                    </div>
                </div>
                <Collapse in={this.state.colMenuStructure}>
                    <div id={uuidv5('collapseMenuStructure', v5NameSpace)}>
                        <Card className="shadow-sm">
                            <CardBody>
                                <Row className="g-3 align-items-stretch">
                                    <Col xs={12} xxl={3} xl={5} lg={6}>
                                        <div className="fs-6 mb-2">{trans['system']['Add menu items']}</div>
                                        <MenuSelects
                                            selects={this.state.selects}
                                            resetSelect={this.state.resetSelect}
                                            individuellMenu={this.state.individuellMenu}
                                            setIndividuellMenu={this.setIndividuellMenu}
                                            addIndividuellMenu={this.addIndividuellMenu}
                                            setSelectSites={this.setSelectSites}

                                            setSelectPosts={this.setSelectPosts}

                                            sendAxiosFormdata={this.sendAxiosFormdata}
                                            resetSelectSites={this.resetSelectSites}
                                            setSelectedMenu={this.setSelectedMenu}
                                            onSetResetSelect={this.onSetResetSelect}
                                        />
                                    </Col>
                                    <Col xs={12} xxl={9} xl={7} lg={6}>
                                        <div className="fs-6 mb-2">{trans['system']['Menu structure']}</div>
                                        <MenuRecursive
                                            groups={this.state.groups}
                                            id={this.props.id}
                                            editGroup={this.state.editGroup}
                                            sendAxiosFormdata={this.sendAxiosFormdata}
                                            onSetMenuGroup={this.onSetMenuGroup}
                                            setSpinner={this.setSpinner}
                                        />
                                        {/*}  <MenuTree
                                            groups={this.state.groups}
                                            id={this.props.id}
                                            editGroup={this.state.editGroup}
                                            sendAxiosFormdata={this.sendAxiosFormdata}
                                            onSetMenuGroup={this.onSetMenuGroup}
                                            setSpinner={this.setSpinner}

                                        /> {*/}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </div>
                </Collapse>
                <Collapse in={this.state.colMenuEdit}>
                    <div id={uuidv5('collapseMenuEdit', v5NameSpace)}>
                        <Card className="shadow-sm">
                            <CardBody>
                                <MenuEditCatForm
                                    menu={this.state.menu}
                                    selects={this.state.selects}
                                    settings={this.state.settings}
                                    onSetMenuCategory={this.onSetMenuCategory}
                                    sendAxiosFormdata={this.sendAxiosFormdata}
                                    onToggleCollapseMenu={this.onToggleCollapseMenu}
                                    onSetMenuCategorySettings={this.onSetMenuCategorySettings}
                                />
                            </CardBody>
                        </Card>
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}