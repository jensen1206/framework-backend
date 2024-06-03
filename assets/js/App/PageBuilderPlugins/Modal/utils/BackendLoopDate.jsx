import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
const v5NameSpace = 'a3a716e0-e047-11ee-8a40-325096b39f47';
export default class BackendLoopDate extends React.Component {
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
                            label={`${trans['posts']['Date format']} *`}
                        >
                            <Form.Control
                                required={true}
                                value={this.props.edit.config.format || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'format')}
                                className="no-blur"
                                type="text"
                                placeholder={trans['posts']['Date format']}/>
                        </FloatingLabel>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

}