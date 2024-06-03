import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";
import ColorPicker from "../../../AppComponents/ColorPicker";

const v5NameSpace = '0c72ca02-cf0e-11ee-98e9-325096b39f47';
export default class BackendDividingLine extends React.Component {
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
                    <Col xl={6} xs={12}>
                        {this.props.edit && this.props.edit.config.style ?
                            <FloatingLabel
                                controlId={uuidv5('selectAlignment', v5NameSpace)}
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
                    </Col>
                    <Col xs={12} xl={6}>
                        <FloatingLabel
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
            </React.Fragment>
        )
    }

}