import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import Col from "react-bootstrap/Col";
import LogSettings from "./Sections/LogSettings";
import AppSettings from "./Sections/AppSettings";
import LogoSettings from "./Sections/LogoSettings";
import OAuthSettings from "./Sections/OAuthSettings";
import EmailSettings from "./Sections/EmailSettings";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import * as AppTools from "../AppComponents/AppTools";
import {swal_validate_password} from "../AppComponents/AppTools";
import Swal from "sweetalert2";

import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            pageSelect: [],
            app: {},
            email: {},
            log: {},
            oauth: {},
            certificate: 2048,
            oauth_config: {},
            version: '',
            colStart: true,
            colDef: false,
            defuseKey: '',
            kidKey: '',
            default_admin_voter: [],
            default_user_voter: [],
            emailDsn: {},
            su: false,
            logSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            appSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            oauthSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            emailSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            }
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onChangeLogSettings = this.onChangeLogSettings.bind(this);
        this.onChangeAppSettings = this.onChangeAppSettings.bind(this);
        this.onChangeOauthSettings = this.onChangeOauthSettings.bind(this);
        this.onChangeEmailSettings = this.onChangeEmailSettings.bind(this);
        this.onChangeEmailDSNSettings = this.onChangeEmailDSNSettings.bind(this);

        this.onChangeCertificate = this.onChangeCertificate.bind(this);
        this.getSettings = this.getSettings.bind(this);
        this.onGenerateNewKeys = this.onGenerateNewKeys.bind(this);
        this.onToggleCollapseSettings = this.onToggleCollapseSettings.bind(this);
        this.onUpdateVoter = this.onUpdateVoter.bind(this);
        this.onUpdateWorker = this.onUpdateWorker.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidMount() {
        this.getSettings()
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

    onToggleCollapseSettings(target) {
        let start = false;
        let def = false;
        switch (target){
            case 'start':
                  start = true;
                break;
            case 'def':
                  def = true;
                break;
        }
        this.setState({
            colStart: start,
            colDef: def,
        })
    }

    getSettings() {
        let formData = {
            'method': 'get_system_settings'
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGenerateNewKeys(type) {
        let formData;
        switch (type) {
            case 'certificate':
                let swal = {
                    'title': `<i class="bi bi-incognito me-1"></i> ${trans['swal']['Password']}`,
                    'btn': trans['system']['Execute']
                }
                AppTools.swal_validate_password(swal).then((result) => {

                    if (result) {
                       // console.log(result)
                        formData = {
                            'method': 'generate_rsa',
                            'pw': result,
                            'bit': this.state.certificate
                        }
                        this.sendAxiosFormdata(formData).then()
                    }
                })
                break;
            case 'defuse_key':
                formData = {
                    'method': 'make_defuse_key'
                }
                this.sendAxiosFormdata(formData).then()
                break;
            case 'kid':
                formData = {
                    'method': 'make_kid_key'
                }
                this.sendAxiosFormdata(formData).then()
                break;
        }
    }

    onChangeCertificate(value) {

        this.setState({
            certificate: value
        })
    }

    onChangeLogSettings(e, type) {
        let upd = this.state.log;
        upd[type] = e;
        this.setState({
            log: upd,
            logSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'log_settings_handle',
                'log': JSON.stringify(_this.state.log),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onChangeAppSettings(e, type) {
        let upd = this.state.app;
        upd[type] = e;
        this.setState({
            app: upd,
            appSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'app_settings_handle',
                'app': JSON.stringify(_this.state.app),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onChangeOauthSettings(e, type) {
        let upd = this.state.oauth;
        upd[type] = e;
        this.setState({
            oauth: upd,
            oauthSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'oauth_settings_handle',
                'app': JSON.stringify(_this.state.oauth),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onChangeEmailSettings(e, type) {
        let upd = this.state.email;
        upd[type] = e;
        this.setState({
            email: upd,
            emailSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'email_settings_handle',
                'email': JSON.stringify(_this.state.email),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onChangeEmailDSNSettings(e, type) {
        let upd = this.state.emailDsn;
        upd[type] = e;
        this.setState({
            emailDsn: upd,
            emailSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'email_dsn_handle',
                'email': JSON.stringify(_this.state.emailDsn),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onUpdateVoter(e, id, type) {
        if(type === 'admin') {
            const updAdmin = [...this.state.app.default_admin_voter]
            const findChange = this.findArrayElementById(updAdmin, id)
            findChange.default = e;
            this.state.app.default_admin_voter = updAdmin;
            this.setState({
                app: this.state.app,
                appSpinner: {
                    showAjaxWait: true
                }
            })
        }
        if(type === 'user') {
            const updUser = [...this.state.app.default_user_voter]
            const findChange = this.findArrayElementById(updUser, id)
            findChange.default = e;
            this.state.app.default_user_voter = updUser;
            this.setState({
                app: this.state.app,
                appSpinner: {
                    showAjaxWait: true
                }
            })
        }

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'app_settings_handle',
                'app': JSON.stringify(_this.state.app),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

    }

    onUpdateWorker(handle) {
        this.setState({
            appSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'worker_handle',
                'handle': handle
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }


    async sendAxiosFormdata(formData, isFormular = false, url = systemSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, systemSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_system_settings':
                            if (data.status) {
                                this.setState({
                                    app: data.record.app,
                                    email: data.record.email,
                                    log: data.record.log,
                                    oauth: data.record.oauth,
                                    oauth_config: data.oauth_config,
                                    version: data.record.version,
                                    su: data.su,
                                    pageSelect: data.page_select,
                                    emailDsn: data.email_dsn
                                })
                            }
                            this.onToggleCollapseSettings('start')
                            break;
                        case 'log_settings_handle':
                            this.setState({
                                logSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'app_settings_handle':
                        case 'worker_handle':
                            this.setState({
                                appSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'oauth_settings_handle':
                            this.setState({
                                oauthSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'email_settings_handle':
                            this.setState({
                                emailSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'generate_rsa':
                            if (data.status) {
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'make_defuse_key':
                            if (data.status) {
                                this.setState({
                                    defuseKey: data.key
                                })
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'make_kid_key':
                            AppTools.success_message(data.msg)
                            this.setState({
                                kidKey: data.key
                            })
                            break;
                        case 'email_dsn_handle':
                            this.setState({
                                emailSpinner: {
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
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body">
                    {trans['System settings']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['system']['Basic settings']}
                    </small>
                </h3>
                <hr/>
                <Col xxl={9} xl={10} xs={12} className="mx-auto">
                    <AppSettings
                        spinner={this.state.appSpinner}
                        app={this.state.app}
                        su={this.state.su}
                        colStart={this.state.colStart}
                        colDef={this.state.colDef}
                        pageSelect={this.state.pageSelect}
                        default_admin_voter={this.state.default_admin_voter}
                        default_user_voter={this.state.default_user_voter}
                        onChangeAppSettings={this.onChangeAppSettings}
                        onToggleCollapseSettings={this.onToggleCollapseSettings}
                        onUpdateVoter={this.onUpdateVoter}
                        onUpdateWorker={this.onUpdateWorker}
                    />
                    <EmailSettings
                        email={this.state.email}
                        spinner={this.state.emailSpinner}
                        emailDsn={this.state.emailDsn}
                        onChangeEmailSettings={this.onChangeEmailSettings}
                        onChangeEmailDSNSettings={this.onChangeEmailDSNSettings}
                    />
                    <OAuthSettings
                        spinner={this.state.oauthSpinner}
                        oauth={this.state.oauth}
                        oauth_config={this.state.oauth_config}
                        certificate={this.state.certificate}
                        defuseKey={this.state.defuseKey}
                        kidKey={this.state.kidKey}
                        onChangeOauthSettings={this.onChangeOauthSettings}
                        onChangeCertificate={this.onChangeCertificate}
                        onGenerateNewKeys={this.onGenerateNewKeys}
                    />
                    <LogSettings
                        spinner={this.state.logSpinner}
                        log={this.state.log}
                        onChangeLogSettings={this.onChangeLogSettings}
                    />
                    <LogoSettings
                        spinner={this.state.appSpinner}
                        app={this.state.app}
                        onChangeAppSettings={this.onChangeAppSettings}
                    />
                </Col>
            </React.Fragment>
        )
    }
}