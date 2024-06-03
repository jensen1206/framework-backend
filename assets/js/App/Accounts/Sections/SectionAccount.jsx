import * as React from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from 'uuid';

import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as AppTools from "../../AppComponents/AppTools";
import MediaUpload from "../../MediaUpload/MediaUpload";
import Collapse from 'react-bootstrap/Collapse';

const v5NameSpace = '6eca0817-9dea-4ca0-8476-3481efac9479';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class SectionAccount extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.pwRef = React.createRef();
        this.pwrRef = React.createRef();
        this.state = {
            showPassword: false,
            showBtnSendMail: false,
            showCopied: false,
            showInfoFlicker: false,
            selectRole: '',
            collapseUpload: false,
            showUpload: true
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onCreatePassword = this.onCreatePassword.bind(this);
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
        this.onChange2FAHandle = this.onChange2FAHandle.bind(this);
        this.onMediathekCallback = this.onMediathekCallback.bind(this);
        this.onDeleteAccountImage = this.onDeleteAccountImage.bind(this);
        this.onAddUserRole = this.onAddUserRole.bind(this);
        this.onSendPWLink = this.onSendPWLink.bind(this);
        this.onDeleteUser = this.onDeleteUser.bind(this);
    }

    componentDidMount() {

        this.setState({
            showPassword: false,
            selectRole: '',
            showInfoFlicker: false,
            collapseUpload: false
        })
    }

    async sendAxiosFormdata(formData, isFormular = false, url = accountSettings.ajax_url, settings = accountSettings) {
        await axios.post(url, SetAjaxData(formData, isFormular, settings))
            .then(({data = {}} = {}) => {
                switch (data.type) {
                    case 'create_random_password':
                        if (data.status) {
                            this.props.onUpdateAccountHolder(data.password, 'password')
                            this.props.onUpdateAccountHolder(data.password, 'repeatPassword')
                            this.setState({
                                selectRole: ''
                            })
                        }
                        break;
                    case 'login_2fa_handle':
                        if (data.status) {
                            this.props.onUpdateAccountHolder(data.totpSecret, 'totpSecret')
                            if (data.handle === 'activate') {
                                this.setState({
                                    showInfoFlicker: true
                                })
                                sleep(10000).then(() => {
                                    this.setState({
                                        showInfoFlicker: false
                                    })
                                })
                            } else {
                                this.setState({
                                    showInfoFlicker: false
                                })
                            }
                        }
                        AppTools.swalAlertMsg(data)
                        break;
                    case 'delete_account_image':
                        if (data.status) {
                            this.props.onUpdateAccounts("", 'imageFilename')
                        } else {
                            AppTools.warning_message(data.msg)
                        }
                        break;
                    case 'send_pw_link':
                            AppTools.swalAlertMsg(data)
                        break;
                }
            })
    }

    onCreatePassword() {
        let formData = {
            'method': 'create_random_password'
        }

        this.sendAxiosFormdata(formData, false, publicSettings.ajax_url, publicSettings).then()
    }

    onChange2FAHandle() {
        let handle = this.props.accountHolder.totpSecret ? 'deactivate' : 'activate';

        let formData = {
            'method': 'login_2fa_handle',
            'id': this.props.accountHolder.id,
            'handle': handle
        }
        if (handle === 'deactivate') {
            let pin = AppTools.randInteger(6);
            let swal = {
                title: `${trans['swal']['deactivate 2FA']}?`,
                msg: `<span class="swal-delete-body text-center"><small class="small-lg d-inline-block mb-3">${trans['swal']['All settings in your authentication app will be lost. The settings cannot be restored.']}</small><br>${trans['swal']['PIN']}: ${pin}</span>`,
                btn: trans['swal']['deactivate 2FA'],
                pin: pin
            }
            AppTools.swal_validate_pin(swal).then((result) => {
                if (result) {
                    this.sendAxiosFormdata(formData, false).then()
                }
            })
        }
        if (handle === 'activate') {
            this.sendAxiosFormdata(formData, false).then()
        }
    }

    onUpdateCopied() {
        this.setState({
            showCopied: true
        })
        sleep(1500).then(() => {
            this.setState({
                showCopied: false
            })
        })
    }

    onMediathekCallback(data, method) {
        //method = upload or delete
        if (method === 'upload') {
            this.setState({
                collapseUpload: false
            })
            this.props.onUpdateAccounts(data.filename, 'imageFilename')
        }
    }

    onDeleteAccountImage() {
        let formData = {
            'method': 'delete_account_image',
            'id': this.props.account.id,
        }
        this.sendAxiosFormdata(formData, false).then()
    }

    onAddUserRole() {
        this.props.onUpdateUserRole(this.state.selectRole, 'add')
        this.setState({
            selectRole: ''
        })
    }

    onSendPWLink() {
        let formData = {
            'method': 'send_pw_link',
            'id': this.props.accountHolder.id,
        }
        this.sendAxiosFormdata(formData, false).then()
    }

    onDeleteUser() {
        let logout;
        this.props.user === this.props.accountHolder.id ? logout = true : logout = false;

        let formData = {
            'method': 'delete_user',
            'id': this.props.account.id,
            'logout': logout
        }

        let pin = AppTools.randInteger(6);
        let swal = {
            title: `${trans['system']['Delete account']}?`,
            msg: `<span class="swal-delete-body text-center"><small class="small-lg d-inline-block mb-3">${trans['swal']['All data will be deleted. The deletion cannot be reversed.']}</small><br><span class="delete-pin">${trans['swal']['PIN']}: ${pin}</span></span>`,
            btn: trans['system']['Delete account'],
            pin: pin
        }
        AppTools.swal_validate_pin(swal).then((result) => {
            if (result) {
                this.props.sendAxiosFormdata(formData)
            }
        })
    }

    render() {

        const isSuAdmin = this.props.accountHolder.roles_array ? this.props.accountHolder.roles_array.includes("ROLE_SUPER_ADMIN") : false;
        let showUpload = false;

        if (!this.props.account.imageFilename && this.props.account.id) {
            showUpload = true;
        }
        return (
            <React.Fragment>
                <fieldset
                    disabled={this.props.user === this.props.accountHolder.id && !this.props.accountEdits.account_edit}>
                    <div className="shadow-sm card">
                        <div
                            className="bg-body-tertiary py-3 fs-5 fw-semibold d-md-flex flex-wrap align-items-center card-header">
                            <div>

                                <i className="bi bi-person-fill-gear me-1"></i>
                                {this.props.account.id ? trans['profil']['Edit account'] : trans['profil']['Create account']}
                                <small
                                    className="fs-6 small-lg d-block text-muted fw-normal">
                                    {this.props.accountHolder.email}
                                </small>

                                {this.props.account.id ? (
                                    <small className="small-xl mb-md-0 mb-2 d-block fw-normal">
                                        {this.props.account.uuid}<br/>
                                    </small>
                                ) : ''}
                            </div>
                            {this.props.account.id && this.props.accountEdits.account_edit ? (
                                <div className="ms-auto">
                                    <div
                                        className="d-flex justify-content-lg-start justify-content-center align-items-center">
                                        <i className={`bi bi-arrow-right text-green info-flicker-text show-info-flicker me-3 fs-3 ${this.state.showInfoFlicker ? ' show' : ' hide'}`}></i>
                                        {this.props.accountHolder.totpSecret ? (
                                            <button type="button" onClick={this.props.onGet2FaData}
                                                    className="btn btn-circle-icon btn-outline-success-custom me-2">
                                                {trans['profil']['2FA']}
                                            </button>
                                        ) : ''}
                                        {this.props.oAuth.active ? (
                                            <button onClick={this.props.onGetApiData}
                                                    type="button"
                                                    className="btn btn-circle-icon btn-outline-success-custom me-2">
                                                {trans['profil']['API']}
                                            </button>) : ''}
                                    </div>
                                </div>) : ''}
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                <div
                                    className={`col-12 ${this.props.accountEdits.edit_roles ? ' col-xl-6 ' : ''}`}>
                                    <FloatingLabel
                                        controlId={uuidv5('companyOrganization', v5NameSpace)}
                                        label={trans['profil']['Company/Organization']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.account.company || ''}
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'company')}
                                            autoComplete="company"
                                            aria-required={false}
                                            type="text"
                                            placeholder={trans['profil']['Company/Organization']}/>
                                    </FloatingLabel>
                                </div>
                                {!isSuAdmin && this.props.user !== this.props.accountHolder.id && this.props.accountEdits.edit_roles ? (
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv5('userRole', v5NameSpace)}
                                            label={trans['profil']['User roles']}>
                                            <Form.Select
                                                className="no-blur"
                                                disabled={isSuAdmin || !this.props.selects.roles.length}
                                                required={false}
                                                aria-required={false}
                                                value={this.state.selectRole}
                                                onChange={(e) => this.setState({selectRole: e.target.value})}
                                                aria-label={trans['profil']['User roles']}
                                            >
                                                {isSuAdmin ? (
                                                    <option value='ROLE_SUPER_ADMIN'>ROLE_SUPER_ADMIN</option>
                                                ) : (
                                                    <option value=''>{trans['profil']['Select user role']}</option>
                                                )}
                                                {this.props.selects.roles.map((select, index) =>
                                                    <option key={index} value={select.id}>
                                                        {select.label}
                                                    </option>
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                        {!isSuAdmin ? (
                                            <button
                                                onClick={this.onAddUserRole}
                                                type="button"
                                                className={`btn mt-2 dark btn-sm ${this.state.selectRole ? 'btn-success-custom' : 'disabled btn-outline-secondary'}`}>
                                                <i className="bi bi-node-plus me-2"></i>
                                                {trans['profil']['Add user role']}
                                            </button>) : ''}
                                    </div>) : (
                                    <div className={`${isSuAdmin ? 'col-xl-6 col-12' : ''}`}></div>
                                )}

                                {!isSuAdmin && this.props.accountEdits.edit_roles ? (
                                    <div className="col-12">
                                        <hr className="mb-2 mt-1"/>
                                        <div className="fw-semibold mb-2">
                                            {trans['profil']['User roles']}
                                        </div>
                                        <div className="d-flex align-items-center btn-delete-box flex-wrap">
                                         <span title="ROLE_USER"
                                               className="me-2 bg-secondary-dark  px-3 py-1 border rounded overflow-hidden position-relative">
                                            User
                                        </span>
                                            {this.props.accountHolder.roles && this.props.accountHolder.roles.length !== 0 ? (
                                                <>
                                                    {this.props.accountHolder.roles.map((roles, index) => {
                                                        return (
                                                            <span key={index} title={roles.value}
                                                                  className={`me-2 ps-2 py-1 bg-secondary-dark border rounded overflow-hidden position-relative ${!isSuAdmin && this.props.user !== this.props.accountHolder.id && this.props.accountEdits.edit_roles ? ' btn-delete-wrapper' : ' pe-2'}`}>
                                                         {roles.label}
                                                                {!isSuAdmin && this.props.user !== this.props.accountHolder.id && this.props.accountEdits.edit_roles ? (
                                                                    <span
                                                                        onClick={() => this.props.onUpdateUserRole(roles.id, 'delete')}
                                                                        title={trans['profil']['Delete user role']}
                                                                        className="cursor-pointer position-absolute btn-delete-trash h-100 bg-danger top-0 end-0">
                                                             <i className="hover-scale small-lg mt-1 px-1 bi bi-trash text-light"></i>
                                                         </span>) : ''}
                                                         </span>
                                                        )
                                                    })}
                                                </>) : ''}
                                        </div>
                                        <div className="form-text mt-3 mb-1">
                                            <i className="bi bi-exclamation-circle text-danger me-2"></i>
                                            {trans['system']['After adding or deleting user roles, the authorisations must be recreated.']}
                                        </div>
                                        <hr className="mb-1 mt-2"/>
                                    </div>) : ''}

                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('firstName', v5NameSpace)}
                                        label={trans['profil']['First name']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            type="text"
                                            aria-required={false}
                                            value={this.props.account.firstName || ''}
                                            autoComplete="given-name"
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'firstName')}
                                            placeholder={trans['profil']['First name']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('lastName', v5NameSpace)}
                                        label={trans['profil']['Last name']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            aria-required={false}
                                            value={this.props.account.lastName || ''}
                                            autoComplete="family-name"
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'lastName')}
                                            type="text"
                                            placeholder={trans['profil']['Last name']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xxl-9 col-xl-8 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('street', v5NameSpace)}
                                        label={trans['profil']['Street']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            autoComplete="street-address"
                                            aria-required={false}
                                            value={this.props.account.street || ''}
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'street')}
                                            type="text"
                                            placeholder={trans['profil']['Street']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xxl-3 col-xl-4 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('HouseNumber', v5NameSpace)}
                                        label={trans['profil']['House number']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            autoComplete="house-number"
                                            aria-required={false}
                                            value={this.props.account.hnr || ''}
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'hnr')}
                                            type="text"
                                            placeholder={trans['profil']['House number']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('phone', v5NameSpace)}
                                        label={trans['profil']['Phone']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            autoComplete="phone"
                                            aria-required={false}
                                            value={this.props.account.phone || ''}
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'phone')}
                                            type="text"
                                            placeholder={trans['profil']['Phone']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('mobil', v5NameSpace)}
                                        label={trans['profil']['Mobile']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            autoComplete="mobile"
                                            aria-required={false}
                                            value={this.props.account.mobil || ''}
                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'mobil')}
                                            type="text"
                                            placeholder={trans['profil']['Mobile']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('emailProfil', v5NameSpace)}
                                        label={`${trans['profil']['Email']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={true}
                                            autoComplete="email"
                                            aria-required={true}
                                            value={this.props.accountHolder.email || ''}
                                            onChange={(e) => this.props.onUpdateAccountHolder(e.target.value, 'email')}
                                            type="email"
                                            placeholder={trans['profil']['Email']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12"></div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('password', v5NameSpace)}
                                        label={`${!this.props.account.id && this.props.accountHolder.password ? trans['profil']['Password'] : trans['profil']['Password set']} ${this.props.account.id ? '' : ' *'}`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={!this.props.account.id}
                                            aria-required={!this.props.account.id}
                                            value={this.props.accountHolder.password || ''}
                                            onChange={(e) => this.props.onUpdateAccountHolder(e.target.value, 'password')}
                                            type={`${this.state.showPassword ? 'text' : 'password'}`}
                                            autoComplete="new-password"
                                            placeholder={trans['profil']['Password']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('RepeatPassword', v5NameSpace)}
                                        label={`${!this.props.account.id && this.props.accountHolder.password ? trans['profil']['Repeat password'] : trans['profil']['Password set']} ${this.props.account.id ? '' : ' *'}`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={false}
                                            aria-required={false}
                                            value={this.props.accountHolder.repeatPassword || ''}
                                            onChange={(e) => this.props.onUpdateAccountHolder(e.target.value, 'repeatPassword')}
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder={trans['profil']['Repeat password']}/>
                                    </FloatingLabel>
                                </div>
                                {this.props.handle === 'insert' || this.props.handle === 'update' && this.props.accountEdits.account_edit && this.props.account.id || this.props.accountEdits.manage_account ? (
                                    <React.Fragment>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <button onClick={this.onCreatePassword}
                                                        type="button"
                                                        className="me-4 btn btn-secondary dark btn-sm">
                                                    <i className="bi bi-shuffle me-1"> </i>
                                                    {trans['profil']['Create password']}
                                                </button>
                                                {this.props.accountHolder.password ? (
                                                    <i onClick={() => this.setState({showPassword: !this.state.showPassword})}
                                                       className={`cursor-pointer d-inline-block hover-scale ${this.state.showPassword ? 'bi-eye' : 'bi-eye-slash'}`}
                                                       title={`${this.state.showPassword ? trans['system']['Hide password'] : trans['system']['Show password']}`}
                                                    >
                                                    </i>) : ''}
                                                {this.props.accountHolder.password ? (
                                                    <div>
                                                        <CopyToClipboard text={this.props.accountHolder.password}
                                                                         onCopy={() => this.onUpdateCopied()}>
                                                            <i title={trans['profil']['Copy password']}
                                                               className="cursor-pointer d-inline-block hover-scale ms-2 bi bi-files"></i>
                                                        </CopyToClipboard>
                                                        <span
                                                            className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showCopied ? ' show-copied' : ''}`}>
                                                            {trans['system']['Copied!']}
                                                    </span>
                                                    </div>
                                                ) : ''}
                                                {this.props.account.id && this.props.accountEdits.account_edit || this.props.account.id && this.props.accountEdits.manage_account ? (
                                                    <div className="ms-auto">
                                                        <button onClick={this.onChange2FAHandle}
                                                                type="button"
                                                                className={`btn dark btn-sm ${this.props.accountHolder.totpSecret ? ' btn-warning-custom' : ' btn-success-custom'}`}>
                                                            {this.props.accountHolder.totpSecret ? trans['profil']['deactivate 2FA'] : trans['profil']['Activate 2FA']}
                                                        </button>
                                                    </div>) : ''}
                                            </div>
                                        </div>
                                        {this.props.account.id ? (
                                            <>
                                                {this.props.user === this.props.accountHolder.id && this.props.accountEdits.account_edit || this.props.user !== this.props.accountHolder.id && this.props.accountEdits.manage_account ? (
                                                    <div className="col-12">
                                                        <hr/>
                                                        <div>{trans['profil']['Profile picture']}</div>
                                                        {this.props.account.imageFilename ? (
                                                            <div
                                                                className="d-flex align-items-center justify-content-center flex-column">
                                                                <div className="text-center">
                                                                    <a className="img-link" data-control="single"
                                                                       href={`${accountSettings.large_account_url}/${this.props.account.imageFilename}`}>
                                                                        <img width={150} alt=""
                                                                             src={`${accountSettings.thumb_account_url}/${this.props.account.imageFilename}`}/>
                                                                    </a>
                                                                </div>
                                                                <div>
                                                                    <button title={trans['profil']['Change']}
                                                                            onClick={() => this.setState({collapseUpload: !this.state.collapseUpload})}
                                                                            type="button"
                                                                            className="btn btn-switch-blue me-1 btn-sm my-3 dark">
                                                                        <i className="bi bi-arrow-left-right"></i>
                                                                    </button>
                                                                    <button title={trans['Delete']}
                                                                            onClick={this.onDeleteAccountImage}
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm my-3 dark">
                                                                        <i className="bi bi-trash"></i>

                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                                        )}
                                                        <Collapse in={this.state.collapseUpload || showUpload}>
                                                            <div id={uuidv5('collapseUpload', v5NameSpace)}>
                                                                <div className="d-flex justify-content-center">
                                                                    <input type="hidden" name="account_id"
                                                                           value={this.props.account.id || ''}/>
                                                                    <input type="hidden" name="method"
                                                                           value="upload_account_image"/>
                                                                    <MediaUpload
                                                                        onMediathekCallback={this.onMediathekCallback}
                                                                        form_id={this.props.formId}
                                                                        showUpload={true}
                                                                        uploadType="account"
                                                                        assets='.jpg,.jpeg,.png,.gif,.svg'
                                                                        maxFiles={1}
                                                                        chunking={true}
                                                                        delete_after={true}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </div>) : ''}
                                            </>

                                        ) : ''}

                                        {!isSuAdmin && this.props.user !== this.props.accountHolder.id && this.props.accountEdits.manage_account ? (
                                            <React.Fragment>
                                                <div className="col-12">
                                                    <hr/>
                                                    <FloatingLabel
                                                        controlId={uuidv5('userNotiz', v5NameSpace)}
                                                        label={trans['profil']['Note']}>
                                                        <Form.Control
                                                            as="textarea"
                                                            className="no-blur"
                                                            placeholder={trans['profil']['Note']}
                                                            value={this.props.account.notiz || ''}
                                                            onChange={(e) => this.props.onUpdateAccounts(e.target.value, 'notiz')}
                                                            style={{height: '100px'}}
                                                        />
                                                    </FloatingLabel>
                                                    <hr/>
                                                </div>
                                                <div className="col-12">
                                                    <Form.Check
                                                        className="no-blur mb-2"
                                                        type="switch"
                                                        checked={this.props.accountHolder.verified || false}
                                                        onChange={(e) => this.props.onUpdateAccountHolder(e.target.checked, 'verified')}
                                                        id={uuidv5('userAktiv', v5NameSpace)}
                                                        label={trans['profil']['User active']}
                                                    />
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.account.changePw || false}
                                                        onChange={(e) => this.props.onUpdateAccounts(e.target.checked, 'changePw')}
                                                        id={uuidv5('changePw', v5NameSpace)}
                                                        label={trans['profil']['User can change profile data']}
                                                    />
                                                    {/*}<Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.state.showBtnSendMail}
                                                        onChange={() => this.setState({showBtnSendMail: !this.state.showBtnSendMail})}
                                                        id={uuidv5('sendPwLink', v5NameSpace)}
                                                        label={trans['profil']['Send link to create password']}
                                                    />{*/}
                                                </div>
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <button
                                                        onClick={this.onSendPWLink}
                                                        type="button"
                                                        className={`mt-3 dark btn w-auto ${this.props.accountHolder.verified && this.props.account.id ? 'btn-switch-blue' : 'btn-outline-secondary disabled'}`}>
                                                        <i className="bi bi-envelope-at me-2"></i>
                                                        {trans['profil']['Send link to create password']}
                                                    </button>
                                                </div>
                                            </React.Fragment>
                                        ) : ''}
                                        {this.props.account.id && this.props.accountEdits.account_delete ? (
                                            <div className="text-end">
                                                <hr/>
                                                <button
                                                    onClick={this.onDeleteUser}
                                                    type="button"
                                                    className={`dark btn w-auto dark btn-danger`}>
                                                    <i className="bi bi-person-dash me-2"></i>
                                                    {trans['system']['Delete account']}
                                                </button>
                                            </div>) : ''}
                                        {!this.props.account.id ? (
                                            <div className="col-12">
                                                <hr/>
                                                <button
                                                    className="btn btn-success-custom dark" type="submit">
                                                    <i className="bi bi-save2 me-2"></i>
                                                    {this.props.account.id ? trans['system']['Save changes'] : trans['profil']['Create profile']}
                                                </button>
                                            </div>) : ''}
                                    </React.Fragment>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </fieldset>
            </React.Fragment>
        )
    }
}