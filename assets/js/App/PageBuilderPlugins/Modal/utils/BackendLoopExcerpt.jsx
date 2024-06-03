import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
const v5NameSpace = '44ff1e57-c611-4e22-8cd6-acd514901389';
export default class BackendLoopExcerpt extends React.Component {
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
                </Row>
            </React.Fragment>
        )
    }

}