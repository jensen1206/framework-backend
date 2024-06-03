import * as React from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from "uuid";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import * as AppTools from "../AppComponents/AppTools";
import {Card, CardBody, CardHeader, ButtonGroup, Col} from "react-bootstrap";
import FontSettings from "./Sections/FontSettings";
import ColorSettings from "./Sections/ColorSettings";
import SetAjaxResponse from "../AppComponents/SetAjaxResponse";

const reactSwal = withReactContent(Swal);
const v5NameSpace = 'fdea1554-5e41-4577-8a84-5119172a5dd7';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colFont: true,
            colColor: false,
            font_selects: [],
            fonts: [],
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.getSettings = this.getSettings.bind(this);
        this.onChangeFontFamily = this.onChangeFontFamily.bind(this);
        this.onChangeFontStyle = this.onChangeFontStyle.bind(this);
        this.onChangeFontSettings = this.onChangeFontSettings.bind(this);
        this.onSetColor = this.onSetColor.bind(this);
        this.onResetColorSettings = this.onResetColorSettings.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);


    }

    componentDidMount() {
        this.getSettings()
    }

    getSettings() {
        let formData = {
            'method': 'get_settings'
        }

        this.sendAxiosFormdata(formData).then()
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

    onChangeFontFamily(e, id, type) {
        if (type === 'font_headline') {
            const upd = [...this.state.fonts.font_headline]
            const find = this.findArrayElementById(upd, id);
            find['font-family'] = e;
            find['font-style'] = '';
            this.state.fonts.font_headline = upd
            this.setState({
                fonts: this.state.fonts
            })
        }
        if(type === 'font'){
            const upd = [...this.state.fonts.font]
            const find = this.findArrayElementById(upd, id);
            find['font-family'] = e;
            find['font-style'] = '';
            this.state.fonts.font = upd
            this.setState({
                fonts: this.state.fonts
            })
        }
    }

    onChangeFontStyle(e, id, type) {
        let upd = ''
        if (type === 'font_headline') {
             upd = [...this.state.fonts.font_headline]
            const find = this.findArrayElementById(upd, id);
            find['font-style'] = e;
            this.state.fonts.font_headline = upd;
            this.setState({
                fonts: this.state.fonts,
                spinner: {
                    showAjaxWait: true
                }
            })
        }
        if(type === 'font') {
            upd = [...this.state.fonts.font]
            const find = this.findArrayElementById(upd, id);
            find['font-style'] = e;
            this.state.fonts.font = upd;
            this.setState({
                fonts: this.state.fonts,
                spinner: {
                    showAjaxWait: true
                }
            })
        }
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData ={
                'method': 'update_font',
                'handle': type,
                'data':  JSON.stringify(upd)
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

    }

    onChangeFontSettings(e, type, id, handle) {
        let upd = ''
        if (handle === 'font_headline') {
            upd = [...this.state.fonts.font_headline]
            const find = this.findArrayElementById(upd, id);
            find[type] = e;
            this.state.fonts.font_headline = upd
            this.setState({
                fonts: this.state.fonts,
                spinner: {
                    showAjaxWait: true
                }
            })

        }
        if(handle === 'font') {
            upd = [...this.state.fonts.font]
            const find = this.findArrayElementById(upd, id);
            find[type] = e;
            this.state.fonts.font = upd;
            this.setState({
                fonts: this.state.fonts,
                spinner: {
                    showAjaxWait: true
                }
            })
        }

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData ={
                'method': 'update_font',
                'handle': handle,
                'data':  JSON.stringify(upd)
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onSetColor(e, type) {
      let upd = this.state.fonts;
      upd['color'][type] = e;
      this.setState({
          fonts: upd,
          spinner: {
              showAjaxWait: true
          }
      })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData ={
                'method': 'update_font',
                'data':  JSON.stringify(upd['color']),
                'handle': 'color'
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onToggleCollapse(target) {
        let font = false;
        let color = false;
        switch (target) {
            case 'font':
                font = true;
                break;
            case 'color':
                color = true;
                break;
        }

        this.setState({
            colFont: font,
            colColor: color
        })
    }

    onResetColorSettings() {
        let formData = {
            'method': 'reset_color_settings'
        }

        let swal = {
            'title': `${trans['swal']['Reset settings']}?`,
            'msg': trans['swal']['All settings will be lost.'],
            'btn': trans['swal']['Reset settings']
        }

        this.onDeleteSwalHandle(formData, swal)

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

    async sendAxiosFormdata(formData, isFormular = false, url = designSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, designSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_settings':
                            if (data.status) {
                                this.setState({
                                    font_selects: data.font_selects,
                                    fonts: data.fonts
                                })
                            }
                            break;
                        case 'update_font':
                        case 'update_color':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'reset_color_settings':
                            if(data.status) {
                                let upd = this.state.fonts;
                                upd['color'] = data.record
                                this.setState({
                                    fonts: upd
                                })
                            }

                              AppTools.swalAlertMsg(data);
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['builder']['Design settings']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['design']['Font and colours']}
                    </small>
                </h3>
                <hr/>
                <div style={{minHeight: '60vh'}} className="shadow-sm py-4 my-4">
                    <Col xxl={8} xl={10} xs={12} className="mx-auto">
                        <div>
                            <div className="p-3">
                                <div className="d-flex flex-wrap align-items-center">
                                    <ButtonGroup className="flex-wrap" aria-label="Basic example">
                                        <button onClick={() => this.onToggleCollapse('font')}
                                                className={`btn btn-switch-blue-outline mb-1 dark ${this.state.colFont ? 'active' : ''}`}>
                                            <i className="bi bi-fonts me-2"></i>
                                            {trans['design']['Font']}
                                        </button>
                                        <button onClick={() => this.onToggleCollapse('color')}
                                                className={`btn btn-switch-blue-outline mb-1 dark ${this.state.colColor ? 'active' : ''}`}>
                                            <i className="bi bi-fonts me-2"></i>
                                            {trans['design']['Colours']}
                                        </button>
                                    </ButtonGroup>
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
                                <Collapse in={this.state.colFont}>
                                    <div id={uuidv5('colFont', v5NameSpace)}>
                                        <FontSettings
                                            font_selects={this.state.font_selects}
                                            fonts={this.state.fonts}
                                            onChangeFontFamily={this.onChangeFontFamily}
                                            onChangeFontStyle={this.onChangeFontStyle}
                                            onChangeFontSettings={this.onChangeFontSettings}
                                        />
                                    </div>
                                </Collapse>
                                <Collapse in={this.state.colColor}>
                                    <div id={uuidv5('colColor', v5NameSpace)}>
                                        <ColorSettings
                                            fonts={this.state.fonts}
                                            onSetColor={this.onSetColor}
                                        />
                                        <hr/>
                                        <button onClick={this.onResetColorSettings}
                                            className="btn btn-warning-custom dark btn-sm">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            {trans['swal']['Reset all colour settings']}
                                        </button>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </Col>
                </div>
            </React.Fragment>
        )

    }
}