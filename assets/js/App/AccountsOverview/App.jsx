import * as React from "react";
import AccountsTable from "./Sections/AccountsTable";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import AccountForm from "../Accounts/AccountForm";
import {isThenable} from "@babel/core/lib/gensync-utils/async";
import * as AppTools from "../AppComponents/AppTools";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const reactSwal = withReactContent(Swal);

const v5NameSpace = 'e3afc68a-5897-4a25-8469-5a2636ffdfb5';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            drawAccountTable: false,
            collapseTable: true,
            collapseEdit: false,
            id: '',
            loadForm: false,
            load_account: false,
            accountLoaded: false,
            formHandle: 'update',
            add_account: false
        }
        this.onSetDrawAccountTable = this.onSetDrawAccountTable.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);

        this.onToggleOvCollapse = this.onToggleOvCollapse.bind(this);
        this.onEditUser = this.onEditUser.bind(this);
        this.onUpdateLoadAccount = this.onUpdateLoadAccount.bind(this);
        this.onAddUser = this.onAddUser.bind(this);
        //Todo Delete User
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        //Manage Account
        this.onSetRoleManage = this.onSetRoleManage.bind(this);


    }

    onEditUser(id) {
        this.setState({
            id: id,
            loadForm: true,
            accountLoaded: true,
            formHandle: 'update',
            load_account: this.state.accountLoaded
        })

        this.onToggleOvCollapse('edit')
    }

    onAddUser() {
        this.setState({
            id: '',
            loadForm: true,
            accountLoaded: true,
            formHandle: 'insert',
            load_account: this.state.accountLoaded
        })

        this.onToggleOvCollapse('edit')
    }

    onUpdateLoadAccount(state) {
        this.setState({
            load_account: state
        })
    }

    onSetRoleManage(state){
        this.setState({
            add_account:state
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

    onToggleOvCollapse(target, drawTable = false) {

        let table = true;
        let edit = false;

        switch (target) {
            case 'table':
                table = true;
                edit = false;
                break;
            case 'edit':
                table = false;
                edit = true;
                break;
        }

        this.setState({
            drawAccountTable: drawTable,
            collapseTable: table,
            collapseEdit: edit,
        })
    }

    onSetDrawAccountTable(state) {
        this.setState({
            drawAccountTable: state
        })
    }

    async sendAxiosFormdata(formData, url = accountSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, false, accountSettings))
                .then(({data = {}} = {}) => {
                    if (data.status) {
                        this.setState({
                            drawAccountTable:true
                        })
                    }
                })
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['profil']['Registered users']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <Collapse in={this.state.collapseTable}>
                    <div id={uuidv5('collapseTable', v5NameSpace)}>
                        {this.state.add_account ? (
                        <button
                            onClick={this.onAddUser}
                            className="btn btn-success-custom dark">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['profil']['Add new user']}
                        </button>) : ''}
                        <hr/>
                        <AccountsTable
                            drawAccountTable={this.state.drawAccountTable}
                            onSetDrawAccountTable={this.onSetDrawAccountTable}
                            onEditUser={this.onEditUser}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            onSetRoleManage={this.onSetRoleManage}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.collapseEdit}>
                    <div id={uuidv5('collapseEdit', v5NameSpace)}>
                        <button
                            onClick={() => this.onToggleOvCollapse('table', true)}
                            className="btn btn-success-custom dark">
                            <i className="bi bi-reply-all me-2"></i>
                            {trans['to overview']}
                        </button>
                        <hr/>
                        {this.state.loadForm ? (
                            <div className="container">
                                <AccountForm
                                    id={this.state.id || ''}
                                    type={"edit"}
                                    handle={this.state.formHandle}
                                    load_account={this.state.load_account}
                                    onUpdateLoadAccount={this.onUpdateLoadAccount}
                                    onToggleOvCollapse={this.onToggleOvCollapse}
                                />
                            </div>
                        ) : ''}
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}