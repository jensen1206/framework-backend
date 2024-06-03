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
    targets: [3, 4, 5, 6, 7],
},{
    targets: [1, 2],
    className: 'align-middle'
},{
    targets: [0, 3, 4, 5, 6, 7],
    className: 'align-middle text-center'
},{
    targets: [],
    className: 'text-nowrap'
},{
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class SiteCategoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableSiteCategory = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.siteCategoryTable();
        let tableTarget = this.tableSiteCategory.current.querySelector('tbody')
        let options = {
            'target': tableTarget,
            'handle': '.arrow-sortable'
        }
        sortableTable(this.props.sortableCallback, options)
    }

    siteCategoryTable() {
        let _this = this;
        let table = $(this.tableSiteCategory.current).DataTable(
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
                        width: "17%",
                    }, {
                        title: trans['system']['Description'],
                        width: "25%",
                    },{
                        title: trans['Seo'],
                        width: "3%",
                    },{
                        title: trans['Cover picture'],
                        width: "3%",
                    },{
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
                "ajax": {
                    url: sitesSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'site_category_table',
                        'token': sitesSettings.token,
                        '_handle': sitesSettings.handle,
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
                'method': 'get_site_category',
                'id': data[6]
            }
            _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-trash', function (e) {

            let swal = {
                'title': `${trans['swal']['Delete category']}?`,
                'msg': trans['swal']['All pages in this category are moved to the standard category.'],
                'btn': trans['swal']['Delete category']
            }

            let formData = {
                'method': 'delete_site_category',
                'id': $(this).attr('data-id')
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.siteCategoryDraw) {
            $(this.tableSiteCategory.current).DataTable().draw('page');
            this.props.setSiteCategoryDraw(false)
        }
    }

    componentWillUnmount() {
        $(this.tableSiteCategory.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableSiteCategory}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }
}
