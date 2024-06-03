import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import axios from "axios";
import Collapse from 'react-bootstrap/Collapse';
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const v5NameSpace = 'b4a49ace-c339-11ee-849c-325096b39f47';

import {ReactSortable} from "react-sortablejs";
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";

export default class FormBuilderLoopSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.builderRef = React.createRef();
        this.state = {
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            }
        }

    }

    render() {
        return (
            <React.Fragment>
                <Card className="shadow-sm my-3">
                    <Card.Header className="fs-5 py-3 bg-body-tertiary text-body d-flex flex-wrap align-items-center">
                        <div>
                            <i className="bi bi-gear me-2"></i>
                            {trans['builder']['Loop settings']}
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
                        <Col className="mx-auto" xxl={10} xs={12}>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-0">{trans['system']['Extra Css']}</h6>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        style={{zIndex: 0}}
                                        controlId={uuidv5('inputLoopExtraCss', v5NameSpace)}
                                        label={trans['builder']['Row extra CSS']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.settings.loop_extra_css || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'loop_extra_css')}
                                            type="text"
                                            placeholder={trans['builder']['Row extra CSS']}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        style={{zIndex: 0}}
                                        controlId={uuidv5('inputLoopColExtraCss', v5NameSpace)}
                                        label={trans['builder']['Column extra CSS']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.settings.loop_col_extra_css || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'loop_col_extra_css')}
                                            type="text"
                                            placeholder={trans['builder']['Column extra CSS']}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        style={{zIndex: 0}}
                                        controlId={uuidv5('inputLoopColInnerExtraCss', v5NameSpace)}
                                        label={trans['builder']['Column-Inner extra CSS']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            value={this.props.settings.loop_col_inner_extra_css || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'loop_col_inner_extra_css')}
                                            type="text"
                                            placeholder={trans['builder']['Column-Inner extra CSS']}
                                        />
                                    </FloatingLabel>
                                </Col>

                            </Row>
                            <h6 className="mb-0 mt-3 lh-1">
                                {trans['gallery']['Breakpoints ( Responsive )']}
                            </h6>
                            <div className="form-text mt-0 mb-3">
                                {trans['gallery']['Properties that are to be changed in a specific screen width.']}
                            </div>
                            <Row className="g-3 align-items-stretch">
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-2">{trans['mediaSlider']['Breakpoint']} XXL 1400px</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLoopXXLColumn', v5NameSpace)}
                                        label={`${trans['builder']['Columns']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.xxlColumn || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'xxlColumn')}
                                            aria-label={trans['builder']['Columns']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="1">{trans['builder']['Columns']} 1</option>
                                            <option value="2">{trans['builder']['Columns']} 2</option>
                                            <option value="3">{trans['builder']['Columns']} 3</option>
                                            <option value="4">{trans['builder']['Columns']} 4</option>
                                            <option value="5">{trans['builder']['Columns']} 5</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectXXLGutter', v5NameSpace)}
                                        label={`${trans['builder']['Gutter (spacing)']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.xxlGutter || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'xxlGutter')}
                                            aria-label={trans['builder']['Gutter (spacing)']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-0">{trans['mediaSlider']['Breakpoint']} XL 1200px</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLoopXLColumn', v5NameSpace)}
                                        label={`${trans['builder']['Columns']}`}>
                                        <Form.Select
                                            className="no-blur mb-2"
                                            value={this.props.settings.xlColumn || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'xlColumn')}
                                            aria-label={trans['builder']['Columns']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="1">{trans['builder']['Columns']} 1</option>
                                            <option value="2">{trans['builder']['Columns']} 2</option>
                                            <option value="3">{trans['builder']['Columns']} 3</option>
                                            <option value="4">{trans['builder']['Columns']} 4</option>
                                            <option value="5">{trans['builder']['Columns']} 5</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectXLGutter', v5NameSpace)}
                                        label={`${trans['builder']['Gutter (spacing)']}`}>
                                        <Form.Select
                                            className="no-blur mb-2"
                                            value={this.props.settings.xlGutter || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'xlGutter')}
                                            aria-label={trans['builder']['Gutter (spacing)']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-0">{trans['mediaSlider']['Breakpoint']} LG 992px</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLoopLGColumn', v5NameSpace)}
                                        label={`${trans['builder']['Columns']}`}>
                                        <Form.Select
                                            className="no-blur mb-2"
                                            value={this.props.settings.lgColumn || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'lgColumn')}
                                            aria-label={trans['builder']['Columns']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="1">{trans['builder']['Columns']} 1</option>
                                            <option value="2">{trans['builder']['Columns']} 2</option>
                                            <option value="3">{trans['builder']['Columns']} 3</option>
                                            <option value="4">{trans['builder']['Columns']} 4</option>
                                            <option value="5">{trans['builder']['Columns']} 5</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLGGutter', v5NameSpace)}
                                        label={`${trans['builder']['Gutter (spacing)']}`}>
                                        <Form.Select
                                            className="no-blur mb-2"
                                            value={this.props.settings.lgGutter || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'lgGutter')}
                                            aria-label={trans['builder']['Gutter (spacing)']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-0">{trans['mediaSlider']['Breakpoint']} MD 768px</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLoopMDColumn', v5NameSpace)}
                                        label={`${trans['builder']['Columns']}`}>
                                        <Form.Select
                                            className="no-blur mb-2"
                                            value={this.props.settings.mdColumn || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'mdColumn')}
                                            aria-label={trans['builder']['Columns']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="1">{trans['builder']['Columns']} 1</option>
                                            <option value="2">{trans['builder']['Columns']} 2</option>
                                            <option value="3">{trans['builder']['Columns']} 3</option>
                                            <option value="4">{trans['builder']['Columns']} 4</option>
                                            <option value="5">{trans['builder']['Columns']} 5</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectMdGutter', v5NameSpace)}
                                        label={`${trans['builder']['Gutter (spacing)']}`}>
                                        <Form.Select
                                            className="no-blur mb-2"
                                            value={this.props.settings.mdGutter || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'mdGutter')}
                                            aria-label={trans['builder']['Gutter (spacing)']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-0">{trans['mediaSlider']['Breakpoint']} SM 576px</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLoopSMColumn', v5NameSpace)}
                                        label={`${trans['builder']['Columns']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.smColumn || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'smColumn')}
                                            aria-label={trans['builder']['Columns']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="1">{trans['builder']['Columns']} 1</option>
                                            <option value="2">{trans['builder']['Columns']} 2</option>
                                            <option value="3">{trans['builder']['Columns']} 3</option>
                                            <option value="4">{trans['builder']['Columns']} 4</option>
                                            <option value="5">{trans['builder']['Columns']} 5</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectSMGutter', v5NameSpace)}
                                        label={`${trans['builder']['Gutter (spacing)']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.smGutter || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'smGutter')}
                                            aria-label={trans['builder']['Gutter (spacing)']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <h6 className="mb-0 mt-0">{trans['mediaSlider']['Breakpoint']} XS 450px</h6>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectLoopXSColumn', v5NameSpace)}
                                        label={`${trans['builder']['Columns']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.xsColumn || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'xsColumn')}
                                            aria-label={trans['builder']['Columns']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="1">{trans['builder']['Columns']} 1</option>
                                            <option value="2">{trans['builder']['Columns']} 2</option>
                                            <option value="3">{trans['builder']['Columns']} 3</option>
                                            <option value="4">{trans['builder']['Columns']} 4</option>
                                            <option value="5">{trans['builder']['Columns']} 5</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('selectXSGutter', v5NameSpace)}
                                        label={`${trans['builder']['Gutter (spacing)']}`}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.xsGutter || ''}
                                            onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'xsGutter')}
                                            aria-label={trans['builder']['Gutter (spacing)']}>
                                            <option value="">{trans['system']['select']}</option>
                                            <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                            </Row>
                        </Col>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}