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
import TableMultiSelect from "./Items/TableMultiSelect";
import TableFilterSelect from "./Items/TableFilterSelect";

const v5NameSpace = '071330f0-521d-4564-9fbd-6d96dd412b1f';
let table;

const columnDefs = [{
    orderable: false,
    targets: [0, 12, 13],
}, {
    targets: [2, 3, 4, 5, 6, 8, 9],
    className: 'align-middle'
}, {
    targets: [0, 1, 6, 7, 10, 11, 12, 13],
    className: 'align-middle text-center'
}, {
    targets: [10, 11],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];

export default class MediaTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableMedia = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.mediaTable()
    }

    mediaTable() {
        let _this = this;

        table = $(this.tableMedia.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[8, 'desc']],
                "lengthMenu": [[5, 10, 15, 20, 25, 30, 50, 100, -1], [5, 10, 15, 20, 25, 30, 50, 100, trans['All']]],
                "searching": true,
                "pageLength": 25,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "columns": [
                    {
                        title: `<div class="form-check table-check check-green" title="${trans['system']['select']}"><input class="form-check-input select-all no-blur" type="checkbox"  aria-label="${trans['media']['select all']}" id=${uuidv4()}></div>`,
                        width: "3%",
                    }, {
                        title: '',
                        width: "5%",
                    }, {
                        title: trans['media']['Filename'],
                        width: "20%",
                    }, {
                        title: trans['media']['Owner'],
                        width: "13%",
                    }, {
                        title: trans['media']['Category'],
                        width: "13%",
                    }, {
                        title: trans['media']['File type'],
                        width: "10%",
                    }, {
                        title: trans['media']['Ext'],
                        width: "3%",
                    }, {
                        title: trans['media']['File size'],
                        width: "5%",
                    }, {
                        title: trans['medien']['Upload'],
                        width: "5%",
                    }, {
                        title: trans['media']['Created'],
                        width: "5%",
                    }, {
                        title: `<i title="${trans['system']['Public']}" class="bi bi-globe-americas me-1"></i> <i title="${trans['system']['Private']}" class="bi bi-incognito"></i>`,
                        width: "3%",
                    }, {
                        title: trans['media']['Exif'],
                        width: "3%",
                    }, {
                        title: trans['media']['Details'],
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['media']['Details']}" class="btn-details btn btn-switch-blue text-nowrap dark btn-sm">${trans['media']['Details']}</button>`,
                        targets: -1
                    }, {
                        title: `<i title="${trans['Delete']}" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="${trans['Delete']}" class="btn-trash btn text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                initComplete: function () {
                    this.api()
                        .columns([3, 4, 5])
                        .every(function () {
                            let column = this;
                            if (parseInt(column[0]) === 3 && publicSettings.su) {
                                let userSelect = $('#' + uuidv5('usSelectId', v5NameSpace));
                                userSelect.on('change', function () {
                                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^'+val+'$': '', true, false).draw();
                                })
                            }
                            if (parseInt(column[0]) === 4) {
                                let katSelect = $('#' + uuidv5('selectFilterCat', v5NameSpace));
                                katSelect.on('change', function () {
                                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ?  val : '', true, false).draw();
                                })
                            }
                            if (parseInt(column[0]) === 5) {
                                let typeSelect = $('#' + uuidv5('selectType', v5NameSpace));
                                typeSelect.on('change', function () {
                                    let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                    column.search(val ? '^' + val : '', true, false).draw();
                                })
                            }
                        })
                },
                "ajax": {
                    url: uploadSettings.ajax_url,
                    type: 'POST',
                    data: {
                        'method': 'media_table',
                        'token': uploadSettings.token,
                        '_handle': uploadSettings.handle,
                    },
                    "dataSrc": function (json) {
                        let selectAll = $('.form-check-input.select-all');
                        selectAll.prop('checked', false)
                        _this.props.onSetSelectTable('', 'remove_all')
                        if (!json.data.length) {
                            selectAll.prop('disabled', true)
                        } else {
                            selectAll.prop('disabled', false)
                        }
                        _this.props.onSetSelects(json.su_category_select, 'category')
                        _this.props.onSetSelects(json.types_select, 'types')
                        _this.props.onSetSelects(json.multiple_selection, 'multiple')
                        _this.props.onSetSelects(json.su_category_select, 'su-category')
                        _this.props.onSetSelects(json.user_selects, 'user')

                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'input.select-all', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let selMedia = $('input.select-media')
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
        table.on('click', 'input.select-media', function (e) {
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

        table.on('click', 'button.btn-details', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method' :'media_details',
                'id': data[12]
            }
             _this.props.sendAxiosFormdata(formData)
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `${trans['swal']['Delete file']}?`,
                'msg': trans['swal']['The deletion cannot be undone.'],
                'btn': trans['swal']['Delete file']
            }

            let formData = {
                'method': 'delete_media',
                'id': data[13]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })

        table.on('draw', function (e) {
            let html;
            html = `<div class="media-grid ${_this.props.showGrid ? '' : 'd-none'} ">`;
            $('.table-img').each(function(index, value){
                let id= $(this).attr('data-id');
                if(id) {
                    let ext = $(this).attr('data-extension');
                    let file = $(this).attr('data-file');
                    html += `<div data-id="${id}" class="media-grid-item cursor-pointer position-relative">`;

                    if (uploadSettings.extensions.includes(ext) || ext === 'svg') {
                        if (ext === 'svg') {
                            html += `<img class="media-grid-img" src="${uploadSettings.public_mediathek}/${file}" alt="">`;
                        } else {
                            html += `<div class="media-load"><div class="img-load-wait"></div> </div>`;
                            html += `<img class="media-grid-img position-relative" src="${uploadSettings.thumb_url}/${file}" alt="">`;
                        }
                    } else {
                        html += `<div style="font-size: 80px" class="media-grid-img opacity-50 bs-file-file d-block text-muted text-center file ext_${ext}"></div>`;
                    }
                    html += '</div>';

                }
            });
            html += '</div>';
            let grid = $('.media-grid');
            if(grid){
                grid.remove();
            }
            let parentTable = _this.tableMedia.current.parentNode;
            parentTable.insertAdjacentHTML('beforebegin', html)

        })

        $(document).on('click', '.media-grid-item', function (e) {
            let id = $(this).attr('data-id');
            if(!id){
                return false;
            }
            let formData = {
                'method' :'media_details',
                'id': $(this).attr('data-id')
            }
            _this.props.sendAxiosFormdata(formData)
        })


    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawMediaTable) {
            $(this.tableMedia.current).DataTable().draw('page');
            this.props.onSetDrawMediaTable(false);
        }

        if(this.props.drawShowGrid){
            if(this.props.showGrid){
                this.tableMedia.current.classList.add('d-none')
                $('.media-grid').removeClass('d-none')
            } else {
                this.tableMedia.current.classList.remove('d-none')
                $('.media-grid').addClass('d-none')
            }
            this.props.onSetDrawShowGrid(false)
        }
    }

    componentWillUnmount() {
        $(this.tableMedia.current).DataTable().destroy()
    }

    render() {
        return (
            <React.Fragment>
                <TableFilterSelect
                    typeSelects={this.props.typeSelects}
                    catId={uuidv5('selectFilterCat', v5NameSpace)}
                    typeId={uuidv5('selectType', v5NameSpace)}
                    userSelectId={uuidv5('usSelectId', v5NameSpace)}
                    userSelects={this.props.userSelects}
                    suCategorySelect={this.props.suCategorySelect}
                    onClickAddCategory={this.props.onClickAddCategory}
                />
                <hr/>
                <TableMultiSelect
                    categorySelect={this.props.categorySelect}
                    multiSelects={this.props.multiSelects}
                    catId={uuidv5('selectCat', v5NameSpace)}
                    multiId={uuidv5('selectMultiple', v5NameSpace)}
                    selectedMultiple={parseInt(this.props.selectedMultiple)}
                    selectedMultiCategory={parseInt(this.props.selectedMultiCategory)}
                    onChangeSelected={this.props.onChangeSelected}
                    selectedIds={this.props.selectedIds}
                    onExecuteMultipleBtn={this.props.onExecuteMultipleBtn}
                    suCategorySelect={this.props.suCategorySelect}
                    showGrid={this.props.showGrid}
                    onToggleGridTable={this.props.onToggleGridTable}
                />
                <Table
                    responsive
                    ref={this.tableMedia}
                    className="w-100 h-100" striped bordered>
                </Table>
                <hr/>
            </React.Fragment>
        )
    }
}