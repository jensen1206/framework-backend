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
import CategoryTableSelect from "../../AppSites/Sections/CategoryTableSelect";


const v5NameSpace = '071330f0-521d-4564-9fbd-6d96dd412b1f';


const columnDefs = [{
    orderable: false,
    targets: [3, 4, 5],
}, {
    targets: [0, 1, 2],
    className: 'align-middle'
}, {
    targets: [3, 4, 5],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class HeaderFooterTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableHF = React.createRef();
        this.state = {
            data: [],
        }
    }
    componentDidMount() {
        this.headerFooterTable()
    }

    headerFooterTable() {
        let _this = this;

        let table = $(this.tableHF.current).DataTable(
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
                        title: trans['Designation'],
                        width: "50%",
                    }, {
                        title: trans['system']['Status'],
                        width: "15%",
                    }, {
                        title: trans['Type'],
                        width: "15%",
                    },
                    {
                        title: `<i title="${trans['Edit']}" class="bi bi-gear"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button class="btn-edit btn btn-switch-blue text-nowrap dark btn-sm"><i class="bi bi-gear me-2"></i>${trans['Edit']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['builder']['Page-Builder']}" class="bi bi-grid"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button class="btn-builder btn btn-success-custom text-nowrap dark btn-sm"><i class="bi bi-grid me-2"></i>${trans['builder']['Page-Builder']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn btn-danger text-nowrap dark btn-sm"><i title="${trans['Delete']}" class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: sitesSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'header_footer_table',
                        'type': _this.props.type,
                        'token': sitesSettings.token,
                        '_handle': sitesSettings.handle,
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-edit', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'get_footer_header',
                'id':  data[3]
            }
             _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-builder', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'get_site_header_footer',
                'type': _this.props.type,
                'id': data[4]
            }
            _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete page']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['swal']['Delete page']
            }

            let formData = {
                'method': 'delete_footer_header',
                'id': data[5]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawTable) {
            $(this.tableHF.current).DataTable().draw('page');
            this.props.setDrawTable(false)
        }
    }

    componentWillUnmount() {
        $(this.tableHF.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                <Table
                    responsive
                    ref={this.tableHF}
                    className="w-100 h-100" striped bordered>
                </Table>
            </React.Fragment>
        )
    }
}