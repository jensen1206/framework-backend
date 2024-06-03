import * as React from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import Collapse from 'react-bootstrap/Collapse';
import * as AppTools from "../../AppComponents/AppTools";

const v5NameSpace = '8fb2a08a-c1e5-11ee-b28f-325096b39f47';
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";

export default class SiteSeo extends React.Component {
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
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);

    }

    fileManagerDidUpdate(state) {
        this.setState({
            didUpdateManager: state
        })
    }

    setFileManagerShow(state) {
        this.setState({
            fileManagerShow: state
        })
    }

    fileManagerCallback(files) {
        if (files.length) {
            this.props.onSetSiteSeo(files[0]['fileName'], 'ogImage')
            this.setState({
                selectedImage: ''
            })
        }
    }

    onSetAppImage(type) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true
        })
    }

    render() {
        return (
            <React.Fragment>
                <button
                    onClick={() => this.props.onToggleSiteCollapse('table', true)}
                    className="btn btn-switch-blue dark">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['to overview']}
                </button>
                <hr/>
                <Col xxl={8} xl={10} xs={12} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-body py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-globe-americas me-2"></i>
                                {trans['system']['Website']} <span className="fw-light">{trans['Seo']}</span>
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
                                <Col xs={12}>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            className="no-blur me-4"
                                            id={uuidv5('noIndex', v5NameSpace)}
                                            checked={this.props.seo.noIndex || false}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.checked, 'noIndex')}
                                            label={trans['seo']['no-index']}
                                        />
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            className="no-blur"
                                            id={uuidv5('noFollow', v5NameSpace)}
                                            checked={this.props.seo.noFollow || false}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.checked, 'noFollow')}
                                            label={trans['seo']['no-follow']}
                                        />
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('seoTitle', v5NameSpace)}
                                        label={`${trans['seo']['Page Title']} ${this.props.seo.seoTitle ? this.props.seo.seoTitle.length : 0}/60`}
                                    >
                                        <Form.Control
                                            required={true}
                                            value={this.props.seo.seoTitle || ''}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'seoTitle')}
                                            className={`no-blur ${this.props.seo.seoTitle ? this.props.seo.seoTitle.length > 60 || this.props.seo.seoTitle.length < 1 ? 'border-danger' : '' : 'border-danger'}`}
                                            type="text"
                                            placeholder={trans['seo']['Page Title']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={5} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('titlePrefix', v5NameSpace)}
                                        label={trans['seo']['Page Title Prefix']}
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            type="text"
                                            required={false}
                                            value={this.props.seo.titlePrefix || ''}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'titlePrefix')}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xl={2} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('seoSeparator', v5NameSpace)}
                                        label={trans['seo']['Separator']}
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            type="text"
                                            required={false}
                                            value={this.props.seo.titleSeparator || ''}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'titleSeparator')}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xl={5} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('titleSuffix', v5NameSpace)}
                                        label={trans['seo']['Page Title Suffix']}
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            type="text"
                                            required={false}
                                            value={this.props.seo.titleSuffix || ''}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'titleSuffix')}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('pageDescription', v5NameSpace)}
                                        label={`${trans['seo']['Page description']} ${this.props.seo.seoContent ? this.props.seo.seoContent.length : 0}/160`}
                                    >
                                        <Form.Control
                                            className={`no-blur ${this.props.seo.seoContent ? this.props.seo.seoContent.length > 160 || this.props.seo.seoContent.length < 1 ? 'border-danger' : '' : 'border-danger'}`}
                                            as="textarea"
                                            required={false}
                                            value={this.props.seo.seoContent || ''}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'seoContent')}
                                            style={{height: '120px'}}
                                            placeholder={trans['seo']['Page description']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <div className="d-flex align-items-center flex-wrap my-2">
                                        <Form.Check
                                            type="switch"
                                            className="no-blur me-4"
                                            disabled={this.props.seo.noIndex || this.props.seo.noFollow}
                                            id={uuidv5('fbActive', v5NameSpace)}
                                            checked={this.props.seo.fbActive || false}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.checked, 'fbActive')}
                                            label={trans['seo']['Facebook active']}
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur"
                                            disabled={this.props.seo.noIndex || this.props.seo.noFollow}
                                            id={uuidv5('xActive', v5NameSpace)}
                                            checked={this.props.seo.xActive || false}
                                            onChange={(e) => this.props.onSetSiteSeo(e.target.checked, 'xActive')}
                                            label={trans['seo']['X (Twitter) active']}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Collapse
                                in={!this.props.seo.noIndex && !this.props.seo.noFollow && this.props.seo.fbActive || !this.props.seo.noIndex && !this.props.seo.noFollow && this.props.seo.xActive}>
                                <div id={uuidv5('colFbAktiv', v5NameSpace)}>
                                    <div className="p-3 border rounded shadow-sm mb-2">
                                        <div className="mb-3 fw-semibold">
                                            {trans['seo']['Open Graph']}
                                        </div>
                                        <Row className="g-2">
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv5('selectOgType', v5NameSpace)}
                                                               label={trans['seo']['OG Type']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.seo.ogType || 'website'}
                                                        onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'ogType')}
                                                        aria-label={trans['seo']['OG Type']}>
                                                        {(this.props.ogTypesSelect).map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('ogReadingTime', v5NameSpace)}
                                                    label={`${trans['seo']['Estimated reading time']} (${trans['seo']['minutes']})`}
                                                >
                                                    <Form.Control
                                                        className={`no-blur`}
                                                        required={false}
                                                        type="number"
                                                        value={this.props.seo.readingTime || ''}
                                                        onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'readingTime')}
                                                        placeholder={trans['seo']['Estimated reading time']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('ogTitle', v5NameSpace)}
                                                    label={`${trans['seo']['OG title']} ${this.props.seo.ogTitle ? this.props.seo.ogTitle.length : 0}/95`}
                                                >
                                                    <Form.Control
                                                        className={`no-blur ${this.props.seo.ogTitle ? this.props.seo.ogTitle.length > 95 || this.props.seo.ogTitle.length < 1 ? 'border-danger' : '' : 'border-danger'}`}
                                                        type="text"
                                                        required={true}
                                                        value={this.props.seo.ogTitle || ''}
                                                        onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'ogTitle')}
                                                        placeholder={trans['seo']['OG title']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv5('ogDescription', v5NameSpace)}
                                                    label={`${trans['seo']['OG page description']} ${this.props.seo.ogContent ? this.props.seo.ogContent.length : 0}/200`}
                                                >
                                                    <Form.Control
                                                        className={`no-blur ${this.props.seo.ogContent ? this.props.seo.ogContent.length > 200 || this.props.seo.ogContent.length < 1 ? 'border-danger' : '' : 'border-danger'}`}
                                                        as="textarea"
                                                        required={false}
                                                        value={this.props.seo.ogContent || ''}
                                                        onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'ogContent')}
                                                        style={{height: '120px'}}
                                                        placeholder={trans['seo']['OG page description']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <div className="fw-semibold my-2">{trans['seo']['OG Image']}
                                                    <small className="fw-normal">(1200 x 627 Pixel )</small>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="d-flex flex-column align-items-center">
                                                        {this.props.seo.ogImage ?
                                                            <div
                                                                className="position-relative p-2 border rounded my-1 overflow-hidden">
                                                                <a className="img-link" data-control="single"
                                                                   title={this.props.seo.seoTitle || ''}
                                                                   href={`${publicSettings.large_url}/${this.props.seo.ogImage}`}>
                                                                    <img className="img-fluid rounded"
                                                                         width={150}
                                                                         height={150}
                                                                         alt={this.props.seo.seoTitle || ''}
                                                                         src={`${publicSettings.thumb_url}/${this.props.seo.ogImage}`}/>
                                                                </a>
                                                            </div>
                                                            :
                                                            <div
                                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                                        }
                                                        <div className="d-flex align-items-center">
                                                            <button type="button"
                                                                    title={this.props.seo.ogImage ? trans['app']['Change image'] : trans['app']['Select image']}
                                                                    onClick={() => this.onSetAppImage('category_logo')}
                                                                    className="btn btn-switch-blue dark my-1 btn-sm">
                                                                <i className="bi bi-arrow-left-right"></i>
                                                            </button>
                                                            {this.props.seo.ogImage ? (
                                                                <button type="button"
                                                                        title={trans['Delete']}
                                                                        onClick={() => this.props.onSetSiteSeo('', 'ogImage')}
                                                                        className="btn dark my-1 ms-2 btn-danger btn-sm">
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            ) : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Collapse
                                        in={this.props.seo.fbActive}>
                                        <div id={uuidv5('fbCollapse', v5NameSpace)}>
                                            <div className="p-3 border rounded shadow-sm mb-2">
                                                <div className="mb-3 fw-semibold">
                                                    {trans['seo']['Facebook']}
                                                </div>
                                                <Row className="g-2">
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('fbAppId', v5NameSpace)}
                                                            label={`${trans['seo']['Facebook App ID']}`}
                                                        >
                                                            <Form.Control
                                                                className={`no-blur`}
                                                                type="text"
                                                                required={false}
                                                                value={this.props.seo.fbAppId || ''}
                                                                onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'fbAppId')}
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('fbAdmins', v5NameSpace)}
                                                            label={`${trans['seo']['Facebook Admins']}`}
                                                        >
                                                            <Form.Control
                                                                className={`no-blur`}
                                                                type="text"
                                                                required={false}
                                                                value={this.props.seo.fbAdmins || ''}
                                                                onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'fbAdmins')}
                                                            />
                                                        </FloatingLabel>
                                                        <div className="form-text">
                                                            {trans['seo']['Separate multiple admins with a comma']}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Collapse
                                        in={this.props.seo.xActive}>
                                        <div id={uuidv5('xCollapse', v5NameSpace)}>
                                            <div className="p-3 border rounded shadow-sm mb-2">
                                                <div className="mb-3 fw-semibold">
                                                    {trans['seo']['X']} <small>({trans['seo']['Twitter']})</small>
                                                </div>
                                                <Row className="g-2">
                                                   <Col xl={6} xs={12}>
                                                       <FloatingLabel controlId={uuidv5('selectXType', v5NameSpace)}
                                                                      label={trans['seo']['X (Twitter) Card-Type']}>
                                                           <Form.Select
                                                               className="no-blur"
                                                               value={this.props.seo.xType || 'summary'}
                                                               onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'xType')}
                                                               aria-label={trans['seo']['X (Twitter) Card-Type']}>
                                                               {(this.props.xCardTypesSelect).map((select, index) =>
                                                                   <option key={index} value={select.id}>
                                                                       {select.label}
                                                                   </option>
                                                               )}
                                                           </Form.Select>
                                                       </FloatingLabel>
                                                   </Col>
                                                    <Col xl={6} xs={12}></Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('xSite', v5NameSpace)}
                                                            label={`${trans['seo']['X (Twitter) Site']}`}
                                                        >
                                                            <Form.Control
                                                                className={`no-blur`}
                                                                type="text"
                                                                required={false}
                                                                value={this.props.seo.xSite || ''}
                                                                onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'xSite')}
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv5('xCreator', v5NameSpace)}
                                                            label={`${trans['seo']['X (Twitter) Creator']}`}
                                                        >
                                                            <Form.Control
                                                                className={`no-blur`}
                                                                type="text"
                                                                required={false}
                                                                value={this.props.seo.xCreator || ''}
                                                                onChange={(e) => this.props.onSetSiteSeo(e.target.value, 'xCreator')}
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            </Collapse>
                        </CardBody>
                    </Card>
                </Col>

                <FileMangerModal
                    didUpdateManager={this.state.didUpdateManager}
                    fileManagerShow={this.state.fileManagerShow}
                    options={this.state.fmOptions}
                    fileManagerDidUpdate={this.fileManagerDidUpdate}
                    setFileManagerShow={this.setFileManagerShow}
                    fileManagerCallback={this.fileManagerCallback}
                />
            </React.Fragment>
        )
    }
}