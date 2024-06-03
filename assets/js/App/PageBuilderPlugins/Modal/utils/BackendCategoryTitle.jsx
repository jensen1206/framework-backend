import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = 'a3a716e0-e047-11ee-8a40-325096b39f47';
export default class BackendCategoryTitle extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

    }

    render() {
        let cats = ['post', 'category', 'loop'];

        return (
            <React.Fragment>
                <Row className="g-2">
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
                    <Col xl={6} xs={12}>
                        {this.props.edit && this.props.edit.options.tag_name ?
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={`${trans['carousel']['Selector']} *`}>
                                <Form.Select
                                    className="no-blur"
                                    required={true}
                                    value={this.props.edit.config.selector || ''}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'selector')}
                                    aria-label={trans['carousel']['Selector']}>
                                    <option value="div">div</option>
                                    <option value="p">p</option>
                                    <option value="small">small</option>
                                    {this.props.edit.options.tag_name.map((s, index) =>
                                        <option value={s.id} key={index}>{s.label}</option>
                                    )}
                                </Form.Select>
                            </FloatingLabel>
                            : ''}
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['system']['Character Limit']}`}
                        >
                            <Form.Control
                                value={this.props.edit.config.word_limit || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'word_limit')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['system']['Character Limit']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12}>
                        <Form.Check
                            inline
                            type="switch"
                            checked={this.props.edit.config.link_category || false}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'link_category')}
                            id={uuidv5('linkToCategory', v5NameSpace)}
                            label={trans['plugins']['Link to the post']}
                        />
                        <Form.Check
                            inline
                            type="switch"
                            disabled={!this.props.edit.config.link_category}
                            checked={this.props.edit.config.new_tab || false}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'new_tab')}
                            id={uuidv5('newLinkTab', v5NameSpace)}
                            label={trans['plugins']['open in new tab']}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}