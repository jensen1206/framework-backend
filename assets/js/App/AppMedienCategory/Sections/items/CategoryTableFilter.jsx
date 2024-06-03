import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';

function CategoryTableFilter({userSelects, userSelectId}) {
    return (
        <React.Fragment>
            {publicSettings.su ? (<></>) : ''}
                <Row className="gy-3 gx-2">

                    <Col xs={12} lg={6} xl={3}>
                        <Form.Group
                            className="mt-2"
                        >
                            <Form.Label
                                htmlFor={userSelectId}
                                className="mb-1"
                            >
                                {trans['media']['Owner']}
                            </Form.Label>
                            <Form.Select
                                id={userSelectId}
                                disabled={userSelects.length < 3}
                                className="no-blur">
                                {userSelects.map((us, index) =>
                                    <option value={us.id} key={index}>{us.label}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

        </React.Fragment>
    )
}

export default CategoryTableFilter;