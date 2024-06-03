import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';

function TableFilterSelect({typeSelects, catId, typeId, suCategorySelect, onClickAddCategory, userSelects, userSelectId}) {
    return (
        <React.Fragment>
            <Row className="gy-3 gx-2">

                <Col xs={12} lg={6} xl={3}>
                    <Form.Group
                        className="mt-2"
                       >
                        <Form.Label
                            htmlFor={catId}
                           className="mb-1"
                        >
                            {trans['medien']['Category']}
                        </Form.Label>
                        <Form.Select
                            id={catId}
                            disabled={suCategorySelect.length < 3}
                            className="no-blur">
                            {suCategorySelect.map((cat, index) =>
                                <option value={cat.id} key={index}>{cat.label}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    <button
                        onClick={onClickAddCategory}
                        type="button"
                        className="btn btn-secondary dark mb-3 mt-2 btn-sm">
                        <i className="bi bi-node-plus me-1"></i>
                        {trans['medien']['Create a new category']}
                    </button>
                </Col>
                <Col xs={12} lg={6} xl={3}>
                    <Form.Group
                        className="mb-3 mt-2"
                        >
                        <Form.Label
                            className="mb-1"
                            htmlFor={typeId}
                        >
                            {trans['medien']['File type']}
                        </Form.Label>
                        <Form.Select
                            id={typeId}
                            disabled={typeSelects.length < 3}
                            className="no-blur">
                            {typeSelects.map((cat, index) =>
                                <option value={cat.id} key={index}>{cat.label}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                </Col>
                {publicSettings.su ? (
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
                ) : ''}
            </Row>
        </React.Fragment>
    );
}

export default TableFilterSelect;