import * as React from "react";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";
import {ReactSortable} from "react-sortablejs";
import SelectLoop from "./SelectLoop";
import CheckLoop from "./CheckLoop";
import {Fragment} from "react";
import {FormGroup} from "react-bootstrap";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

const options = [
    {value: 'chocolate', label: 'Chocolate'},
    {value: 'strawberry', label: 'Strawberry'},
    {value: 'vanilla', label: 'Vanilla'}
]

export default class EditTextFields extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            optionCollapse: false
        }
        this.onChangeOptionsCollapse = this.onChangeOptionsCollapse.bind(this);
        this.onChangeOptionsSingleCollapse = this.onChangeOptionsSingleCollapse.bind(this);
        this.onDeleteField = this.onDeleteField.bind(this);
        this.onChangeCondition = this.onChangeCondition.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.onGetConditionTxt = this.onGetConditionTxt.bind(this);


    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    onGetConditionTxt(id) {
        if (id) {
            const con = [...this.props.selects.conditions]
            const find = this.findArrayElementById(con, id)
            if (find) {
                return find.label;
            }
        }
        return false;
    }

    onChangeOptionsCollapse() {
        this.setState({
            optionCollapse: !this.state.optionCollapse
        })
        $('.option-collapse').removeClass('active')
        const collapseElementList = document.querySelectorAll('.option-multi-collapse')
        const collapseList = [...collapseElementList].map(collapseEl => {
            let bsMulti = new bootstrap.Collapse(collapseEl, {
                toggle: false
            })
            if (!this.state.optionCollapse) {
                bsMulti.hide()
            } else {
                bsMulti.show()
            }
        })
    }

    onChangeOptionsSingleCollapse(e, target) {
        let current = $(e);

        const bsCollapse = new bootstrap.Collapse(target, {
            toggle: false
        })
        if ($(target).hasClass('show')) {
            bsCollapse.hide()
            if (!this.state.optionCollapse) {
                current.addClass('active')
            }

        } else {
            bsCollapse.show()
            current.removeClass('active')
        }

    }

    onDeleteField() {
        let formData = {
            'method': 'delete_form_input',
            'grid': this.props.editFormDataIds.grid_id,
            'group': this.props.editFormDataIds.group_id,
            'input_id': this.props.editFormDataIds.input_id,
            'form_id': this.props.formData.form_id,
        }


        let swal = {
            'title': `${trans['forms']['Delete form field']}?`,
            'msg': trans['forms']['Do you really want to delete a form field? The deletion cannot be undone.'],
            'btn': trans['Delete']
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    onSetIdPlaceholder(e) {

    }

    onChangeCondition(e) {

        //onUpdateFormCondition
    }

    render() {
        let rand = uuidv4();
        let cRand = uuidv4();
        return (
            <>

                <div className="row gy-2">
                    <div className="col-12">
                        <Form.Group
                            controlId={uuidv4()}>
                            <Form.Label className="form-edit-label mb-1">{trans['forms']['Field ID']}</Form.Label>
                            <Form.Control
                                className="no-blur"
                                type="text"
                                disabled={true}
                                value={this.props.formEdit.id || ''}
                                onChange={(e) => this.onSetIdPlaceholder(e)}
                                placeholder={trans['forms']['Field ID']}/>
                        </Form.Group>
                    </div>
                    {this.onGetConditionTxt(this.props.formEdit.condition.type || '') ? (
                        <div className="col-12">
                            <hr/>
                            <div className="d-flex">
                                <i className="bi bi-arrow-return-right me-2"></i>
                                <div className="d-flex flex-column">
                                    <div className="fw-semibold">{trans['forms']['Conditions']}:</div>
                                    {this.onGetConditionTxt(this.props.formEdit.condition.type || '')}
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ) : ''}
                    {this.props.formEdit.form_type === 'html' ||
                    this.props.formEdit.form_type === 'credit-card-date' ||
                    this.props.formEdit.form_type === 'credit-card' ||
                    this.props.formEdit.form_type === 'credit-card-cvc'
                        ? (<></>) : (
                            <div
                                className={"col-12 position-relative" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Label']}
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit.label || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'label')}
                                        className="no-blur"
                                        placeholder={trans['forms']['Label']}/>
                                </FloatingLabel>
                            </div>)}
                    <div className="col-12">
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={trans['forms']['Slug']}
                        >
                            <Form.Control
                                type="text"
                                disabled={this.props.formEdit.form_type === 'html'}
                                value={this.props.formEdit.slug || ''}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'slug')}
                                className="no-blur"
                                placeholder={trans['forms']['Slug']}/>
                        </FloatingLabel>
                        <div className="form-text">
                            {trans['forms']['The slug is used as a placeholder for sending the e-mail.']}
                        </div>
                    </div>

                    {this.props.formEdit.type === 'switch' ? (
                        <>
                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Size']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.btn_size || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'btn_size', true)}
                                        aria-label={trans['forms']['Size']}>
                                        {this.props.selects.group_size.map((o, index) =>
                                            <option key={index} value={o.type}>
                                                {o.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>

                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Alignment']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.alignment || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'alignment', true)}
                                        aria-label={trans['forms']['Alignment']}>
                                        {this.props.selects.group_alignment.map((o, index) =>
                                            <option key={index} value={o.type}>
                                                {o.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>

                        </>
                    ) : (<></>)}
                    {this.props.formEdit.type === 'button'
                        ? (<></>) : (
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <hr/>
                                {this.props.formEdit.type === 'checkbox' ||
                                this.props.formEdit.type === 'switch' ||
                                this.props.formEdit.form_type === 'html' ||
                                this.props.formEdit.type === 'privacy-check' ||
                                this.props.formEdit.type === 'rating' ||
                                this.props.formEdit.type === 'radio' ? (<></>) : (<>
                                    <Form.Check
                                        className="no-blur mt-1"
                                        type="switch"
                                        id={uuidv4()}
                                        checked={this.props.formEdit.required || false}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'required')}
                                        label={trans['forms']['Required field']}
                                    /></>)}
                                {this.props.formEdit.form_type === 'html' ? (<></>) : (<>
                                    <Form.Check
                                        className="no-blur mt-1"
                                        type="switch"
                                        id={uuidv4()}
                                        disabled={this.props.formEdit.floating}
                                        checked={this.props.formEdit.hide_label || false}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'hide_label')}
                                        label={trans['forms']['Hide label']}
                                    /></>)}

                                {this.props.formEdit.type === 'tinymce' ||
                                this.props.formEdit.type === 'radio' ||
                                this.props.formEdit.type === 'switch' ||
                                this.props.formEdit.type === 'range' ||
                                this.props.formEdit.form_type === 'html' ||
                                this.props.formEdit.type === 'color' ||
                                this.props.formEdit.type === 'rating' ||
                                this.props.formEdit.form_type === 'upload' ||
                                this.props.formEdit.type === 'privacy-check' ||
                                this.props.formEdit.form_type === 'credit-card' ||
                                this.props.formEdit.type === 'checkbox' ? (<>
                                    <hr/>
                                </>) : (
                                    <>
                                        <Form.Check
                                            className="no-blur mt-1"
                                            type="switch"
                                            id={uuidv4()}
                                            checked={this.props.formEdit.floating || false}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'floating')}
                                            label={trans['forms']['Floating label']}
                                        />
                                        {this.props.formEdit.type === 'email' ?
                                            <Form.Check
                                                className="no-blur mt-1"
                                                type="switch"
                                                id={uuidv4()}
                                                checked={this.props.formEdit.is_autoresponder || false}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'is_autoresponder')}
                                                label={trans['forms']['E-mail for autoresponder']}
                                            />
                                            : ''}
                                        <hr/>
                                    </>
                                )}

                                {this.props.formEdit.type === 'checkbox' ||
                                this.props.formEdit.type === 'privacy-check' ||
                                this.props.formEdit.type === 'radio' ? (
                                        <>
                                            {this.props.formEdit.type === 'checkbox' ||
                                            this.props.formEdit.type === 'privacy-check'
                                                ? (
                                                    <React.Fragment>
                                                        <Form.Check
                                                            className="no-blur"
                                                            type="switch"
                                                            id={uuidv4()}
                                                            checked={this.props.formEdit !== '' ? this.props.formEdit.config.animated : false}
                                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'animated', true)}
                                                            label={trans['forms']["Animated checkbox"]}
                                                        />
                                                        {this.props.formEdit !== '' && this.props.formEdit.config.animated ?
                                                            <React.Fragment>
                                                                <Form.Label
                                                                    className="mt-3"
                                                                    htmlFor={cRand}>{trans['forms']['Checkbox color']}</Form.Label>
                                                                <Form.Control
                                                                    type="color"
                                                                    id={cRand}
                                                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.animated_color : ''}
                                                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'animated_color', true)}
                                                                    title={trans['forms']["Choose your color"]}
                                                                /></React.Fragment> : ''}

                                                        {this.props.formEdit !== '' && this.props.formEdit.config.animated === false ?
                                                            <Form.Check
                                                                className="no-blur"
                                                                type="switch"
                                                                id={uuidv4()}
                                                                checked={this.props.formEdit !== '' ? this.props.formEdit.config.switch : false}
                                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'switch', true)}
                                                                label='Switch'
                                                            /> : ''}

                                                    </React.Fragment>) : (<></>)}
                                            {this.props.formEdit.type !== 'privacy-check' ? (
                                                <React.Fragment>
                                                    {this.props.formEdit !== '' && this.props.formEdit.config.animated === false ?
                                                        <Form.Check
                                                            className="no-blur mt-1"
                                                            type="switch"
                                                            id={uuidv4()}
                                                            checked={this.props.formEdit !== '' ? this.props.formEdit.config.inline : false}
                                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'inline', true)}
                                                            label='Inline'
                                                        /> : ''}
                                                </React.Fragment>) : (<></>)}
                                            <hr/>
                                        </>
                                    )
                                    :
                                    (<></>)}
                            </div>
                        )}
                    {this.props.formEdit.type === 'button' ||
                    this.props.formEdit.form_type === 'html' ? (<></>) : (
                        <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={trans['forms']['Description']}
                            >
                                <Form.Control
                                    as="textarea"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.caption : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'caption', true)}
                                    className="no-blur"
                                    style={{height: '80px'}}
                                    placeholder={`${trans['forms']['Description']}`}/>
                            </FloatingLabel>
                        </div>)}

                    {this.props.formEdit.type === 'textarea' ? (
                        <div className="col-12">
                            {this.props.formEdit.floating ? (
                                <>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={trans['plugins']['Height']}
                                    >
                                        <Form.Control
                                            type="number"
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.height : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.height, 'rows', true)}
                                            className="no-blur"
                                            placeholder={trans['plugins']['Height']}/>
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['forms']['Height in PX']}
                                    </div>
                                </>
                            ) : (
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Rows']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.rows : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'rows', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Rows']}/>
                                </FloatingLabel>
                            )}
                        </div>
                    ) : (<></>)
                    }
                    {
                        this.props.formEdit.type === 'button' ||
                        this.props.formEdit.type === 'tinymce' ||
                        this.props.formEdit.type === 'checkbox' ||
                        this.props.formEdit.type === 'radio' ||
                        this.props.formEdit.type === 'switch' ||
                        this.props.formEdit.type === 'date' ||
                        this.props.formEdit.type === 'color' ||
                        this.props.formEdit.form_type === 'upload' ||
                        this.props.formEdit.type === 'privacy-check' ||
                        this.props.formEdit.type === 'rating' ||
                        this.props.formEdit.form_type === 'html' ||
                        this.props.formEdit.form_type === 'credit-card' ||
                        this.props.formEdit.type === 'range' ||
                        this.props.formEdit.type === 'select' ? (<></>) : (
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Placeholder']}
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.placeholder : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'placeholder', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Placeholder']}/>
                                </FloatingLabel>
                            </div>
                        )
                    }
                    {this.props.formEdit.type === 'privacy-check' ? (
                        <>
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Privacy checkbox text']}
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Privacy checkbox text']}/>
                                </FloatingLabel>
                                <div className="form-text">
                                    {trans['forms']['The placeholder { Text } links the text to the Privacy URL / URI']}
                                </div>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Privacy page']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.url || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'url', true)}
                                        aria-label={trans['forms']['Privacy page']}>
                                        <option value="">{trans['system']['select']}</option>
                                        {this.props.selects.pages.map((o, index) =>
                                            <option key={index} value={o.url}>
                                                {o.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Privacy URL / URI']}
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.url : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'url', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Privacy page']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <Form.Check
                                    className="no-blur mt-1"
                                    type="switch"
                                    id={uuidv4()}
                                    checked={this.props.formEdit !== '' ? this.props.formEdit.config.new_tab : false}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'new_tab', true)}
                                    label={trans['forms']['Open in new tab']}
                                />
                            </div>
                        </>) : (<></>)}
                    {this.props.formEdit.type === 'html' ? (<></>) : (
                        <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={trans['forms']['Extra CSS Class']}
                            >
                                <Form.Control
                                    type="text"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.custom_class : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'custom_class', true)}
                                    className="no-blur"
                                    placeholder={trans['forms']['Extra CSS Class']}/>
                            </FloatingLabel>
                        </div>)}
                    {
                        this.props.formEdit.type === 'select' ||
                        this.props.formEdit.type === 'radio' ||
                        this.props.formEdit.type === 'switch' ||
                        this.props.formEdit.type === 'date' ||
                        this.props.formEdit.form_type === 'upload' ||
                        this.props.formEdit.type === 'range' ||
                        this.props.formEdit.type === 'hr' ||
                        this.props.formEdit.type === 'rating' ||
                        this.props.formEdit.form_type === 'credit-card' ||
                        this.props.formEdit.type === 'privacy-check' ||
                        this.props.formEdit.type === 'checkbox' ? (<></>) : (
                            <div className={"col-12" + (this.props.formEdit.type === 'button' ? ' d-none' : '')}>
                                {this.props.formEdit.type === 'color' ? (<>

                                    <Form.Label htmlFor={rand}>{trans['forms']['Default']}</Form.Label>
                                    <Form.Control
                                        type="color"
                                        id={rand}
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        title={trans['forms']["Choose your color"]}
                                    />


                                </>) : (<></>)}
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={this.props.formEdit.type === 'html' ? trans['forms']['HTML'] : trans['forms']['Default']}
                                >
                                    {this.props.formEdit.type === 'html' ? (
                                        <Form.Control
                                            type="text"
                                            as="textarea"
                                            style={{height: '400px', overflowY: 'scroll'}}
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                            className={"no-blur"}
                                            placeholder={trans['forms']['Default']}/>
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                            className={"no-blur"}
                                            placeholder={trans['forms']['Default']}/>
                                    )}
                                </FloatingLabel>


                                {/*} <Select options={options} />
                                <CreatableSelect  isClearable options={options} /> {*/}

                            </div>)
                    }
                    {this.props.formEdit.type === 'hr' ? (
                        <div className="col-12">
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={trans['forms']['Width']}
                            >
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                    className={"no-blur"}
                                    placeholder={trans['forms']['Width']}/>
                            </FloatingLabel>
                        </div>
                    ) : (<></>)}
                    {
                        this.props.formEdit.type === 'button' ? (
                            <>
                                <div className={"col-12"}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={trans['forms']['Button type']}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.formEdit.config.btn_type || ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'btn_type', true)}
                                            aria-label={trans['forms']['Button type']}>
                                            {this.props.formEdit.options.map((o, index) =>
                                                <option key={index} value={o.type}>
                                                    {o.name}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className={"col-12"}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={trans['forms']['Button CSS']}
                                    >
                                        <Form.Control
                                            type="text"
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.btn_class : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'btn_class', true)}
                                            className="no-blur"
                                            placeholder={trans['forms']['Button CSS']}/>
                                    </FloatingLabel>
                                </div>
                            </>
                        ) : (<></>)
                    }

                    {
                        this.props.formEdit.type === 'tinymce' ? (
                            <>
                                <div className={"col-12"}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={trans['forms']['Sanitization Level']}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.formEdit.config.sanitize || ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'sanitize', true)}
                                            aria-label={trans['forms']['Sanitization Level']}>
                                            {this.props.formEdit.options.map((o, index) =>
                                                <option key={index} value={o.type}>
                                                    {o.name}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                            </>
                        ) : (<></>)
                    }
                    {
                        this.props.formEdit.type === 'select' ||
                        this.props.formEdit.type === 'radio' ||
                        this.props.formEdit.type === 'switch'
                            ? (
                                <div className={"col-12 builder-options-background"}>
                                    <hr/>
                                    <h5 className="fw-semibold mb-3">
                                        <i className="text-blue bi bi-caret-down me-2"></i>
                                        {trans['forms']['Options']}
                                    </h5>
                                    <hr/>
                                    <button onClick={() => this.props.onAddOptionsInputField('select')}
                                            className="btn btn-switch-blue dark  btn-sm">
                                        <i className="bi bi-node-plus me-2"></i>
                                        {trans['forms']['Add option']}
                                    </button>
                                    <hr/>
                                    <div className="d-flex align-items-center pe-2 ps-3">
                                        <div>
                                            {this.props.formEdit.type === 'select' ||
                                            this.props.formEdit.type === 'switch' ? (<>
                                                <Form.Check
                                                    className="no-blur mb-1"
                                                    type="radio"
                                                    name={"standard"}
                                                    checked={this.props.formEdit.config.standard || false}
                                                    onChange={(e) => this.props.onUpdateEditOptionsTextField(e.currentTarget.value, 'standard', false)}
                                                    id={uuidv4()}
                                                    label={trans['forms']['no default']}
                                                />
                                                {this.props.formEdit.type === 'select' ? (<>
                                                    <Form.Check
                                                        className="no-blur"
                                                        checked={this.props.formEdit.config.send_email || false}
                                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'send_email', true)}
                                                        id={uuidv4()}
                                                        label={trans['forms']['Email recipient']}
                                                    />
                                                    {this.props.formEdit.config.send_email ? (
                                                        <div className="form-text">
                                                            {trans['forms']['Enter the e-mail recipient in the Value field.']}
                                                        </div>) : (<></>)}
                                                </>) : (<></>)}
                                            </>) : (<></>)}

                                        </div>
                                        <div className="ms-auto">
                                            <i onClick={this.onChangeOptionsCollapse}
                                               className={"collapse-option-btn fw-normal fs-5" + (this.state.optionCollapse ? ' active' : '')}></i>
                                        </div>
                                    </div>
                                    <SelectLoop
                                        formEdit={this.props.formEdit}
                                        onUpdateSelectOptionsSortable={this.props.onUpdateSelectOptionsSortable}
                                        sortableOptions={this.props.sortableOptions}
                                        onUpdateSelectOptions={this.props.onUpdateSelectOptions}
                                        onDeleteSectionOption={this.props.onDeleteSectionOption}
                                        onChangeOptionsSingleCollapse={this.onChangeOptionsSingleCollapse}
                                        optionCollapse={this.state.optionCollapse}
                                        onUpdateEditOptionsTextField={this.props.onUpdateEditOptionsTextField}
                                    />
                                </div>
                            ) : (<></>)
                    }
                    {
                        this.props.formEdit.type === 'checkbox' ? (
                            <div className={"col-12 builder-options-background"}>
                                <hr/>
                                <h5 className="fw-semibold mb-3">
                                    <i className="text-blue bi bi-caret-down me-2"></i>
                                    {trans['forms']['Options']}
                                </h5>
                                <hr/>
                                <button onClick={() => this.props.onAddOptionsInputField('checkbox')}
                                        className="btn btn-switch-blue dark btn-sm">
                                    <i className="bi bi-node-plus me-2"></i>
                                    {trans['forms']['Add option']}
                                </button>
                                <hr/>
                                <div className="d-flex align-items-center pe-2 ps-3">
                                    <div className="ms-auto">
                                        <i onClick={this.onChangeOptionsCollapse}
                                           className={"collapse-option-btn fw-normal fs-5" + (this.state.optionCollapse ? ' active' : '')}></i>
                                    </div>
                                </div>
                                <CheckLoop
                                    formEdit={this.props.formEdit}
                                    onUpdateSelectOptionsSortable={this.props.onUpdateSelectOptionsSortable}
                                    sortableOptions={this.props.sortableOptions}
                                    onUpdateSelectOptions={this.props.onUpdateSelectOptions}
                                    onDeleteSectionOption={this.props.onDeleteSectionOption}
                                    onChangeOptionsSingleCollapse={this.onChangeOptionsSingleCollapse}
                                    optionCollapse={this.optionCollapse}
                                    onUpdateEditOptionsTextField={this.props.onUpdateEditOptionsTextField}
                                    onUpdateEditCheckboxTextField={this.props.onUpdateEditCheckboxTextField}
                                />

                            </div>
                        ) : (<></>)
                    }
                    {this.props.formEdit.type === 'date' ? (
                        <>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Date type']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.date_type || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'date_type', true)}
                                        aria-label={trans['forms']['Date type']}>
                                        {this.props.selects.date_formats.map((o, index) =>
                                            <option key={index} value={o.value}>
                                                {o.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>
                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Date from']}
                                >
                                    <Form.Control
                                        type={this.props.formEdit.config.date_type || 'date'}
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.date_min : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'date_min', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Date from']}/>
                                </FloatingLabel>
                            </div>
                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Date to']}
                                >
                                    <Form.Control
                                        type={this.props.formEdit.config.date_type || 'date'}
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.date_max : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'date_max', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Date to']}/>
                                </FloatingLabel>
                            </div>
                        </>
                    ) : (<></>)}
                    {this.props.formEdit.form_type === 'upload' ? (
                        <div className={"col-12"}>
                            <hr/>
                            <div className="fs-5 mt-2 mb-3 fw-semibold">{trans['forms']['Settings']}</div>

                            <Form.Check
                                className="no-blur mb-1"
                                type="switch"
                                checked={this.props.formEdit.config.show_btn || false}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'show_btn', true)}
                                id={uuidv4()}
                                label={trans['forms']['Show button']}
                            />
                            {/*} <Form.Check
                                className="no-blur mb-1"
                                type="switch"
                                checked={this.props.formEdit.config.chunk_upload || false}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'chunk_upload', true)}
                                id={uuidv4()}
                                label={bsFormBuild.lang['Chunk Upload']}
                            />
                            <Form.Check
                                className="no-blur mb-3"
                                type="switch"
                                checked={this.props.formEdit.config.allowFileSizeValidation || false}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'allowFileSizeValidation', true)}
                                id={uuidv4()}
                                label={bsFormBuild.lang['Validation of the file size']}
                            />{*/}

                            <FloatingLabel
                                className={!this.props.formEdit.config.show_btn ? 'd-none' : ' mb-2'}
                                controlId={uuidv4()}
                                label={trans['forms']['Button text']}
                            >
                                <Form.Control
                                    type="text"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.datei_select_txt : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'datei_select_txt', true)}
                                    className="no-blur"
                                    placeholder={trans['forms']['Button text']}/>
                            </FloatingLabel>
                            {/*}<FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label={bsFormBuild.lang['Minimum file size (MB)']}
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.minFileSize : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'minFileSize', true)}
                                    className="no-blur"
                                    placeholder={bsFormBuild.lang['Minimum file size (MB)']}/>
                            </FloatingLabel>{*/}
                            <FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label={trans['forms']['maximum file size (MB)']}
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.maxFileSize : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'maxFileSize', true)}
                                    className="no-blur"
                                    placeholder={trans['forms']['Maximum file size (MB)']}/>
                            </FloatingLabel>
                            {/*} <FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label={bsFormBuild.lang['maximum total upload size (MB)']}
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.maxTotalFileSize : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'maxTotalFileSize', true)}
                                    className="no-blur"
                                    placeholder={bsFormBuild.lang['maximum total upload size (MB)']}/>
                            </FloatingLabel> {*/}
                            <FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label={trans['forms']['Max. Files per e-mail']}
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.maxFiles : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'maxFiles', true)}
                                    className="no-blur"
                                    placeholder={trans['forms']['Max. Files per e-mail']}/>
                            </FloatingLabel>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={trans['forms']['File Upload MimeTypes']}
                            >
                                <Form.Control
                                    type="text"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.accept : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'accept', true)}
                                    className="no-blur"
                                    placeholder={trans['forms']['File Upload MimeTypes']}/>
                            </FloatingLabel>
                            <div className="form-text">
                                {trans['forms']['Separate MimeTypes with comma or semicolon.']}
                            </div>
                        </div>
                    ) : (<></>)}
                    {this.props.formEdit.type === 'range' ? (
                        <Fragment>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Default']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Default']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Minimum']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.min : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'min', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Minimum']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Maximum']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.max : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'max', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Maximum']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Step']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.step : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'step', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['Step']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <Form.Check
                                    className="no-blur my-1"
                                    type="switch"
                                    checked={this.props.formEdit.config.show_value || false}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'show_value', true)}
                                    id={uuidv4()}
                                    label={trans['forms']['Show value']}
                                />
                            </div>
                            {this.props.formEdit.config.show_value ? (
                                <Fragment>
                                    <div className="col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={trans['forms']['Prefix']}
                                        >
                                            <Form.Control
                                                type="text"
                                                value={this.props.formEdit !== '' ? this.props.formEdit.config.prefix : ''}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'prefix', true)}
                                                className="no-blur"
                                                placeholder={trans['forms']['Prefix']}/>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={trans['forms']['Suffix']}
                                        >
                                            <Form.Control
                                                type="text"
                                                value={this.props.formEdit !== '' ? this.props.formEdit.config.suffix : ''}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'suffix', true)}
                                                className="no-blur"
                                                placeholder={trans['forms']['Suffix']}/>
                                        </FloatingLabel>
                                    </div>
                                </Fragment>
                            ) : ''}
                        </Fragment>
                    ) : ''}
                    {this.props.formEdit.type === 'rating' ? (
                        <React.Fragment>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Default']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        className="no-blur"
                                        min={0}
                                        max={this.props.formEdit.config.count}
                                        placeholder={trans['forms']['Default']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Number of stars']}
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.count : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'count', true)}
                                        className="no-blur"
                                        min={1}
                                        placeholder={trans['forms']['Number of stars']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['Rating type']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.type}
                                        onChange={(e) => this.props.onUpdateEditStarField(e.currentTarget.value)}
                                        aria-label={trans['forms']['Rating type']}>
                                        {this.props.formEdit.options.map((r, index) =>
                                            <option key={index} value={r.id}>
                                                {r.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['font size']}
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.font_size : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'font_size', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['font size']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={trans['forms']['spacing']}
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.distance : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'distance', true)}
                                        className="no-blur"
                                        placeholder={trans['forms']['spacing']}/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    className="d-flex justify-content-end flex-row-reverse align-items-center my-1"
                                    controlId={uuidv4()}
                                >
                                    <Form.Label
                                        className="ms-2">
                                        {trans['forms']['Colour not active']}
                                    </Form.Label>
                                    <Form.Control
                                        className="no-blur"
                                        type="color"
                                        value={this.props.formEdit.config.color}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'color', true)}
                                        title={trans['forms']['Colour not active']}
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    className="d-flex justify-content-end flex-row-reverse align-items-center"
                                    controlId={uuidv4()}
                                >
                                    <Form.Label
                                        className="ms-2">
                                        {trans['forms']['Colour active']}
                                    </Form.Label>
                                    <Form.Control
                                        className="no-blur"
                                        type="color"
                                        value={this.props.formEdit.config.color_fill}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'color_fill', true)}
                                        title={trans['forms']['Colour active']}
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <Form.Check
                                    className="no-blur my-1"
                                    type="switch"
                                    checked={this.props.formEdit.config.reset || false}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'reset', true)}
                                    id={uuidv4()}
                                    label={trans['forms']['Reset active']}
                                />
                            </div>
                        </React.Fragment>
                    ) : ''}
                    {this.props.formEdit.form_type === 'credit-card' ? (
                        <React.Fragment>
                            {this.props.formEdit.type === 'credit-card' ? (
                                <React.Fragment>
                                    <div className="col-12">
                                        <Form.Check
                                            className="no-blur my-1"
                                            type="switch"
                                            checked={this.props.formEdit.options.show_name}
                                            onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.checked, 'show_name')}
                                            id={uuidv4()}
                                            label={trans['forms']['Show name']}
                                        />
                                    </div>
                                    {this.props.formEdit.options.show_name ? (<>
                                        {this.props.formEdit.hide_label ? '' : (
                                            <div className="col-12">
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={trans['forms']['Label Name']}
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        value={this.props.formEdit.options.label_name || ''}
                                                        onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.value, 'label_name')}
                                                        className="no-blur"
                                                        placeholder={trans['forms']['Label Name']}/>
                                                </FloatingLabel>
                                            </div>)}
                                        <div className="col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={trans['forms']['Name Placeholder']}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    value={this.props.formEdit.options.label_placeholder || ''}
                                                    onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.value, 'label_placeholder')}
                                                    className="no-blur"
                                                    placeholder={trans['forms']['Name Placeholder']}/>
                                            </FloatingLabel>
                                        </div>

                                    </>) : ''}

                                </React.Fragment>
                            ) : ''}

                            {this.props.formEdit.type === 'credit-card' ? (
                                <React.Fragment>
                                    {this.props.formEdit.hide_label ? '' : (
                                        <div className="col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={trans['forms']['Label Card number']}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    value={this.props.formEdit.options.label_card_number || ''}
                                                    onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.value, 'label_card_number')}
                                                    className="no-blur"
                                                    placeholder={trans['forms']['Label Card number']}/>
                                            </FloatingLabel>
                                        </div>
                                    )}
                                </React.Fragment>
                            ) : ''}

                            <React.Fragment>
                                {this.props.formEdit.type === 'credit-card' ? (
                                    <div className="col-12">
                                        <Form.Check
                                            className="no-blur my-1"
                                            type="switch"
                                            checked={this.props.formEdit.options.show_date}
                                            onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.checked, 'show_date')}
                                            id={uuidv4()}
                                            label={trans['forms']['Show date']}
                                        />
                                    </div>
                                ) : ''}
                                {this.props.formEdit.type === 'credit-card-date' || this.props.formEdit.options.show_date ? (<>
                                        {this.props.formEdit.hide_label ? '' : (
                                            <div className="col-12">
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={trans['forms']['Label expiry date']}
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        value={this.props.formEdit.options.label_card_date || ''}
                                                        onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.value, 'label_card_date')}
                                                        className="no-blur"
                                                        placeholder={trans['forms']['Label expiry date']}/>
                                                </FloatingLabel>
                                            </div>)}</>
                                ) : ''}
                            </React.Fragment>


                            {this.props.formEdit.type === 'credit-card' ? (
                                <div className="col-12">
                                    <Form.Check
                                        className="no-blur my-1"
                                        type="switch"
                                        checked={this.props.formEdit.options.show_cvc}
                                        onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.checked, 'show_cvc')}
                                        id={uuidv4()}
                                        label={trans['forms']['Show CVC']}
                                    />
                                </div>
                            ) : ''}

                            {this.props.formEdit.type === 'credit-card-cvc' || this.props.formEdit.type === 'credit-card' ? (
                                <React.Fragment>
                                    {this.props.formEdit.hide_label || !this.props.formEdit.options.show_cvc ? '' : (
                                        <div className="col-12">
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={trans['forms']['Label CVC']}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    value={this.props.formEdit.options.label_card_cvc || ''}
                                                    onChange={(e) => this.props.onCreditCardTypeValue(e.currentTarget.value, 'label_card_cvc')}
                                                    className="no-blur"
                                                    placeholder={trans['forms']['Label CVC']}/>
                                            </FloatingLabel>
                                        </div>
                                    )}
                                </React.Fragment>
                            ) : ''}
                        </React.Fragment>
                    ) : ''}
                    <div className="col-12">
                        <hr/>
                        <button onClick={this.onDeleteField}
                                className="btn btn-danger btn-sm">
                            <i className="bi bi-trash me-2"></i>
                            {trans['forms']['Delete field']}
                        </button>

                    </div>

                </div>
            </>
        )
    }
}