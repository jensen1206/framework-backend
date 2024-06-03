import * as React from "react";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4,v5 as uuidv5} from "uuid";
import {FormGroup} from "react-bootstrap";
import {useCreditCardValidator, images} from 'react-creditcard-validator';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import InputGroup from "react-bootstrap/InputGroup";
import parser from "react-html-parser";
import _,{map } from 'underscore';
const v5NameSpace = 'ab510b60-edbe-11ee-b21a-325096b39f47';
export default class TextFields extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {}
    }

    onDeleteFormInput(formId, gridId, groupId) {

        let formData = {
            'method': 'delete_form_input',
            'group': groupId,
            'grid': gridId,
            'input_id': formId,
            'form_id': this.props.formData.form_id,
        }

        let swal = {
            'title': `${trans['forms']['Delete form field']}?`,
            'msg': trans['forms']['Do you really want to delete a form field? The deletion cannot be undone.'],
            'btn': trans['Delete']
        }
        this.props.onDeleteSwalHandle(formData, swal)
    }

    expDateValidate(month, year) {

    }

    render() {

        const PayInputs = () => {
            const {
                getCardNumberProps,
                getExpiryDateProps,
                getCVCProps,
                getCardImageProps,
                meta: {erroredInputs}
            } = useCreditCardValidator();

            return (
                <React.Fragment>
                    <div className="ms-2 mb-1 border p-3 rounded" style={{maxWidth: '350px'}}>
                        <Row className="g-2">
                            {this.props.formInput.options.show_name ? (
                                <Form.Group controlId={uuidv4()} as={Col} xs={12}>
                                    {this.props.formInput.hide_label ? '' : (
                                        <Form.Label className="mb-1">
                                            {this.props.formInput.options.label_name} {this.props.formInput.required ? '*' : ''}
                                        </Form.Label>)}
                                    <div className="position-relative">
                                        <div className="position-absolute credit-card-icon-wrapper me-2 end-0">
                                            <i className="bi bi-person text-muted"></i>
                                        </div>
                                        <Form.Control
                                            className="pe-none"
                                            type="text"
                                            required={true}
                                            placeholder={this.props.formInput.options.label_placeholder}
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid">
                                        {this.props.formInput.err_msg}
                                    </Form.Control.Feedback>
                                </Form.Group>) : ''}
                            {this.props.formInput.type === 'credit-card' ? (
                                <Form.Group className="has-validation" as={Col} xs={12}>
                                    {this.props.formInput.hide_label ? '' : (
                                        <Form.Label className="mb-1" htmlFor={'cardNumber'}>
                                            {this.props.formInput.options.label_card_number} {this.props.formInput.required ? '*' : ''}
                                        </Form.Label>)}
                                    <div className="position-relative">
                                        <div className="position-absolute credit-card-svg-wrapper me-2 end-0">
                                            <svg {...getCardImageProps({images})} />
                                        </div>
                                        <input
                                            className={`pe-none w-100 form-control ${erroredInputs.cardNumber && erroredInputs.cardNumber ? 'is-invalid' : ''}`} {...getCardNumberProps()} />
                                    </div>
                                    <Form.Control.Feedback
                                        type="invalid">
                                        {erroredInputs.cardNumber && erroredInputs.cardNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>) : ''}

                            {this.props.formInput.type === 'credit-card-date' || this.props.formInput.options.show_date ? (
                                <Form.Group className="has-validation" as={Col} xs={12} xl={this.props.formInput.type === 'credit-card-date' || !this.props.formInput.options.show_cvc ? 12 : 6}>
                                    {this.props.formInput.hide_label ? '' : (
                                        <Form.Label className="mb-1" htmlFor={'expiryDate'}>
                                            {this.props.formInput.options.label_card_date} {this.props.formInput.required ? '*' : ''}
                                        </Form.Label>)}
                                    <div className="position-relative">
                                        <div className="position-absolute credit-card-icon-wrapper me-2 end-0">
                                            <i className="bi bi-calendar4-week text-muted"></i>
                                        </div>
                                        <input
                                            className={`pe-none w-100 form-control ${erroredInputs.expiryDate && erroredInputs.expiryDate ? 'is-invalid' : ''}`} {...getExpiryDateProps()} />
                                    </div>
                                    <Form.Control.Feedback
                                        type="invalid">{erroredInputs.expiryDate && erroredInputs.expiryDate}</Form.Control.Feedback>
                                </Form.Group>) : ''}
                            {this.props.formInput.type === 'credit-card-cvc' || this.props.formInput.options.show_cvc ? (
                                <Form.Group as={Col} xs={12} xl={this.props.formInput.type === 'credit-card-cvc' || !this.props.formInput.options.show_date ? 12 : 6}>
                                    {this.props.formInput.hide_label ? '' : (
                                        <Form.Label className="mb-1" htmlFor={'cvc'}>
                                            {this.props.formInput.options.label_card_cvc} {this.props.formInput.required ? '*' : ''}
                                        </Form.Label>)}
                                    <div className="position-relative">
                                        <div className="position-absolute credit-card-icon-wrapper me-2 end-0">
                                            <i className="bi bi-lock text-muted"></i>
                                        </div>
                                        <input
                                            className={`pe-none w-100 form-control ${erroredInputs.cvc && erroredInputs.cvc ? 'is-invalid' : ''}`} {...getCVCProps()} />
                                    </div>
                                    <Form.Control.Feedback
                                        type="invalid">{erroredInputs.cvc && erroredInputs.cvc}</Form.Control.Feedback>
                                </Form.Group>) : ''}
                        </Row>
                    </div>
                    {this.props.formInput && this.props.formInput.config.caption ? (
                        <div className="form-text ms-2">
                            {this.props.formInput.config.caption}
                        </div>

                    ) : (<></>)}
                </React.Fragment>
            );
        }
        const TextInputs = () => {
            return (
                <div className="position-relative">
                    <div className="form-input-field-type">
                        <i className={"me-2 " + (this.props.formInput.icon)}></i>
                        <div className="text-nowrap"> {this.props.formInput.select}</div>
                    </div>
                    <div className="forms-input-wrapper">
                        <div className="d-flex align-items-center justify-content-end">
                            <i onClick={() => this.onDeleteFormInput(this.props.formInput.id, this.props.gridId, this.props.groupId)}
                               className="bi bi-trash me-1"></i>
                            <div className="forms-arrow">
                                <i className="bi bi-arrows-move"></i>
                            </div>
                        </div>
                    </div>
                    {this.props.formInput.type === 'button' ? (
                        <>
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <div
                                    style={{maxWidth: '75%'}}
                                    className="text-truncate my-1">
                                    {this.props.formInput.config.btn_type || ''}
                                </div>
                                <div className="d-block mt-1">
                                    <button type="button"
                                            className={"pe-none btn btn-outline-secondary"}>
                                        {this.props.formInput.label}
                                    </button>
                                </div>
                            </div>
                        </>) : (<></>)}

                    {this.props.formInput.form_type === 'textfeld' && this.props.formInput.type !== 'button' ? (
                        <Form.Group
                            className="no-blur"
                            controlId={uuidv4()}>
                            {this.props.formInput.hide_label ? (
                                <div style={{minHeight: '1.75rem'}}></div>
                            ) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    className="text-truncate mb-2">
                                    {this.props.formInput.label} {this.props.formInput.required ? '*' : ''}
                                </div>)}
                            <Form.Control
                                disabled={true}
                                type={this.props.formInput.type === 'hidden' ? 'text' : this.props.formInput.type}
                                defaultValue={this.props.formInput.config.default}
                                required={this.props.formInput.required}
                                placeholder={this.props.formInput.config.placeholder}/>
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>

                            ) : (<></>)}
                        </Form.Group>
                    ) : (<></>)}
                    {this.props.formInput.type === 'select' ? (
                        <Form.Group
                            className="no-blur"
                            controlId={uuidv4()}>
                            {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    className="text-truncate mb-2">
                                    {this.props.formInput.label} {this.props.formInput.required ? '*' : ''}
                                </div>)}
                            <Form.Select
                                disabled={true}
                                value={this.props.formInput.config.selected || ''}
                                aria-label="Select-Field">
                                {this.props.formInput.options.map((o, index) =>
                                    <option key={o.id} value={o.id}>
                                        {this.props.formInput.config.selected && !this.props.formInput.config.standard ? o.label : ''}
                                    </option>
                                )}
                            </Form.Select>
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : (<></>)}
                        </Form.Group>) : (<></>)}
                    {this.props.formInput.type === 'radio' ? (
                        <>
                            {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    className="text-truncate d-block mb-2">
                                    {this.props.formInput.label}
                                </div>)}
                            {this.props.formInput.options.map((o, index) => {
                                return (
                                    <Form.Check
                                        className="text-field-check"
                                        disabled={true}
                                        checked={o.checked}
                                        inline={this.props.formInput && this.props.formInput.config.inline || false}
                                        key={index}
                                        type="radio"
                                        id={uuidv4()}
                                        label={o.label + (o.required ? ' *' : '')}
                                    />
                                )
                            })}
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : (<></>)}
                        </>
                    ) : (<></>)}
                    {this.props.formInput.type === 'date' ? (
                        <Form.Group
                            className="no-blur"
                            controlId={this.props.formInput.id}>
                            {this.props.formInput.hide_label ? (
                                <div style={{minHeight: '1.75rem'}}></div>
                            ) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    className="text-truncate mb-2">
                                    {this.props.formInput.label} {this.props.formInput.required ? '*' : ''}
                                </div>)}
                            <Form.Control
                                disabled={true}
                                type={this.props.formInput.config.date_type === 'year' ? 'date' : this.props.formInput.config.date_type}
                                defaultValue={this.props.formInput.config.default}
                                required={this.props.formInput.required}
                                placeholder={this.props.formInput.config.placeholder}/>
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : (<></>)}
                        </Form.Group>
                    ) : (<></>)}
                    {this.props.formInput.type === 'checkbox' ? (
                        <>
                            {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    id={uuidv4()}
                                    className="text-truncate d-block mb-2">
                                    {this.props.formInput.label}
                                </div>)}
                            {this.props.formInput.options.map((o, index) => {
                                return (
                                    <Form.Check
                                        className="text-field-check"
                                        disabled={true}
                                        checked={o.checked}
                                        inline={this.props.formInput && this.props.formInput.config.inline || false}
                                        key={index}
                                        type={this.props.formInput && this.props.formInput.config.switch ? 'switch' : 'checkbox'}
                                        id={uuidv4()}
                                        label={o.label + (o.required ? ' *' : '')}
                                    />
                                )
                            })}
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : (<></>)}
                        </>
                    ) : (<></>)}

                    {this.props.formInput.type === 'privacy-check' ? (
                        <>
                            {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    id={uuidv4()}
                                    className="text-truncate d-block mb-2">
                                    {this.props.formInput.label}
                                </div>)}

                            <Form.Check
                                className="text-field-check"
                                disabled={true}
                                checked={false}
                                inline={false}
                                type={this.props.formInput && this.props.formInput.config.switch ? 'switch' : 'checkbox'}
                                id={uuidv4()}
                                label={this.props.formInput.config.default + ' *'}
                            />
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : (<></>)}

                        </>
                    ) : (<></>)}
                    {this.props.formInput.type === 'switch' ? (<>
                        {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                            <div
                                style={{maxWidth: '75%'}}
                                id={uuidv4()}
                                className="text-truncate d-block mb-2">
                                {this.props.formInput.label}
                            </div>)}
                        <div
                            className={"btn-group switch-btn-group " + (this.props.formInput.config.btn_size) + ' ' + (this.props.formInput.config.alignment)}
                            role="group" aria-label="Basic example">
                            {this.props.formInput.options.map((o, index) => {
                                return (
                                    <button
                                        key={o.id}
                                        type="button"
                                        className={"btn btn-outline-primary pe-none" + (o.default ? ' active' : '')}>
                                        {o.label}
                                    </button>
                                )
                            })}
                        </div>
                        {this.props.formInput && this.props.formInput.config.caption ? (
                            <div className="form-text">
                                {this.props.formInput.config.caption}
                            </div>
                        ) : (<></>)}
                    </>) : (<></>)}

                    {this.props.formInput.form_type === 'html' ? (
                        <>
                            {this.props.formInput.type === 'html' ? (
                                <div className="html-output">
                                    <div style={{minHeight: '1.75rem'}}>
                                        {parser(this.props.formInput.config.default)}
                                    </div>
                                </div>) : <></>}
                        </>
                    ) : (<></>)}
                    {this.props.formInput.type === 'hr' ? (
                        <>
                            <div className="html-output">
                                <div style={{minHeight: '1rem'}}></div>
                                <hr style={{
                                    width: this.props.formInput.config.default + '%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}/>
                            </div>
                        </>
                    ) : (<></>)}

                    {this.props.formInput.type === 'upload' ? (
                        <>
                            <div className="mx-auto" style={{maxWidth: '500px'}}>
                                {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                    <div
                                        style={{maxWidth: '75%'}}
                                        id={uuidv4()}
                                        className="text-truncate d-block mb-2">
                                        {this.props.formInput.label + (this.props.formInput.required ? ' *' : '')}
                                    </div>)}
                                <div style={{height: '4rem'}}
                                     className="bg-body-secondary p-3 d-flex align-items-center justify-content-center position-relative border rounded">
                                    {this.props.formInput.message.drag_file_txt || ''}
                                </div>
                                <button
                                    className={"btn btn-outline-secondary mt-2 pe-none" + (this.props.formInput && this.props.formInput.config.show_btn ? '' : ' opacity0')}>
                                    {this.props.formInput.config.datei_select_txt || ''}
                                </button>
                                {this.props.formInput && this.props.formInput.config.caption ? (
                                    <div className="form-text">
                                        {this.props.formInput.config.caption}
                                    </div>
                                ) : (<></>)}
                            </div>
                        </>
                    ) : (<></>)}
                    {this.props.formInput.type === 'range' ? (
                        <>
                            <FormGroup
                                controlId={uuidv4()}
                            >
                                {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                    <Form.Label
                                        style={{maxWidth: '75%'}}
                                        className="text-truncate d-block mb-2">
                                        {this.props.formInput.label + (this.props.formInput.required ? ' *' : '')}
                                    </Form.Label>)}
                                <div className="d-flex align-items-center">
                                    <Form.Range
                                        className="pe-none mt-1 p-0 w-100"
                                        min={this.props.formInput.config.min || ''}
                                        max={this.props.formInput.config.max || ''}
                                        step={this.props.formInput.config.step || ''}
                                        defaultValue={this.props.formInput.config.default}
                                        required={this.props.formInput.required}
                                    />
                                    {this.props.formInput.config.show_value ? (
                                        <div
                                            className="d-flex justify-content-center w-auto align-items-center ms-1">
                                            {this.props.formInput.config.prefix ? (
                                                <div className="mx-1">
                                                    {this.props.formInput.config.prefix}
                                                </div>
                                            ) : ''}
                                            {this.props.formInput.config.default}
                                            {this.props.formInput.config.suffix ? (
                                                <div className="mx-1">
                                                    {this.props.formInput.config.suffix}
                                                </div>
                                            ) : ''}
                                        </div>
                                    ) : ''}
                                </div>
                            </FormGroup>
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : ('')
                            }
                        </>
                    ) : ''}
                    {this.props.formInput.type === 'rating' ? (
                        <>
                            {this.props.formInput.hide_label ? (<div style={{minHeight: '1.75rem'}}></div>) : (
                                <div
                                    style={{maxWidth: '75%'}}
                                    id={uuidv4()}
                                    className="text-truncate d-block mb-2">
                                    {this.props.formInput.label}
                                </div>)}
                            <div className="d-flex align-items-center">

                                {_.times(this.props.formInput.config.count || 5, (i) => (
                                    <i key={i}
                                       style={{
                                           color: i + 1 > this.props.formInput.config.default ? this.props.formInput.config.color : this.props.formInput.config.color_fill,
                                           fontSize: this.props.formInput.config.font_size,
                                           marginRight: this.props.formInput.config.distance
                                       }}
                                       className={i + 1 > this.props.formInput.config.default ? this.props.formInput.config.icon : this.props.formInput.config.icon_active}
                                    >
                                    </i>
                                ))}
                                {this.props.formInput.config.reset ? (
                                    <i className="bi bi-x-circle text-muted ms-2"></i>
                                ) : ''}
                            </div>
                            {this.props.formInput && this.props.formInput.config.caption ? (
                                <div className="form-text">
                                    {this.props.formInput.config.caption}
                                </div>
                            ) : (<></>)}

                        </>
                    ) : ''}
                    {this.props.formInput.type === 'credit-card' ||
                    this.props.formInput.type === 'credit-card-date'||
                    this.props.formInput.type === 'credit-card-cvc' ? (
                        <>
                            <div style={{minHeight: '1.75rem'}}></div>
                            <PayInputs/>
                        </>
                    ) : ''}
                </div>
            )
        }
        return (
            <>
                {this.props.formInput.form_type === 'textfeld' ? (<></>) : (<></>)}
                <TextInputs/>
            </>
        )
    }
}