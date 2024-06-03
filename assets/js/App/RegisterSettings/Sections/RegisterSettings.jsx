import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, Row, Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";

const v5NameSpace = '2fc57ac2-be92-11ee-b79b-325096b39f47';
export default class RegisterSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

    }

    render() {
        return (
            <React.Fragment>
                <Col xxl={8} xl={10} xs={12} className="mx-auto">
                    <Card className="shadow-sm mt-3">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-person-workspace me-2"></i>
                                {trans['reg']['Registration settings']}
                            </div>
                            <div className="ms-auto">
                                <div
                                    className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                <small>
                                    <SetAjaxResponse
                                        status={this.props.spinner.ajaxStatus}
                                        msg={this.props.spinner.ajaxMsg}
                                    />
                                </small>
                            </div>
                        </Card.Header>
                        <CardBody>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            type="switch"
                                            className="no-blur me-4"
                                            id={uuidv5('showForgotPw', v5NameSpace)}
                                            checked={this.props.settings.registration_active || false}
                                            onChange={(e) => this.props.onChangeSettings(e.target.checked, 'registration_active')}
                                            label={trans['reg']['Anyone can register']}
                                        />
                                        <Form.Check
                                            type="switch"
                                            id={uuidv5('registerActive', v5NameSpace)}
                                            checked={this.props.settings.show_forgotten_password || false}
                                            onChange={(e) => this.props.onChangeSettings(e.target.checked, 'show_forgotten_password')}
                                            label={trans['reg']['Show forgotten password']}
                                        />
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <fieldset disabled={!this.props.settings.registration_active}>
                                        <hr className="mt-0"/>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('registerMethodEmail', v5NameSpace)}
                                            checked={this.props.settings.registration_method === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'registration_method')}
                                            label={trans['reg']['Confirm registration with e-mail']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('registerMethodManual', v5NameSpace)}
                                            checked={this.props.settings.registration_method === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'registration_method')}
                                            label={trans['reg']['Activate new registration manually']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('registerMethodSofort', v5NameSpace)}
                                            checked={this.props.settings.registration_method === 3}
                                            onChange={(e) => this.props.onChangeSettings(3, 'registration_method')}
                                            label={trans['reg']['User active immediately']}
                                        />
                                    </fieldset>
                                </Col>
                                <Col xs={12}>
                                    <fieldset disabled={!this.props.settings.registration_active}>
                                        <hr className="mt-0"/>
                                        <div className="d-flex flex-wrap">
                                            <Form.Check
                                                type="switch"
                                                className="me-4"
                                                id={uuidv5('sendEmail', v5NameSpace)}
                                                checked={this.props.settings.send_notification || false}
                                                onChange={(e) => this.props.onChangeSettings(e.target.checked, 'send_notification')}
                                                label={trans['reg']['Send notification of new registration']}
                                            />
                                            <Form.Check
                                                type="switch"
                                                id={uuidv5('sendAfterEmail', v5NameSpace)}
                                                checked={this.props.settings.send_after_validate || false}
                                                onChange={(e) => this.props.onChangeSettings(e.target.checked, 'send_after_validate')}
                                                label={trans['reg']['Send notification after manual activation.']}
                                            />
                                        </div>
                                        <Collapse
                                            in={this.props.settings.send_notification && this.props.settings.registration_active || false}>
                                            <div className="mt-3" id={uuidv5('collapseSendEmail', v5NameSpace)}>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('emailNotification', v5NameSpace)}
                                                        label={trans['reg']['E-mail address for notification']}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            type="email"
                                                            value={this.props.settings.email_notification || ''}
                                                            onChange={(e) => this.props.onChangeSettings(e.target.value, 'email_notification', 'record')}
                                                            placeholder={trans['reg']['E-mail address for notification']}/>
                                                    </FloatingLabel>
                                                </Col>
                                            </div>
                                        </Collapse>
                                    </fieldset>
                                </Col>
                            </Row>
                            <fieldset disabled={!this.props.settings.registration_active}>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <hr/>
                                        <div
                                            className={`fs-5 ms-2 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>{trans['reg']['Registration form fields']}</div>
                                        <hr className="mb-0"/>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Company/Organisation']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showCompany0', v5NameSpace)}
                                            checked={this.props.settings.show_company === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_company')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showCompany1', v5NameSpace)}
                                            checked={this.props.settings.show_company === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_company')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showCompany2', v5NameSpace)}
                                            checked={this.props.settings.show_company === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_company')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Title']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showTitle0', v5NameSpace)}
                                            checked={this.props.settings.show_title === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_title')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showTitle1', v5NameSpace)}
                                            checked={this.props.settings.show_title === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_title')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showTitle2', v5NameSpace)}
                                            checked={this.props.settings.show_title === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_title')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['First name / Surname']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showName0', v5NameSpace)}
                                            checked={this.props.settings.show_name === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_name')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showName1', v5NameSpace)}
                                            checked={this.props.settings.show_name === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_name')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showName2', v5NameSpace)}
                                            checked={this.props.settings.show_name === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_name')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Street / house number']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showStreet0', v5NameSpace)}
                                            checked={this.props.settings.show_street === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_street')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showStreet1', v5NameSpace)}
                                            checked={this.props.settings.show_street === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_street')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showStreet2', v5NameSpace)}
                                            checked={this.props.settings.show_street === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_street')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Postcode / city']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showCity0', v5NameSpace)}
                                            checked={this.props.settings.show_city === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_city')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showCity1', v5NameSpace)}
                                            checked={this.props.settings.show_city === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_city')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showCity2', v5NameSpace)}
                                            checked={this.props.settings.show_city === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_city')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Telephone number']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showPhone0', v5NameSpace)}
                                            checked={this.props.settings.show_phone === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_phone')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showPhone1', v5NameSpace)}
                                            checked={this.props.settings.show_phone === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_phone')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showPhone2', v5NameSpace)}
                                            checked={this.props.settings.show_phone === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_phone')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <div
                                            className={`fw-semibold mb-1 ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Mobile']}
                                        </div>
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showMobile0', v5NameSpace)}
                                            checked={this.props.settings.show_mobile === 0}
                                            onChange={(e) => this.props.onChangeSettings(0, 'show_mobile')}
                                            label={trans['reg']['do not show']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showMobile1', v5NameSpace)}
                                            checked={this.props.settings.show_mobile === 1}
                                            onChange={(e) => this.props.onChangeSettings(1, 'show_mobile')}
                                            label={trans['reg']['not a required field']}
                                        />
                                        <Form.Check
                                            type="radio"
                                            inline
                                            id={uuidv5('showMobile2', v5NameSpace)}
                                            checked={this.props.settings.show_mobile === 2}
                                            onChange={(e) => this.props.onChangeSettings(2, 'show_mobile')}
                                            label={trans['reg']['Required field']}
                                        />
                                    </Col>
                                    <Col xs={12}>
                                        <hr className="mt-0"/>
                                        <Form.Check
                                            type="switch"
                                            id={uuidv5('leakChecker', v5NameSpace)}
                                            checked={this.props.settings.leak_checker || false}
                                            onChange={(e) => this.props.onChangeSettings(e.target.checked, 'leak_checker')}
                                            label={trans['reg']['Password Leak Checker active']}
                                        />
                                        <div
                                            className={`form-text ${!this.props.settings.registration_active ? 'text-secondary' : ''}`}>
                                            {trans['reg']['Checks whether the password is affected by a data leak.']}
                                        </div>
                                    </Col>
                                </Row>
                            </fieldset>
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
        )
    }
}