import * as React from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import {Col} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Collapse from 'react-bootstrap/Collapse';
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";
import * as AppTools from "../../../AppComponents/AppTools";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const deleteWarningSwal = withReactContent(Swal);

export default class FormOptionen extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            forms: [],
            conditions: [],
            formIds: [],
            editConditions: {},
            showAddCol: false,
            addName: '',
            valueIsSelected: false,
            fieldsActive: []
        };
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onToggleAddCondition = this.onToggleAddCondition.bind(this);
        this.onAddNewCondition = this.onAddNewCondition.bind(this);
        this.onGetConditionById = this.onGetConditionById.bind(this);
        this.swalDeleteAlertMsg = this.swalDeleteAlertMsg.bind(this);
        this.onDeleteCondition = this.onDeleteCondition.bind(this);
        this.onToggleConField = this.onToggleConField.bind(this);
        this.onConAddRule = this.onConAddRule.bind(this);
        this.onUpdateConditionsItems = this.onUpdateConditionsItems.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.onSelectField = this.onSelectField.bind(this);
        this.onMakeFormIdArr = this.onMakeFormIdArr.bind(this);
        this.onDeleteLine = this.onDeleteLine.bind(this);
        this.onChangeRuleValue = this.onChangeRuleValue.bind(this);
        this.onAddLine = this.onAddLine.bind(this);


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

    swalDeleteAlertMsg(swal, formData) {
        deleteWarningSwal.fire({
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
                this.sendAxiosFormdata(formData).then()
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadCondition) {
            this.setState({
                forms: [],
                conditions: [],
                formIds: [],
                editConditions: {}
            })
            let formData = {
                'method': 'get_form_conditions',
                'form_id': this.props.formData.form_id,
            }
            this.sendAxiosFormdata(formData).then()
            this.props.onSetLoadCondition(false)
        }
    }

    async sendAxiosFormdata(formData, isFormular = false, url = formsSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, formsSettings))
                .then(({data = {}} = {}) => {

                    switch (data.type) {
                        case 'get_form_conditions':
                            if (data.status) {
                                this.setState({
                                    //  forms: data.forms,
                                    conditions: data.conditions
                                })
                            } else {
                                if (data.msg) {
                                    AppTools.warning_message(data.msg)
                                }
                            }
                            break;
                        case 'add_form_conditions':
                            if (data.status) {
                                this.setState({
                                    forms: data.forms,
                                    conditions: data.conditions,
                                    editConditions: data.edit,
                                    showAddCol: false,
                                    addName: '',
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'get_form_condition_by_id':
                            let formIds = this.onMakeFormIdArr(data.forms)
                            if (data.status) {
                                this.setState({
                                    forms: data.forms,
                                    editConditions: data.edit,
                                    formIds: formIds,
                                    fieldsActive: data.fields
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'delete_form_condition':
                            if (data.status) {
                                this.setState({
                                    editConditions: {},
                                    forms: [],
                                    conditions: data.conditions,
                                })

                                AppTools.success_message(data.msg)
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case'add_form_condition_type':
                            if (data.status) {
                                let formIds = this.onMakeFormIdArr(data.forms)
                                this.setState({
                                    forms: data.forms,
                                    formIds: formIds
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'add_condition_rule':
                            if (data.status) {

                                this.setState({
                                    conditions: data.conditions,
                                    editConditions: data.edit
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'get_builder_form_options':
                            if (data.status) {
                                this.setState({
                                    editConditions: data.edit,
                                    valueIsSelected: data.form_value.is_select,
                                    fieldsActive: data.fields
                                })

                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'reload_get_builder_form_options':

                            break;
                        case 'delete_form_line':
                            if (data.status) {
                                const updGroup = [...this.state.editConditions.group]
                                if (data.delete_group) {
                                    this.state.editConditions.group = this.filterArrayElementById(updGroup, data.group_id)
                                } else {
                                    const rule = this.findArrayElementById(updGroup, data.group_id)
                                    rule.rules = this.filterArrayElementById(rule.rules, data.rule_id)
                                    this.state.editConditions.group = updGroup;
                                }
                                this.setState({
                                    editConditions: this.state.editConditions,
                                    fieldsActive: data.fields
                                })

                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'add_rule_line':
                            if (data.status) {
                                const updEdit = [...this.state.editConditions.group]
                                const findEdit = this.findArrayElementById(updEdit, data.group_id);
                                findEdit.rules = [...findEdit.rules, {
                                    id: data.rule.id,
                                    compare: data.rule.compare,
                                    field: data.rule.field,
                                    is_select: data.rule.is_select,
                                    value: data.rule.value
                                }];
                                this.state.editConditions.group = updEdit;
                                this.setState({
                                    editConditions: this.state.editConditions
                                })
                            } else {
                                AppTools.warning_message(data.msg)
                            }
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    onMakeFormIdArr(forms) {
        let arr = [];

        forms.map((f, index) => {
            let t = f.form.condition.type || '';
            if(f.form.type === 'upload' ||
                f.form.type === 'html' ||
                f.form.type === 'hr' ||
                f.form.type === 'credit-card'
            ){
                arr.push(f.form.id);
            }
            if (t) {
                arr.push(f.form.id);
            }
        })
        return arr;
    }

    onToggleAddCondition() {
        this.setState({
            showAddCol: !this.state.showAddCol
        })
    }

    onAddNewCondition() {
        let formData = {
            'method': 'add_form_conditions',
            'form_id': this.props.formData.form_id,
            'name': this.state.addName,
        }
        this.sendAxiosFormdata(formData).then()
    }

    onGetConditionById(id) {

        let formData = {
            'method': 'get_form_condition_by_id',
            'form_id': this.props.formData.form_id,
            'id': id,
        }
        this.sendAxiosFormdata(formData).then()
    }

    onDeleteCondition() {
        let formData = {
            'method': 'delete_form_condition',
            'form_id': this.props.formData.form_id,
            'id': this.state.editConditions.id,
        }

        let swal = {
            'title': trans['forms']['Delete condition'] + '?',
            'msg': trans['forms']['The deletion cannot be undone.'],
            'btn':trans['forms']['Delete condition'],
        }

        this.swalDeleteAlertMsg(swal, formData);
    }

    onToggleConField(id, isActive = false) {

        //add
        let formData = {
            'method': 'add_form_condition_type',
            'form_id': this.props.formData.form_id,
            'id': this.state.editConditions.id,
            'field': id,
            'handle': isActive ? 'delete' : 'add',
        }

        this.sendAxiosFormdata(formData).then()

    }

    onConAddRule() {
        let formData = {
            'method': 'add_condition_rule',
            'form_id': this.props.formData.form_id,
            'id': this.state.editConditions.id,
        }

        this.sendAxiosFormdata(formData).then()
    }

    onUpdateConditionsItems(e, type) {
        let updCon = this.state.editConditions;
        updCon[type] = e;
        this.setState({
            editConditions: updCon
        })

        if (type === 'name') {
            const upd = [...this.state.conditions]
            const findUpd = this.findArrayElementById(upd, this.state.editConditions.id)
            if (findUpd) {
                findUpd.name = e;
            }
        }

        let formData = {
            'method': 'update_condition_rule',
            'form_id': this.props.formData.form_id,
            'id': this.state.editConditions.id,
            'data': JSON.stringify(updCon),
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSelectField(fieldId, ruleId, ruleGroup, handle) {

        if (!fieldId) {
            const upd = [...this.state.editConditions.group]
            const find = this.findArrayElementById(upd, ruleGroup)
            const updRule = [...find.rules]
            const findRule = this.findArrayElementById(updRule, ruleId)
            findRule.field = '';
            findRule.value = '';
            find.rules = updRule
            this.state.editConditions.group = upd
            let con = this.state.editConditions;
            con.group = upd
            this.setState({
                editConditions: this.state.editConditions,
            })
            let form = {
                'method': 'update_condition_rule',
                'form_id': this.props.formData.form_id,
                'id': this.state.editConditions.id,
            }
            this.sendAxiosFormdata(form).then()

        } else {

            let formData = {
                'method': 'get_builder_form_options',
                'form_id': this.props.formData.form_id,
                'con_id': this.state.editConditions.id,
                'rule_id': ruleId,
                'rule_group': ruleGroup,
                'field_id': fieldId,
                'handle': handle,
            }

            this.sendAxiosFormdata(formData).then()
        }
    }

    onDeleteLine(ruleId, groupId) {

        let formData = {
            'method': 'delete_form_line',
            'form_id': this.props.formData.form_id,
            'id': this.state.editConditions.id,
            'rule_id': ruleId,
            'group_id': groupId,
        }

        let swal = {
            'title': trans['forms']['Delete line'] + '?',
            'msg': trans['forms']['The deletion cannot be undone.'],
            'btn': trans['forms']['Delete line'],
        }

        this.swalDeleteAlertMsg(swal, formData);
    }

    onChangeRuleValue(value, ruleId, groupId, handle) {
        let updEdit = [...this.state.editConditions.group]
        let findEdit = this.findArrayElementById(updEdit, groupId);
        let updRules = [...findEdit.rules];
        let findRule = this.findArrayElementById(updRules, ruleId)
        if (!value) {
            findRule.value = '';
        } else {
            findRule.value = value
        }
        this.state.editConditions.group = updEdit;
        this.setState({
            editConditions: this.state.editConditions
        })
        //console.log(findRule)
        //console.log(optionId, ruleId, groupId)
        let formData = {
            'method': 'get_builder_form_options',
            'form_id': this.props.formData.form_id,
            'reload': true,
            'con_id': this.state.editConditions.id,
            'rule_id': ruleId,
            'rule_group': groupId,
            'field_id': value,
            'handle': handle,
        }
        this.sendAxiosFormdata(formData).then()
    }

    onAddLine(group_id) {
        let formData = {
            'method': 'add_rule_line',
            'group_id': group_id,
            'form_id': this.props.formData.form_id,
            'con_id': this.state.editConditions.id,
        }
        this.sendAxiosFormdata(formData).then()
    }

    render() {
        return (
            <>
                {/*}  <h6 className="mb-3">{trans['forms']['Conditions form']}</h6>{*/}
                <div className="row gy-3 gx-1 align-items-stretch mb-2">
                    <div className="col-xl-2 col-12">
                        <div className="p-3 h-100 border rounded">
                            {this.state.conditions.length ? (
                                <div className="mb-3 fw-semibold">
                                    {trans['forms']['Conditions']}:
                                </div>) : (<></>)}
                            <div className="list-group">
                                {this.state.conditions.map((c, index) => {
                                    return (
                                        <button key={index} type="button"
                                                onClick={() => this.onGetConditionById(c.id, c.id === this.state.editConditions.id)}
                                                className={"list-group-item text-start list-group-item-action" + (c.id === this.state.editConditions.id ? ' active pe-none' : '')}
                                                aria-current="true">
                                            {c.name}
                                        </button>
                                    )
                                })}
                            </div>
                            <button onClick={this.onToggleAddCondition}
                                    className="btn btn-secondary mt-3 btn-sm">
                                <i className="bi bi-node-plus me-1"></i>
                                {trans['forms']['New condition']}
                            </button>
                            <Collapse in={this.state.showAddCol}>
                                <div className="my-3">
                                    <Form.Control
                                        placeholder={trans['forms']['Designation']}
                                        className="no-blur"
                                        id={uuidv4()}
                                        value={this.state.addName}
                                        onChange={(e) => this.setState({addName: e.currentTarget.value})}
                                        aria-label={trans['forms']['Designation']}
                                        aria-describedby={trans['forms']['Designation']}
                                    />
                                    <Button onClick={this.onAddNewCondition}
                                            variant={"success-custom dark btn-sm mt-2" + (this.state.addName ? '' : ' disabled pe-none')}
                                            id={uuidv4()}>
                                        {trans['forms']['Create']}
                                    </Button>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                    <div className="col-xl-8 col-12">
                        <div className="p-3 h-100 border rounded">
                            {this.state.editConditions.id ? (
                                <div className="row g-2">
                                    <Col xl={6} xs={12}>
                                        <h6>{trans['Designation']}</h6>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={trans['forms']['Condition']}
                                        >
                                            <Form.Control
                                                type="text"
                                                className="no-blur"
                                                value={this.state.editConditions.name || ''}
                                                onChange={(e) => this.onUpdateConditionsItems(e.currentTarget.value, 'name')}
                                                placeholder={trans['forms']['Condition']}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <h6>{trans['forms']['Action']}</h6>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            className="action-select"
                                            label={trans['forms']['Action']}>
                                            <Form.Select
                                                className="no-blur"
                                                value={this.state.editConditions.type || ''}
                                                onChange={(e) => this.onUpdateConditionsItems(e.currentTarget.value, 'type')}
                                                aria-label={trans['forms']['Type']}>
                                                <option value="show">{trans['forms']['Show']}</option>
                                                <option value="hide">{trans['forms']['Hide']}</option>
                                                <option value="deactivate">{trans['forms']['Deactivate']}</option>
                                                <option value="activate">{trans['forms']['Activate']}</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <hr className="mb-2 mt-2"/>
                                    <Col className="text-xl-end text-start" xs={12}>
                                        <button onClick={this.onConAddRule}
                                                className="btn btn-secondary btn-sm">
                                            {trans['forms']['Add rule']}
                                        </button>
                                    </Col>
                                    <hr className="mt-3"/>
                                    {this.state.editConditions.group.length ? (
                                            <>
                                                {this.state.editConditions.group.map((g, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {g.rules.map((r, rIndex) => {
                                                                return (
                                                                    <div key={rIndex}>
                                                                        {index > 0 && rIndex === 0 ?
                                                                            <div className="position-relative">
                                                                                <div
                                                                                    className="rule-and">{trans['forms']['or']}</div>
                                                                            </div> : ''}

                                                                        <div className="row gx-1 gy-3">
                                                                            <div className="col-xl-5 col-12">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="text-nowrap me-1"
                                                                                         style={{width: '2.9rem'}}>{rIndex === 0 ? trans['forms']['if'] : trans['forms']['and']}</div>
                                                                                    <FloatingLabel
                                                                                        controlId={uuidv4()}
                                                                                        className="w-100"
                                                                                        label={trans['forms']['Field']}>
                                                                                        <Form.Select
                                                                                            className="no-blur"
                                                                                            value={r.field || ''}
                                                                                            onChange={(e) => this.onSelectField(e.currentTarget.value, r.id, g.id, 'field')}
                                                                                            aria-label={trans['forms']['Field']}>
                                                                                            <option
                                                                                                value="">{trans['forms']['select']}...
                                                                                            </option>
                                                                                            {this.state.forms.map((fs, sIndex) =>

                                                                                                !this.state.formIds.includes(fs.form.id) ? (

                                                                                                    <option key={sIndex}
                                                                                                            value={fs.form.id}>
                                                                                                        {fs.form.label} {fs.form.type}
                                                                                                    </option>) : (<option
                                                                                                    className="d-none"
                                                                                                    key={sIndex}></option>)
                                                                                            )}
                                                                                        </Form.Select>
                                                                                    </FloatingLabel>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-xl-2 col-12">
                                                                                <FloatingLabel
                                                                                    controlId={uuidv4()}
                                                                                    label={trans['forms']['Type']}>
                                                                                    <Form.Select
                                                                                        className="no-blur"
                                                                                        value={r.compare || ''}
                                                                                        onChange={(e) => this.onSelectField(e.currentTarget.value, r.id, g.id, 'compare')}
                                                                                        // onChange={(e) => this.onUpdateConditionsItems(e.currentTarget.value, 'type')}
                                                                                        aria-label={trans['forms']['Type']}>
                                                                                        <option
                                                                                            value="is">{trans['forms']['is']}</option>
                                                                                        <option
                                                                                            value="isnot">{trans['forms']['is not']}</option>
                                                                                        <option
                                                                                            value="greater">{trans['forms']['greater']}</option>
                                                                                        <option
                                                                                            value="smaller">{trans['forms']['smaller']}</option>
                                                                                        <option
                                                                                            value="contains">{trans['forms']['contains']}</option>
                                                                                    </Form.Select>
                                                                                </FloatingLabel>
                                                                            </div>
                                                                            <div className="col-xl-5 col-12">
                                                                                <div className="d-flex align-items-center">
                                                                                    {r.is_select ? (
                                                                                        <FloatingLabel
                                                                                            controlId={uuidv4()}
                                                                                            className="w-100"
                                                                                            label={trans['forms']['Value']}>
                                                                                            <Form.Select
                                                                                                className="no-blur"
                                                                                                value={r.value}
                                                                                                onChange={(e) => this.onChangeRuleValue(e.currentTarget.value, r.id, g.id, 'value')}
                                                                                                aria-label={trans['forms']['Type']}>
                                                                                                <option
                                                                                                    value="">{trans['forms']['select']}...
                                                                                                </option>
                                                                                                {r.selects.map((v, vIndex) =>
                                                                                                    <option key={vIndex}
                                                                                                            value={v.id}>
                                                                                                        {v.label}
                                                                                                    </option>
                                                                                                )}
                                                                                            </Form.Select>
                                                                                        </FloatingLabel>
                                                                                    ) : (
                                                                                        <FloatingLabel
                                                                                            controlId={uuidv4()}
                                                                                            label="Value"
                                                                                            className="w-100"
                                                                                        >
                                                                                            <Form.Control
                                                                                                className="no-blur"
                                                                                                type="text"
                                                                                                value={r.value}
                                                                                                onChange={(e) => this.onChangeRuleValue(e.currentTarget.value, r.id, g.id, 'value')}
                                                                                                placeholder="placeholder"/>
                                                                                        </FloatingLabel>)}
                                                                                    <div
                                                                                        className="d-flex justify-content-end"
                                                                                        style={{width: '1.5rem'}}>
                                                                                        <i onClick={() => this.onDeleteLine(r.id, g.id)}
                                                                                           title={trans['forms']['Delete line']}
                                                                                           className="bi bi-x-circle cursor-pointer text-danger"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                            <div className="text-end mb-3">
                                                                <div className="btn-group flex-wrap">
                                                                    <button
                                                                        onClick={() => this.onAddLine(g.id)}
                                                                        style={{marginRight: '1.5rem'}}
                                                                        className="btn mt-1 btn-outline-secondary btn-sm">
                                                                        {trans['forms']['new line']}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )
                                        :
                                        <>{trans['forms']['No rule defined']}</>
                                    }
                                    <Col xs={12}>
                                        <hr/>
                                        <button onClick={this.onDeleteCondition}
                                                className="btn btn-outline-danger btn-sm">
                                            <i className="bi bi-trash me-1"></i>
                                            {trans['forms']['Delete condition']}
                                        </button>
                                    </Col>
                                </div>
                            ) : (<>{trans['forms']['No condition selected']}...</>)}


                        </div>
                    </div>
                    <div className="col-xl-2 col-12">
                        <div className="p-3 h-100 border rounded">
                            {this.state.editConditions.id ? (<>
                                <div className="mb-3">
                                    {trans['forms']['Fields to which this condition should be applied.']}
                                </div>
                                <div className="list-group">
                                    {this.state.forms.map((f, index) => {
                                        return (
                                            <button
                                                onClick={() => this.onToggleConField(f.form.id, this.state.editConditions.id === f.form.condition.type)}
                                                key={index} type="button"
                                                disabled={this.state.fieldsActive.includes(f.form.id)}
                                                className={`field-list list-group-item text-start list-group-item-action success` + (this.state.editConditions.id === f.form.condition.type ? ' active' : '')}
                                                aria-current="true">
                                                <div className="d-flex align-items-center">
                                                    <div className="text-truncate"> {f.form.label}</div>
                                                    {this.state.editConditions.id === f.form.condition.type ? (
                                                        <div className="ms-auto">
                                                            <i className="bi bi-check2-circle"></i>
                                                        </div>) : (<></>)}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </>) : (<> {trans['forms']['No condition selected']}...</>)}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}