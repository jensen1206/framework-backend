import * as React from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import ColorPicker from "../../AppComponents/ColorPicker";
import {Card, CardBody, CardHeader, ButtonGroup, Col, Row, Form} from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';

const reactSwal = withReactContent(Swal);
const v5NameSpace = '0639e2d6-e5d1-11ee-b8c2-325096b39f47';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

export default class ColorSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);


    }

    onColorChangeCallback(color, handle) {
        this.props.onSetColor(color, handle)
    }
    render() {
        return (
            <React.Fragment>
                {this.props.fonts && this.props.fonts.color ?
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <div className="fw-semibold">
                                    <i className="bi bi-arrow-right me-2"></i>
                                    {trans['design']['Background colours']}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row className="g-2">
                                    <Col xs={12}>
                                        <div className="form-text mb-2">
                                            {trans['design']['The navigation background colour can be changed in the main menu settings.']}
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.site_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='site_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Pages']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.footer_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='footer_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Footer']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="g-0" xs={12}></Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.footer_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='footer_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Footer']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <div className="fw-semibold">
                                    <i className="bi bi-arrow-right me-2"></i>
                                    {trans['design']['Menu colours']}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row className="g-2">
                                    <Col xs={12}>
                                        <h6>{trans['design']['Menu button']}</h6>
                                    </Col>

                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_btn_bg_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_btn_bg_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Menu button']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_btn_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_btn_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Menu button']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <hr className="mt-0 mb-2"/>
                                        <h6>{trans['design']['Menu button active']}</h6>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_btn_active_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_btn_active_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Menu button active']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center  flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_btn_active_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_btn_active_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Menu button active']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <hr className="mt-0 mb-2"/>
                                        <h6>{trans['design']['Menu button hover']}</h6>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_btn_hover_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_btn_hover_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Menu button hover']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center  flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_btn_hover_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_btn_hover_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Menu button hover']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <hr className="mt-0 mb-2"/>
                                        <h6>{trans['design']['Main menu dropdown']}</h6>
                                    </Col>
                                    <Col xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.dropdown_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='dropdown_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_dropdown_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_dropdown_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown Item']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center  flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_dropdown_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_dropdown_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown Item']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <hr className="mt-0 mb-2"/>
                                        <h6>{trans['design']['Dropdown menu active']}</h6>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_dropdown_active_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_dropdown_active_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown menu active']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center  flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_dropdown_active_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_dropdown_active_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown menu active']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <hr className="mt-0 mb-2"/>
                                        <h6>{trans['design']['Dropdown menu hover']}</h6>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_dropdown_hover_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_dropdown_hover_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown menu hover']}</b> {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center  flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.menu_dropdown_hover_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='menu_dropdown_hover_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <b>{trans['design']['Dropdown menu hover']}</b> {trans['design']['Font colour']}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                <div className="fw-semibold">
                                    <i className="bi bi-arrow-right me-2"></i>
                                    {trans['design']['Link colour']}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row className="g-2">
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.link_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='link_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                {trans['design']['Link colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.link_aktiv_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='link_aktiv_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                {trans['design']['Active link']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="g-0" xs={12}></Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.link_hover_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='link_hover_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                {trans['design']['Link hover']}
                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>
                                <div className="fw-semibold">
                                    <i className="bi bi-arrow-right me-2"></i>
                                    {trans['design']['Scroll To Top Button']}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row className="g-2">
                                    <Col xs={12}>
                                        <Form.Check
                                            type="switch"
                                            className="no-blur"
                                            checked={this.props.fonts.color.scroll_btn_active || false}
                                            onChange={(e) => this.props.onSetColor(e.currentTarget.checked, 'scroll_btn_active')}
                                            id={uuidv4()}
                                            label={trans['active']}
                                        />
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.scroll_btn_bg || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='scroll_btn_bg'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                {trans['design']['Background colour']}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={5} xl={6} xs={12}>
                                        <div className="d-flex align-items-center flex-wrap mt-2">
                                            <div className="picker-color position-relative color-picker-top me-2">
                                                <ColorPicker
                                                    color={this.props.fonts.color.scroll_btn_color || ''}
                                                    callback={this.onColorChangeCallback}
                                                    handle='scroll_btn_color'
                                                />
                                            </div>
                                            <div className="mb-1">
                                                {trans['design']['Icon Colour']}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion> : ''}
            </React.Fragment>
        )

    }
}