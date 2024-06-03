import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";
import {v5 as uuidv5} from 'uuid';
import {Card, ButtonGroup, Col, Button, Collapse, Alert} from "react-bootstrap";
import AppDb from "./components/AppDb";
import AppEmail from "./components/AppEmail";
import AppEnv from "./components/AppEnv";
import AppUser from "./components/AppUser";

const v5NameSpace = '63db005c-19f0-11ef-9d4b-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colStepEins: true,
            colStepZwei: false,
            colStepDrei: false,
            colStepVier: false,
            installStatus: true,
            installationError: false,
            showPw: false,
            errMsg: '',
            showInstall: false,
            db: {},
            email: {},
            env: {},
            user: {}
        }


        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);

        this.onSetDatabase = this.onSetDatabase.bind(this);
        this.onSetEmail = this.onSetEmail.bind(this);
        this.onSetEnv = this.onSetEnv.bind(this);
        this.onSetUser = this.onSetUser.bind(this);

        this.getInstallData = this.getInstallData.bind(this);
        this.collapseToggle = this.collapseToggle.bind(this);
        this.onToggleShowPw = this.onToggleShowPw.bind(this);

        this.onAppInstall = this.onAppInstall.bind(this);


    }

    componentDidMount() {
        this.getInstallData()
    }


    getInstallData() {
        let formData = {
            'method': 'get_install_data'
        }

        this.sendAxiosFormdata(formData).then()
    }

    collapseToggle(target) {
        let colEins = false;
        let colZwei = false;
        let colDrei = false;
        let colVier = false;
        switch (target) {
            case 'eins':
                colEins = true;
                break;
            case 'zwei':
                colZwei = true;
                break;
            case 'drei':
                colDrei = true;
                break;
            case 'vier':
                colVier = true;
                break;
        }

        this.setState({
            colStepEins: colEins,
            colStepZwei: colZwei,
            colStepDrei: colDrei,
            colStepVier: colVier,
        })
    }

    onSetDatabase(e, type) {
        let upd = this.state.db;
        upd[type] = e;
        this.setState({
            db: upd
        })
    }

    onSetEmail(e, type) {
        let upd = this.state.email;
        upd[type] = e;
        this.setState({
            email: upd
        })
    }

    onSetEnv(e, type) {
        let upd = this.state.env;
        upd[type] = e;
        this.setState({
            env: upd
        })
    }

    onSetUser(e, type) {
        let upd = this.state.user;
        upd[type] = e;
        this.setState({
            user: upd
        })
    }

    onToggleShowPw(show) {
        this.setState({
            showPw: show
        })
    }

    onAppInstall() {
        let formData = {
            'method': 'app_install',
            'db': JSON.stringify(this.state.db),
            'email': JSON.stringify(this.state.email),
            'env': JSON.stringify(this.state.env),
            'user': JSON.stringify(this.state.user),
        }
        this.setState({
            installationError: false,
            showInstall: true,
        })
        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = installSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, installSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_install_data':
                            if (data.status) {
                                this.setState({
                                    db: data.record.db,
                                    email: data.record.email,
                                    env: data.record.env,
                                    installStatus: data.status
                                })
                            } else {
                                if (data.php_version_error) {
                                    this.setState({
                                        installStatus: data.status,
                                        errMsg: data.msg
                                    })
                                }
                            }

                            break;
                        case 'generate_secret':
                            if (data.status) {
                                let as = this.state.env;
                                as.app_secret = data.secret
                                this.setState({
                                    env: as
                                })
                            }
                            break;
                        case 'make_defuse_key':
                            if (data.status) {
                                let def = this.state.env;
                                def.defuse_key = data.key
                                this.setState({
                                    env: def
                                })
                            }
                            break;
                        case 'generate_password':
                            if (data.status) {
                                let upd = this.state.user;
                                upd.pw = data.pw;
                                upd.repeat_pw = data.pw;
                                this.setState({
                                    user: upd,
                                    showPw: true
                                })
                            }
                            break;
                        case 'app_install':
                            if (data.status) {
                                this.setState({
                                    installationError: false,
                                    showInstall: false,
                                })
                                window.location.href = data.login_url
                            } else {
                                this.setState({
                                    installationError: true,
                                    errMsg: data.msg
                                })
                            }
                            break;
                    }
                }).catch((err) => {
                  //  console.error(err)
                    this.setState({
                        installationError: true,
                        errMsg: err.message
                    })
                }) ;
        }
    }


    render() {
        return (
            <React.Fragment>
                <div className="container my-5">
                    {this.state.installStatus ?
                        <Col xl={8} xs={12} className="mx-auto">
                            <Card>
                                <Card.Header>
                                    <Card.Title><i
                                        className="bi bi-tools me-2"></i>{this.state.env.site_name} {trans['install']['Installation']}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Collapse in={this.state.colStepEins}>
                                        <div id={uuidv5('collapseStepEins', v5NameSpace)}>
                                            <AppDb
                                                db={this.state.db}
                                                collapseToggle={this.collapseToggle}
                                                onSetDatabase={this.onSetDatabase}
                                            />
                                        </div>
                                    </Collapse>
                                    <Collapse in={this.state.colStepZwei}>
                                        <div id={uuidv5('collapseStepZwei', v5NameSpace)}>
                                            <AppEmail
                                                email={this.state.email}
                                                collapseToggle={this.collapseToggle}
                                                onSetEmail={this.onSetEmail}
                                            />
                                        </div>
                                    </Collapse>
                                    <Collapse in={this.state.colStepDrei}>
                                        <div id={uuidv5('collapseStepDrei', v5NameSpace)}>
                                            <AppEnv
                                                env={this.state.env}
                                                collapseToggle={this.collapseToggle}
                                                onSetEnv={this.onSetEnv}
                                                sendAxiosFormdata={this.sendAxiosFormdata}
                                            />
                                        </div>
                                    </Collapse>
                                    <Collapse in={this.state.colStepVier}>
                                        <div id={uuidv5('collapseStepVier', v5NameSpace)}>
                                            <AppUser
                                                user={this.state.user}
                                                showPw={this.state.showPw}
                                                showInstall={this.state.showInstall}
                                                collapseToggle={this.collapseToggle}
                                                onSetUser={this.onSetUser}
                                                onToggleShowPw={this.onToggleShowPw}
                                                sendAxiosFormdata={this.sendAxiosFormdata}
                                                onAppInstall={this.onAppInstall}
                                            />
                                        </div>
                                    </Collapse>
                                    {this.state.installationError ?
                                        <React.Fragment>
                                            <hr/>
                                            <Alert variant="danger"
                                                   onClose={() => this.setState({installationError: false})}
                                                   dismissible>
                                                <Alert.Heading>
                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                    {trans['install']['Installation failed']}
                                                </Alert.Heading>
                                                <p>
                                                    {this.state.errMsg}
                                                </p>
                                            </Alert></React.Fragment> : ''}
                                </Card.Body>
                            </Card>
                        </Col>
                        :
                        <Alert variant="danger">
                            <Alert.Heading>
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['install']['Installation not possible']}
                            </Alert.Heading>
                            <p>{this.state.errMsg}</p>
                        </Alert>
                    }
                </div>
            </React.Fragment>
        )
    }
}