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

let jsonSearch;
let accountRoles;

const columnDefs = [{
    orderable: false,
    targets: [7, 12, 13, 14],
}, {
    targets: [1, 2, 3, 4, 5, 6, 7],
    className: 'align-middle'
}, {
    targets: [0, 8, 9, 10, 11, 12, 13, 14],
    className: 'align-middle text-center'
}, {
    targets: [1, 2, 3],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}

];
export default class AccountsTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableAccounts = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.accountSiteTable()
    }

    accountSiteTable() {

        let _props = this.props;
        let _this = this;

        table = $(this.tableAccounts.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[1, 'asc']],
                "lengthMenu": [[10, 20, 30, 50, 100, -1], [10, 20, 30, 50, 100, trans['All']]],
                "searching": true,
                "pageLength": 20,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "dom": "Blfrtip",
                "buttons": [
                    {
                        extend: 'copy',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
                        title: '',
                        width: "3%",
                    }, {
                        title: trans['profil']['Name'],
                        width: "8%",
                    }, {
                        title: trans['profil']['Company'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Email'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Phone'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Mobile'],
                        width: "10%",
                    }, {
                        title: trans['profil']['User roles'],
                        width: "10%",
                    }, {
                        title: trans['system']['Grants'],
                        width: "15%",
                    }, {
                        title: `<span class="d-none">${trans['profil']['User active']}</span><i title="${trans['profil']['User active']}" class="bi bi-person-lock"><i/>`,
                        width: "3%",
                    }, {
                        title: `<span title="${trans['profil']['2FA active']}">${trans['profil']['2FA']}</span>`,
                        width: "3%",
                    }, {
                        title: `<span class="d-none">${trans['system']['API active']}</span><i title="${trans['system']['API active']}" class="bi bi-server"></i>`,
                        width: "3%",
                    }, {
                        title: `<span class="d-none">${trans['system']['Authentication']}</span><i title="${trans['system']['Authentication']}" class="bi bi-shield-lock"></i>`,
                        width: "3%",
                    }, {
                        title: `<i title="${trans['profil']['Edit user']}" class="bi bi-pencil-square"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['profil']['Edit user']}" class="btn-edit btn btn-switch-blue text-nowrap dark btn-sm"><i class="bi bi-pencil-square"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['system']['Login as']}" class="bi bi-box-arrow-in-right"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['system']['Login as']}" class="btn-switch btn btn-success-custom text-nowrap dark btn-sm"><i class="bi bi-box-arrow-in-right"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn  text-nowrap dark btn-sm btn-danger-"><i class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                initComplete: function () {

                    this.api()
                        .columns([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
                        .every(function () {
                            let column = this;
                            column.data()
                                .unique()
                                .sort()
                            if (parseInt(column[0]) === 12 || parseInt(column[0]) === 13 || parseInt(column[0]) === 14) {
                                column.data().map((select, index) => {

                                    if (parseInt(column[0]) === 12) {
                                        //console.log(select)

                                    }
                                })
                            }

                            /* column[0].map((select, index) => {
                                 let btnData;
                                 if (select === 12) {
                                     //console.log(column.data()[0][12].email)
                                     $('button.btn-edit').attr('title', `${column.data()[0][12]['email']} ‒ ${trans['edit']}`)
                                 }
                                 if (select === 13) {
                                   //  $('button.btn-switch').attr('title', `${trans['system']['Login as']} ‒ ${column.data()[0][13]}`)
                                 }
                                 if (select === 14) {

                                 }
                             })*/
                        })
                },
                "ajax": {
                    url: accountSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'accounts_table',
                        'token': accountSettings.token,
                        '_handle': accountSettings.handle,
                    },
                    "dataSrc": function (json) {
                        accountRoles = json.roles;
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('draw', function () {
            _this.props.onSetRoleManage(accountRoles.add_account)
            let btnDelete = $('button.btn-trash');
            if (accountRoles && accountRoles.account_delete) {
                btnDelete.removeClass('pe-none btn-outline-secondary disabled').addClass('btn-danger')
            }
            if (accountRoles && !accountRoles.account_delete) {
                btnDelete.removeClass('btn-danger').addClass('pe-none btn-outline-secondary disabled')
            }
        });

        table.on('click', 'button.btn-switch', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            window.location.href = `${accountSettings.switch_url}?_switch_user=${data[13]}`;
        })

        table.on('click', 'button.btn-edit', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            _this.props.onEditUser(data[12])
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
                'id': data[14]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawAccountTable) {
            $(this.tableAccounts.current).DataTable().draw('page');
            this.props.onSetDrawAccountTable(false);
        }
    }

    componentWillUnmount() {
        $(this.tableAccounts.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableAccounts}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }
}