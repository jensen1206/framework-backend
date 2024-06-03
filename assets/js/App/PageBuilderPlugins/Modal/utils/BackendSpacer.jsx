import * as React from "react";

import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from "uuid";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import SelectMediaCategory from "../../../AppMedien/Sections/Items/SelectMediaCategory";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
const v5NameSpace = '238d169e-c661-11ee-8fdd-325096b39f47';

function BackendSpacer({onSetData, edit}) {
    return (
        <React.Fragment>
            <Row className="g-2">
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('spacer', v5NameSpace)}
                        label={`${trans['plugins']['Spacer']}`}
                    >
                        <Form.Control
                            required={true}
                            defaultValue={edit.data.input || ''}
                            onChange={(e) => onSetData(e.currentTarget.value, 'input')}
                            className="no-blur"
                            type="text"
                            placeholder={trans['plugins']['Spacer']}/>
                    </FloatingLabel>
                    <div className="form-text">
                        {trans['plugins']['Enter empty space height (Note CSS measurement units allowed).']}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default BackendSpacer;