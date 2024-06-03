import * as React from "react";

import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const v5NameSpace = '180c4d8c-c77c-11ee-a214-325096b39f47';
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            animation: ''
        }
        this.onSetAnimation = this.onSetAnimation.bind(this);
    }

    onSetAnimation(e, type, id) {
        this.setState({animation: e})
        this.props.onSetSlider(e, type, id)
    }

    render() {
        return (
            <React.Fragment>
                <Card className="shadow-sm border-success">
                    <CardBody>
                        <Row className="g-2">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['carousel']['Headline']}`}
                                >
                                    <Form.Control
                                        required={false}
                                        value={this.props.s.headline_caption}
                                        onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'headline_caption', this.props.s.id)}
                                        className="no-blur"
                                        as="textarea"
                                        style={{height: '100px'}}
                                        placeholder={trans['carousel']['Headline']}/>
                                </FloatingLabel>
                                <div className="form-text">
                                    {trans['carousel']['HTML can be used']}
                                </div>
                            </Col>
                            <Col xl={6} xs={12}>
                                <div className="text-muted my-1">
                                    <b className={`d-block fw-semibold animate__animated animate__${this.state.animation}`}>
                                        {trans['carousel']['Animation for text']}
                                    </b>
                                </div>
                            </Col>
                            <Col xl={6} xs={12}></Col>
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['carousel']['Animation']}`}>
                                    <Form.Select
                                        className="no-blur mb-2"
                                        value={this.props.s.headline_ani}
                                        onChange={(e) => this.onSetAnimation(e.currentTarget.value, 'headline_ani', this.props.s.id)}
                                        aria-label={trans['carousel']['Animation']}>
                                        <option value="">{trans['system']['select']}...</option>
                                        {this.props.selects.animate_selects.map((s, index) =>
                                            <option
                                                disabled={s.divider && s.divider === true}
                                                key={index} value={s.animate}>{s.animate}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                                <div className="form-text">
                                    {trans['carousel']['Animation for text']}
                                </div>
                            </Col>

                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['carousel']['Selector']}`}>
                                    <Form.Select
                                        className="no-blur mb-2"
                                        value={this.props.s.subline_tag}
                                        onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'subline_tag', this.props.s.id)}
                                        aria-label={trans['carousel']['Selector']}>
                                        {this.props.selects.select_tag_name.map((s, index) =>
                                            <option
                                                key={index} value={s.id}>{s.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['plugins']['CSS class name (without dot or hash in front)']}`}
                                >
                                    <Form.Control
                                        required={false}
                                        value={this.props.s.headline_css || ''}
                                        onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'headline_css', this.props.s.id)}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['plugins']['CSS class name (without dot or hash in front)']}/>
                                </FloatingLabel>
                                <div className="form-text">
                                    {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                </div>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['plugins']['Element-ID']}`}
                                >
                                    <Form.Control
                                        required={false}
                                        value={this.props.s.headline_id || ''}
                                        onChange={(e) => this.props.onSetSlider(e.currentTarget.value, 'headline_id', this.props.s.id)}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['plugins']['Element-ID']}/>
                                </FloatingLabel>
                                <div className="form-text">
                                    {trans['plugins']['Enter element ID (Note make sure it is unique and valid according to w3c specification).']}
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}