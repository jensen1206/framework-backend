import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = 'aeb0ecf2-4b50-4779-9bd8-489f43da1770';
export default class BackendLoopPostImage extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

    }

    render() {
        return (
            <React.Fragment>
                <Col xs={12} xl={6}>
                    <FloatingLabel
                        controlId={uuidv5('selectCaption', v5NameSpace)}
                        label={`${trans['plugins']['Caption options']}`}>
                        <Form.Select
                            className="no-blur"
                            required={false}
                            defaultValue={this.props.edit.config.caption_type || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'caption_type')}
                            aria-label={trans['plugins']['Caption options']}>
                            {this.props.edit.options.caption.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                            <option value="post_title">{trans['plugins']['Post title']}</option>
                            <option value="post_excerpt">{trans['plugins']['Post excerpt']}</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`${trans['plugins']['Width']} (px)`}
                    >
                        <Form.Control
                            value={this.props.edit.config.width || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'width')}
                            className="no-blur"
                            type="number"
                            placeholder={trans['plugins']['Width']}/>
                    </FloatingLabel>
                </Col>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`${trans['plugins']['Height']} (px)`}
                    >
                        <Form.Control
                            value={this.props.edit.config.height || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'height')}
                            className="no-blur"
                            type="number"
                            placeholder={trans['plugins']['Height']}/>
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <Form.Check
                        inline
                        type="switch"
                        defaultChecked={this.props.edit.config.new_tab || ''}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'new_tab')}
                        id={uuidv5('newTab', v5NameSpace)}
                        label={trans['plugins']['open in new tab']}
                    />
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`${trans['plugins']['Caption']}`}
                    >
                        <Form.Control
                            disabled={this.props.edit.config.caption_type !== 'individuell'}
                            value={this.props.edit.config.custom_caption || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'custom_caption')}
                            className="no-blur"
                            type="url"
                            placeholder={trans['plugins']['Caption']}/>
                    </FloatingLabel>
                    <div className="form-text">
                        {trans['carousel']['HTML can be used']}
                    </div>
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`${trans['plugins']['External URL']}`}
                    >
                        <Form.Control
                            disabled={this.props.edit.config.action !== 'custom'}
                            required={this.props.edit.config.action === 'custom'}
                            value={this.props.edit.config.external_url || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'external_url')}
                            className="no-blur"
                            type="url"
                            placeholder={trans['plugins']['External URL']}/>
                    </FloatingLabel>
                </Col>

            </React.Fragment>
        )
    }
}