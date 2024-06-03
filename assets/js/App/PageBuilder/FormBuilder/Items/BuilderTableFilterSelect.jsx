import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';

function BuilderTableFilterSelect({typeSelects, typeId}) {
    return (
        <React.Fragment>
            <Row className="gy-3 gx-2">
                <Col xs={12} lg={6} xl={3}>
                    <Form.Group
                        className="mt-2"
                    >
                        <Form.Label
                            htmlFor={typeId}
                            className="mb-1"
                        >
                            {trans['Builder type']}
                        </Form.Label>
                        <Form.Select
                            id={typeId}
                            className="no-blur">
                            <option value="">{trans['All']}</option>
                            {typeSelects.map((t, index) =>
                                <option value={t.id} key={index}>{t.label}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default BuilderTableFilterSelect;