import * as React from "react";

const JSZip = require('jszip');

window.JSZip = JSZip;

import "datatables.net-bs5";
import 'datatables.net'
import 'datatables.net-dt'
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons'
import 'datatables-buttons-excel-styles';
import 'datatables.net-select';
// Datatables - Buttons
import 'datatables.net-buttons-bs5';

import DTGerman from "../../AppComponents/DTGerman";
import Table from "react-bootstrap/Table";
import 'datatables-buttons-excel-styles';

let table;
let countData = 0;
const columnDefs = [{
    orderable: false,
    targets: [8,9],
}, {
    targets: [0, 1, 2, 3, 4, 5, 6, 7],
    className: 'align-middle'
}, {
    targets: [8,9],
    className: 'align-middle text-center'
}, {
    targets: [2, 3, 4],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class EmailPublicSentTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableEmailSent = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        if(this.props.drawSentTable) {

        }

        this.sentEmailTable()

    }

    sentEmailTable() {
        let _props = this.props;
        let _this = this;
        table = $(this.tableEmailSent.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[0, 'desc']],
                "lengthMenu": [[5, 10, 15, 20, 30, 50, 100, -1], [5, 10, 15, 20, 30, 50, 100, trans['All']]],
                "searching": true,
                "pageLength": 15,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "dom": "Blfrtip",
                "buttons": [
                    {
                        extend: 'copy',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-files me-1"></i> ${trans['Copy']}`,
                        // autoFilter: true,
                        sheetName: `${publicSettings.site_name} ${trans['system']['Sent emails']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['system']['Sent emails']}${trans['system']['Sent emails']}`;
                        },
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-filetype-csv me-1"></i>${trans['CSV']}`,
                        sheetName: `${publicSettings.site_name} ${trans['system']['Sent emails']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['system']['Sent emails']}`;
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        excelStyles: [
                            {
                                cells: "1",
                                height: '35',
                                style: {
                                    "alignment": {
                                        "vertical": "center"
                                    },
                                    font: {
                                        name: "Arial",
                                        size: "14",
                                        color: "FFFFFF",
                                        b: true,
                                    },
                                    fill: {                     // Style the cell fill (background)
                                        pattern: {              // Type of fill (pattern or gradient)
                                            color: "ff8c00",    // Fill color
                                        }
                                    }
                                }
                            },
                            {
                                cells: "2",
                                style: {
                                    font: {
                                        name: "Arial",
                                        size: "11",
                                        color: "FFFFFF",
                                        b: true,

                                    },
                                    fill: {
                                        pattern: {
                                            color: "6fb320",

                                        }
                                    }
                                }
                            },
                        ],
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-filetype-xls me-1"></i>${trans['Excel']}`,
                        // autoFilter: true,
                        sheetName: `${publicSettings.site_name}  ${trans['system']['Sent emails']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['system']['Sent emails']}`;
                        },
                    },
                ],
                "columns": [
                    {
                        title: trans['email']['Sent'],
                        width: "5%",
                    }, {
                        title: trans['Type'],
                        width: "5%",
                    }, {
                        title: trans['forms']['Form'],
                        width: "10%",
                    }, {
                        title: trans['email']['Sent from'],
                        width: "10%",
                    }, {
                        title: trans['email']['Sent to'],
                        width: "10%",
                    }, {
                        title: 'Cc',
                        width: "10%",
                    }, {
                        title: 'Bcc',
                        width: "10%",
                    }, {
                        title: trans['email']['Subject'],
                        width: "18%",
                    },{
                        title: `<i title="${trans['email']['Show email']}" class="bi bi-envelope-paper"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['email']['Show email']}" class="btn-show btn btn-switch-blue text-nowrap dark btn-sm"><i class="bi bi-envelope-paper"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: formsSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'email_sent_table',
                        'token': formsSettings.token,
                        '_handle': formsSettings.handle,
                    },
                    "dataSrc": function (json) {
                        _this.props.onSetRecordsTotal(json.recordsTotal)
                       return json.data;
                    }
                },
                destroy: true,
            });

        table.on('click', 'button.btn-show', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            _this.props.onGetShowEmail(data[8])
        })
        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete email']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['swal']['Delete email']
            }

            let formData = {
                'method': 'delete_email',
                'id': data[9]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawSentTable) {
            $(this.tableEmailSent.current).DataTable().draw('page');
            this.props.onSetDrawSentTable(false);
        }
    }

    componentWillUnmount() {
        $(this.tableEmailSent.current).DataTable().destroy()
    }


    render() {
        return (
            <React.Fragment>
                <h3 className="fw-semibold text-body pb-3">
                    {trans['system']['Sent emails']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <hr/>
                <Table
                    responsive
                    ref={this.tableEmailSent}
                    className="w-100 h-100" striped bordered>
                </Table>
                <hr/>
                <button
                    onClick={this.props.onDeleteAllEmails}
                    className={`btn  dark ${this.props.recordsTotal > 0 ? 'btn-danger' : 'btn-outline-secondary disabled'}`}
                    type="button">
                    <i className="bi bi-trash me-2"></i>
                    {trans['email']['Delete all emails']}
                </button>
            </React.Fragment>
        )
    }
}
