import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import AddMenuModal from "./Sections/AddMenuModal";
import MenuTable from "./Sections/MenuTable";
import MenuDetails from "./Sections/MenuDetails";
const v5NameSpace = '6b73cbb5-7182-4f64-88b7-1d51a1bbe70d';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            id:'',
            showMenuTable: true,
            showMenuDetails: false,
            menuTableDraw: false,
            getAddModal: false,
            loadDetails: false,
        }

        this.onSetGetAddModal = this.onSetGetAddModal.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.setMenuTableDraw = this.setMenuTableDraw.bind(this);
        this.sortableMenuTableCallback = this.sortableMenuTableCallback.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.setLoadDetails = this.setLoadDetails.bind(this);



    }

    setMenuTableDraw(state) {
        this.setState({
            menuTableDraw: state
        })
    }

    setLoadDetails(state, id=null) {
        this.setState({
            id: id,
            loadDetails: state
        })
    }

    sortableMenuTableCallback(options) {
        let formData = {
            'method': 'set_menu_position',
            'ids': JSON.stringify(options),
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSetGetAddModal(state) {
        this.setState({
            getAddModal: state
        })
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
            showMenuTable: table,
            showMenuDetails: details,
            menuTableDraw: draw,
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

    async sendAxiosFormdata(formData, isFormular = false, url = menuSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, menuSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'add_menu':
                        case 'delete_menu':
                            AppTools.swalAlertMsg(data)
                            if (data.status) {
                                this.setState({
                                    menuTableDraw: true
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
                    {trans['system']['Page menu']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                {menuSettings.add_menu ?
                    <button
                        onClick={() => this.setState({getAddModal: true})}
                        className="btn btn-success-custom ms-auto dark">
                        <i className="bi bi-node-plus me-2"></i>
                        {trans['system']['Add menu']}
                    </button> : ''}
                <hr/>

                <Collapse in={this.state.showMenuTable}>
                    <div id={uuidv5('collapseMenuTable', v5NameSpace)}>
                        <MenuTable
                            menuTableDraw={this.state.menuTableDraw}
                            setMenuTableDraw={this.setMenuTableDraw}
                            sortableMenuTableCallback={this.sortableMenuTableCallback}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            setLoadDetails={this.setLoadDetails}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.showMenuDetails}>
                    <div id={uuidv5('collapseMenuDetails', v5NameSpace)}>
                        <MenuDetails
                            loadDetails={this.state.loadDetails}
                            id={this.state.id}
                            setLoadDetails={this.setLoadDetails}
                            onToggleCollapse={this.onToggleCollapse}
                        />

                    </div>
                </Collapse>
                <AddMenuModal
                    getAddModal={this.state.getAddModal}
                    onSetGetAddModal={this.onSetGetAddModal}
                    sendAxiosFormdata={this.sendAxiosFormdata}

                />
            </React.Fragment>
        )
    }
}