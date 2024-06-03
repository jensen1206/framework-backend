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

import CategoryTableFilter from "./items/CategoryTableFilter";
const v5NameSpace = 'c63daf32-4b6e-4f07-bbb0-86cc70a2d139';


const columnDefs = [{
    orderable: false,
    targets: [4, 5, 6],
}, {
    targets: [1, 2, 3],
    className: 'align-middle'
}, {
    targets: [0, 4, 5, 6],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class MedienCategoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableMediaCategory = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.mediaCategoryTable()
        let tableTarget = this.tableMediaCategory.current.querySelector('tbody')
        let options = {
            'target': tableTarget,
            'handle': '.arrow-sortable'
        }
        sortableTable(this.props.sortableCallback, options)
    }

    mediaCategoryTable() {
        let _this = this;
        let table = $(this.tableMediaCategory.current).DataTable(
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
                        title: trans['media']['Owner'],
                        width: "13%",
                    }, {
                        title: trans['Designation'],
                        width: "17%",
                    }, {
                        title: trans['system']['Description'],
                        width: "25%",
                    }, {
                        title: trans['system']['Count'],
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
                    }
                ],

                columnDefs,
                initComplete: function () {
                    this.api()
                        .columns([1])
                        .every(function () {
                            let column = this;
                            if (parseInt(column[0]) === 1 && publicSettings.su) {
                                let userSelect = $('#' + uuidv5('usSelectId', v5NameSpace));
                                userSelect.on('change', function () {
                                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                                })
                            }
                        })
                },
                "ajax": {
                    url: uploadSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'media_category_table',
                        'token': uploadSettings.token,
                        '_handle': uploadSettings.handle,
                    },
                    "dataSrc": function (json) {
                        _this.props.onSetTableSelects(json.user_selects)
                        return json.data;
                    }
                },
                destroy: true,

            });


        table.on('click', 'button.btn-details', function (e) {
            let data = table.row(e.target.closest('tr')).data();
             _this.props.onGetCategoryModal(data[5])
        })

        table.on('click', 'button.btn-trash', function (e) {

            let swal = {
                'title': `${trans['swal']['Delete category']}?`,
                'msg': trans['swal']['All documents of this category will be moved to the default category.'],
                'btn': trans['swal']['Delete category']
            }

            let formData = {
                'method': 'delete_media_category',
                'id': $(this).attr('data-id')
            }
             _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.mediaCategoryDraw) {
            $(this.tableMediaCategory.current).DataTable().draw('page');
            this.props.setMediaCategoryDraw(false)
        }
    }

    componentWillUnmount() {
        $(this.tableMediaCategory.current).DataTable().destroy()
    }

    render() {

        return (
            <React.Fragment>
                {publicSettings.su ? (<>
                <CategoryTableFilter
                    userSelects={this.props.userSelects}
                    userSelectId={uuidv5('usSelectId', v5NameSpace)}
                />
                <hr/></>) : ''}
                <Table
                    responsive
                    ref={this.tableMediaCategory}
                    className="w-100 h-100" striped bordered>
                </Table>
            </React.Fragment>
        )
    }
}