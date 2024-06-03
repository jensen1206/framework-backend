import * as React from "react";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import BreakpointLoop from "./BreakpointLoop";

const v5NameSpace = '0c0e0034-c78b-11ee-8a91-325096b39f47';
export default class SliderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

        this.addBreakpoint = this.addBreakpoint.bind(this);
    }

    addBreakpoint() {
        let formData = {
            'method': 'add_breakpoint',
            'id': this.props.id
        }
        this.props.sendAxiosFormdata(formData)
    }

    render() {

        return (
            <React.Fragment>
                <div className="d-flex align-items-center flex-wrap">
                    <button
                        onClick={() => this.props.onToggleCollapse('overview')}
                        className="btn btn-switch-blue dark">
                        <i className="bi bi-reply-all me-2"></i>
                        {trans['to overview']}
                    </button>
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
                </div>
                <hr/>
                <Card className="shadow-sm">
                    <CardHeader className="p-3 fs-5 bg-body-tertiary">
                        <div className="d-flex align-items-center flex-wrap">
                            {this.props.details.designation || ''} <span
                            className="fw-light ms-1">{trans['Settings']}</span>
                            <div className="ms-auto small fs-6 fw-normal">
                                <a className="text-reset" target="_blank" href="https://splidejs.com/guides/options/#options">
                                    <i className="bi bi-lightbulb me-2"></i>
                                    {trans['Help']}
                                </a>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Col xxl={8} lg={10} xs={12} className="mx-auto">
                            <Card>
                                <CardBody>
                                    {trans['Settings']}
                                    <hr/>
                                    <Row className="g-2">
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('slideDesignation', v5NameSpace)}
                                                label={trans['Designation']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.details.designation || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'designation')}
                                                    placeholder={trans['Designation']}/>
                                            </FloatingLabel>
                                            <hr className="mb-2"/>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.arrows || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'arrows')}
                                                id={uuidv5('checkArrows', v5NameSpace)}
                                                label={trans['mediaSlider']['arrows']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.cover || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'cover')}
                                                id={uuidv5('checkCover', v5NameSpace)}
                                                label={trans['mediaSlider']['cover']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.keyboard || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'keyboard')}
                                                id={uuidv5('checkKeyboard', v5NameSpace)}
                                                label={trans['mediaSlider']['keyboard']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.pauseOnFocus || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'pauseOnFocus')}
                                                id={uuidv5('checkPauseOnFocus', v5NameSpace)}
                                                label={trans['mediaSlider']['pauseOnFocus']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.drag || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'drag')}
                                                id={uuidv5('checkDrag', v5NameSpace)}
                                                label={trans['mediaSlider']['drag']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.rewind || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'rewind')}
                                                id={uuidv5('checkRewind', v5NameSpace)}
                                                label={trans['mediaSlider']['rewind']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.pauseOnHover || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'pauseOnHover')}
                                                id={uuidv5('checkPauseOnHover', v5NameSpace)}
                                                label={trans['mediaSlider']['pauseOnHover']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.pagination || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'pagination')}
                                                id={uuidv5('checkPagination', v5NameSpace)}
                                                label={trans['mediaSlider']['pagination']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.autoplay || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'autoplay')}
                                                id={uuidv5('checkAutoplay', v5NameSpace)}
                                                label={trans['mediaSlider']['autoplay']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.container || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'container')}
                                                id={uuidv5('checkContainer', v5NameSpace)}
                                                label={trans['mediaSlider']['container']}
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.details.thumbnail || false}
                                                onChange={(e) => this.props.onSetDetails(e.target.checked, 'thumbnail')}
                                                id={uuidv5('checkThumbnail', v5NameSpace)}
                                                label={trans['mediaSlider']['thumbnail']}
                                            />
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row className="g-2">
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('sliderType', v5NameSpace)}
                                                label={trans['mediaSlider']['type']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.type || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'type')}
                                                    placeholder={trans['mediaSlider']['type']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('perPage', v5NameSpace)}
                                                label={trans['mediaSlider']['perPage']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.perPage || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'perPage')}
                                                    placeholder={trans['mediaSlider']['perPage']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('perMove', v5NameSpace)}
                                                label={trans['mediaSlider']['perMove']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.perMove || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'perMove')}
                                                    placeholder={trans['mediaSlider']['perMove']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('lazyLoad', v5NameSpace)}
                                                label={trans['mediaSlider']['lazyLoad']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.lazyLoad || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'lazyLoad')}
                                                    placeholder={trans['mediaSlider']['lazyLoad']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('gap', v5NameSpace)}
                                                label={trans['mediaSlider']['gap']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.gap || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'gap')}
                                                    placeholder={trans['mediaSlider']['gap']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('preloadPages', v5NameSpace)}
                                                label={trans['mediaSlider']['preloadPages']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.preloadPages || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'preloadPages')}
                                                    placeholder={trans['mediaSlider']['preloadPages']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('trimSpace', v5NameSpace)}
                                                label={trans['mediaSlider']['trimSpace']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.trimSpace || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'trimSpace')}
                                                    placeholder={trans['mediaSlider']['trimSpace']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('interval', v5NameSpace)}
                                                label={trans['mediaSlider']['interval']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.interval || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'interval')}
                                                    placeholder={trans['mediaSlider']['interval']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('speed', v5NameSpace)}
                                                label={trans['mediaSlider']['speed']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.speed || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'speed')}
                                                    placeholder={trans['mediaSlider']['speed']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('rewindSpeed', v5NameSpace)}
                                                label={trans['mediaSlider']['rewindSpeed']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.rewindSpeed || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'rewindSpeed')}
                                                    placeholder={trans['mediaSlider']['rewindSpeed']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('flickPower', v5NameSpace)}
                                                label={trans['mediaSlider']['flickPower']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.details.flickPower || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'flickPower')}
                                                    placeholder={trans['mediaSlider']['flickPower']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('height', v5NameSpace)}
                                                label={trans['mediaSlider']['height']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.height || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'height')}
                                                    placeholder={trans['mediaSlider']['height']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('width', v5NameSpace)}
                                                label={trans['mediaSlider']['width']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.width || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'width')}
                                                    placeholder={trans['mediaSlider']['width']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('fixedHeight', v5NameSpace)}
                                                label={trans['mediaSlider']['fixedHeight']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.fixedHeight || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'fixedHeight')}
                                                    placeholder={trans['mediaSlider']['fixedHeight']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('fixedWidth', v5NameSpace)}
                                                label={trans['mediaSlider']['fixedWidth']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.fixedWidth || ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'fixedWidth')}
                                                    placeholder={trans['mediaSlider']['fixedWidth']}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <div className="fw-semibold mb-2">{trans['mediaSlider']['Padding']}</div>
                                    <Row className="g-2">
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('left', v5NameSpace)}
                                                label={trans['mediaSlider']['left']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.padding ? this.props.details.padding.left : ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'left', 'padding')}
                                                    placeholder={trans['mediaSlider']['left']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('right', v5NameSpace)}
                                                label={trans['mediaSlider']['right']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.padding ? this.props.details.padding.right : ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'right', 'padding')}
                                                    placeholder={trans['mediaSlider']['right']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('top', v5NameSpace)}
                                                label={trans['mediaSlider']['top']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.padding ? this.props.details.padding.top : ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'top', 'padding')}
                                                    placeholder={trans['mediaSlider']['top']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('bottom', v5NameSpace)}
                                                label={trans['mediaSlider']['bottom']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.details.padding ? this.props.details.padding.bottom : ''}
                                                    onChange={(e) => this.props.onSetDetails(e.target.value, 'bottom', 'padding')}
                                                    placeholder={trans['mediaSlider']['bottom']}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="fw-semibold">{trans['mediaSlider']['Breakpoints']}</div>
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
                                    </div>
                                    <button
                                        onClick={this.addBreakpoint}
                                        type="button"
                                        className="btn btn-secondary dark mt-2 btn-sm">
                                        <i className="bi bi-node-plus me-1"></i>
                                        {trans['mediaSlider']['Add breakpoint']}
                                    </button>
                                    <hr/>
                                    {this.props.details.breakpoints && this.props.details.breakpoints.length ?
                                    <BreakpointLoop
                                        id={this.props.id}
                                        breakpoint={this.props.details.breakpoints || []}
                                        onSetBreakpoint={this.props.onSetBreakpoint}
                                        onDeleteSwalHandle={this.props.onDeleteSwalHandle}
                                    />:
                                     <div className="text-danger">
                                         <i className="bi bi-exclamation-triangle me-2"></i>
                                         {trans['mediaSlider']['No breakpoints available']}
                                     </div>
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>
                </Card>

            </React.Fragment>
        )
    }

}