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

export default class FormBuilderSettings extends React.Component {
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
                            {trans['builder']['Page settings']}
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
                            <Row className="g-3 align-items-stretch">
                                <Col xl={6} xs={12}>
                                    <div className="p-3 h-100 bg-app-light border rounded">
                                        {trans['builder']['Responsive settings']}
                                        <hr/>
                                        <div className="fw-semibold mb-2">
                                            {trans['builder']['Columns']}
                                        </div>
                                        <Form.Check
                                            label={trans['builder']['Do not wrap columns']}
                                            type="radio"
                                            checked={this.props.settings.col === ''}
                                            onChange={(e) => this.props.onUpdateSettings('', 'col')}
                                            id={uuidv5('checkNowrap', v5NameSpace)}
                                        />
                                        <Form.Check
                                            label="< 575 (sm)"
                                            type="radio"
                                            checked={this.props.settings.col === 'sm'}
                                            onChange={(e) => this.props.onUpdateSettings('sm', 'col')}
                                            id={uuidv5('checkSm', v5NameSpace)}
                                        />
                                        <Form.Check
                                            label="< 767 (md)"
                                            type="radio"
                                            checked={this.props.settings.col === 'md'}
                                            onChange={(e) => this.props.onUpdateSettings('md', 'col')}
                                            id={uuidv5('checkMd', v5NameSpace)}
                                        />
                                        <Form.Check
                                            label="< 991 (lg)"
                                            type="radio"
                                            checked={this.props.settings.col === 'lg'}
                                            onChange={(e) => this.props.onUpdateSettings('lg', 'col')}
                                            id={uuidv5('checkLg', v5NameSpace)}
                                        />
                                        <Form.Check
                                            label="< 1199 (xl)"
                                            type="radio"
                                            checked={this.props.settings.col === 'xl'}
                                            onChange={(e) => this.props.onUpdateSettings('xl', 'col')}
                                            id={uuidv5('checkXl', v5NameSpace)}
                                        />
                                        <Form.Check
                                            label="< 1399 (xxl)"
                                            type="radio"
                                            checked={this.props.settings.col === 'xxl'}
                                            onChange={(e) => this.props.onUpdateSettings('xxl', 'col')}
                                            id={uuidv5('checkXXl', v5NameSpace)}
                                        />
                                    </div>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <div className="p-3 h-100 bg-app-light border rounded">
                                        {trans['builder']['Responsive settings']}
                                        <hr/>
                                        <div className="fw-semibold mb-2">
                                            {trans['builder']['Raster']}
                                        </div>
                                        <FloatingLabel
                                            controlId={uuidv5('selectGutter', v5NameSpace)}
                                            label={`${trans['builder']['Gutter (spacing)']}`}>
                                            <Form.Select
                                                className="no-blur mb-2"
                                                value={this.props.settings.gutter || ''}
                                                onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'gutter')}
                                                aria-label={trans['builder']['Gutter (spacing)']}>
                                                <option value="">{trans['builder']['Individual']}</option>
                                                <option value="g-1">{trans['builder']['Gutter']} 1 (g-1)</option>
                                                <option value="g-2">{trans['builder']['Gutter']} 2 (g-2)</option>
                                                <option value="g-3">{trans['builder']['Gutter']} 3 (g-3)</option>
                                                <option value="g-4">{trans['builder']['Gutter']} 4 (g-4)</option>
                                                <option value="g-5">{trans['builder']['Gutter']} 5 (g-5)</option>
                                            </Form.Select>
                                        </FloatingLabel>

                                        <FloatingLabel
                                            controlId={uuidv5('inputInd', v5NameSpace)}
                                            label={trans['builder']['Individual grid']}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                disabled={this.props.settings.gutter !== ''}
                                                value={this.props.settings.individuell || ''}
                                                onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'individuell')}
                                                type="text"
                                                placeholder={trans['builder']['Individual grid']} />
                                        </FloatingLabel>
                                        <div className="form-text mb-2">
                                            {trans['builder']['Possible values e.g. gx-1 gy-2 etc.']}
                                        </div>
                                        <FloatingLabel
                                            controlId={uuidv5('inputBuilderExtraCss', v5NameSpace)}
                                            label={trans['builder']['Builder extra CSS']}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                value={this.props.settings.extra_css || ''}
                                                onChange={(e) => this.props.onUpdateSettings(e.currentTarget.value, 'extra_css')}
                                                type="text"
                                                placeholder={trans['builder']['Builder extra CSS']} />
                                        </FloatingLabel>
                                        <div className="form-text">
                                            {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>

                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }

}