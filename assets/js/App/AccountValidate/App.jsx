import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const reactSwal = withReactContent(Swal);
import ValidateUserTable from "./Sections/ValidateUserTable";
import * as AppTools from "../AppComponents/AppTools";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            drawValidateTable: false,
        }

        this.onSetDrawValidateTable = this.onSetDrawValidateTable.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
    }

    onSetDrawValidateTable(state) {
        this.setState({
            drawValidateTable: state
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

    async sendAxiosFormdata(formData, url = accountSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, false, accountSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type){
                        case 'validate_register_user':
                        case 'delete_user':
                            if(data.status){
                                this.setState({
                                    drawValidateTable: true
                                })
                            }
                            AppTools.swalAlertMsg(data)
                            break;
                    }
                    if (data.status) {
                        this.setState({
                            drawValidateTable:true
                        })
                    }
                })
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['system']['Activate registrations manually']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <hr/>
                <ValidateUserTable
                    drawValidateTable={this.state.drawValidateTable}
                    onSetDrawValidateTable={this.onSetDrawValidateTable}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                />
            </React.Fragment>
        )
    }
}