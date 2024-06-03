import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import ActivityTable from "./Sections/ActivityTable";
import ActivityModal from "./Sections/ActivityModal";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import * as AppTools from "../AppComponents/AppTools";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            id: '',
            selectedIds: [],
            drawActivityTable: false,
            loadActivityModal: false,

        }

        this.onSetDrawActivityTable = this.onSetDrawActivityTable.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onSetSelectTable = this.onSetSelectTable.bind(this);
        this.onSetLoadActivityModal = this.onSetLoadActivityModal.bind(this);
        this.onDeleteSelected = this.onDeleteSelected.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    componentDidMount() {
        if (this.props.id) {
            this.onSetLoadActivityModal(true, this.props.id)
        }
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

    onSetSelectTable(id, type) {
        switch (type) {
            case 'add_all':
                this.setState({
                    selectedIds: id
                })
                break;
            case 'remove_all':
                this.setState({
                    selectedIds: []
                })
                break;
            case 'add':
                this.setState({
                    selectedIds: [...this.state.selectedIds, {
                        id: id
                    }]
                })
                break;
            case 'remove':
                const selUpd = [...this.state.selectedIds];

                this.setState({
                    selectedIds: this.filterArrayElementById(selUpd, id)
                })

                break;
        }

        /*  sleep(150).then(() => {
              if (!this.state.selectedIds.length) {
                  this.setState({
                      selectedMultiCategory: 0,
                      selectedMultiple: 0
                  })
              }
          })*/
    }

    onSetDrawActivityTable(state) {
        this.setState({
            drawActivityTable: state
        })
    }

    onSetLoadActivityModal(state, id = null) {
        this.setState({
            loadActivityModal: state,
            id: id,
        })
    }

    onDeleteSelected() {
        let swal = {
            'title': `${trans['swal']['Delete log entries']}?`,
            'msg': trans['swal']['The deletion cannot be undone.'],
            'btn': trans['swal']['Delete log entries']
        }

        let formData = {
            'method': 'delete_selected_log',
            'ids': JSON.stringify(this.state.selectedIds),
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

    async sendAxiosFormdata(formData, isFormular = false, url = logSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, logSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'delete_log':
                        case 'delete_selected_log':
                            if (data.status) {
                                this.setState({
                                    drawActivityTable: true
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
                    {trans['activity']['System Log']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {this.props.channel === 'queue' ? trans['activity']['Activity'] : trans['system']['Registrations']}

                    </small>
                </h3>
                <ActivityTable
                    drawActivityTable={this.state.drawActivityTable}
                    channel={this.props.channel}
                    selectedIds={this.state.selectedIds}
                    onSetDrawActivityTable={this.onSetDrawActivityTable}
                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                    onSetLoadActivityModal={this.onSetLoadActivityModal}
                    onSetSelectTable={this.onSetSelectTable}
                    onDeleteSelected={this.onDeleteSelected}
                />
                <ActivityModal
                    loadActivityModal={this.state.loadActivityModal}
                    id={this.state.id}
                    channel={this.props.channel}
                    onSetLoadActivityModal={this.onSetLoadActivityModal}
                    onSetDrawActivityTable={this.onSetDrawActivityTable}

                />
            </React.Fragment>
        )
    }
}