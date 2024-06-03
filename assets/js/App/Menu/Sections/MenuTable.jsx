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
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {sortableTable} from "../../AppComponents/sortableTable";

const v5NameSpace = 'c63daf32-4b6e-4f07-bbb0-86cc70a2d139';

const columnDefs = [{
    orderable: false,
    targets: [5, 6],
}, {
    targets: [1, 2, 3, 4],
    className: 'align-middle'
}, {
    targets: [0, 5, 6],
    className: 'align-middle text-center'
}, {
    targets: [4],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class MenuTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableMenu = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.menuTable();
        let tableTarget = this.tableMenu.current.querySelector('tbody')
        let options = {
            'target': tableTarget,
            'handle': '.arrow-sortable'
        }
        sortableTable(this.props.sortableMenuTableCallback, options)
    }

    menuTable() {
        let _this = this;

        let table = $(this.tableMenu.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[0, 'asc']],
                "lengthMenu": [[5, 10, 15, 20, 30, 50, 100, -1], [5, 10, 15, 20, 30, 50, 100, trans['All']]],
                "searching": true,
                "pageLength": 10,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "columns": [
                    {
                        title: `<i class="bi bi-arrows-move"></i>`,
                        width: "3%",
                    }, {
                        title: trans['Designation'],
                        width: "17%",
                    }, {
                        title: trans['system']['Description'],
                        width: "25%",
                    }, {
                        title: trans['system']['Slug'],
                        width: "17%",
                    }, {
                        title: trans['system']['Menu type'],
                        width: "5%",
                    }, {
                        title: `<i title="${trans['media']['Details']}" class="bi bi-pencil-square"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['media']['Details']}" class="btn-details btn btn-switch-blue text-nowrap dark btn-sm"><i title="${trans['media']['Details']}" class="bi bi-pencil-square"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-delete btn btn-danger text-nowrap dark btn-sm"><i title="${trans['Delete']}" class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],

                columnDefs,
                "ajax": {
                    url: menuSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'menu_table',
                        'token': menuSettings.token,
                        '_handle': menuSettings.handle,
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-details', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            _this.props.setLoadDetails(true, data[5])
        })

        table.on('click', 'button.btn-delete', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete menu']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['swal']['Delete menu']
            }

            let formData = {
                'method': 'delete_menu',
                'id': data[6]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.menuTableDraw) {
            $(this.tableMenu.current).DataTable().draw('page');
            this.props.setMenuTableDraw(false)
        }
    }

    componentWillUnmount() {
        $(this.tableMenu.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableMenu}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }

}