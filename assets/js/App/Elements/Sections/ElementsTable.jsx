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
    targets: [4, 5, 6],
}, {
    targets: [0, 1, 2, 3],
    className: 'align-middle'
}, {
    targets: [4, 5, 6],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class ElementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableElements = React.createRef();
        this.state = {
            data: [],
        }
    }
    componentDidMount() {
        this.elementsTable()
    }
    elementsTable() {
        let _this = this;
        table = $(this.tableElements.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[3, 'desc']],
                "lengthMenu": [[5, 10, 15, 20, 30, 50, 100, -1], [5, 10, 15, 20, 30, 50, 100, trans['All']]],
                "searching": true,
                "pageLength": 15,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "columns": [
                    {
                        title: trans['Designation'],
                        width: "15%",
                    }, {
                        title: trans['Section'],
                        width: "10%",
                    }, {
                        title: trans['Type'],
                        width: "10%",
                    }, {
                        title: trans['profil']['Created'],
                        width: "10%",
                    },{
                        title: `<i title="${trans['system']['Download']}" class="bi bi-download"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['system']['Download']}" class="btn-download btn btn-warning-custom text-nowrap dark btn-sm"><i class="bi bi-download me-2"></i> ${trans['system']['Download']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['plugins']['Rename']}" class="bi bi-tools"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['plugins']['Rename']}" class="btn-show btn btn-switch-blue text-nowrap dark btn-sm"><i class="bi bi-tools me-2"></i>${trans['plugins']['Rename']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash me-2"></i>${trans['Delete']}</button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: builderPluginSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'elements_table',
                        'token': builderPluginSettings.token,
                        '_handle': builderPluginSettings.handle,
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-show', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            _this.props.onSetLoadElementModalData(true, data[5])
        })

        table.on('click', 'button.btn-download', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            window.location.href = data[4];
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete element']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['swal']['Delete element']
            }

            let formData = {
                'method': 'delete_element',
                'id': data[6]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawElementsTable) {
            $(this.tableElements.current).DataTable().draw('page');
            this.props.onSetDrawElementsTable(false);
        }
    }

    componentWillUnmount() {
        $(this.tableElements.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableElements}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }

}