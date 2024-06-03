import * as React from "react";

import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from "uuid";
const v5NameSpace = '955dcdf4-b53b-11ee-a786-325096b39f47';
function RadioShowFile({readonly=null}) {
    return (
        <React.Fragment>
            <Form.Check
                inline
                className={`no-blur ${readonly ? 'pe-none' : ''}`}
                label="Public"
                name="show_filemanager"
                type="radio"
                defaultChecked={true}
                defaultValue={1}
                id={uuidv5('publicRadio', v5NameSpace)}
            />
            <Form.Check
                inline
                className={`no-blur ${readonly ? 'pe-none' : ''}`}
                label="Private"
                name="show_filemanager"
                defaultValue={0}
                type="radio"
                id={uuidv5('privateRadio', v5NameSpace)}
            />
            <Form.Text className="d-block">
                {trans['system']['If Public is active, the file is displayed in the file manager and is visible to all registered users.']}
            </Form.Text>
        </React.Fragment>
    );
}

export default RadioShowFile;