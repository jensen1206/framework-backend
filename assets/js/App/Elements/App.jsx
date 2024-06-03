import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import * as AppTools from "../AppComponents/AppTools";
import ElementsTable from "./Sections/ElementsTable";
import ElementEditModal from "./Sections/ElementEditModal";
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import DropzoneElementUpload from "./Sections/utils/DropzoneElementUpload";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const reactSwal = withReactContent(Swal);

const v5NameSpace = '123160d0-c729-11ee-8d18-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            drawElementsTable: false,
            loadElementModalData: false,
            elementId: '',
            colImportElement: false
        }
        this.onSetDrawElementsTable = this.onSetDrawElementsTable.bind(this);
        this.onSetLoadElementModalData = this.onSetLoadElementModalData.bind(this);

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);

    }

    onSetDrawElementsTable(state) {
        this.setState({
            drawElementsTable: state
        })
    }

    onSetLoadElementModalData(state, id = null) {
        this.setState({
            loadElementModalData: state,
            elementId: id
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

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'import_element':
                        case 'delete_element':
                            if (data.status) {
                                this.setState({
                                    drawElementsTable: true,
                                    colImportElement: false,
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }


    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['builder']['Page-Builder']} <span
                    className="ms-1 fw-light"> {trans['plugins']['Elements']}</span>
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <div className="text-end">
                    <button
                        onClick={() => this.setState({colImportElement: !this.state.colImportElement})}
                        className="btn btn-switch-blue dark">
                        {trans['plugins']['Import']}
                    </button>
                </div>
                <hr/>
                <Collapse in={this.state.colImportElement}>
                    <div id={uuidv5('collapseImport', v5NameSpace)}>
                        <DropzoneElementUpload
                            sendAxiosFormdata={this.sendAxiosFormdata}
                        />
                        <hr/>
                    </div>
                </Collapse>
                <ElementsTable
                    drawElementsTable={this.state.drawElementsTable}
                    onSetDrawElementsTable={this.onSetDrawElementsTable}
                    onSetLoadElementModalData={this.onSetLoadElementModalData}
                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                />
                <ElementEditModal
                    loadElementModalData={this.state.loadElementModalData}
                    onSetLoadElementModalData={this.onSetLoadElementModalData}
                    onSetDrawElementsTable={this.onSetDrawElementsTable}
                    id={this.state.elementId}
                />
            </React.Fragment>
        )
    }

}