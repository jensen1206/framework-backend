import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';

function CategoryTableSelect({catSelects, catSelectId}) {
    return (
        <React.Fragment>
            <Row className="gy-3 gx-2">
                <Col xs={12} lg={6} xl={3}>
                    <Form.Group
                        className="mt-2"
                    >
                        <Form.Label
                            htmlFor={catSelectId}
                            className="mb-1"
                        >
                            {trans['media']['Category']}
                        </Form.Label>
                        <Form.Select
                            id={catSelectId}
                            className="no-blur">
                            <option value="">{trans['All']}</option>
                            {catSelects.map((us, index) =>
                                <option value={us.id} key={index}>{us.label}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

        </React.Fragment>
    )
}

export default CategoryTableSelect;