import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from 'uuid';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Collapse from 'react-bootstrap/Collapse';

const v5NameSpace = '80d21af2-c215-11ee-963d-325096b39f47';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";

export default class SiteOffcanvas extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            collapseExcerpt: false,
            collapseAttributes: false,
            collapseFile: false,
            collapseCustom: false
        }

        this.setCollapse = this.setCollapse.bind(this);

    }

    setCollapse(type) {
        switch (type) {
            case 'excerpt':
                this.setState({
                    collapseExcerpt: !this.state.collapseExcerpt
                })
                break;
            case 'attr':
                this.setState({
                    collapseAttributes: !this.state.collapseAttributes
                })
                break;
            case 'file':
                this.setState({
                    collapseFile: !this.state.collapseFile
                })
                break;
            case 'custom':
                this.setState({
                    collapseCustom: !this.state.collapseCustom
                })
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Offcanvas
                    show={this.props.showSiteOffcanvas}
                    placement="end"
                    onHide={() => this.props.onSetShowOffcanvas(false)}>
                    <Offcanvas.Header className="bg-body-tertiary" closeButton>
                        <Offcanvas.Title>{trans['system']['Page Settings']}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Row className="g-2">
                            <Col xs={12}>
                                <div className="d-flex align-items-center" style={{minHeight: '35px'}}>
                                    {this.props.spinner.ajaxMsg || this.props.spinner.showAjaxWait ? '' :
                                        <div>{trans['system']['Status']}:</div>
                                    }
                                    <div
                                        className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}>
                                    </div>
                                    <small>
                                        <SetAjaxResponse
                                            status={this.props.spinner.ajaxStatus}
                                            msg={this.props.spinner.ajaxMsg}
                                        />
                                    </small>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('siteSlug', v5NameSpace)}
                                    label={trans['system']['Slug']}
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={false}
                                        type="text"
                                        value={this.props.site.siteSlug || ''}
                                        onChange={(e) => this.props.onSetSite(e.target.value, 'siteSlug')}
                                        placeholder={trans['system']['Slug']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('siteRoute', v5NameSpace)}
                                    label={trans['system']['Route']}
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={true}
                                        type="text"
                                        value={this.props.site.routeName || ''}
                                        onChange={(e) => this.props.onSetSite(e.target.value, 'routeName')}
                                        placeholder={trans['system']['Route']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel controlId={uuidv5('selectSiteStatus', v5NameSpace)}
                                               label={trans['system']['Site status']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.site.siteStatus || ''}
                                        onChange={(e) => this.props.onSetSite(e.target.value, 'siteStatus')}
                                        aria-label={trans['system']['Site status']}>
                                        {(this.props.selectSiteStatus).map((select, index) =>
                                            <option key={index} value={select.value}>
                                                {select.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                                <Collapse
                                    in={this.props.site.siteStatus === 'protected'}>
                                    <div className="mt-2 bg-body-tertiary rounded"
                                         id={uuidv5('colSiteProtected', v5NameSpace)}>
                                        <div className="p-3">
                                            <FloatingLabel
                                                controlId={uuidv5('protectedUser', v5NameSpace)}
                                                label={trans['site']['User name']}
                                            >
                                                <Form.Control
                                                    className={`no-blur mb-2`}
                                                    required={this.props.site.siteStatus === 'protected'}
                                                    type="text"
                                                    value={this.props.site.siteUser || ''}
                                                    onChange={(e) => this.props.onSetSite(e.target.value, 'siteUser')}
                                                    placeholder={trans['site']['User name']}/>
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId={uuidv5('protectedPw', v5NameSpace)}
                                                label={`${this.props.site.isPw ? trans['profil']['Password set'] : trans['site']['Password']}`}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    type="text"
                                                    defaultValue=""
                                                    onChange={(e) => this.props.onSetSite(e.target.value, 'sitePassword')}
                                                    placeholder={trans['site']['Password']}/>
                                            </FloatingLabel>
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel controlId={uuidv5('selectSiteCategory', v5NameSpace)}
                                               label={trans['system']['Category']}>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.site.siteCategory || ''}
                                        onChange={(e) => this.props.onSetSite(e.target.value, 'siteCategory')}
                                        aria-label={trans['system']['Category']}>
                                        {(this.props.categorySelect).map((select, index) =>
                                            <option key={index} value={select.id}>
                                                {select.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('custom')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['builder']['Header']} / {trans['builder']['Footer']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseCustom ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseCustom}>
                                    <div className="mt-2 pt-1 bg-body-tertiary border rounded"
                                         id={uuidv5('colCustom', v5NameSpace)}>
                                        <div className="p-2">
                                            <Col xs={12}>
                                                <FloatingLabel controlId={uuidv5('selectSiteHeader', v5NameSpace)}
                                                               label={trans['builder']['Header']}>
                                                    <Form.Select
                                                        className="no-blur mb-2"
                                                        value={this.props.site.header || ''}
                                                        onChange={(e) => this.props.onSetSite(e.target.value, 'header')}
                                                        aria-label={trans['builder']['Header']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {(this.props.selectHeader).map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel controlId={uuidv5('selectSiteFooter', v5NameSpace)}
                                                               label={trans['builder']['Footer']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.site.footer || ''}
                                                        onChange={(e) => this.props.onSetSite(e.target.value, 'footer')}
                                                        aria-label={trans['builder']['Footer']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {(this.props.selectFooter).map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                        </div>
                                    </div>
                                  </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('file')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['Cover picture']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseFile ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>


                                <Collapse
                                    in={this.state.collapseFile}>
                                    <div className="mt-2 pt-3 bg-body-tertiary border rounded"
                                         id={uuidv5('colFile', v5NameSpace)}>
                                        {this.props.site.siteImg ?
                                            <React.Fragment>
                                                <div style={{width: '300px', height: '200px'}}
                                                     className="p-1 border rounded overflow-hidden d-flex mx-auto mb-3">
                                                    <img
                                                        style={{objectFit: 'cover', width: '300px'}}
                                                        className="rounded img-fluid"
                                                        alt={trans['Cover picture']}
                                                        src={`${publicSettings.medium_url}/${this.props.site.siteImg}`}/>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                        }
                                        <div className="mt-auto text-center pb-2 mx-3 mb-2">
                                            <button
                                                onClick={() => this.props.onSetAppImage('site_logo')}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                {this.props.site.siteImg ? trans['app']['Change image'] : trans['app']['Select image']}
                                            </button>
                                            {this.props.site.siteImg ?
                                                <button
                                                    onClick={() => this.props.onSetSite('', 'siteImg')}
                                                    type="button"
                                                    className="btn btn-danger ms-2 dark btn-sm">
                                                    {trans['delete']}
                                                </button> : ''}
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('excerpt')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['system']['Text excerpt']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseExcerpt ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseExcerpt}>
                                    <div className="mt-2 bg-body-tertiary border rounded"
                                         id={uuidv5('colExcerpt', v5NameSpace)}>
                                        <div className="p-2">
                                            <FloatingLabel
                                                controlId={uuidv5('siteExcerpt', v5NameSpace)}
                                                label={trans['system']['Text excerpt']}
                                            >
                                                <Form.Control
                                                    className="no-blur mb-2"
                                                    as="textarea"
                                                    required={false}
                                                    value={this.props.site.siteExcerpt || ''}
                                                    onChange={(e) => this.props.onSetSite(e.target.value, 'siteExcerpt')}
                                                    style={{height: '100px'}}
                                                    placeholder={trans['system']['Text excerpt']}/>
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId={uuidv5('excerptSign', v5NameSpace)}
                                                label={trans['system']['Character Limit']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.site.excerptLimit || ''}
                                                    onChange={(e) => this.props.onSetSite(e.target.value, 'excerptLimit')}
                                                    placeholder={trans['system']['Character Limit']}/>
                                            </FloatingLabel>
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('attr')}
                                    className="cursor-pointer border rounded bg-body-tertiary p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['system']['Page attributes']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseAttributes ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseAttributes}>
                                    <div className="mt-2 bg-body-tertiary border rounded"
                                         id={uuidv5('colAttr', v5NameSpace)}>
                                        <div className="p-2">
                                            <FloatingLabel
                                                controlId={uuidv5('extraCss', v5NameSpace)}
                                                label={trans['system']['Extra Css']}
                                            >
                                                <Form.Control
                                                    className={`no-blur mb-2`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.site.extra_css || ''}
                                                    onChange={(e) => this.props.onSetSite(e.target.value, 'extra_css')}
                                                    placeholder={trans['system']['Extra Css']}/>
                                            </FloatingLabel>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur mt-3"
                                                id={uuidv5('comments', v5NameSpace)}
                                                checked={this.props.site.commentStatus || false}
                                                onChange={(e) => this.props.onSetSite(e.target.checked, 'commentStatus')}
                                                label={trans['system']['Allow comments']}
                                            />
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                        </Row>
                    </Offcanvas.Body>
                </Offcanvas>
            </React.Fragment>
        )
    }
}