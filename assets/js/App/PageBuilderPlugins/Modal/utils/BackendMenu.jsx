import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = '63d164ed-67c5-4161-b516-d30431b7cddb';
export default class BackendMenu extends React.Component {
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
                            controlId={uuidv4()}
                            label={`${trans['plugins']['Menu']} *`}>
                            <Form.Select
                                className="no-blur"
                                required={true}
                                value={this.props.edit.config.menu || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'menu')}
                                aria-label={trans['plugins']['Menu']}>
                                <option value="">{trans['system']['select']}</option>
                                {this.props.edit.options.menu.map((s, index) =>
                                    <option value={s.id} key={index}>{s.label}</option>
                                )}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col className="g-0" xl={6} xs={12}></Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['plugins']['UL extra CSS']}`}
                        >
                            <Form.Control
                                disabled={!this.props.edit.config.menu}
                                value={this.props.edit.config.ul_css || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'ul_css')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['UL extra CSS']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['plugins']['LI extra CSS']}`}
                        >
                            <Form.Control
                                disabled={!this.props.edit.config.menu}
                                value={this.props.edit.config.li_css || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'li_css')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['plugins']['LI extra CSS']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12}>
                        <Form.Check
                            type="switch"
                            checked={this.props.edit.config.show_name || false}
                            onChange={(e) => this.props.onSetStateConfig(e.target.checked, 'show_name')}
                            id={uuidv5('checkName', v5NameSpace)}
                            label={trans['plugins']['Display menu name']}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}