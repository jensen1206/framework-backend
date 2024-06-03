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
const v5NameSpace = 'ae555c98-d672-11ee-a9fc-325096b39f47';

const columnDefs = [{
    orderable: false,
    targets: [3, 4],
}, {
    targets: [0, 1, 2],
    className: 'align-middle'
}, {
    targets: [3, 4],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class MapProtectionTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableProtection = React.createRef();
        this.state = {
            data: [],
        }
    }
    componentDidMount() {
        this.protectionTable()
    }

    protectionTable(){
        let _this = this;
        let table = $(this.tableProtection.current).DataTable(
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
                        width: "20%",
                    },{
                        title: trans['Type'],
                        width: "20%",
                    },{
                        title: trans['media']['Created'],
                        width: "10%",
                    },{
                        title: `<i title="${trans['media']['Details']}" class="bi bi-pencil-square"></i>`,
                        width: "3%",
                         data: null,
                         defaultContent: `<button title="${trans['media']['Details']}" class="btn-details btn btn-switch-blue text-nowrap dark btn-sm"><i title="${trans['media']['Details']}" class="bi bi-pencil-square me-2"></i>${trans['Edit']}</button>`,
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
                    url: mediaGallery.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'map_protection_table',
                        'token': mediaGallery.token,
                        '_handle': mediaGallery.handle,
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-details', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'get_map_protection',
                'id': data[3]
            }
           _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'delete_map_protection',
                'id': data[4]
            }
            let swal = {
                'title': `${trans['swal']['Delete data protection']}?`,
                'msg': trans['swal']['The deletion cannot be undone.'],
                'btn' : trans['swal']['Delete data protection']
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawTable) {
            $(this.tableProtection.current).DataTable().draw('page');
            this.props.onSetDrawTable(false)
        }
    }

    componentWillUnmount() {
        $(this.tableProtection.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableProtection}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }
}