import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";

const v5NameSpace = '651f75ac-cf3a-11ee-ad5f-325096b39f47';
export default class BackendUnfilteredHTML extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <Row className="g-2">
                    <Col xs={12}>
                        <FloatingLabel
                            controlId={uuidv5('invHtml', v5NameSpace)}
                            label={`${trans['plugins']['Unfiltered HTML']}`}
                        >
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.html || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'html')}
                                className="no-blur"
                                as="textarea"
                                style={{height: '190px'}}
                                placeholder={trans['plugins']['Unfiltered HTML']}/>
                        </FloatingLabel>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}