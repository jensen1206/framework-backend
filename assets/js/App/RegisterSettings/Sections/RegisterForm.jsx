import * as React from "react";
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
const v5NameSpace = '257446ca-be92-11ee-bae7-325096b39f47';
export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

    }

    render() {
        return (
            <React.Fragment>
                <Card className="shadow-sm mt-3">
                    <Card.Header
                        className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                        <div>
                            <i className="bi bi-view-list me-2"></i>
                            {trans['reg']['Registration form fields']}
                        </div>
                        <div className="ms-auto">
                            <div
                                className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                            <small>
                                <SetAjaxResponse
                                    status={this.props.spinner.ajaxStatus}
                                    msg={this.props.spinner.ajaxMsg}
                                />
                            </small>
                        </div>
                    </Card.Header>
                    <CardBody>

                    </CardBody>

                </Card>
            </React.Fragment>
        )
    }
}