import * as React from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import ColorPicker from "../../AppComponents/ColorPicker";
import {Card, CardBody, CardHeader, ButtonGroup, Col, Row, FloatingLabel, Form} from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';

const reactSwal = withReactContent(Swal);
const v5NameSpace = '02158767-a18b-4099-bdee-6bc14eff1084';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

export default class FontSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            selectFamily: ''
        }
        this.onSelectStyles = this.onSelectStyles.bind(this);
        this.onColorHeadlineChangeCallback = this.onColorHeadlineChangeCallback.bind(this);
        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);
        this.findArrayElementByLabel = this.findArrayElementByLabel.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    findArrayElementByLabel(array, label) {
        return array.find((element) => {
            return element.label === label;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    onColorHeadlineChangeCallback(color, handle) {
        this.props.onChangeFontSettings(color, 'color', handle, 'font_headline')
    }

    onColorChangeCallback(color, handle) {
        this.props.onChangeFontSettings(color, 'color', handle, 'font')
    }

    onSelectStyles(font, type) {
        const selects = [...this.props.font_selects]
        const find = this.findArrayElementByLabel(selects, font)
        if (find) {
            return {
                id: find.id,
                selects: find.styles
            }
        }
        return {
            id: '',
            selects: []
        };
    }

    render() {
        return (
            <React.Fragment>
                <h5 className="mb-3">{trans['design']['Headings']}</h5>
                {this.props.fonts.font_headline && this.props.fonts.font_headline.length ?
                    <Accordion>
                        {this.props.fonts.font_headline.map((h, index) => {
                            return (
                                <Accordion.Item key={index} eventKey={index}>
                                    <Accordion.Header>
                                        <div className="fw-semibold">
                                            <i className="bi bi-arrow-right me-2"></i>
                                            {h.label} <span className="fw-normal">{trans['design']['Heading']}</span>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Col xs={12}>
                                            <Row className="g-2">
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={trans['design']['Font family']}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            value={h['font-family'] || ''}
                                                            onChange={(e) => this.props.onChangeFontFamily(e.currentTarget.value, h.id, 'font_headline')}
                                                            aria-label={trans['design']['Font family']}
                                                        >
                                                            <option value="">{trans['system']['select']}</option>
                                                            {this.props.font_selects.map((s, index) =>
                                                                <option value={s.label} key={index}>{s.label}</option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                {this.onSelectStyles(h['font-family'], 'font_headline') ?
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={trans['design']['Font style']}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            aria-label={trans['design']['Font style']}
                                                            value={h['font-style'] || ''}
                                                            onChange={(e) => this.props.onChangeFontStyle(e.currentTarget.value, h.id, 'font_headline')}
                                                        >
                                                            <option value="">{trans['system']['select']}</option>
                                                            {h['font-family'] ? (
                                                                this.onSelectStyles(h['font-family'], 'font_headline').selects.map((s, index) =>
                                                                    <option value={s.id}
                                                                            key={index}>{s.full_name}</option>
                                                                )) : ''}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>: ''}
                                                <Col xxl={4} xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['design']['Font size desktop']} (px)`}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={h.size}
                                                            onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.value, 'size', h.id, 'font_headline')}
                                                            type="number"
                                                            placeholder={trans['design']['Font size desktop']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xxl={4} xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['design']['Font size mobile']} (px)`}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={h.size_sm}
                                                            onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.value, 'size_sm', h.id, 'font_headline')}
                                                            type="number"
                                                            placeholder={trans['design']['Font size mobile']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xxl={4} xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['design']['Line height']}`}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={h['line-height']}
                                                            onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.value, 'line-height', h.id, 'font_headline')}
                                                            type="text"
                                                            placeholder={trans['design']['Line height']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className="d-flex align-items-center flex-wrap mt-2">
                                                        <div className="picker-color me-2">
                                                            <ColorPicker
                                                                color={h.color || ''}
                                                                callback={this.onColorHeadlineChangeCallback}
                                                                handle={h.id}
                                                            />
                                                        </div>
                                                        <div className="mb-1">
                                                         <b>{h.label}</b>  {trans['design']['Font colour']}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={h.display || false}
                                                        onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.checked, 'display', h.id, 'font_headline')}
                                                        id={uuidv4()}
                                                        label={trans['design']['Display headline']}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion> : ''}
                <hr/>
                <h5 className="mb-3">{trans['design']['Body Menu Button']}</h5>
                <hr/>
                {this.props.fonts.font && this.props.fonts.font.length ?
                    <Accordion>
                        {this.props.fonts.font.map((h, index) => {
                            return (
                                <Accordion.Item key={index} eventKey={index}>
                                    <Accordion.Header>
                                        <div className="fw-semibold">
                                            <i className="bi bi-arrow-right me-2"></i>
                                            {h.label} <span className="fw-normal">{trans['design']['Font settings']}</span>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Col xs={12}>
                                            <Row className="g-2">
                                                {h.id==='button' || h.id==='menu' ?
                                                <Col xs={12}>
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur"
                                                        checked={h.uppercase || false}
                                                        onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.checked, 'uppercase', h.id, 'font')}
                                                        id={uuidv4()}
                                                        label={trans['design']['uppercase']}
                                                    />
                                                    <div className="form-text">
                                                        {h.id === 'button' ? trans['design']['Button font in capital letters.'] : trans['design']['Menu font in capital letters.']}

                                                    </div>
                                                </Col>: ''}
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={trans['design']['Font family']}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            value={h['font-family'] || ''}
                                                            onChange={(e) => this.props.onChangeFontFamily(e.currentTarget.value, h.id, 'font')}
                                                            aria-label={trans['design']['Font family']}
                                                        >
                                                            <option value="">{trans['system']['select']}</option>
                                                            {this.props.font_selects.map((s, index) =>
                                                                <option value={s.label} key={index}>{s.label}</option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={trans['design']['Font style']}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            aria-label={trans['design']['Font style']}
                                                            value={h['font-style'] || ''}
                                                            onChange={(e) => this.props.onChangeFontStyle(e.currentTarget.value, h.id, 'font')}
                                                        >
                                                            <option value="">{trans['system']['select']}</option>
                                                            {h['font-family'] ? (
                                                                this.onSelectStyles(h['font-family'], 'font').selects.map((s, index) =>
                                                                    <option value={s.id}
                                                                            key={index}>{s.full_name}</option>
                                                                )) : ''}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xxl={4} xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['design']['Font size desktop']} (px)`}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={h.size}
                                                            onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.value, 'size', h.id, 'font')}
                                                            type="number"
                                                            placeholder={trans['design']['Font size desktop']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xxl={4} xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['design']['Font size mobile']} (px)`}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={h.size_sm}
                                                            onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.value, 'size_sm', h.id, 'font')}
                                                            type="number"
                                                            placeholder={trans['design']['Font size mobile']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xxl={4} xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['design']['Line height']}`}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            value={h['line-height']}
                                                            onChange={(e) => this.props.onChangeFontSettings(e.currentTarget.value, 'line-height', h.id, 'font')}
                                                            type="text"
                                                            placeholder={trans['design']['Line height']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                {h.id === 'body' ?
                                                <Col xs={12}>
                                                    <div className="d-flex align-items-center flex-wrap mt-2">
                                                        <div className="picker-color me-2">
                                                            <ColorPicker
                                                                color={h.color || ''}
                                                                callback={this.onColorChangeCallback}
                                                                handle={h.id}
                                                            />
                                                        </div>
                                                        <div className="mb-1">
                                                            <b>{h.label}</b>  {trans['design']['Font colour']}
                                                        </div>
                                                    </div>
                                                </Col>:''}
                                            </Row>
                                        </Col>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion> : ''}
            </React.Fragment>
        )
    }
}