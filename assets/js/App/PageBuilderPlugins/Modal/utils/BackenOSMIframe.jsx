import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
const v5NameSpace = '6e7eb4b1-5403-4d73-94d9-b832657cd2b8';
export default class BackenOSMIframe extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

    }

    render() {
        return (
            <React.Fragment>
                <Row className="g-2">
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv5('selectPolicy', v5NameSpace)}
                            label={`${trans['maps']['Map Privacy Policy']}`}>
                            <Form.Select
                                className="no-blur"
                                required={false}
                                defaultValue={this.props.edit.config.privacy_policy || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'privacy_policy')}
                                aria-label={trans['maps']['Map Privacy Policy']}>
                                <option value="">{trans['system']['select']}...</option>
                                {this.props.edit.options.protection.map((s, index) =>
                                    <option value={s.id} key={index}>{s.label}</option>
                                )}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col className="g-0" xl={6} xs={12}></Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['plugins']['Width']} `}
                        >
                            <Form.Control
                                required={false}
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
                            label={`${trans['plugins']['Height']} `}
                        >
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.height || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'height')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['plugins']['Height']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['maps']['I-Frame']} *`}
                        >
                            <Form.Control
                                required={true}
                                value={this.props.edit.config.iframe || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'iframe')}
                                className="no-blur"
                                as="textarea"
                                style={{height: '180px'}}
                                placeholder={trans['maps']['I-Frame']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12}>
                        <Form.Check
                            type="switch"
                            checked={this.props.edit.config.link_show_larger_map || false}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'link_show_larger_map')}
                            id={uuidv4()}
                            label={trans['maps']['Link Show larger map']}
                        />
                    </Col>

                </Row>
            </React.Fragment>
        )
    }

}