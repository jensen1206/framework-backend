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
    targets: [6, 7],
}, {
    targets: [0, 1, 2, 3, 4, 5],
    className: 'align-middle'
}, {
    targets: [6, 7],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}

];

export default class ValidateUserTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableValidate = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.validateUserTable()
    }
    validateUserTable(){
        let _props = this.props;
        let _this = this;

        table = $(this.tableValidate.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[1, 'asc']],
                "lengthMenu": [[10, 20, 30, 50, 100, -1], [10, 20, 30, 50, 100, trans['All']]],
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
                        sheetName: `${publicSettings.site_name} ${trans['Users']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['Users']}`;
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
                        sheetName: `${publicSettings.site_name} ${trans['Users']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['Users']}`;
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
                        sheetName: `${publicSettings.site_name} ${trans['Users']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['Users']}`;
                        },
                    },
                ],
                "columns": [
                    {
                        title: trans['profil']['Email'],
                        width: "10%",
                    }, {
                        title: trans['reg']['Registered'],
                        width: "7%",
                    }, {
                        title: trans['profil']['Name'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Company'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Phone'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Mobile'],
                        width: "10%",
                    }, {
                        title: `<i title="${trans['reg']['Activate']}" class="bi bi-check2-circle"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['reg']['Activate']}" class="btn-validate btn  text-nowrap dark btn-sm btn-success-custom"><i class="bi bi-check2-circle me-2"></i>${trans['reg']['Activate']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn  text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: accountSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'validate_user_table',
                        'token': accountSettings.token,
                        '_handle': accountSettings.handle,
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-validate', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'validate_register_user',
                'id': data[6]
            }
            _this.props.sendAxiosFormdata(formData)
            //_this.props.onEditUser(data[7])
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete user']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['swal']['Delete user']
            }

            let formData = {
                'method': 'delete_user',
                'id': data[7]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawValidateTable) {
            $(this.tableValidate.current).DataTable().draw('page');
            this.props.onSetDrawValidateTable(false);
        }
    }

    componentWillUnmount() {
        $(this.tableValidate.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableValidate}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }
}