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
    targets: [3, 4, 5, 6],
}, {
    targets: [0, 1, 2],
    className: 'align-middle'
}, {
    targets: [3, 4, 5, 6],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];
export default class FormsTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableForms = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.formTable()
    }

    formTable() {
        let _this = this;
        let table = $(this.tableForms.current).DataTable(
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
                    },{
                        title: trans['forms']['Form'],
                        width: "15%",
                    },{
                        title: trans['media']['Created'],
                        width: "15%",
                    }, {
                        title: `<i title="${trans['Duplicate']}" class="bi bi-copy"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Duplicate']}" class="btn-duplicate btn btn-switch-blue text-nowrap dark btn-sm"><i  class="bi bi-copy"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['system']['Download']}" class="bi bi-cloud-download"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['system']['Download']}" class="btn-download btn btn-warning-custom text-nowrap dark btn-sm"><i  class="bi bi-cloud-download"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Edit']}" class="bi bi-tools"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['forms']['Form-Builder']}" class="btn-builder btn btn-success-custom text-nowrap dark btn-sm"><i class="bi bi-grid me-2"></i>${trans['forms']['Form-Builder']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                       // data: null,
                       // defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn btn-danger text-nowrap dark btn-sm"><i title="${trans['Delete']}" class="bi bi-trash"></i></button>`,
                       // targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: formsSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'form_table',
                        'token': formsSettings.token,
                        '_handle': formsSettings.handle,
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-duplicate', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'duplicate_forms',
                'id':  data[3]
            }
            _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-download', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            window.location.href = data[4];
        })

        table.on('click', 'button.btn-builder', function (e) {
            let data = table.row(e.target.closest('tr')).data();
             _this.props.onGetBuilder(data[5])
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['forms']['Delete form']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['forms']['Delete form']
            }

            let formData = {
                'method': 'delete_form_builder',
                'id': $(this).attr('data-id')
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawTable) {
            $(this.tableForms.current).DataTable().draw('page');
            this.props.setDrawTable(false)
        }
    }

    componentWillUnmount() {
        $(this.tableForms.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                <Table
                    responsive
                    ref={this.tableForms}
                    className="w-100 h-100" striped bordered>
                </Table>
            </React.Fragment>
        )
    }
}

