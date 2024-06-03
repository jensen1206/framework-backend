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
import AddCustomFieldModal from "./Sections/AddCustomFieldModal";
import SetAjaxResponse from "../AppComponents/SetAjaxResponse";
import CustomFieldLoop from "./Sections/CustomFieldLoop";
const reactSwal = withReactContent(Swal);
const v5NameSpace = '8a4cdad4-f638-11ee-8f9a-325096b39f47';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            addCustomFieldModal: false,
            colOverview: true,
            colDetails: false,
            selectType: [],
            customTypes: [],
            id: '',
            addField: {
                designation: '',
                type: 'text'
            },
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.get_custom_fields = this.get_custom_fields.bind(this);
        this.setShowAddCustomFieldModal = this.setShowAddCustomFieldModal.bind(this);
        this.onSetAddCustomFieldValue = this.onSetAddCustomFieldValue.bind(this);
        this.onSetValue = this.onSetValue.bind(this);
        this.setSaveAjax = this.setSaveAjax.bind(this);
        this.onSetCustomSortable = this.onSetCustomSortable.bind(this);
        this.onDeleteCustomField = this.onDeleteCustomField.bind(this);
        this.onUpdateSortable = this.onUpdateSortable.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }


    componentDidMount() {
        this.get_custom_fields();
    }

    onSetValue(e, type , id) {
        const edit = [...this.state.customTypes]
        const find = this.findArrayElementById(edit, id);
        find[type] = e;
        this.setState({
            customTypes: edit,
            spinner: {
                showAjaxWait: true
            }
        })

        this.setSaveAjax(this.state.customTypes, 'update_custom_field')
    }

    onSetCustomSortable(newState) {
       this.setState({
           customTypes: newState
       })
    }

    onUpdateSortable() {

        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        sleep(50).then(() => {
            this.setSaveAjax(this.state.customTypes, 'update_custom_field')
        })
    }

    onDeleteCustomField(id) {
        let swal = {
            'title':`${trans['system']['Delete field']}?`,
            'msg': trans['swal']['The deletion cannot be undone.'],
            'btn': trans['system']['Delete field']
        }
        let formData = {
            'method': 'delete_custom_field',
            'field_id': id,
            'id': this.state.id,
        }
        this.onDeleteSwalHandle(formData, swal)
    }

    setSaveAjax(data, method){
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': method,
                'id': _this.state.id,
                'custom': JSON.stringify(data),
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
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

    onToggleCollapse(target, load = false) {
        let start = false;
        let details = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'details':
                details = true;
                break;
        }

        this.setState({
            colDetails: details,
            colOverview: start
        })

        if (load) {
            this.get_custom_fields();
        }

    }

    setShowAddCustomFieldModal(state) {
        this.setState({
            addCustomFieldModal: state,
            addField: {
                designation: '',
                type: 'text'
            },
        })
    }

    onSetAddCustomFieldValue(e, type) {
        let upd = this.state.addField;
        upd[type] = e;
        this.setState({
            addField: upd
        })
    }


    get_custom_fields() {
        let formData = {
            'method': 'get_custom_fields'
        }

        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = mediaGallery.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, mediaGallery))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_custom_fields':
                            this.setState({
                                selectType: data.selects
                            })
                            if (data.status) {
                                this.setState({
                                    customTypes: data.record.data || [],
                                    id: data.record.id || '',
                                })
                                this.onToggleCollapse('start')
                            }
                            break;
                        case 'add_custom_field':
                            if (data.status) {
                                AppTools.swalAlertMsg(data)
                                this.setState({
                                    addCustomFieldModal: false,
                                    addField: {
                                        designation: '',
                                        type: 'text'
                                    }
                                })
                                this.onToggleCollapse('start', true)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_custom_field':
                            this.setState({
                                spinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_custom_field':
                             if(data.status){
                                 this.setState({
                                     customTypes: this.filterArrayElementById([...this.state.customTypes], data.id)
                                 })
                                 AppTools.swalAlertMsg(data)
                             } else {
                                 AppTools.warning_message(data.msg);
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
                    {trans['system']['Custom Fields']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <Button
                    onClick={() => this.setState({addCustomFieldModal: true})}
                    variant={`success-custom dark`}>
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['system']['Add Custom Field']}
                </Button>
                <hr/>
                <Collapse in={this.state.colOverview}>
                    <div id={uuidv5('colOverview', v5NameSpace)}>
                        <CustomFieldLoop
                            selectType={this.state.selectType}
                            customTypes={this.state.customTypes}
                            spinner={this.state.spinner}
                            onSetValue={this.onSetValue}
                            onSetCustomSortable={this.onSetCustomSortable}
                            onDeleteCustomField={this.onDeleteCustomField}
                            onUpdateSortable={this.onUpdateSortable}
                        />
                    </div>
                </Collapse>
                <AddCustomFieldModal
                    addField={this.state.addField}
                    addCustomFieldModal={this.state.addCustomFieldModal}
                    selectType={this.state.selectType}

                    setShowAddCustomFieldModal={this.setShowAddCustomFieldModal}
                    onSetAddCustomFieldValue={this.onSetAddCustomFieldValue}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                />
            </React.Fragment>
        )
    }
}