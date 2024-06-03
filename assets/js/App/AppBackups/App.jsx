import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import SendBackupModal from "./Sections/SendBackupModal";

const reactSwal = withReactContent(Swal);
import {v5 as uuidv5} from 'uuid';
import * as AppTools from "../AppComponents/AppTools";
import BackupTable from "./Sections/BackupTable";

const v5NameSpace = 'e0580382-85b1-4730-99a0-cd6cb42a8ccd';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            drawBackupTable: false,
            loadSendBackupModalData: false,
            backupId: ''
        }

        this.onSetDrawBackupTable = this.onSetDrawBackupTable.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onAddBackup = this.onAddBackup.bind(this);
        this.onSetLoadBackupModalData = this.onSetLoadBackupModalData.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onAddDuplicate = this.onAddDuplicate.bind(this);

    }

    onSetDrawBackupTable(state) {
        this.setState({
            drawBackupTable: state
        })
    }

    onSetLoadBackupModalData(state, id = null) {
        this.setState({
            loadSendBackupModalData: state,
        })
        if (id) {
            this.setState({
                backupId: id
            })
        }
    }

    onAddBackup() {
        let formData = {
            'method': 'make_backup'
        }

        this.sendAxiosFormdata(formData).then()
    }

    onAddDuplicate() {
        let formData = {
            'method': 'make_duplicate'
        }

        this.sendAxiosFormdata(formData).then()
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

    async sendAxiosFormdata(formData, isFormular = false, url = backupSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, backupSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'make_backup':
                        case 'delete_backup':
                            if (data.status) {
                                this.setState({
                                    drawBackupTable: true
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                        case 'make_duplicate':
                            if (data.status) {
                                this.setState({
                                    drawBackupTable: true
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
                    {trans['System settings']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['backup']['Database backups']}
                    </small>
                </h3>
                {backupSettings.add_backup ?
                    <div className="d-flex align-center flex-wrap">
                        <button
                            onClick={this.onAddBackup}
                            className="btn btn-success-custom me-2 dark">
                            <i className="bi bi-database-add me-2"></i>
                            {trans['backup']['Create new backup']}
                        </button>
                        <div className="ms-auto">
                            <button
                                onClick={this.onAddDuplicate}
                                className="btn btn-switch-blue dark">
                                <i className="bi bi-copy me-2"></i>
                                {trans['system']['Create duplicate with installation']}
                            </button>
                        </div>
                    </div>
                    : ''}
                <hr/>
                <BackupTable
                    drawBackupTable={this.state.drawBackupTable}
                    onSetDrawBackupTable={this.onSetDrawBackupTable}
                    onSetLoadBackupModalData={this.onSetLoadBackupModalData}
                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                />
                <SendBackupModal
                    loadSendBackupModalData={this.state.loadSendBackupModalData}
                    id={this.state.backupId}
                    onSetLoadBackupModalData={this.onSetLoadBackupModalData}
                />
            </React.Fragment>
        )
    }
}