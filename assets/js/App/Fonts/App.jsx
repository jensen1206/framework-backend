import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const reactSwal = withReactContent(Swal);
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import MediaUpload from "../MediaUpload/MediaUpload";
import * as AppTools from "../AppComponents/AppTools";
import Form from "react-bootstrap/Form";
import FontLoop from "./Sections/FontLoop";
import FontInfo from "./Sections/FontInfo";
import FontSettings from "./Sections/FontSettings";
const v5NameSpace = 'faa7a782-e3af-11ee-9f9f-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.formUpdTimeOut = '';
        this.state = {
            colShowUpl: false,
            selectCategories: [],
            not_complete: false,
            uploadData: [],
            fontName: '',
            fonts: [],
            editFont: {},
            editId: '',
            fontInfo: {},
            localName: [],
            colStart: true,
            colDetails: false,
            colSettings: false,
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onMediathekCallback = this.onMediathekCallback.bind(this);
        this.getFonts = this.getFonts.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.getFontInfo = this.getFontInfo.bind(this);
        this.getFontEdit = this.getFontEdit.bind(this);
        this.onSetEditFont = this.onSetEditFont.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);



        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidMount() {
        this.getFonts()
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

    getFonts() {
        let formData = {
            'method': 'get_fonts'
        }
        this.sendAxiosFormdata(formData).then()
    }

    getFontInfo(id, infoId) {
        const getFont = [...this.state.fonts]
        const findFont = this.findArrayElementById(getFont, id);
        this.setState({
            fontInfo: this.findArrayElementById([...findFont.fontInfo], infoId),
            fontName: findFont.designation,
            localName: findFont.localName
        })
        this.onToggleCollapse('info')
    }

    getFontEdit(id, editId) {
        const getFont = [...this.state.fonts]
        const findFont = this.findArrayElementById(getFont, id);
        this.setState({
            editFont: this.findArrayElementById([...findFont.fontData], editId),
            fontName: findFont.designation,
            editId: id
        })

        this.onToggleCollapse('settings')
    }

    onSetEditFont(e, type) {

        const font = [...this.state.fonts]
        const find = this.findArrayElementById(font,this.state.editId)
        const edit = this.findArrayElementById([...find.fontData], this.state.editFont.id)
        edit[type] = e;

        this.setState({
            fonts: font,
            spinner: {
                showAjaxWait: true
            }
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'font_update',
                'id': _this.state.editId,
                'data': JSON.stringify(edit),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    onToggleCollapse(target) {
        let start = false;
        let info = false;
        let settings = false
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'info':
                info = true;
                break;
            case 'settings':
                settings = true;
                break;
        }
        this.setState({
            colStart: start,
            colDetails: info,
            colSettings: settings
        })
    }

    onMediathekCallback(data, method) {
        switch (method) {
            case 'upload':
                if (data.status) {
                    let updFonds = [...this.state.fonts];
                    const findFond = this.findArrayElementById(updFonds, data.record.id);
                    if (findFond) {
                        findFond.localName = data.record.localName;
                        findFond.fontInfo = data.record.fontInfo;
                        findFond.fontData = data.record.fontData;
                        this.setState({
                            fonts: updFonds
                        })
                    } else {
                        this.setState({
                            fonts: [...this.state.fonts, data.record]
                        })
                    }
                }
                break;
            case 'delete':

                break;
            case 'start_complete':
                if(data.complete) {
                   let formData = {
                       'method': 'update_font_face'
                   }
                   this.sendAxiosFormdata(formData).then()
                }

                break;
        }
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
                        case 'get_fonts':
                            if (data.status) {
                                this.setState({
                                    fonts: data.record
                                })
                            }
                            break;
                        case 'font_update':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_font':
                             AppTools.swalAlertMsg(data);
                             if(data.status){
                                 this.setState({
                                     fonts: this.filterArrayElementById([...this.state.fonts], data.id)
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
                    {trans['builder']['Design settings']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['system']['Manage Fonts']}
                    </small>
                </h3>
                <button onClick={() => this.setState({colShowUpl: !this.state.colShowUpl})}
                        className="btn btn-switch-blue dark">
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['design']['Add font']}
                </button>
                <hr/>
                <Collapse in={this.state.colShowUpl}>
                    <div id={uuidv5('colUpload', v5NameSpace)}>
                        <Form ref={this.uploadRefForm}
                              id={uuidv5('uploadForm', v5NameSpace)}>
                            <input type="hidden" name="method" value="font_upload"/>
                            <input type="hidden" name="account_id"
                                   value={uploadSettings.account_id}/>
                            <div className="d-flex justify-content-center upload-full">
                                <MediaUpload
                                    onMediathekCallback={this.onMediathekCallback}
                                    form_id={uuidv5('uploadForm', v5NameSpace)}
                                    showUpload={true}
                                    uploadType="fonts"
                                    assets='.ttf'
                                    maxFiles={50}
                                    chunking={true}
                                    delete_after={true}
                                />
                            </div>
                        </Form>
                        <hr/>
                    </div>
                </Collapse>
                {this.state.fonts.length ?
                    <React.Fragment>
                    <Collapse in={this.state.colStart}>
                        <div id={uuidv5('colStart', v5NameSpace)}>
                            <FontLoop
                                fonts={this.state.fonts}
                                getFontInfo={this.getFontInfo}
                                getFontEdit={this.getFontEdit}
                                onDeleteSwalHandle={this.onDeleteSwalHandle}
                            />
                        </div>
                    </Collapse>
                        <Collapse in={this.state.colDetails}>
                            <div id={uuidv5('colInfo', v5NameSpace)}>
                                <FontInfo
                                    fontInfo={this.state.fontInfo}
                                    fontName={this.state.fontName}
                                    localName={this.state.localName}
                                    onToggleCollapse={this.onToggleCollapse}
                                />
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colSettings}>
                            <div id={uuidv5('colSettings', v5NameSpace)}>
                                <FontSettings
                                    onToggleCollapse={this.onToggleCollapse}
                                    onSetEditFont={this.onSetEditFont}
                                    fontName={this.state.fontName}
                                    editFont={this.state.editFont}
                                    spinner={this.state.spinner}
                                />
                            </div>
                        </Collapse>
                    </React.Fragment>
                    :
                    <h5 className="text-danger fw-normal">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {trans['design']['no fonts available']}
                    </h5>}
            </React.Fragment>
        )
    }
}