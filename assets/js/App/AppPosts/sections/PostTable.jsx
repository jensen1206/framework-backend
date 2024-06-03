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
import CategoryTableSelect from "../../AppSites/Sections/CategoryTableSelect";

const v5NameSpace = 'ae555c98-d672-11ee-a9fc-325096b39f47';

const columnDefs = [{
    orderable: false,
    targets: [9, 10, 11],
}, {
    targets: [1, 2, 3, 4],
    className: 'align-middle'
}, {
    targets: [0, 5, 6, 7, 8, 9, 10, 11],
    className: 'align-middle text-center'
}, {
    targets: [ 5, 6],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class PostTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tablePost = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.websiteTable();
        let tableTarget = this.tablePost.current.querySelector('tbody')
        let options = {
            'target': tableTarget,
            'handle': '.arrow-sortable'
        }
        sortableTable(this.props.sortableCallback, options)
    }

    websiteTable() {
        let _this = this;
        let table = $(this.tablePost.current).DataTable(
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
                        title: trans['system']['Title'],
                        width: "20%",
                    },{
                        title: trans['Type'],
                        width: "5%",
                    }, {
                        title: trans['system']['Status'],
                        width: "5%",
                    }, {
                        title: trans['media']['Category'],
                        width: "10%",
                    }, {
                        title: trans['seo']['no-follow'],
                        width: "3%",
                    }, {
                        title: trans['seo']['no-index'],
                        width: "3%",
                    }, {
                        title: trans['seo']['FB'],
                        width: "3%",
                    }, {
                        title: trans['seo']['X'],
                        width: "3%",
                    }, {
                        title: `<i title="${trans['Seo']}" class="bi bi-globe-americas"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Seo']}" class="btn-seo btn btn-success-custom text-nowrap dark btn-sm"><i title="${trans['media']['Details']}" class="bi bi-globe-americas me-2"></i>${trans['Seo']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['media']['Details']}" class="bi bi-pencil-square"></i>`,
                         width: "3%",
                        // data: null,
                        // defaultContent: `<button title="${trans['media']['Details']}" class="btn-details btn btn-switch-blue text-nowrap dark btn-sm"><i title="${trans['media']['Details']}" class="bi bi-pencil-square me-2"></i>${trans['Edit']}</button>`,
                        // targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                       // data: null,
                       // defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn btn-danger text-nowrap dark btn-sm"><i title="${trans['Delete']}" class="bi bi-trash"></i></button>`,
                       // targets: -1
                    }
                ],
                "dom": "Blfrtip",
                "buttons": [
                    {
                        extend: 'copy',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-files me-1"></i> ${trans['Copy']}`,
                        // autoFilter: true,
                        sheetName: `${publicSettings.site_name} ${trans['system']['Sites']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['system']['Sites']}`;
                        },
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            format: {
                                body: function (data, row, column, node) {
                                    return data.replace(/(<([^>]+)>)/gi, "");
                                }
                            }
                        },
                        className: 'btn btn-secondary dark btn-sm btn-table',
                        text: `<i class="bi bi-filetype-csv me-1"></i>${trans['CSV']}`,
                        sheetName: `${publicSettings.site_name} ${trans['system']['Sites']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['system']['Sites']}`;
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
                        sheetName: `${publicSettings.site_name} ${trans['system']['Sites']}`,
                        title: function () {
                            return `${publicSettings.site_name} ${trans['system']['Sites']}`;
                        },
                    },
                ],

                columnDefs,
                initComplete: function () {
                    this.api()
                        .columns([4])
                        .every(function () {
                            let column = this;
                            if (parseInt(column[0]) === 4) {
                                let userSelect = $('#' + uuidv5('catSelectId', v5NameSpace));
                                userSelect.on('change', function () {
                                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                })
                            }
                        })
                },
                "ajax": {
                    url: postSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'post_table',
                        'token': postSettings.token,
                        '_handle': postSettings.handle,
                    },
                    "dataSrc": function (json) {
                        _this.props.onSetCategorySelect(json.categories)
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-seo', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'get_site',
                'handle': 'seo',
                'id': data[9]
            }
            _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-details', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'get_site',
                'handle': 'site',
                'id':  $(this).attr('data-id')
            }
            _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['posts']['Delete post']}?`,
                'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
                'btn': trans['posts']['Delete post']
            }

            let formData = {
                'method': 'delete_post',
                'id': $(this).attr('data-id')
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawTable) {
            $(this.tablePost.current).DataTable().draw('page');
            this.props.onSetDrawTable(false)
        }
    }

    componentWillUnmount() {
        $(this.tablePost.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                 <CategoryTableSelect
                   catSelects={this.props.categorySelect}
                   catSelectId={uuidv5('catSelectId', v5NameSpace)}
                />
                <hr/>
                <Table
                    responsive
                    ref={this.tablePost}
                    className="w-100 h-100" striped bordered>
                </Table>
            </React.Fragment>
        )
    }
}
