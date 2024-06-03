import * as React from "react";

import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from "uuid";
import FloatingLabel from "react-bootstrap/FloatingLabel";
const v5NameSpace = 'ea616b86-79e9-4898-82bd-f11af3d2f557';
function SelectMediaCategory({selectCategories, readonly=null}) {

    return (
        <React.Fragment>
            <FloatingLabel
                controlId={uuidv5('selectCategory', v5NameSpace)}
                label={`${trans['media']['Category']} *`}>
                <Form.Select
                    className={`no-blur ${readonly ? 'pe-none' : ''}`}
                    name="media_category"
                    aria-label={trans['media']['Category']}>
                    {selectCategories.map((select, index) =>
                        <option key={index} value={select.id}>
                            {select.label}
                        </option>
                    )}
                </Form.Select>
            </FloatingLabel>
        </React.Fragment>
    );
}

export default SelectMediaCategory;