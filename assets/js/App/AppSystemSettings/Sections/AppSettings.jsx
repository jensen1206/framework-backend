import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import Collapse from 'react-bootstrap/Collapse';

const v5NameSpace = '81a8bea8-bc53-11ee-a675-325096b39f47';
export default class AppSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
        }
    }

    render() {

        return (
            <React.Fragment>
                {systemSettings.manage_app ?
                    <Card className="shadow-sm mt-3">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-view-list me-2"></i>
                                {trans['app']['App settings']}
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
                            <Form>
                                <Collapse in={this.props.colStart}>
                                    <div id={uuidv5('collapseAppSettingsStart', v5NameSpace)}>
                                        <Row className="g-2">
                                            <Col xs={12} xl={6}>
                                                <FloatingLabel
                                                    controlId={uuidv5('siteName', v5NameSpace)}
                                                    label={`${trans['app']['Page title']} *`}
                                                >
                                                    <Form.Control
                                                        className="no-blur"
                                                        value={this.props.app.site_name || ''}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'site_name')}
                                                        aria-required={true}
                                                        required={true}
                                                        type="text"
                                                        placeholder={trans['app']['Page title']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} xl={6}>
                                                <FloatingLabel
                                                    controlId={uuidv5('adminEmail', v5NameSpace)}
                                                    label={`${trans['app']['Administrator e-mail address']} *`}
                                                >
                                                    <Form.Control
                                                        className="no-blur"
                                                        value={this.props.app.admin_email || ''}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'admin_email')}
                                                        aria-required={true}
                                                        required={true}
                                                        type="email"
                                                        placeholder={trans['app']['Administrator e-mail address']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <div className="d-flex flex-wrap">
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mt-3"
                                                    id={uuidv5('htmlMinimiseActive', v5NameSpace)}
                                                    checked={this.props.app.html_minimise || false}
                                                    onChange={(e) => this.props.onChangeAppSettings(e.target.checked, 'html_minimise')}
                                                    label={trans['app']['Minimise HTML']}
                                                />
                                                {this.props.su || systemSettings.manage_backup ?
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur ms-lg-4 mt-3"
                                                        id={uuidv5('exportVendor', v5NameSpace)}
                                                        checked={this.props.app.export_vendor || false}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.target.checked, 'export_vendor')}
                                                        label={trans['app']['Export vendor archive']}
                                                    />
                                                    : ''}
                                                </div>
                                            </Col>
                                            {this.props.su || systemSettings.manage_worker ?
                                                <Col xs={12}>
                                                    <hr/>
                                                    <div className="d-flex flex-wrap">
                                                        {this.props.su ?
                                                            <button
                                                                onClick={() => this.props.onToggleCollapseSettings('def')}
                                                                type="button"
                                                                className="btn btn-switch-blue dark me-2 mt-2 btn-sm">
                                                                {trans['system']['Default authorisations']}
                                                            </button> : ''}
                                                        {systemSettings.manage_worker ?
                                                            <div className="ms-lg-auto">
                                                                <button
                                                                    onClick={() => this.props.onUpdateWorker('restart')}
                                                                    type="button"
                                                                    className="btn btn-warning-custom dark me-2 mt-2 btn-sm">
                                                                    {trans['app']['Restart worker']}
                                                                </button>
                                                                <button
                                                                    onClick={() => this.props.onUpdateWorker('stop')}
                                                                    type="button"
                                                                    className="btn btn-danger dark  mt-2 btn-sm">
                                                                    {trans['app']['Stop worker']}
                                                                </button>
                                                            </div>
                                                            : ''}
                                                    </div>
                                                </Col>
                                                : ''}
                                            <Col xs={12}>
                                                <hr/>
                                                <div className="fs-5 ms-2">{trans['app']['Data protection']}</div>
                                                <hr/>
                                            </Col>
                                            <Col xs={12} lg={6} xl={4}>
                                                <FloatingLabel controlId={uuidv5('privacyPage', v5NameSpace)}
                                                               label={`${trans['app']['Privacy page']}`}>
                                                    <Form.Select
                                                        required={false}
                                                        className="no-blur"
                                                        value={this.props.app.privacy_page_route || ''}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.currentTarget.value, 'privacy_page_route')}
                                                        aria-label={trans['app']['Privacy page']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {this.props.pageSelect.map((s, index) =>
                                                            <option value={s.url} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} lg={6} xl={4}>
                                                <FloatingLabel controlId={uuidv5('imprintPage', v5NameSpace)}
                                                               label={`${trans['app']['Imprint page']}`}>
                                                    <Form.Select
                                                        required={false}
                                                        className="no-blur"
                                                        value={this.props.app.imprint_page_route || ''}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.currentTarget.value, 'imprint_page_route')}
                                                        aria-label={trans['app']['Imprint page']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {this.props.pageSelect.map((s, index) =>
                                                            <option value={s.url} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} lg={6} xl={4}>
                                                <FloatingLabel controlId={uuidv5('agbPage', v5NameSpace)}
                                                               label={`${trans['app']['Terms and conditions page']}`}>
                                                    <Form.Select
                                                        required={false}
                                                        className="no-blur"
                                                        value={this.props.app.agb_page_route || ''}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.currentTarget.value, 'agb_page_route')}
                                                        aria-label={trans['app']['Terms and conditions page']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {this.props.pageSelect.map((s, index) =>
                                                            <option value={s.url} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <hr/>
                                                <div className="fs-5 ms-2">{trans['app']['Media library']}</div>
                                                <hr/>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-1"
                                                    id={uuidv5('gmapsActive', v5NameSpace)}
                                                    checked={this.props.app.gmaps_active || false}
                                                    onChange={(e) => this.props.onChangeAppSettings(e.target.checked, 'gmaps_active')}
                                                    label={trans['app']['Google Maps active']}
                                                />
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('allowedTypes', v5NameSpace)}
                                                    label={`${trans['system']['Allowed file types']}`}
                                                >
                                                    <Form.Control
                                                        className="no-blur"
                                                        value={this.props.app.upload_types || ''}
                                                        onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'upload_types')}
                                                        aria-required={false}
                                                        required={false}
                                                        as="textarea"
                                                        style={{height: '100px'}}
                                                        placeholder={trans['system']['Allowed file types']}/>
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    {trans['system']['Enter only extension without dot. Separate with a comma or semicolon.']}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Collapse>
                                {this.props.su ?
                                    <Collapse in={this.props.colDef}>
                                        <div id={uuidv5('collapseAppSettingsDefault', v5NameSpace)}>
                                            <button onClick={() => this.props.onToggleCollapseSettings('start')}
                                                    type="button" className="btn btn-switch-blue dark btn-sm">
                                                <i className="bi bi-reply-all  me-2"></i>
                                                {trans['back']}
                                            </button>
                                            <hr/>
                                            <div className="fs-5 mb-2">
                                             <span
                                                 className="fw-light">
                                                 {trans['system']['Default authorisations']}
                                             </span> {trans['Admin']}
                                            </div>
                                            {this.props.app && this.props.app.default_admin_voter ?
                                                <React.Fragment>
                                                    <div className="bg-body-tertiary p-3 rounded border">

                                                        <div className="fs-5 ">
                                                            {trans['system']['Account authorisations']}
                                                        </div>
                                                        <hr/>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'user' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'user' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['Page menu']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'menu' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'menu' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['Page settings']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'page' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'page' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || ''}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}

                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['builder']['Design settings']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'design' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'design' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['posts']['Posts']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'posts' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'posts' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['forms']['Forms']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'forms' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'forms' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['Tools']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'tools' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'tools' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['E-mail authorisations']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'email' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'email' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['API authorisations']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'api' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'api' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['System settings']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'log' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'log' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['System backups']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'backup' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'backup' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['Media library authorisations']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_admin_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'media' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'media' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'admin')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="fs-5 mt-3 mb-2">
                                                     <span
                                                         className="fw-light">
                                                         {trans['system']['Default authorisations']}
                                                     </span> {trans['User']}
                                                    </div>
                                                    <div className="bg-body-tertiary p-3 rounded border">
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['Account authorisations']}
                                                        </div>
                                                        <hr/>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_user_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'user' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'user' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'user')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="mt-0"/>
                                                        <div className="fs-5 mb-2">
                                                            {trans['system']['Media library authorisations']}
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            {this.props.app.default_user_voter.map((v, index) => {
                                                                return (
                                                                    <div key={index}
                                                                         className={`${v.section === 'media' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                                        {v.section === 'media' ? (<>
                                                                            {v.label}
                                                                            <Form.Check
                                                                                type="switch"
                                                                                className="no-blur mb-3"
                                                                                checked={v.default || false}
                                                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id, 'user')}
                                                                                id={v.id}
                                                                                label={trans['active']}
                                                                            /></>) : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                    </div>
                                                </React.Fragment>

                                                : ''}
                                        </div>
                                    </Collapse> : ''}
                            </Form>
                        </CardBody>
                    </Card> : ''}

                {systemSettings.manage_scss ?
                    <React.Fragment>
                        <Card className="shadow-sm mt-3">
                            <Card.Header
                                className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                                <div>
                                    <i className="bi bi-view-list me-2"></i>
                                    {trans['scss']['SCSS Compiler Settings']}
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
                                <Row className="g-2">
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv5('scssSrc', v5NameSpace)}
                                            label={`${trans['scss']['SCSS Location']}`}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.app.scss_source_file || ''}
                                                onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'scss_source_file')}
                                                aria-required={false}
                                                required={true}
                                                type="text"
                                                placeholder={trans['scss']['SCSS Location']}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv5('cssSrc', v5NameSpace)}
                                            label={`${trans['scss']['CSS Location']}`}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.app.scss_destination_file || ''}
                                                onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'scss_destination_file')}
                                                aria-required={false}
                                                required={true}
                                                type="text"
                                                placeholder={trans['scss']['CSS Location']}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mb-2">
                                            <Form.Check
                                                type="switch"

                                                className="no-blur my-1 me-4"
                                                checked={this.props.app.scss_cache_active || false}
                                                onChange={(e) => this.props.onChangeAppSettings(e.target.checked, 'scss_cache_active')}
                                                id={uuidv5('scssCacheActive', v5NameSpace)}
                                                label={trans['scss']['Cache active']}
                                            />
                                            <Form.Check
                                                type="switch"
                                                className="no-blur my-1 me-4"
                                                checked={this.props.app.scss_map_active || false}
                                                onChange={(e) => this.props.onChangeAppSettings(e.target.checked, 'scss_map_active')}
                                                id={uuidv5('scssSourceMapActive', v5NameSpace)}
                                                label={trans['scss']['Create source map']}
                                            />
                                            <Form.Check
                                                type="switch"
                                                className="no-blur my-1"
                                                checked={this.props.app.scss_by_login_active || false}
                                                onChange={(e) => this.props.onChangeAppSettings(e.target.checked, 'scss_by_login_active')}
                                                id={uuidv5('scssByLoginActive', v5NameSpace)}
                                                label={trans['scss']['Compiler only active at login']}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv5('cacheUri', v5NameSpace)}
                                            label={`${trans['scss']['Cache path']}`}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.app.scss_cache_dir || ''}
                                                onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'scss_cache_dir')}
                                                aria-required={false}
                                                required={true}
                                                disabled={!this.props.app.scss_cache_active}
                                                type="text"
                                                placeholder={trans['scss']['Cache path']}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel controlId={uuidv5('selectScssOutput', v5NameSpace)}
                                                       label={`${trans['scss']['Output']}`}>
                                            <Form.Select
                                                required={false}
                                                className="no-blur"
                                                value={this.props.app.scss_map_output || ''}
                                                onChange={(e) => this.props.onChangeAppSettings(e.currentTarget.value, 'scss_map_output')}
                                                aria-label={trans['scss']['Output']}>
                                                <option value="expanded">expanded</option>
                                                <option value="compressed">compressed</option>

                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel controlId={uuidv5('selectScssOptionen', v5NameSpace)}
                                                       label={`${trans['scss']['Source map options']}`}>
                                            <Form.Select
                                                required={false}
                                                className="no-blur"
                                                disabled={!this.props.app.scss_map_active}
                                                value={this.props.app.scss_map_option || ''}
                                                onChange={(e) => this.props.onChangeAppSettings(e.currentTarget.value, 'scss_map_option')}
                                                aria-label={trans['scss']['Source map options']}>
                                                <option value="map_file">File</option>
                                                <option value="map_inline">Inline</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </React.Fragment>
                    : ''}
            </React.Fragment>
        )
    }
}