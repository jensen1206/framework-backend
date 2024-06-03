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
import {v4 as uuidv4} from "uuid";

let table;

const columnDefs = [{
    orderable: false,
    targets: [0, 8, 9, 10],
}, {
    targets: [1, 2, 3, 4, 5, 6, 7],
    className: 'align-middle'
}, {
    targets: [0, 8, 9, 10],
    className: 'align-middle text-center'
}, {
    targets: [7],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class ActivityTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableActivity = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.activityTable()
    }

    activityTable() {
        let _props = this.props;
        let _this = this;
        table = $(this.tableActivity.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[1, 'desc']],
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
                            columns: [1, 2, 3, 4, 5, 6, 7, 8],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-files me-1"></i> ${trans['Copy']}`,
                        // autoFilter: true,
                        sheetName: `${publicSettings.site_name} ${trans['activity']['Activity']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['activity']['Activity']}`;
                        },
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-filetype-csv me-1"></i>${trans['CSV']}`,
                        sheetName: `${publicSettings.site_name} ${trans['activity']['Activity']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['activity']['Activity']}`;
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8],
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
                        sheetName: `${publicSettings.site_name} ${trans['activity']['Activity']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['activity']['Activity']}`;
                        },
                    },
                ],
                "columns": [
                    {
                        title: `<div class="form-check table-check check-green" title="${trans['system']['select']}"><input class="form-check-input select-all no-blur" type="checkbox"  aria-label="${trans['media']['select all']}" id=${uuidv4()}></div>`,
                        width: "3%",
                    }, {
                        title: trans['activity']['Date'],
                        width: "5%",
                    }, {
                        title: trans['activity']['Channel'],
                        width: "5%",
                    }, {
                        title: trans['activity']['Type'],
                        width: "5%",
                    }, {
                        title: trans['activity']['Entry'],
                        width: "20%",
                    }, {
                        title: trans['activity']['User'],
                        width: "8%",
                    }, {
                        title: trans['activity']['Level'],
                        width: "5%",
                    }, {
                        title: trans['activity']['Level Name'],
                        width: "5%",
                    }, {
                        title: trans['activity']['Request ID'],
                        width: "12%",
                    }, {
                        title: trans['activity']['Show'],
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['activity']['Show']}" class="btn-modal btn btn-switch-blue dark text-nowrap btn-sm"><i class="bi bi-envelope me-2"></i>${trans['activity']['Show']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                    }
                ],
                columnDefs,
                "ajax": {
                    url: logSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'activity_table',
                        'token': logSettings.token,
                        '_handle': logSettings.handle,
                        'channel': _this.props.channel
                    },
                    "dataSrc": function (json) {
                        let selectAll = $('.form-check-input.select-all');
                        selectAll.prop('checked', false)
                        _this.props.onSetSelectTable('', 'remove_all')
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-modal', function (e) {
            let data = table.row(e.target.closest('tr')).data();

            _this.props.onSetLoadActivityModal(true, data[9])
        })

        table.on('click', 'button.btn-trash', function (e) {
            let swal = {
                'title': `${trans['swal']['Delete log entry']}?`,
                'msg': trans['swal']['The deletion cannot be undone.'],
                'btn': trans['swal']['Delete log entry']
            }

            let formData = {
                'method': 'delete_log',
                'id': $(e.target).attr('data-id')
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })

        table.on('click', 'input.select-all', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let selMedia = $('input.select-log')
            let type;
            let parentTr;
            let addArr = [];
            if ($(this).prop('checked')) {
                selMedia.each(function (index, value) {
                    parentTr = $(this).parents('tr');
                    $(this).prop('checked', true)
                    $(this).parents('tr').addClass('table-selected')
                    let fd = {
                        id: $(this).attr('data-id')
                    }
                    addArr.push(fd)
                });
                _this.props.onSetSelectTable(addArr, 'add_all')
            } else {
                selMedia.each(function (index, value) {
                    parentTr = $(this).parents('tr');
                    $(this).prop('checked', false)
                    $(this).parents('tr').removeClass('table-selected')
                    //
                });

                _this.props.onSetSelectTable('', 'remove_all')
            }
        })

        table.on('click', 'input.select-log', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let parentTr = $(this).parents('tr');

            if ($(this).prop('checked')) {
                parentTr.addClass('table-selected')
                _this.props.onSetSelectTable($(this).attr('data-id'), 'add')
            } else {
                parentTr.removeClass('table-selected')
                _this.props.onSetSelectTable($(this).attr('data-id'), 'remove')
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawActivityTable) {
            $(this.tableActivity.current).DataTable().draw('page');
            this.props.onSetDrawActivityTable(false);
        }
    }

    componentWillUnmount() {
        $(this.tableActivity.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                <Table
                    responsive
                    ref={this.tableActivity}
                    className="w-100 h-100" striped bordered>
                </Table>
                <hr/>
                <button onClick={this.props.onDeleteSelected}
                    className={`btn dark ${this.props.selectedIds.length ? 'btn-danger' : 'btn-outline-secondary pe-none'}`}>
                    <i className="bi bi-trash me-2"></i>
                    {trans['medien']['Delete selected']}
                </button>
            </React.Fragment>
        )
    }
}