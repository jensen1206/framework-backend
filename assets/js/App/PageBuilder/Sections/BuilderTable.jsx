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
import BuilderTableFilterSelect from "../FormBuilder/Items/BuilderTableFilterSelect";

const v5NameSpace = '099991a0-c1e2-11ee-8dd4-325096b39f47';

const columnDefs = [{
    orderable: false,
    targets: [0, 3, 4, 5, 6],
}, {
    targets: [0, 1, 2],
    className: 'align-middle'
}, {
    targets: [3, 4, 5, 6],
    className: 'align-middle text-center'
}, {
    targets: [0, 1],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class BuilderTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableBuilder = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.builderTable();
    }

    builderTable() {
        let _this = this;
        let table = $(this.tableBuilder.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[1, 'asc'],[2, 'desc']],
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
                        width: "25%",
                    }, {
                        title: trans['Type'],
                        width: "10%",
                    }, {
                        title: trans['media']['Created'],
                        width: "10%",
                    }, {
                        title: `<i title="${trans['Duplicate']}" class="bi bi-copy"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Duplicate']}" class="btn-duplicate btn btn-switch-blue text-nowrap dark btn-sm"><i title="${trans['Duplicate']}" class="bi bi-copy"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['system']['Download']}" class="bi bi-cloud-download"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['system']['Download']}" class="btn-download btn btn-warning-custom text-nowrap dark btn-sm"><i title="${trans['system']['Download']}" class="bi bi-cloud-download"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Edit']}" class="bi bi-pencil-square"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Edit']}" class="btn-details btn btn-success-custom text-nowrap dark btn-sm"><i title="${trans['Edit']}" class="bi bi-tools me-2"></i>${trans['Edit']}</button>`,
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
                initComplete: function () {
                    this.api()
                        .columns([1])
                        .every(function () {
                            let column = this;
                            if (parseInt(column[0]) === 1) {
                                let typeSelect = $('#' + uuidv5('selectType', v5NameSpace));
                                typeSelect.on('change', function () {
                                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                })
                            }
                        })
                },
                "ajax": {
                    url: builderSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'builder_table',
                        'token': builderSettings.token,
                        '_handle': builderSettings.handle,
                    },
                    "dataSrc": function (json) {
                        _this.props.setTypeSelects(json.select_type)
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-details', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            _this.props.onSetLoadBuilderModalData(true, data[5])
        })

        table.on('click', 'button.btn-download', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            window.location.href = data[4];
            //_this.props.onSetLoadBuilderModalData(true, data[4])
        })

        table.on('click', 'button.btn-duplicate', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'duplicate_builder',
                'id': data[3]
            }
            _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete form builder']}?`,
                'msg': trans['swal']['All page content with this layout will be lost.'],
                'btn': trans['swal']['Delete form builder']
            }

            let formData = {
                'method': 'delete_form_builder',
                'id': data[6]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.builderTableDraw) {
            $(this.tableBuilder.current).DataTable().draw('page');
            this.props.setBuilderTableDraw(false)
        }
    }

    componentWillUnmount() {
        $(this.tableBuilder.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                <BuilderTableFilterSelect
                    typeSelects={this.props.typeSelects}
                    typeId={uuidv5('selectType', v5NameSpace)}
                />
                <hr/>
                <Table
                    responsive
                    ref={this.tableBuilder}
                    className="w-100 h-100" striped bordered>
                </Table>
            </React.Fragment>
        )
    }
}