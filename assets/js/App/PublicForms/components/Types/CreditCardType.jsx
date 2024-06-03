import * as React from "react";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import {FormGroup} from "react-bootstrap";
import {useCreditCardValidator, images} from 'react-creditcard-validator';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';



export default function PaymentInputs({form, onSetFormCreditCardTypes}) {




    function expDateValidate(month, year) {
        let  date = new Date();
         let jahr = date.getFullYear()
        let zj = String(jahr).substring(2,2);
        console.log(Number.parseInt(year), jahr)
       // console.log(date.getDate())
        /*if (jahr > Number.parseInt(year)) {
          //  return "Das Verfallsjahr darf nicht in der Vergangenheit liegen";
        }*/

      //  return false;
    }
    const {
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps,
        getCardImageProps,
        meta: { erroredInputs }
    } = useCreditCardValidator();



   if(getCardNumberProps().ref.current){
       let cardNum;
       if(erroredInputs.cardNumber && erroredInputs.cardNumber) {
           cardNum = '';
       } else {
           cardNum = getCardNumberProps().ref.current.value;
       }
       onSetFormCreditCardTypes(cardNum,'card_number', form.id)
   }

    if(getExpiryDateProps().ref.current){
        let cardDate;

        if(erroredInputs.expiryDate && erroredInputs.expiryDate) {
            cardDate = '';
        } else {
            cardDate = getExpiryDateProps().ref.current.value;
        }
        onSetFormCreditCardTypes(cardDate,'expiry_date', form.id)
    }

    if(getCVCProps().ref.current){
        let cardCvc;
        if(erroredInputs.cvc && erroredInputs.cvc) {
            cardCvc = '';
        } else {
            cardCvc = getCVCProps().ref.current.value;
        }
        onSetFormCreditCardTypes(cardCvc,'cvc', form.id)
    }

    return (
        <React.Fragment>
            <div className={`mb-1 border p-3 rounded ${form.config.custom_class}`}>
                <Row className="g-2">
                    {form.options.show_name ? (
                        <Form.Group className="credit-card-form" controlId={uuidv4()} as={Col} xs={12}>
                            {form.hide_label ? '' : (
                                <Form.Label className="mb-1">
                                    {form.options.label_name} {form.required ? '*':''}
                                </Form.Label>)}
                            <div className="position-relative">
                                <div className="position-absolute credit-card-icon-wrapper me-2 end-0">
                                    <i className="bi bi-person text-muted"></i>
                                </div>
                                <Form.Control
                                    className="no-blur"
                                    type="text"
                                    defaultValue={form.options.full_name || ''}
                                    onChange={(e) => onSetFormCreditCardTypes(e.currentTarget.value,'full_name', form.id)}
                                    required={form.required}
                                    placeholder={form.options.label_placeholder}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {form.err_msg}
                                </Form.Control.Feedback>
                            </div>
                        </Form.Group>) : ''}
                    {form.type === 'credit-card' ? (
                        <Form.Group className="has-validation" as={Col} xs={12}>
                            {form.hide_label ? '' : (
                                <Form.Label className="mb-1" htmlFor={'cardNumber'}>
                                    {form.options.label_card_number} {form.required ? '*':''}
                                </Form.Label>)}
                            <div className="position-relative">
                                <div className="position-absolute credit-card-svg-wrapper me-2 end-0">
                                    {erroredInputs.cardNumber && erroredInputs.cardNumber ? '' :(
                                        <svg {...getCardImageProps({images})} />)}
                                </div>
                                <input
                                    required={form.required}
                                    defaultValue={form.options.card_number || ''}
                                    className={`w-100 form-control no-blur ${erroredInputs.cardNumber && erroredInputs.cardNumber ? 'is-invalid' : ''}`} {...getCardNumberProps()} />
                                <Form.Control.Feedback
                                    type="invalid">
                                    {erroredInputs.cardNumber && erroredInputs.cardNumber}
                                </Form.Control.Feedback>
                            </div>
                        </Form.Group>) : ''}

                    {form.type === 'credit-card-date' || form.options.show_date ? (
                        <Form.Group className="has-validation" as={Col} xs={12}
                                    xl={form.type === 'credit-card-date' || !form.options.show_cvc ? 12 : 6}>
                            {form.hide_label ? '' : (
                                <Form.Label className="mb-1" htmlFor={'expiryDate'}>
                                    {form.options.label_card_date} {form.required ? '*':''}
                                </Form.Label>)}
                            <div className="position-relative">
                                <div className="position-absolute credit-card-icon-wrapper me-2 end-0">
                                    {erroredInputs.expiryDate && erroredInputs.expiryDate ? '' : (
                                        <i className="bi bi-calendar4-week text-muted"></i>)}
                                </div>
                                <input
                                    required={form.required}
                                    className={`w-100 form-control no-blur ${erroredInputs.expiryDate && erroredInputs.expiryDate ? 'is-invalid' : ''}`} {...getExpiryDateProps()} />

                                <Form.Control.Feedback
                                    type="invalid">{erroredInputs.expiryDate && erroredInputs.expiryDate}</Form.Control.Feedback>
                            </div>
                        </Form.Group>) : ''}
                    {form.type === 'credit-card-cvc' || form.options.show_cvc ? (
                        <Form.Group as={Col} xs={12}
                                    xl={form.type === 'credit-card-cvc' || !form.options.show_date ? 12 : 6}>
                            {form.hide_label ? '' : (
                                <Form.Label className="mb-1" htmlFor={'cvc'}>
                                    {form.options.label_card_cvc} {form.required ? '*':''}
                                </Form.Label>)}
                            <div className="position-relative">
                                <div className="position-absolute credit-card-icon-wrapper me-2 end-0">
                                    {erroredInputs.cvc && erroredInputs.cvc ? '' : (
                                        <i className="bi bi-lock text-muted"></i>)}
                                </div>
                                <input
                                    required={form.required}
                                    className={`w-100 form-control no-blur ${erroredInputs.cvc && erroredInputs.cvc ? 'is-invalid' : ''}`} {...getCVCProps()} />
                                <Form.Control.Feedback
                                    type="invalid">{erroredInputs.cvc && erroredInputs.cvc}
                                </Form.Control.Feedback>
                            </div>
                        </Form.Group>) : ''}
                </Row>
            </div>
            {form.config.caption ? (
                <div className="form-text ms-2">
                    {form.config.caption}
                </div>
            ) : (<></>)}
        </React.Fragment>
    );
}