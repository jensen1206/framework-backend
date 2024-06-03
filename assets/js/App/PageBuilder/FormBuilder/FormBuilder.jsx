import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import axios from "axios";
import Collapse from 'react-bootstrap/Collapse';
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import FormBuilderSettings from "./FormBuilderSettings";
import FormBuilderLoopSettings from "./FormBuilderLoopSettings";
import BuilderPlugins from "../../PageBuilderPlugins/BuilderPlugins";
import PluginEditModal from "../../PageBuilderPlugins/Modal/PluginEditModal";
import PagePlugins from "../../PageBuilderPlugins/Sections/PagePlugins";
import RowEditModal from "../../PageBuilderPlugins/Modal/RowEditModal";
import ColumnEditModal from "../../PageBuilderPlugins/Modal/ColumnEditModal";
import SectionSelectModal from "../../PageBuilderPlugins/Modal/SectionSelectModal";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
const v5NameSpace = '68093668-ba9d-4fca-9ee2-880277efee5f';

import {ReactSortable} from "react-sortablejs";

export default class FormBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.builderRef = React.createRef();
        this.state = {
            builderStatus: false,
            builderSelects: [],
            loadOverviewModal: false,
            loadPluginEditModal: false,
            showRowEditModal: false,
            showColumnEditModal: false,
            showRowSaveCollapse: false,
            triggerRowEditStart: false,
            triggerColumnEditStart: false,
            colLayout: true,
            pluginData: {},
            colSettings: false,
            colLoopSettings: false,
            builder: [],
            editRow: {},
            savedSections: [],
            showSectionModal: false,
            editColumn: {},
            settings: {},
            loadPlugin: {
                group: '',
                grid: '',
                input: ''
            },
            loadEditPlugin: {
                group: '',
                grid: '',
                input: ''
            },
            version: '',
            builderType: '',
            sortableOptions: {
                animation: 300,
                // handle: ".arrow-sortable",
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            settingsSpinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            }
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.onGetFormBuilder = this.onGetFormBuilder.bind(this);
        this.onUpdateSettings = this.onUpdateSettings.bind(this);
        this.onSetSaveRowCollapse = this.onSetSaveRowCollapse.bind(this);
        this.onSetColumnEdit = this.onSetColumnEdit.bind(this);

        //Builder Split
        this.onDeleteCol = this.onDeleteCol.bind(this);
        this.onSplitCol = this.onSplitCol.bind(this);
        this.onAddBuilderRow = this.onAddBuilderRow.bind(this)
        this.onDeleteGroup = this.onDeleteGroup.bind(this)

        //Plugins
        this.onGetFormFieldsModal = this.onGetFormFieldsModal.bind(this)

        //Builder Sortable
        this.onUpdateFormGroupPosition = this.onUpdateFormGroupPosition.bind(this);
        this.onUpdateGroupSortable = this.onUpdateGroupSortable.bind(this);

        this.onUpdateFormColsPosition = this.onUpdateFormColsPosition.bind(this);
        this.onUpdateColsSortable = this.onUpdateColsSortable.bind(this);

        this.onUpdateSortableInputSortableList = this.onUpdateSortableInputSortableList.bind(this);
        this.onUpdateInputFormsPosition = this.onUpdateInputFormsPosition.bind(this);
        this.onUpdateEndPostionFormInput = this.onUpdateEndPostionFormInput.bind(this);

        //Plugins
        this.setLoadOverviewModal = this.setLoadOverviewModal.bind(this);
        this.callbackSetPlugin = this.callbackSetPlugin.bind(this);
        this.onDeletePlugin = this.onDeletePlugin.bind(this);

        //Plugin Edit
        this.setLoadPluginEditModal = this.setLoadPluginEditModal.bind(this);
        this.callbackPluginEditModal = this.callbackPluginEditModal.bind(this);
        this.onGetPluginModal = this.onGetPluginModal.bind(this);
        this.onDuplicatePlugin = this.onDuplicatePlugin.bind(this);


        //Modal
        this.onSetShowRowEditModal = this.onSetShowRowEditModal.bind(this);
        this.onSetShowColumnEditModal = this.onSetShowColumnEditModal.bind(this);
        this.setShowSectionModal = this.setShowSectionModal.bind(this);
        this.onSetSavedSection = this.onSetSavedSection.bind(this);
        this.onGetSavedSection = this.onGetSavedSection.bind(this);
        this.onSetRowEdit = this.onSetRowEdit.bind(this);
        this.onSetTriggerRowEditStart = this.onSetTriggerRowEditStart.bind(this);

        this.onSetTriggerColumnEditStart = this.onSetTriggerColumnEditStart.bind(this);

    }

    componentDidMount() {
        if (this.props.id) {
            this.onGetFormBuilder(id)
        }
    }

    onSetSaveRowCollapse(state) {
        this.setState({
            showRowSaveCollapse: state
        })
    }

    onSetTriggerRowEditStart(state) {
        this.setState({
            triggerRowEditStart: state
        })
    }

    onSetTriggerColumnEditStart(state) {
        this.setState({
            triggerColumnEditStart: state
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.getFormBuilderData) {

            this.onGetFormBuilder(this.props.id)
            this.props.onSetFormBuilderData(false)
        }
    }

    setShowSectionModal(state) {
        this.setState({
            showSectionModal: state
        })
    }

    onSetSavedSection(id) {
        let formData = {
            'method': 'set_saved_section',
            'id': id,
            'builder': this.props.id
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGetSavedSection() {
        let formData = {
            'method': 'get_saved_sections',
            'builder': this.props.id
        }
        this.sendAxiosFormdata(formData).then()
    }

    setLoadPluginEditModal(state) {
        this.setState({
            loadPluginEditModal: state
        })
    }

    onSetShowRowEditModal(state, row = {}) {
        this.setState({
            showRowEditModal: state,
            editRow: row,
            showRowSaveCollapse: false,
            triggerRowEditStart: true
        })
    }

    onSetRowEdit(e, type) {
        let upd = this.state.editRow;
        upd[type] = e;

        this.setState({
            editRow: upd
        })
    }

    onSetShowColumnEditModal(state, row = {}, column = {}) {
        this.setState({
            showColumnEditModal: state,
            editColumn: column,
            editRow: row,
            triggerColumnEditStart: true
        })
    }

    onSetColumnEdit(e, type) {
        let upd = this.state.editColumn;
        upd[type] = e;

        this.setState({
            editColumn: upd
        })
    }


    callbackPluginEditModal(edit, input, grid, group) {
        const updForm = [...this.state.builder]
        const findGroup = this.findArrayElementById(updForm, group);
        const findGrid = [...findGroup.grid];
        const updGrid = this.findArrayElementById(findGrid, grid)
        const updInput = [...updGrid.forms];
        const findInput = this.findArrayElementById(updInput, input)
        findInput.config = edit.config;
        findInput.data = edit.data;
        if (edit.images) {
            findInput.images = edit.images
        }

        this.setState({
            builder: updForm
        })
    }

    onGetPluginModal(input, grid, group) {
        this.setState({
            loadEditPlugin: {
                group: group,
                grid: grid,
                input: input
            },
            loadPluginEditModal: true
        })
    }

    setLoadOverviewModal(state) {
        this.setState({
            loadOverviewModal: state
        })
    }

    callbackSetPlugin(data, grid, group) {
        const updForm = [...this.state.builder]
        const findGroup = this.findArrayElementById(updForm, group);
        const findGrid = [...findGroup.grid];
        const updGrid = this.findArrayElementById(findGrid, grid)
        updGrid.forms = [...updGrid.forms, data]
        findGrid.grid
        this.setState({
            builder: updForm,
            pluginData: data
        })
    }

    onDeletePlugin(input, group, grid) {
        let formData = {
            'method': 'delete_plugin',
            'site_id': this.props.site_id,
            'input': input,
            'grid': grid,
            'group': group,
            'id': this.props.id,
        }
        let swal = {
            'title': `${trans['builder']['Delete element']}?`,
            'msg': trans['builder']['Really delete the element? The deletion cannot be undone.'],
            'btn': trans['builder']['Delete element'],
        }

        this.onDeleteSwalHandle(formData, swal)
    }

    onDuplicatePlugin(input, group, grid) {
        let formData = {
            'method': 'duplicate_plugin',
            'site_id': this.props.site_id,
            'input': input,
            'grid': grid,
            'group': group,
            'id': this.props.id,
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGetFormBuilder(id) {
        let formData = {
            'method': 'get_form_builder',
            'id': id
        }

        this.sendAxiosFormdata(formData).then()
    }

    onUpdateSettings(e, type) {
        let upd = this.state.settings;
        upd[type] = e;
        this.setState({
            settings: upd,
            settingsSpinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_settings',
               // 'site_id': this.props.site_id || '',
                'settings': JSON.stringify(_this.state.settings),
                'id': _this.props.id,
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    onToggleCollapse(target) {
        let layout = false;
        let settings = false;
        let loopSettings = false;
        switch (target) {
            case 'layout':
                layout = true;
                break;
            case 'settings':
                settings = true;
                break;
            case 'loop':
                loopSettings = true;
                break;
        }

        this.setState({
            colLayout: layout,
            colSettings: settings,
            colLoopSettings: loopSettings
        })
    }

    onDeleteSwalHandle(formData, swal, spinner = false) {
        reactSwal.fire({
            title: swal.title,
            reverseButtons: true,
            html: `<span class="swal-delete-body">${swal.msg}</span>`,
            confirmButtonText: swal.btn,
            cancelButtonText: trans['swal']['Cancel'],
            customClass: {
                popup: 'swal-delete-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (spinner) {
                    this.setState({
                        spinner: {
                            showAjaxWait: true
                        }
                    })
                }
                this.sendAxiosFormdata(formData).then()
            }
        });
    }

    //GRID
    onDeleteCol(col, grid, groupId, gridId) {

        let formData = {
            'method': 'remove_col',
            'site_id': this.props.site_id | '',
            'id': this.props.id,
            'col': col,
            'grid': JSON.stringify(grid),
            'group_id': groupId,
            'grid_id': gridId,
        }
        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        this.sendAxiosFormdata(formData).then()
    }

    onSplitCol(col, colId, groupId) {
        let formData = {
            'method': 'split_col',
            'site_id': this.props.site_id || '',
            'id': this.props.id,
            'col': col,
            'colId': colId,
            'groupId': groupId,
        }
        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        this.sendAxiosFormdata(formData).then()
    }

    onAddBuilderRow() {
        let formData = {
            'method': 'add_builder_row',
            'site_id': this.props.site_id || '',
            'id': this.props.id,
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGetFormFieldsModal(group, grid) {
        this.setState({
            loadOverviewModal: true,
            loadPlugin: {
                group: group,
                grid: grid,
            }
        })
    }

    onDeleteGroup(id) {
        let formData = {
            'method': 'delete_group',
            'site_id': this.props.site_id || '',
            'group_id': id,
            'id': this.props.id,

        }
        let swal = {
            'title': `${trans['builder']['Delete group']}?`,
            'msg': trans['builder']['Really delete a group? The deletion cannot be undone.'],
            'btn': trans['builder']['Delete group'],
        }
        this.onDeleteSwalHandle(formData, swal, true);

    }


    //SORTABLE
    onUpdateFormGroupPosition(newState) {
        this.setState({
            builder: newState
        })
    }

    onUpdateGroupSortable(e) {
        let elementArray = [];
        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })

        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_group_position',
                //'site_id': this.props.site_id || '',
                'elements': JSON.stringify(elementArray),
                'id': _this.props.id,
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);

    }

    onUpdateFormColsPosition(e, group) {
        const updBuilder = [...this.state.builder]
        const findBuilder = this.findArrayElementById(updBuilder, group)
        findBuilder.grid = e;
        this.setState({
            builder: updBuilder
        })
    }

    onUpdateColsSortable(e, group) {
        let elementArray = [];

        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })

        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        let formData = {
            'method': 'update_grid_position',
            'site_id': this.props.site_id,
            'elements': JSON.stringify(elementArray),
            'id': this.props.id,
            'group': group,
        }

        this.sendAxiosFormdata(formData).then()
    }

    onUpdateSortableInputSortableList(e, group, grid) {
        const updBuilder = [...this.state.builder]
        const findBuilder = this.findArrayElementById(updBuilder, group)
        const updGrid = [...findBuilder.grid]
        const findGrid = this.findArrayElementById(updGrid, grid)
        findGrid.forms = e;
        updGrid.grid = findGrid
        this.setState({
            builder: updBuilder
        })
    }

    onUpdateInputFormsPosition(e, group, grid) {
        let elementArray = [];
        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })

        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })

        let formData = {
            'method': 'update_form_position',
            'site_id': this.props.site_id,
            'elements': JSON.stringify(elementArray),
            'id': this.props.id,
            'to_group': group,
            'to_grid': grid,
        }

        this.sendAxiosFormdata(formData).then()
    }

    onUpdateEndPostionFormInput(e, groupId, gridId) {
        let elementArray = [];
        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })
        let parent = $(e.from.parentElement.parentElement);
        let formData = {
            'method': 'update_grid_form',
            'site_id': this.props.site_id,
            'elements': JSON.stringify(elementArray),
            'id': this.props.id,
            'from_group': parent.attr('data-from-group'),
            'from_grid': parent.attr('data-from-grid'),
            'to_group': groupId,
            'to_grid': gridId,
        }

        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_form_builder':
                            if (data.status) {

                                this.setState({
                                    builderSelects: data.selects,
                                    builder: data.builder.builder,
                                    settings: data.builder.settings,
                                    version: data.builder.builder_version,
                                    builderType: data.builder.type
                                })
                            }
                            this.setState({
                                builderStatus: data.status
                            })
                            break;
                        case 'add_builder_row':
                            if (data.status) {
                                this.setState({
                                    builder: [...this.state.builder, data.record]
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_group_position':
                        case 'update_grid_position':
                        case 'update_form_position':
                            if (data.status) {
                                this.setState({
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'split_col':
                            if (data.status) {
                                const updForm = [...this.state.builder]
                                const findGroup = this.findArrayElementById(updForm, data.group_id);
                                const findGrid = [...findGroup.grid];
                                const findCol = this.findArrayElementById(findGrid, data.col_id)
                                findCol.col = data.split;
                                findGrid.grid = findCol;
                                findGroup.grid = [...findGroup.grid, data.record]
                                this.setState({
                                    builder: updForm,
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'remove_col':
                            if (data.status) {
                                const updForm = [...this.state.builder]
                                const findGroup = this.findArrayElementById(updForm, data.record.id);
                                findGroup.grid = data.record.grid;
                                this.setState({
                                    builder: updForm,
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_settings':
                            this.setState({
                                settingsSpinner: {
                                    showAjaxWait: false,
                                    ajaxMsg: data.msg,
                                    ajaxStatus: data.status
                                }
                            })
                            break;
                        case 'delete_group':
                            if (data.status) {
                                //const updBuilder = [...this.state.builder];
                                //const filterBuilder = this.filterArrayElementById(updBuilder, data.group_id)
                                this.setState({
                                    builder: this.filterArrayElementById([...this.state.builder], data.group_id),
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            }
                            break;
                        case 'delete_plugin':
                            if (data.status) {
                                const updBuilder = [...this.state.builder]
                                const findBuilder = this.findArrayElementById(updBuilder, data.group)
                                const updGrid = [...findBuilder.grid]
                                const findGrid = this.findArrayElementById(updGrid, data.grid)
                                const searchForm = [...findGrid.forms];
                                findGrid.forms = this.filterArrayElementById(searchForm, data.input)
                                this.setState({
                                    builder: updBuilder
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_row_edit':
                            if (data.status) {
                                const updBuilder = [...this.state.builder]
                                let findBuilder = this.findArrayElementById(updBuilder, data.group)
                                findBuilder = data.record;
                                this.setState({
                                    showRowEditModal: false,
                                    builder: updBuilder,
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_column_edit':
                            if (data.status) {
                                const updBuilder = [...this.state.builder]
                                const findBuilder = this.findArrayElementById(updBuilder, data.group)
                                const updGrid = [...findBuilder.grid];
                                let findGrid = this.findArrayElementById(updGrid, data.grid)
                                findGrid = data.record
                                this.setState({
                                    showColumnEditModal: false,
                                    builder: updBuilder,
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'duplicate_plugin':
                            if (data.status) {
                                const updBuilder = [...this.state.builder]
                                const findBuilder = this.findArrayElementById(updBuilder, data.group)
                                const updGrid = [...findBuilder.grid];
                                const findGrid = this.findArrayElementById(updGrid, data.grid)
                                findGrid.forms = [...findGrid.forms, data.record];

                                this.setState({
                                    builder: updBuilder,
                                    spinner: {
                                        showAjaxWait: false,
                                        ajaxMsg: data.msg,
                                        ajaxStatus: data.status
                                    }
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'add_row_save':
                            this.setState({
                                showRowSaveCollapse: false
                            })
                            if (data.status) {
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'get_saved_sections':
                            if (data.status) {
                                this.setState({
                                    savedSections: data.record,

                                })
                            }
                            this.setState({
                                showSectionModal: true
                            })
                            break;
                        case 'set_saved_section':
                            if (data.status) {
                                this.setState({
                                    builder: data.record,
                                    showSectionModal: false,
                                    savedSections: []
                                })
                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {

        return (
            <React.Fragment>
                {this.state.builderStatus ?
                    <React.Fragment>
                        <div className="d-flex align-items-center flex-wrap">
                            <button onClick={() => this.onToggleCollapse('layout')}
                                    className={`btn btn-switch-blue-outline dark btn-sm me-1 ${this.state.colLayout ? 'active' : ''}`}>
                                {trans['builder']['Page layout']}
                            </button>
                            <button onClick={() => this.onToggleCollapse('settings')}
                                    className={`btn btn-switch-blue-outline btn-sm me-1 dark ${this.state.colSettings ? 'active' : ''}`}>
                                {trans['builder']['Page settings']}
                            </button>
                            {this.props.builderType === 'loop' ?
                                <button onClick={() => this.onToggleCollapse('loop')}
                                        className={`btn btn-switch-blue-outline btn-sm dark ${this.state.colLoopSettings ? 'active' : ''}`}>
                                    {trans['builder']['Loop settings']}
                                </button> : ''}
                            <div className="ms-auto d-flex align-items-center flex-wrap">
                                <button onClick={this.onGetSavedSection}
                                        type="button"
                                        className="btn btn-success-custom me-2 dark btn-sm">
                                    <i className="bi bi-cloud-plus me-2"></i>
                                    {trans['system']['Add section']}
                                </button>
                                <div
                                    className={`ajax-spinner text-muted ${this.state.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                <small>
                                    <SetAjaxResponse
                                        status={this.state.spinner.ajaxStatus}
                                        msg={this.state.spinner.ajaxMsg}
                                    />
                                </small>
                                {/*}  <small className="text-muted small-lg">Version: {this.state.version}</small> {*/}
                            </div>
                        </div>
                        <Collapse in={this.state.colLayout}>
                            <div id={uuidv5('collapseLayout', v5NameSpace)}>

                                <div
                                    className="builder-wrapper d-flex flex-wrap px-2 pb-3 pt-2 mt-3 bg-body-tertiary border rounded mb-2 align-items-stretch- position-relative">
                                    <ReactSortable
                                        className="builder-content"
                                        list={this.state.builder}
                                        handle=".group-arrow"
                                        setList={(newState) => this.onUpdateFormGroupPosition(newState)}
                                        {...this.state.sortableOptions}
                                        onUpdate={(e) => this.onUpdateGroupSortable(e)}
                                    >
                                        {this.state.builder.map((b, groupIndex) => {
                                            return (
                                                <div key={b.id} data-id={b.id} className="builder-row mb-3">
                                                    <div
                                                        className={`builder-inner p-3 ${b.saved && b.saved ? 'builder-saved' : ''}`}>
                                                        {groupIndex > 0 ?
                                                            <div onClick={() => this.onDeleteGroup(b.id)}
                                                                 className="group-delete">
                                                            </div>
                                                            : ''}
                                                        <div className="group-arrow"></div>
                                                        <div onClick={() => this.onSetShowRowEditModal(true, b)}
                                                             className="group-edit">
                                                        </div>
                                                        <ReactSortable
                                                            className="row g-2"
                                                            list={b.grid}
                                                            handle=".group-box-arrow"
                                                            setList={(newState) => this.onUpdateFormColsPosition(newState, b.id)}
                                                            {...this.state.sortableOptions}
                                                            onUpdate={(e) => this.onUpdateColsSortable(e, b.id)}
                                                        >
                                                            {b.grid.map((g, gIndex) => {
                                                                return (
                                                                    <div key={g.id} data-id={g.id}
                                                                         className={"group-target col-12 col-lg-" + (g.col)}>
                                                                        <div data-from-grid={g.id}
                                                                             data-from-group={b.id}
                                                                             className="group-box">
                                                                            {gIndex > 0 ?
                                                                                <div
                                                                                    onClick={() => this.onDeleteCol(gIndex, b, b.id, g.id)}
                                                                                    title={trans['builder']['merge']}
                                                                                    className="group-box-delete gx-0">
                                                                                </div>
                                                                                : ''}
                                                                            {g.col > 1 && g.col < 13 ?
                                                                                <div
                                                                                    onClick={() => this.onSplitCol(g.col, g.id, b.id)}
                                                                                    title={trans['builder']['split']}
                                                                                    className="group-box-split gx-0">
                                                                                </div>
                                                                                : ''}
                                                                            <div
                                                                                onClick={() => this.onGetFormFieldsModal(b.id, g.id)}
                                                                                className="group-box-add gx-0">
                                                                            </div>
                                                                            <div className="group-box-arrow gx-0"></div>
                                                                            <div
                                                                                onClick={() => this.onSetShowColumnEditModal(true, b, g)}
                                                                                className="group-box-edit gx-0">
                                                                                <i className="bi bi-tools"></i>
                                                                            </div>
                                                                            <div className="builder-form-box p-3">

                                                                                <ReactSortable
                                                                                    className="row g-2"
                                                                                    group="inputForms"
                                                                                    handle=".forms-arrow"
                                                                                    list={g.forms}
                                                                                    setList={(newState) => this.onUpdateSortableInputSortableList(newState, b.id, g.id)}
                                                                                    {...this.state.sortableOptions}
                                                                                    onUpdate={(e) => this.onUpdateInputFormsPosition(e, b.id, g.id)}
                                                                                    onAdd={(e) => this.onUpdateEndPostionFormInput(e, b.id, g.id)}
                                                                                >
                                                                                    {g.forms.map((f, fIndex) => {
                                                                                        return (
                                                                                            <div key={f.id}
                                                                                                 data-id={f.id}
                                                                                                 className="col-12 forms-input-field position-relative mt-3">
                                                                                                <div
                                                                                                    onClick={(e) => this.onGetPluginModal(f.id, g.id, b.id)}
                                                                                                    className="input-box-field cursor-pointer rounded">
                                                                                                    <PagePlugins
                                                                                                        plugin={f}
                                                                                                        groupId={b.id}
                                                                                                        gridId={g.id}
                                                                                                        gIndex={gIndex}
                                                                                                        groupIndex={groupIndex}
                                                                                                        id={this.props.id}
                                                                                                        onDeleteSwalHandle={this.onDeleteSwalHandle}
                                                                                                    />
                                                                                                </div>
                                                                                                <div
                                                                                                    onClick={() => this.onDuplicatePlugin(f.id, b.id, g.id)}
                                                                                                    title={trans['Duplicate']}
                                                                                                    className="plugin-copy">
                                                                                                    <i className="bi bi-copy me-1"></i>
                                                                                                </div>
                                                                                                <div
                                                                                                    onClick={() => this.onDeletePlugin(f.id, b.id, g.id)}
                                                                                                    className="plugin-trash">
                                                                                                    <i className="bi bi-trash me-1"></i>
                                                                                                </div>

                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </ReactSortable>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </ReactSortable>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div onClick={this.onAddBuilderRow}
                                             title={trans['builder']['Click on to add a new line to the layout.']}
                                             className="add-builder-row">
                                        </div>
                                    </ReactSortable>
                                </div>
                                <small className="text-secondary d-block small-lg text-end">
                                    Page-Builder by <a className="text-reset text-decoration-underline"
                                                       href="https://github.com/jensen1206">Jens Wiecker</a>
                                </small>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colSettings}>
                            <div id={uuidv5('collapseSettings', v5NameSpace)}>
                                <FormBuilderSettings
                                    id={this.props.id}
                                    settings={this.state.settings}
                                    spinner={this.state.settingsSpinner}
                                    version={this.state.version}
                                    onUpdateSettings={this.onUpdateSettings}
                                />
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colLoopSettings}>
                            <div id={uuidv5('collapseLoopSettings', v5NameSpace)}>
                                <FormBuilderLoopSettings
                                    id={this.props.id}
                                    settings={this.state.settings}
                                    spinner={this.state.settingsSpinner}
                                    version={this.state.version}
                                    onUpdateSettings={this.onUpdateSettings}
                                />
                            </div>
                        </Collapse>
                    </React.Fragment>
                    :
                    <div className="text-center fs-4 mt-3 text-muted">
                        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                        {trans['builder']['no page builder selected!']}
                    </div>
                }
                <BuilderPlugins
                    loadOverviewModal={this.state.loadOverviewModal}
                    builderType={this.props.builderType}
                    loadPlugin={this.state.loadPlugin}
                    id={this.props.id}
                    catId={this.props.catId}
                    setLoadOverviewModal={this.setLoadOverviewModal}
                    callbackSetPlugin={this.callbackSetPlugin}
                />
                <PluginEditModal
                    loadEditPlugin={this.state.loadEditPlugin}
                    loadPluginEditModal={this.state.loadPluginEditModal}
                    id={this.props.id}
                    site_id={this.props.site_id}
                    catId={this.props.catId}
                    selects={this.state.builderSelects}
                    builderType={this.state.builderType}
                    setLoadPluginEditModal={this.setLoadPluginEditModal}
                    callbackPluginEditModal={this.callbackPluginEditModal}
                />
                <RowEditModal
                    showRowEditModal={this.state.showRowEditModal}
                    editRow={this.state.editRow}
                    showRowSaveCollapse={this.state.showRowSaveCollapse}
                    id={this.props.id}
                    selects={this.state.builderSelects}
                    triggerRowEditStart={this.state.triggerRowEditStart}
                    builderType={this.state.builderType}
                    onSetShowRowEditModal={this.onSetShowRowEditModal}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                    onSetSaveRowCollapse={this.onSetSaveRowCollapse}
                    onSetRowEdit={this.onSetRowEdit}
                    onSetTriggerRowEditStart={this.onSetTriggerRowEditStart}
                />
                <ColumnEditModal
                    showColumnEditModal={this.state.showColumnEditModal}
                    id={this.props.id}
                    editColumn={this.state.editColumn}
                    selects={this.state.builderSelects}
                    group={this.state.editRow.id}
                    builderType={this.state.builderType}
                    triggerColumnEditStart={this.state.triggerColumnEditStart}
                    sendAxiosFormdata={this.sendAxiosFormdata}
                    onSetShowColumnEditModal={this.onSetShowColumnEditModal}
                    onSetTriggerColumnEditStart={this.onSetTriggerColumnEditStart}
                    onSetColumnEdit={this.onSetColumnEdit}
                />
                <SectionSelectModal
                    showSectionModal={this.state.showSectionModal}
                    savedSections={this.state.savedSections}
                    builderType={this.state.builderType}
                    setShowSectionModal={this.setShowSectionModal}
                    onSetSavedSection={this.onSetSavedSection}
                />

            </React.Fragment>
        )
    }
}