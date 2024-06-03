import * as React from "react";
import RegisterSettings from "./Sections/RegisterSettings";
import RegisterForm from "./Sections/RegisterForm";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import * as AppTools from "../AppComponents/AppTools";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            settings: {},
            regSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            }
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onGetRegisterSettings = this.onGetRegisterSettings.bind(this);
        this.onChangeSettings = this.onChangeSettings.bind(this);

    }

    componentDidMount() {
        this.onGetRegisterSettings();
    }

    onGetRegisterSettings(){
      let formData = {
          'method': 'get_settings'
      }

      this.sendAxiosFormdata(formData).then()
    }

    onChangeSettings(e, type){
        let upd = this.state.settings;
        upd[type] = e;
        this.setState({
            settings: upd,
            regSpinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'register_settings_handle',
                'registrierung': JSON.stringify(_this.state.settings),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    async sendAxiosFormdata(formData, isFormular = false, url = registerSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, registerSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_settings':
                            if (data.status) {
                                this.setState({
                                    settings: data.record
                                })
                            }
                            break;
                        case 'register_settings_handle':
                            this.setState({
                                regSpinner: {
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
                <h3 className="fw-semibold text-body pb-3">
                    {trans['System settings']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['reg']['Registration']}
                    </small>
                </h3>
                <hr/>
                <RegisterSettings
                    settings={this.state.settings}
                    spinner={this.state.regSpinner}
                    onChangeSettings={this.onChangeSettings}
                />
            </React.Fragment>
        )
    }
}