import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = '887cdace-1b75-4668-9576-7d0f1d04bc2b';
export default class BackendCategoryImage extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

    }

    render() {
        let cats = ['post', 'category', 'loop'];
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
                            <option value="category_title">{trans['posts']['Category title']}</option>
                            <option value="category_decription">{trans['posts']['Category Description']}</option>
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
                {!cats.includes(this.props.builderType) ?
                    <React.Fragment>
                        <Col xl={6} xs={12}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={`${trans['posts']['Post category']} *`}>
                                <Form.Select
                                    className="no-blur"
                                    required={true}
                                    value={this.props.edit.config.category || ''}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'category')}
                                    aria-label={trans['posts']['Post category']}>
                                    <option value="">{trans['system']['select']}</option>
                                    {this.props.edit.options.post_categories.map((s, index) =>
                                        <option value={s.id} key={index}>{s.label}</option>
                                    )}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>

                    </React.Fragment>
                    : ''}
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