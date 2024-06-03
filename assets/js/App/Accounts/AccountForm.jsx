import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import * as AppTools from "../AppComponents/AppTools";
import SectionAccount from "./Sections/SectionAccount";
import Form from "react-bootstrap/Form";
import Section2FA from "./Sections/Section2FA";
import SectionApi from "./Sections/SectionApi";
import SectionUserConsent from "./Sections/SectionUserConsent";
import Collapse from 'react-bootstrap/Collapse';
import SectionOauth from "./Sections/SectionOauth";
import SectionGravatar from "./Sections/SectionGravatar";
import SectionAuthorisation from "./Sections/SectionAuthorisation";
import {v5 as uuidv5} from 'uuid';
import {v4 as uuidv4} from "uuid";
import AlertMsg from "../AppComponents/AlertMsg";
import SetAjaxResponse from "../AppComponents/SetAjaxResponse";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const reactSwal = withReactContent(Swal);

const v5NameSpace = 'd7404aa8-a686-11ee-94ee-325096b39f47';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class AccountForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.formAccount = React.createRef();
        this.oAuthAccount = React.createRef();
        this.accountUpdTimeOut = '';
        this.state = {
            ajaxStatus: false,
            ajaxMsg: '',
            showAjayWait: false,
            collapseEdit: true,
            collapse2Fa: false,
            collapseApi: false,
            collapseApiOAuth: false,
            collapseUserConsent: false,
            collapseAdminBerechtigung: false,
            collapseGravatar: false,
            accountValidated: false,
            oauthValidated: false,
            alertShow: false,
            disabledBtnAuth: false,
            isChangeRole: false,
            alert: {
                title: trans['Error'],
                msg: ''
            },
            alertVariant: 'danger',
            data2Fa: {},
            dataApi: {},
            account: {},
            oAuth: {},
            accountHolder: {},
            grands: [],
            redirectUris: [],
            scopes: [],
            voter: [],
            su: false,
            admin: false,
            isNotUser: true,
            user: 0,
            accountEdits: {
                account_show: false,
                account_edit: false,
                edit_roles: false,
                account_delete: false,
                manage_api: false,
                edit_grants: false,
                manage_account: false,
                manage_authorisation: false,
            },
            selects: {
                grand: [],
                roles: [],
                scopes: [],
                gravatar: []
            }
        }
        this.getAccountData = this.getAccountData.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

        //Todo Update States
        this.onUpdateAccounts = this.onUpdateAccounts.bind(this);
        this.onUpdateAccountHolder = this.onUpdateAccountHolder.bind(this);
        this.onUpdateOAuth = this.onUpdateOAuth.bind(this);
        this.onUpdateGrants = this.onUpdateGrants.bind(this);
        this.onUpdateUserRole = this.onUpdateUserRole.bind(this);
        this.onUpdateRedirectUrl = this.onUpdateRedirectUrl.bind(this);
        this.onUpdateScope = this.onUpdateScope.bind(this);
        this.onUpdateGravatar = this.onUpdateGravatar.bind(this);
        this.onUpdateVoter = this.onUpdateVoter.bind(this);
        this.onUpdateSetUserRole = this.onUpdateSetUserRole.bind(this);


        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onAlertShow = this.onAlertShow.bind(this);

        //Todo Get 2FA Data
        this.onGet2FaData = this.onGet2FaData.bind(this);
        //Todo Get API Data
        this.onGetApiData = this.onGetApiData.bind(this);
        //Todo Submit Forms
        this.handleAccountSubmit = this.handleAccountSubmit.bind(this);
        this.handleOAuthSubmit = this.handleOAuthSubmit.bind(this);
        //TODO Update AutoSave Account
        this.handleUpdateAccount = this.handleUpdateAccount.bind(this);
        //TODO Update AutoSave OAuth
        this.onUpdateHandleOauth = this.onUpdateHandleOauth.bind(this);
        //Todo Swal Delete
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);


    }

    componentDidMount() {
        this.getAccountData();
    }

    componentWillUnmount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.load_account) {
            this.getAccountData();
            this.setState({
                collapse2Fa: false,
                collapseApi: false,
                collapseAdminBerechtigung: false,
                collapseGravatar: false,
                collapseEdit: true,
                collapseApiOAuth: false,
                collapseUserConsent: false,
                ajaxStatus: false,
                ajaxMsg: '',
                showAjayWait: false,
                isChangeRole: false
            })
            this.props.onUpdateLoadAccount(false)
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

    onAlertShow(state) {
        this.setState({
            alertShow: state
        })
    }

    onUpdateAccounts(e, type) {
        let upd = this.state.account;
        upd[type] = e;
        this.setState({
            account: upd
        })
        if(this.state.account.id){
            this.handleUpdateAccount()
        }
    }

    onUpdateAccountHolder(e, type) {
        let upd = this.state.accountHolder;
        upd[type] = e;
        this.setState({
            accountHolder: upd
        })

        if(this.state.account.id){
            this.handleUpdateAccount()
        }
    }

    onUpdateOAuth(e, type) {
        let upd = this.state.oAuth
        upd[type] = e;
        this.setState({
            oAuth: upd
        })

        this.onUpdateHandleOauth();
    }


    onUpdateGrants(id, handle) {
        switch (handle) {
            case 'delete':
                const grantsUpd = [...this.state.grands];
                const find = this.findArrayElementById(grantsUpd, id);
                let selectGrants = this.state.selects.grand
                selectGrants = [
                    ...selectGrants, {
                        id: find.id,
                        label: find.label,
                        value: find.value,
                    }
                ];
                this.state.selects.grand = selectGrants;
                this.setState({
                    selects: this.state.selects,
                    grands: this.filterArrayElementById(grantsUpd, id)
                })

                break;
            case'add':
                const updSelectGrants = [...this.state.selects.grand]
                const findSelect = this.findArrayElementById(updSelectGrants, id);
                this.state.selects.grand = this.filterArrayElementById(updSelectGrants, id);
                this.setState({
                    selects: this.state.selects,
                    grands: [
                        ...this.state.grands, {
                            id: findSelect.id,
                            label: findSelect.label,
                            value: findSelect.value,
                        }
                    ]
                })
                break;
        }
       this.onUpdateHandleOauth()
    }

    onUpdateScope(id, handle) {
        switch (handle) {
            case 'delete':
                const scopeUpd = [...this.state.scopes];
                const find = this.findArrayElementById(scopeUpd, id);
                let selectScopes = this.state.selects.scopes
                selectScopes = [
                    ...selectScopes, {
                        id: find.id,
                        label: find.label,
                        value: find.value,
                    }
                ];
                this.state.selects.scopes = selectScopes;
                this.setState({
                    selects: this.state.selects,
                    scopes: this.filterArrayElementById(scopeUpd, id)
                })

                break;
            case'add':
                const updSelectScopes = [...this.state.selects.scopes]
                const findSelect = this.findArrayElementById(updSelectScopes, id);
                this.state.selects.scopes = this.filterArrayElementById(updSelectScopes, id);
                this.setState({
                    selects: this.state.selects,
                    scopes: [
                        ...this.state.scopes, {
                            id: findSelect.id,
                            label: findSelect.label,
                            value: findSelect.value,
                        }
                    ]
                })
                break;
        }
        this.onUpdateHandleOauth()
    }

    onUpdateUserRole (id, handle) {

        if(this.state.account.id){
            let swal = {
                'title': `${trans['profil']['Change user role']}?`,
                'msg': trans['profil']['After <b><u>saving</u></b>, all authorisations are reset and must be reassigned.'],
                'btn': trans['profil']['Change user role']
            }
            let formData = {
                'id': id,
                'handle': handle,
            }

            this.onDeleteSwalHandle(formData, swal, 'role');
        } else {
            this.onUpdateSetUserRole(id, handle)
        }
    }

    onUpdateSetUserRole(id, handle) {
        switch (handle) {
            case 'delete':
                const roleUpd = [...this.state.accountHolder.roles];
                const findRole = this.findArrayElementById(roleUpd, id);

                if (findRole.value === 'ROLE_ADMIN') {
                    this.setState({
                        isNotUser: false
                    })
                }
                this.state.selects.roles = [
                    ...this.state.selects.roles, {
                        id: findRole.id,
                        label: findRole.label,
                        value: findRole.value,
                    }
                ];
                this.state.accountHolder.roles = this.filterArrayElementById(roleUpd, id);
                this.setState({
                    accountHolder: this.state.accountHolder,
                    selects: this.state.selects,
                })
                break;
            case 'add':
                let userRoles = [...this.state.accountHolder.roles]
                const updSelectRoles = [...this.state.selects.roles]
                const findSelect = this.findArrayElementById(updSelectRoles, id);
                this.state.selects.roles = this.filterArrayElementById(updSelectRoles, id);
                if (findSelect.value === 'ROLE_ADMIN') {
                    this.setState({
                        isNotUser: true,
                    })
                }
                userRoles = [
                    ...userRoles, {
                        id: findSelect.id,
                        label: findSelect.label,
                        value: findSelect.value,
                    }
                ];
                this.state.accountHolder.roles = userRoles;
                this.setState({
                    accountHolder: this.state.accountHolder,
                })
                break;
        }
        this.setState({
            isChangeRole: true
        })
        this.handleUpdateAccount()
    }

    onUpdateRedirectUrl(e, handle, id = '') {
        const updRedirect = [...this.state.redirectUris]
        switch (handle) {
            case 'update':
                const findUpdRedirect = this.findArrayElementById(updRedirect, id);
                findUpdRedirect.value = e;
                this.setState({
                    redirectUris: updRedirect
                })
                break;
            case 'add':
                this.setState({
                    redirectUris: [
                        ...this.state.redirectUris, {
                            id: uuidv4(),
                            label: trans['system']['Redirect URL'],
                            value: "",
                        }
                    ]
                })
                break;
            case 'delete':
                this.setState({
                    redirectUris: this.filterArrayElementById(updRedirect, id)
                })
                break;
        }
        this.onUpdateHandleOauth()
    }

    onUpdateVoter(e, id) {
        const updVoter = [...this.state.voter];
        const findVoter = this.findArrayElementById(updVoter, id);
        findVoter.aktiv = e;
        // this.state.account.voter = updVoter;
        this.setState({
            voter: updVoter,
            ajaxMsg: '',
            ajaxStatus: false,
            showAjayWait:true
        })
        let _this = this;
        clearTimeout(this.accountUpdTimeOut);
        this.accountUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_voter',
                'id': _this.state.account.id,
                'voter': JSON.stringify(_this.state.voter),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

    }

    getAccountData() {
        let formData = {
            'id': this.props.id,
            'method': 'get_account',
            'handle': this.props.handle,
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGet2FaData() {
        let formData = {
            'method': 'get_2fa_Data',
            'id': this.state.accountHolder.id,
        }
        this.sendAxiosFormdata(formData, false).then()
    }

    onGetApiData() {
        let formData = {
            'method': 'get_api_Data',
            'id': this.state.account.id,
        }
        this.sendAxiosFormdata(formData, false).then()
    }

    onUpdateGravatar(gravatar) {
        this.state.account.gravatar = gravatar;
        this.setState({
            account: this.state.account,
            ajaxStatus: false,
            ajaxMsg: '',
            showAjayWait: true,
        })
        let _this = this;
        clearTimeout(this.accountUpdTimeOut);
        this.accountUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'gravatar_update',
                'id': _this.state.account.id,
                'gravatar': gravatar
            }
            _this.sendAxiosFormdata(formData, false).then()
        }, 1000);

    }

    onToggleCollapse(target) {

        let edit = false;
        let t2fa = false;
        let api = false;
        let apiOAuth = false;
        let userConsent = false;
        let aminBerechtigung = false;
        let gravatar = false;
        switch (target) {
            case 'edit':
                edit = true;
                break;
            case '2fa':
                t2fa = true;
                break;
            case 'api':
                api = true;
                break;
            case 'apiOAuth':
                apiOAuth = true
                break;
            case 'consent':
                userConsent = true;
                break;
            case 'adminEdit':
                aminBerechtigung = true;
                let formData = {
                    'method': 'get_voter',
                    'id': this.state.account.id
                }
                this.sendAxiosFormdata(formData).then()
                break;
            case 'gravatar':
                gravatar = true;
                break;
        }

        this.setState({
            collapseEdit: edit,
            collapse2Fa: t2fa,
            collapseApi: api,
            collapseApiOAuth: apiOAuth,
            collapseUserConsent: userConsent,
            collapseAdminBerechtigung: aminBerechtigung,
            collapseGravatar: gravatar,
            accountValidated: false,
            oauthValidated: false,
            disabledBtnAuth: false,
            ajaxStatus: false,
            ajaxMsg: '',
            showAjayWait: false,
            isChangeRole: false
        })
    }

    handleUpdateAccount() {
        if(!this.state.account.id){
            return false;
        }
        let form = this.formAccount.current;
        if (form.checkValidity() === false) {
            this.setState({
                accountValidated: true
            })
        } else {
            this.setState({
                ajaxMsg: '',
                showAjayWait: true,
            })

            let _this = this;
            clearTimeout(this.accountUpdTimeOut);
            this.accountUpdTimeOut = setTimeout(function () {
                let formData = {
                    'method': 'account_handle',
                    'account': JSON.stringify(_this.state.account),
                    'account_holder': JSON.stringify(_this.state.accountHolder),
                    'handle': 'update',
                    'isChangeRole': _this.state.isChangeRole,
                    'isAdmin': _this.state.isNotUser
                }
                _this.sendAxiosFormdata(formData, false).then()
            }, 1000);
           /* this.accountUpdTimeOut = setTimeout(() =>
                this.sendAxiosFormdata(formData, false), 1000)*/
        }
    }


    handleAccountSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            this.setState({
                accountValidated: true
            })
        } else {

            let formData = {
                'method': 'account_handle',
                'account': JSON.stringify(this.state.account),
                'account_holder': JSON.stringify(this.state.accountHolder),
                'handle': this.state.account.id ? 'update' : 'insert'
            }
            this.sendAxiosFormdata(formData, false).then()
        }
    }

    onUpdateHandleOauth(){
        let form = this.oAuthAccount.current;
        if (form.checkValidity() === false) {
            this.setState({
                oauthValidated: true
            })
        } else {
            this.setState({
                ajaxStatus: false,
                ajaxMsg: '',
                showAjayWait: true,
            })
            let _this = this;
            clearTimeout(this.accountUpdTimeOut);
            this.accountUpdTimeOut = setTimeout(function () {
                let formData = {
                    'method': 'oauth_handle',
                    'user': _this.state.accountHolder.id,
                    'grands': JSON.stringify(_this.state.grands),
                    'oAuth': JSON.stringify(_this.state.oAuth),
                    'redirectUris': JSON.stringify(_this.state.redirectUris),
                    'scopes': JSON.stringify(_this.state.scopes),
                }
                _this.sendAxiosFormdata(formData, false).then()
            }, 1000);
        }
    }
    handleOAuthSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            this.setState({
                oauthValidated: true
            })
        } else {
            let formData = {
                'method': 'oauth_handle',
                'user': this.state.accountHolder.id,
                'grands': JSON.stringify(this.state.grands),
                'oAuth': JSON.stringify(this.state.oAuth),
                'redirectUris': JSON.stringify(this.state.redirectUris),
                'scopes': JSON.stringify(this.state.scopes),
            }
            this.sendAxiosFormdata(formData, false).then()
        }
    }

    onDeleteSwalHandle(formData, swal, type=false) {
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
                if(type){
                    switch (type){
                        case 'role':
                            this.onUpdateSetUserRole(formData.id, formData.handle)
                            break;
                    }
                } else {
                    this.sendAxiosFormdata(formData).then()
                }
            }
        });
    }


    async sendAxiosFormdata(formData, isFormular = false, url = accountSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, accountSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_account':
                            this.setState({
                                accountValidated: false,
                                oauthValidated: false,
                                collapseAdminBerechtigung: false,
                                collapseGravatar: false,
                                collapseEdit: true,
                                collapseApiOAuth: false,
                                collapseUserConsent: false,
                                disabledBtnAuth: false
                            })
                            if (data.status) {
                                this.setState({

                                    alertShow: false,
                                    account: data.record.account,
                                    oAuth: data.record.oAuth,
                                    accountHolder: data.record.accountHolder,
                                    grands: data.record.grands,
                                    //voter: data.record.account.voter,
                                    redirectUris: data.record.redirectUris,
                                    scopes: data.record.scopes,
                                    su: data.record.su,
                                    admin: data.record.admin,
                                    user: data.record.user,
                                    isNotUser: data.record.isNotUser,
                                    accountEdits: {
                                        account_show: data.record.account_show,
                                        account_edit: data.record.account_edit,
                                        edit_roles: data.record.edit_roles,
                                        account_delete: data.record.account_delete,
                                        manage_api: data.record.manage_api,
                                        edit_grants: data.record.edit_grants,
                                        manage_account: data.record.manage_account,
                                        manage_authorisation: data.record.manage_authorisation
                                    },
                                    selects: {
                                        grand: data.record.selects.grand,
                                        roles: data.record.selects.roles,
                                        scopes: data.record.selects.scopes,
                                        gravatar: data.record.selects.gravatar
                                    }
                                })
                            } else {
                                this.setState({
                                    collapseEdit: false,
                                })
                                AppTools.swalAlertMsg(data)
                            }
                            break;
                        case 'get_2fa_Data':
                            if (data.status) {
                                this.setState({
                                    data2Fa: data.record
                                })
                                this.onToggleCollapse('2fa')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'get_api_Data':
                            if (data.status) {
                                this.setState({
                                    dataApi: data.record
                                })
                                this.onToggleCollapse('api')
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'account_handle':
                            this.state.account.sendPwLink = false;
                            this.setState({
                                account: this.state.account,
                                isChangeRole: false
                            })

                            if (data.handle === 'update') {
                                this.setState({
                                    showAjayWait: false,
                                    ajaxStatus: data.status,
                                    ajaxMsg: data.msg
                                })
                            }
                            if (data.status) {
                                this.setState({
                                    alertShow: false,
                                    accountValidated: false,
                                })
                                if (data.handle === 'insert') {
                                    AppTools.swalAlertMsg(data)
                                    this.setState({
                                        account: data.record.account,
                                        oAuth: data.record.oAuth,
                                        accountHolder: data.record.accountHolder,
                                        grands: data.record.grands,
                                        redirectUris: data.record.redirectUris,
                                        scopes: data.record.scopes,
                                        selects: {
                                            grand: data.record.selects.grand,
                                            roles: data.record.selects.roles,
                                            scopes: data.record.selects.scopes,
                                            gravatar: data.record.selects.gravatar
                                        }
                                    })
                                }
                            } else {
                                if (data.pw_error) {
                                    let updHolder = this.state.accountHolder;
                                    updHolder['password'] = '';
                                    updHolder['repeatPassword'] = '';
                                    this.setState({
                                        alertShow: true,
                                        accountHolder: updHolder,
                                        alert: {
                                            msg: data.msg,
                                            title: data.title
                                        }
                                    })
                                }
                                if (data.handle === 'insert') {
                                    AppTools.swalAlertMsg(data)
                                } else {
                                    this.setState({
                                        showAjayWait: false,
                                        ajaxStatus: data.status,
                                        ajaxMsg: data.msg
                                    })
                                }
                            }
                            break;
                        case 'oauth_handle':
                            this.setState({
                                ajaxStatus: data.status,
                                ajaxMsg: data.msg,
                                showAjayWait: false,
                            })
                            if (data.status) {
                                this.setState({
                                    oauthValidated: false,
                                })
                            }
                           // AppTools.swalAlertMsg(data)
                            break;
                        case 'delete_consent':
                            if (data.status) {
                                let updConsent = this.state.oAuth;
                                updConsent.consentExpired = true;
                                updConsent.expires = '';
                                this.setState({
                                    oAuth: updConsent,
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'update_voter':
                        case 'gravatar_update':
                              this.setState({
                                  ajaxStatus: data.status,
                                  ajaxMsg: data.msg,
                                  showAjayWait: false,
                              })
                            break;
                        case 'get_voter':
                            if (data.status) {
                                this.setState({
                                    voter: data.voter
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_user':
                            AppTools.swalAlertMsg(data)
                          if(data.logout){
                              sleep(3000).then(() => {
                                  window.location.href = `${data.logout}`;
                              })
                            } else {
                              this.props.onToggleOvCollapse('table' , true)
                              this.onToggleCollapse('edit')
                          }

                            break;

                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-xxl-10 col-xl-10 col-12 mx-auto">
                    {this.state.account.id ? (
                        <div className="d-flex flex-wrap align-items-center">
                            <ButtonGroup className="mb-2 flex-wrap" aria-label="Basic example">
                                <Button onClick={() => this.onToggleCollapse('edit')}
                                        variant={`switch-blue-outline mb-1 dark ${this.state.collapseEdit ? 'active' : ''}`}>{trans['Account']}</Button>
                                {this.state.accountEdits.manage_api && this.state.account.id ? (
                                    <Button onClick={() => this.onToggleCollapse('apiOAuth')}
                                            variant={`switch-blue-outline mb-1 dark ${this.state.collapseApiOAuth ? 'active' : ''}`}>{trans['profil']['API OAuth2']}</Button>
                                ) : ''}
                                {this.state.oAuth.expires && this.state.accountEdits.manage_api && this.state.user !== this.state.accountHolder.id ? (
                                    <Button onClick={() => this.onToggleCollapse('consent')}
                                            variant={`switch-blue-outline mb-1 dark ${this.state.collapseUserConsent ? 'active' : ''}`}>{trans['profil']['User consent']}</Button>
                                ) : ''}
                                {this.state.accountEdits.manage_authorisation && this.state.accountHolder.id !== this.state.user ? (
                                    <Button onClick={() => this.onToggleCollapse('adminEdit')}
                                            variant={`switch-blue-outline mb-1 dark ${this.state.collapseAdminBerechtigung ? 'active' : ''} ${this.state.disabledBtnAuth ? ' disabled' : ''}`}>{trans['system']['Authorisations']}</Button>
                                ) : ''}

                                <Button onClick={() => this.onToggleCollapse('gravatar')}
                                        variant={`switch-blue-outline mb-1 dark ${this.state.collapseGravatar ? 'active' : ''}`}>{trans['profil']['Gravatar']}</Button>
                            </ButtonGroup>
                            <div className="ms-3 mb-3">
                                <div
                                    className={`ajax-spinner text-muted ${this.state.showAjayWait ? 'wait' : ''}`}></div>
                                <SetAjaxResponse
                                    status={this.state.ajaxStatus}
                                    msg={this.state.ajaxMsg}
                                />
                            </div>
                        </div>
                    ) : ''}
                    <Collapse in={this.state.collapseEdit}>
                        <div id={uuidv5('collapseEdit', v5NameSpace)}>
                            <Form ref={this.formAccount} noValidate validated={this.state.accountValidated}
                                  onSubmit={this.handleAccountSubmit}
                                  id={uuidv5('editForm', v5NameSpace)}>
                                <SectionAccount
                                    su={this.state.su}
                                    user={this.state.user}
                                    account={this.state.account}
                                    oAuth={this.state.oAuth}
                                    accountHolder={this.state.accountHolder}
                                    selects={this.state.selects}
                                    accountEdits={this.state.accountEdits}
                                    handle={this.props.handle}
                                    formId={uuidv5('editForm', v5NameSpace)}
                                    sendAxiosFormdata={this.sendAxiosFormdata}
                                    onUpdateAccountHolder={this.onUpdateAccountHolder}
                                    onUpdateAccounts={this.onUpdateAccounts}
                                    onToggleCollapse={this.onToggleCollapse}
                                    onGet2FaData={this.onGet2FaData}
                                    onGetApiData={this.onGetApiData}
                                    onUpdateUserRole={this.onUpdateUserRole}
                                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                                />
                                <AlertMsg
                                    alertShow={this.state.alertShow}
                                    alertVariant={this.state.alertVariant}
                                    onAlertShow={this.onAlertShow}
                                    alert={this.state.alert}
                                />
                            </Form>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.collapseApiOAuth}>
                        <div id={uuidv5('collapseApiOAuth', v5NameSpace)}>
                            <Form ref={this.oAuthAccount} noValidate validated={this.state.oauthValidated} onSubmit={this.handleOAuthSubmit}>
                                {this.state.accountEdits.manage_api && this.state.account.id ? (
                                    <SectionOauth
                                        su={this.state.su}
                                        user={this.state.user}
                                        account={this.state.account}
                                        accountHolder={this.state.accountHolder}
                                        oAuth={this.state.oAuth}
                                        selects={this.state.selects}
                                        grands={this.state.grands}
                                        scopes={this.state.scopes}
                                        redirectUris={this.state.redirectUris}
                                        accountEdits={this.state.accountEdits}
                                        onUpdateOAuth={this.onUpdateOAuth}
                                        onUpdateGrants={this.onUpdateGrants}
                                        onUpdateRedirectUrl={this.onUpdateRedirectUrl}
                                        onUpdateScope={this.onUpdateScope}
                                    />
                                ) : ''}
                            </Form>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.collapseUserConsent}>
                        <div id={uuidv5('collapseUserConsent', v5NameSpace)}>
                            {this.state.oAuth.expires && this.state.accountEdits.manage_api && this.state.user !== this.state.accountHolder.id ? (
                                <SectionUserConsent
                                    oAuth={this.state.oAuth}
                                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                                />
                            ) : ('')}
                        </div>
                    </Collapse>
                    <Collapse in={this.state.collapseAdminBerechtigung}>
                        <div id={uuidv5('collapseAdminBerechtigung', v5NameSpace)}>
                            <SectionAuthorisation
                                onUpdateVoter={this.onUpdateVoter}
                                voter={this.state.voter}
                                account={this.state.account}
                                accountHolder={this.state.accountHolder}
                                isNotUser={this.state.isNotUser}
                            />
                        </div>
                    </Collapse>
                    <Collapse in={this.state.collapseGravatar}>
                        <div id={uuidv5('collapseGravatar', v5NameSpace)}>
                            <SectionGravatar
                                su={this.state.su}
                                user={this.state.user}
                                account={this.state.account}
                                accountHolder={this.state.accountHolder}
                                selects={this.state.selects}
                                onUpdateGravatar={this.onUpdateGravatar}
                            />
                        </div>
                    </Collapse>
                </div>
                <Collapse in={this.state.collapse2Fa}>
                    <div id={uuidv5('collapse2Fa', v5NameSpace)}>
                        <Section2FA
                            data2Fa={this.state.data2Fa}
                            onToggleCollapse={this.onToggleCollapse}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.collapseApi}>
                    <div id={uuidv5('collapseApi', v5NameSpace)}>
                        <SectionApi
                            dataApi={this.state.dataApi}
                            onToggleCollapse={this.onToggleCollapse}
                        />
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}