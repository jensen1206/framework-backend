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
const columnDefs = [{
    orderable: false,
    targets: [6, 7, 8, 9],
}, {
    targets: [0, 1, 2, 3, 4, 5],
    className: 'align-middle'
}, {
    targets: [6, 7, 8, 9],
    className: 'align-middle text-center'
}, {
    targets: [7],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class BackupTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableBackup = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.backupTable()
    }

    backupTable() {
        let _props = this.props;
        let _this = this;

        table = $(this.tableBackup.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[2, 'desc']],
                "lengthMenu": [[5, 10, 15, 20, 30, 50, 100, -1], [5, 10, 15, 20, 30, 50, 100, trans['All']]],
                "searching": true,
                "pageLength": 10,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "dom": "Blfrtip",
                "buttons": [
                    {
                        extend: 'copy',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-files me-1"></i> ${trans['Copy']}`,
                        // autoFilter: true,
                        sheetName: `${publicSettings.site_name} ${trans['backup']['Database backups']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['backup']['Database backups']}`;
                        },
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-filetype-csv me-1"></i>${trans['CSV']}`,
                        sheetName: `${publicSettings.site_name} ${trans['backup']['Database backups']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['backup']['Database backups']}`;
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5],
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
                        sheetName: `${trans['backup']['Database backups']}`,
                        title: function () {
                            return `${trans['backup']['Database backups']}`;
                        },
                    },
                ],
                "columns": [
                    {
                        title: trans['backup']['File name'],
                        width: "40%",
                    }, {
                        title: trans['backup']['Status'],
                        width: "6%",
                    }, {
                        title: trans['backup']['Created'],
                        width: "10%",
                    }, {
                        title: trans['backup']['File size'],
                        width: "10%",
                    }, {
                        title: trans['activity']['Type'],
                        width: "6%",
                    }, {
                        title: trans['backup']['Version'],
                        width: "3%",
                    }, {
                        title: trans['backup']['Installer'],
                        width: "3%",
                    }, {
                        title: trans['system']['Download'],
                        width: "3%",
                       // data: null,
                       // defaultContent: `<button title="${trans['system']['Download']}" class="btn-download btn btn-success-custom dark text-nowrap btn-sm"><i class="bi bi-download me-2"></i>${trans['system']['Download']}</button>`,
                       // targets: -1
                    }, {
                        title: trans['backup']['Email'],
                        width: "3%",
                        //data: null,
                       // defaultContent: `<button title="${trans['backup']['Email']}" class="btn-email btn btn-switch-blue dark text-nowrap btn-sm"><i class="bi bi-envelope me-2"></i>${trans['backup']['Email']}</button>`,
                       // targets: -1
                    },{
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: backupSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'backup_table',
                        'token': backupSettings.token,
                        '_handle': backupSettings.handle,
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            });

        table.on('click', 'button.btn-download', function (e) {
           // let data = table.row(e.target.closest('tr')).data();
             window.location.href = $(this).attr('data-url');
        })

        table.on('click', 'button.btn-email', function (e) {
          //  let data = table.row(e.target.closest('tr')).data();
            _this.props.onSetLoadBackupModalData(true, $(this).attr('data-id'))
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete backup']}?`,
                'msg': trans['swal']['The deletion cannot be undone.'],
                'btn': trans['swal']['Delete backup']
            }

            let formData = {
                'method': 'delete_backup',
                'id': data[9]['id'],
                'type': data[9]['type'],
                'archiv': data[9]['archiv']
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawBackupTable) {
            $(this.tableBackup.current).DataTable().draw('page');
            this.props.onSetDrawBackupTable(false);
        }
    }

    componentWillUnmount() {
        $(this.tableBackup.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                <Table
                    responsive
                    ref={this.tableBackup}
                    className="w-100 h-100" striped bordered>
                </Table>
            </React.Fragment>
        )
    }
}