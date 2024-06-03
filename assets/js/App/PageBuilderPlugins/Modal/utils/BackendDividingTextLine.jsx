import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";
import ColorPicker from "../../../AppComponents/ColorPicker";

const v5NameSpace = 'f8813726-c113-438f-9667-54ff5dfe7f3e';
export default class BackendDividingTextLine extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}
        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);
    }

    onColorChangeCallback(color, handle) {
        this.props.onSetStateConfig(color, handle)
    }

    render() {
        return (
            <React.Fragment>
                <Row className="g-2">
                    <div className="fs-5">{trans['plugins']['Dividing line']}</div>
                    <hr className="mb-0"/>
                    <Col xl={6} xs={12}>
                        <div className="mb-1">
                            {trans['builder']['Color']}
                        </div>
                        {this.props.edit && this.props.edit.config.color ?
                            <ColorPicker
                                color={this.props.edit.config.color}
                                callback={this.onColorChangeCallback}
                                handle="color"
                            /> : ''}
                    </Col>
                    <Col xl={6} xs={12}></Col>
                    <Col xl={6} xs={12}>
                        {this.props.edit && this.props.edit.config.alignment ?
                            <FloatingLabel
                                controlId={uuidv5('selectAlignment', v5NameSpace)}
                                label={`${trans['plugins']['Alignment']}`}>
                                <Form.Select
                                    className="no-blur"
                                    value={this.props.edit.config.alignment || ''}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'alignment')}
                                    aria-label={trans['plugins']['Alignment']}>
                                    {this.props.selects.alignItems.map((s, index) =>
                                        <option value={s.id}
                                                key={index}>{s.label}</option>
                                    )}
                                </Form.Select>
                            </FloatingLabel>
                            : ''}
                    </Col>
                    {/*}  <Col xl={6} xs={12}>
                        {this.props.edit && this.props.edit.config.style ?
                            <FloatingLabel
                                controlId={uuidv5('selectAlignment', v5NameSpace)}
                                style={{zIndex: 0}}
                                label={`${trans['plugins']['Style']}`}>
                                <Form.Select
                                    className="no-blur"
                                    value={this.props.edit.config.style || ''}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'style')}
                                    aria-label={trans['plugins']['Style']}>
                                    {this.props.selects.selectBorder.map((s, index) =>
                                        <option value={s.id}
                                                key={index}>{s.label}</option>
                                    )}
                                </Form.Select>
                            </FloatingLabel>
                            : ''}
                    </Col> {*/}
                    <Col xs={12} xl={6}></Col>
                    <Col xs={12} xl={6}>
                        <FloatingLabel
                            style={{zIndex: 0}}
                            controlId={uuidv5('borderWidth', v5NameSpace)}
                            label={`${trans['plugins']['Width']} %`}
                        >
                            <Form.Control
                                required={true}
                                min={1}
                                max={100}
                                value={this.props.edit.config.width || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'width')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['plugins']['Width']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} xl={6}>
                        <FloatingLabel
                            style={{zIndex: 0}}
                            controlId={uuidv5('borderHeight', v5NameSpace)}
                            label={`${trans['plugins']['Height']}`}
                        >
                            <Form.Control
                                required={true}
                                value={this.props.edit.config.height || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'height')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['Height']}/>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="g-2">
                    <div className="fs-5 mt-3">{trans['plugins']['Title']}</div>
                    <hr className="mb-0"/>
                    <Col xs={12}>
                        <FloatingLabel
                            style={{zIndex: 0}}
                            controlId={uuidv5('textTitle', v5NameSpace)}
                            label={`${trans['plugins']['Title']}`}
                        >
                            <Form.Control
                                required={true}
                                defaultValue={this.props.edit.config.text || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'text')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['Title']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv5('selectTitleLevel', v5NameSpace)}
                            style={{zIndex: 0}}
                            label={`${trans['plugins']['Title level']}`}>
                            <Form.Select
                                className="no-blur"
                                required={true}
                                value={this.props.edit.config.fontStyle || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'fontStyle')}
                                aria-label={trans['plugins']['Title level']}>
                                <option value="h1">H1</option>
                                <option value="h2">H2</option>
                                <option value="h3">H3</option>
                                <option value="h4">H4</option>
                                <option value="h5">H5</option>
                                <option value="h6">H6</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        {this.props.edit && this.props.edit.config.alignment ?
                            <FloatingLabel
                                controlId={uuidv5('selectTextAlignment', v5NameSpace)}
                                label={`${trans['plugins']['Alignment']}`}>
                                <Form.Select
                                    className="no-blur"
                                    required={true}
                                    value={this.props.edit.config.text_align || ''}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'text_align')}
                                    aria-label={trans['plugins']['Alignment']}>
                                    {this.props.selects.alignItems.map((s, index) =>
                                        <option value={s.id}
                                                key={index}>{s.label}</option>
                                    )}
                                </Form.Select>
                            </FloatingLabel>
                            : ''}
                    </Col>
                    <Col xs={12}>
                        <FloatingLabel
                            style={{zIndex: 0}}
                            controlId={uuidv5('textExtraCss', v5NameSpace)}
                            label={`${trans['plugins']['Title CSS']}`}
                        >
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.text_css || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'text_css')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['Title CSS']}/>
                        </FloatingLabel>
                        <div className="form-text">
                            {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

}