import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import {v4 as uuidv4} from "uuid";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

const v5NameSpace = '97de1eb0-a9a3-11ee-bb1c-325096b39f47';
export default class SectionOauth extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showCopied: false,
            selectGrand: '',
            selectScope: '',
            addUrl: '',
        }
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onCreateOauthSecret = this.onCreateOauthSecret.bind(this);
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
        this.onAddGrant = this.onAddGrant.bind(this);
        this.onAddScope = this.onAddScope.bind(this);

    }

    componentDidMount() {

    }

    async sendAxiosFormdata(formData, isFormular = false, url = accountSettings.ajax_url, settings = accountSettings) {
        await axios.post(url, SetAjaxData(formData, isFormular, settings))
            .then(({data = {}} = {}) => {
                switch (data.type) {
                    case 'create_oauth_secret':
                        if (data.status) {
                            this.props.onUpdateOAuth(data.secret, 'secret')
                        }
                        break;
                }
            })
    }

    onCreateOauthSecret() {
        let formData = {
            'method': 'create_oauth_secret'
        }
        this.sendAxiosFormdata(formData, false, publicSettings.ajax_url, publicSettings).then()
    }

    onUpdateCopied() {
        this.setState({
            showCopied: true
        })
        sleep(1500).then(() => {
            this.setState({
                showCopied: false,
                selectGrand: ''
            })
        })
    }

    onAddGrant() {
        this.props.onUpdateGrants(this.state.selectGrand, 'add')
        this.setState({
            selectGrand: ''
        })
    }

    onAddScope() {
        this.props.onUpdateScope(this.state.selectScope, 'add')
        this.setState({
            selectScope: ''
        })
    }

    render() {
        const isSuAdmin = this.props.accountHolder.roles_array ? this.props.accountHolder.roles_array.includes("ROLE_SUPER_ADMIN") : false;
        return (
            <React.Fragment>
                <div className="shadow-sm card">
                    <div
                        className="bg-body-tertiary py-3 fs-5 fw-semibold d-flex flex-wrap align-items-center card-header">
                        <div>
                            <i className="bi bi-incognito me-2"></i>
                            {trans['profil']['API OAuth2']}
                        </div>
                        <div className="ms-auto">
                            <small className="fs-6 small-lg text-muted fw-normal">{this.props.accountHolder.email}</small>
                        </div>
                    </div>
                    <div className="card-body">
                        <fieldset disabled={!this.props.oAuth.active || false}>
                            <div className="row g-2">
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('oauthName', v5NameSpace)}
                                        label={`${trans['system']['Client name']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            autoComplete="off"
                                            required={true}
                                            aria-required={true}
                                            defaultValue={this.props.oAuth.name || 'App client'}
                                            onChange={(e) => this.props.onUpdateOAuth(e.target.value, 'name')}
                                            type="text"
                                            placeholder={trans['system']['Client name']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-xl-6 col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('oauthIdentifier', v5NameSpace)}
                                        label={`${trans['system']['Client ID']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            readOnly={true}
                                            autoComplete="off"
                                            aria-required={true}
                                            defaultValue={this.props.oAuth.identifier || ''}
                                            //onChange={(e) => this.props.onUpdateOAuth(e.target.value, 'email')}
                                            type="text"
                                            placeholder={trans['system']['Client ID']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-12">
                                    <FloatingLabel
                                        controlId={uuidv5('oauthSecret', v5NameSpace)}
                                        label={`${trans['system']['Client Secret']} *`}
                                    >
                                        <Form.Control
                                            className="no-blur mb-2"
                                            autoComplete="off"
                                            required={true}
                                            aria-required={true}
                                            value={this.props.oAuth.secret || ''}
                                            onChange={(e) => this.props.onUpdateOAuth(e.target.value, 'secret')}
                                            type="text"
                                            placeholder={trans['system']['Client Secret']}/>
                                    </FloatingLabel>
                                    <div className="d-flex align-items-center">
                                        <button
                                            onClick={this.onCreateOauthSecret}
                                            className={`btn dark btn-sm ${this.props.oAuth.active ? ' btn-secondary' : ' btn-outline-secondary'}`}
                                            type="button">
                                            <i className="bi bi-shuffle me-1"> </i>
                                            {trans['system']['Create new']}
                                        </button>
                                        <div>
                                            <CopyToClipboard text={this.props.oAuth.secret}
                                                             onCopy={() => this.onUpdateCopied()}>
                                                <i title={trans['profil']['Copy password']}
                                                   className={`d-inline-block hover-scale ms-2 bi bi-files ${this.props.oAuth.active ? ' cursor-pointer' : ' pe-none opacity-25'}`}></i>
                                            </CopyToClipboard>
                                            <span
                                                className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showCopied ? ' show-copied' : ''}`}>
                                                            {trans['system']['Copied!']}
                                                    </span>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <span className="mb-2">{trans['system']['released addresses']}</span>
                                {this.props.redirectUris.length ? (
                                    <>
                                        {this.props.redirectUris.map((redirect, index) => {
                                            return (
                                                <div key={index} className="d-flex align-items-center">
                                                    <div className={index > 0 ? 'col-11' : 'col-12'}>
                                                        <FloatingLabel
                                                            controlId={redirect.id}
                                                            label={`${trans['system']['Redirect URL']} * `}
                                                        >
                                                            <Form.Control
                                                                className="no-blur"
                                                                autoComplete="off"
                                                                required={true}
                                                                aria-required={true}
                                                                value={redirect.value}
                                                                onChange={(e) => this.props.onUpdateRedirectUrl(e.target.value, 'update', redirect.id)}
                                                                type="url"
                                                                placeholder={trans['system']['Redirect URL']}/>
                                                        </FloatingLabel>
                                                    </div>
                                                    {index > 0 ? (
                                                        <div className="col-1">
                                                            <div className="text-center">
                                                                <button
                                                                    onClick={() => this.props.onUpdateRedirectUrl('', 'delete', redirect.id)}
                                                                    title={trans['system']['Delete URL']}
                                                                    type="button"
                                                                    className="btn btn-danger dark btn-sm">
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>) : ''}
                                                </div>
                                            )
                                        })}
                                    </>
                                ) : (
                                    <div className="my-1 text-danger">
                                        {trans['system']['No addresses available']}
                                    </div>
                                )}
                                <div className="mt-2">
                                    <button
                                        onClick={() => this.props.onUpdateRedirectUrl('', 'add')}
                                        className={`btn dark btn-sm ${this.props.oAuth.active ? ' btn-success-custom' : ' btn-outline-secondary'}`}
                                        type="button">
                                        <i className="bi bi-node-plus me-2"></i>
                                        {trans['system']['Add URL']}
                                    </button>
                                </div>
                                {!isSuAdmin && this.props.user !== this.props.accountHolder.id && this.props.accountEdits.manage_api && this.props.accountEdits.edit_grants ? (
                                    <React.Fragment>
                                        <div className="col-12">
                                            <hr/>
                                            <div className="row g-2">
                                                <div className="col-xl-6 col-12">
                                                    <FloatingLabel
                                                        controlId={uuidv5('selectGrand', v5NameSpace)}
                                                        label={trans['system']['Grants']}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            disabled={!this.props.selects.grand.length}
                                                            required={false}
                                                            aria-required={false}
                                                            value={this.state.selectGrand}
                                                            onChange={(e) => this.setState({selectGrand: e.target.value})}
                                                            aria-label={trans['system']['Grants']}
                                                        >
                                                            <option
                                                                value="">{`${trans['system']['select']}...`}</option>
                                                            {this.props.selects.grand.map((select, index) =>
                                                                <option key={index} value={select.id}>
                                                                    {select.label}
                                                                </option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                    <button
                                                        type="button"
                                                        onClick={this.onAddGrant}
                                                        className={`btn mt-2 dark btn-sm ${this.state.selectGrand ? 'btn-success-custom' : 'disabled btn-outline-secondary'}`}>
                                                        <i className="bi bi-node-plus me-2"></i>
                                                        {trans['system']['Add authorisation']}
                                                    </button>
                                                </div>

                                                <div className="col-xl-6 col-12">
                                                    <FloatingLabel
                                                        controlId={uuidv5('selectScope', v5NameSpace)}
                                                        label={trans['system']['API Scope']}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            disabled={!this.props.selects.scopes.length}
                                                            required={false}
                                                            aria-required={false}
                                                            value={this.state.selectScope}
                                                            onChange={(e) => this.setState({selectScope: e.target.value})}
                                                            aria-label={trans['system']['API Scope']}
                                                        >
                                                            <option
                                                                value="">{`${trans['system']['select']}...`}</option>
                                                            {this.props.selects.scopes.map((select, index) =>
                                                                <option key={index} value={select.id}>
                                                                    {select.label}
                                                                </option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                    <button
                                                        type="button"
                                                        onClick={this.onAddScope}
                                                        className={`btn mt-2 dark btn-sm ${this.state.selectScope ? 'btn-success-custom' : 'disabled btn-outline-secondary'}`}>
                                                        <i className="bi bi-node-plus me-2"></i>
                                                        {trans['system']['Add scope of application']}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <hr className="mb-2 mt-1"/>
                                            <div className="fw-semibold mb-2">
                                                {trans['system']['Grants']}
                                            </div>
                                            {this.props.grands.length ? (
                                                <div
                                                    className="d-flex align-items-center   btn-delete-box flex-wrap">
                                                    {this.props.grands && this.props.grands.length !== 0 ? (
                                                        <>
                                                            {this.props.grands.map((grants, index) => {
                                                                return (
                                                                    <span key={index} title={grants.value}
                                                                          className={`me-2 ps-2 py-1 bg-secondary-dark mb-1 btn-delete-wrapper border rounded overflow-hidden position-relative ${this.props.oAuth.active ? '' : ' opacity-25'}`}>
                                                         {grants.label}
                                                                        <span
                                                                            onClick={() => this.props.onUpdateGrants(grants.id, 'delete')}
                                                                            title={trans['system']['Delete authorisation']}
                                                                            className={`cursor-pointer text-light position-absolute btn-delete-trash h-100 bg-danger top-0 end-0 ${this.props.oAuth.active ? '' : ' opacity-25 pe-none'}`}>
                                                             <i className="hover-scale small-lg mt-1 px-1 bi bi-trash"></i>
                                                         </span>
                                                         </span>
                                                                )
                                                            })}
                                                        </>) : ''}
                                                </div>) : (
                                                <div
                                                    className="my-1 text-danger">{trans['system']['no authorisations']}</div>
                                            )}
                                        </div>
                                        <div className="col-12">
                                            <hr className="mb-2 mt-1"/>
                                            <div className="fw-semibold mb-2">
                                                {trans['system']['API Scope']}
                                            </div>
                                            {this.props.scopes.length ? (
                                                <div
                                                    className="d-flex align-items-center btn-delete-box flex-wrap">
                                                    {this.props.scopes && this.props.scopes.length !== 0 ? (
                                                        <>
                                                            {this.props.scopes.map((scope, index) => {
                                                                return (
                                                                    <span key={index} title={scope.value}
                                                                          className={`me-2 ps-2  py-1 bg-secondary-dark btn-delete-wrapper border rounded overflow-hidden position-relative ${this.props.oAuth.active ? '' : ' opacity-25'}`}>
                                                         {scope.label}
                                                                        <span
                                                                            onClick={() => this.props.onUpdateScope(scope.id, 'delete')}
                                                                            title={trans['system']['Delete authorisation']}
                                                                            className={`cursor-pointer  text-light position-absolute btn-delete-trash h-100 bg-danger top-0 end-0 ${this.props.oAuth.active ? '' : ' opacity-25 pe-none'}`}>
                                                             <i className="hover-scale small-lg mt-1 px-1 bi bi-trash"></i>
                                                         </span>
                                                         </span>
                                                                )
                                                            })}
                                                        </>) : ''}
                                                </div>) : (
                                                <div
                                                    className="my-1 text-danger">{trans['system']['No scope available']}</div>
                                            )}
                                        </div>

                                    </React.Fragment>
                                ) : ''}
                            </div>
                        </fieldset>
                        {!isSuAdmin && this.props.user !== this.props.accountHolder.id && this.props.accountEdits.manage_api ? (
                            <div className="col-12">
                                <hr/>
                                <Form.Check
                                    className="no-blur mb-2"
                                    type="switch"
                                    checked={this.props.oAuth.active || false}
                                    onChange={(e) => this.props.onUpdateOAuth(e.target.checked, 'active')}
                                    id={uuidv5('apiAktiv', v5NameSpace)}
                                    label={trans['system']['API active']}
                                />
                            </div>) : ''}
                        <hr/>
                        {/*}  <button className="btn btn-success-custom mb-1 dark" type="submit">
                            <i className="bi bi-save2 me-2"></i>
                            {trans['profil']['Save API settings']}
                        </button> {*/}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}