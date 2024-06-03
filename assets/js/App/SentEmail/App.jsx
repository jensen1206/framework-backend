import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import EmailSentTable from "./Sections/EmailSentTable";
import ShowSentEmail from "./Sections/ShowSentEmail";
import * as AppTools from "../AppComponents/AppTools";

const v5NameSpace = '1a1cdafe-b469-11ee-8bec-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            data: {},
            drawSentTable: false,
            collapseSentTable: false,
            collapseSentShow: false,
            isSingle: false,
            recordsTotal: 0,
            load_email_data: false,
            id: '',
        }
        this.onSetDrawSentTable = this.onSetDrawSentTable.bind(this);
        this.onToggleSeCollapse = this.onToggleSeCollapse.bind(this);
        this.onSetRecordsTotal = this.onSetRecordsTotal.bind(this);
        this.onGetShowEmail = this.onGetShowEmail.bind(this);
        this.onSetGetEmailData = this.onSetGetEmailData.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteAllEmails = this.onDeleteAllEmails.bind(this);
    }

    componentDidMount() {
        let isSingle;
        let id;
        let load_email_data;
        if (this.props.id) {
            isSingle = true
            id = this.props.id;
            load_email_data = true;
            this.onToggleSeCollapse('show')
        } else {
            this.onToggleSeCollapse('table')
            isSingle = false
        }
        this.setState({
            isSingle: isSingle,
            id: id,
            load_email_data:load_email_data
        })
    }

    async sendAxiosFormdata(formData, isFormular = false, url = emailSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, emailSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'delete_email':
                        case 'delete_all_email':
                            if (data.status) {
                                this.setState({
                                    drawSentTable: true,
                                })
                            }
                            AppTools.swalAlertMsg(data)
                    }
                }).catch(err => console.error(err));
        }
    }

    onDeleteAllEmails(){
        let swal = {
            'title': `${trans['swal']['Delete all emails']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete all emails']
        }

        let formData = {
            'method': 'delete_all_email',
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

    onSetRecordsTotal(count) {
        this.setState({
            recordsTotal: count
        })
    }

    onGetShowEmail(id) {
        this.setState({
            id: id,
            load_email_data: true
        })
        this.onToggleSeCollapse('show')
    }

    onSetGetEmailData(state) {
        this.setState({
            load_email_data: state
        })
    }

    onToggleSeCollapse(target, drawTable = false) {
        let table = true;
        let show = false;
        switch (target) {
            case 'table':
                table = true;
                show = false;
                break;
            case 'show':
                table = false;
                show = true;
                break;
        }

        this.setState({
            drawSentTable: drawTable,
            collapseSentTable: table,
            collapseSentShow: show,
        })
    }

    onSetDrawSentTable(state) {
        this.setState({
            drawSentTable: state
        })
    }

    render() {
        return (
            <React.Fragment>
                <Collapse in={this.state.collapseSentTable}>
                    <div id={uuidv5('collapseSentTable', v5NameSpace)}>
                        <EmailSentTable
                            drawSentTable={this.state.drawSentTable}
                            recordsTotal={this.state.recordsTotal}
                            onSetDrawSentTable={this.onSetDrawSentTable}
                            onSetRecordsTotal={this.onSetRecordsTotal}
                            onGetShowEmail={this.onGetShowEmail}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            onDeleteAllEmails={this.onDeleteAllEmails}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.collapseSentShow}>
                    <div id={uuidv5('collapseSentShow', v5NameSpace)}>
                        <ShowSentEmail
                            id={this.state.id}
                            isSingle={this.state.isSingle}
                            load_email_data={this.state.load_email_data}
                            onToggleSeCollapse={this.onToggleSeCollapse}
                            onSetGetEmailData={this.onSetGetEmailData}
                        />
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}