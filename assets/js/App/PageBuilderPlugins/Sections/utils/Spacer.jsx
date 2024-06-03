import * as React from "react";

import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from "uuid";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import SelectMediaCategory from "../../../AppMedien/Sections/Items/SelectMediaCategory";
import Col from "react-bootstrap/Col";

const v5NameSpace = '238d169e-c661-11ee-8fdd-325096b39f47';

function Spacer({plugin}) {
    return (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center">
                <i className="bi bi-arrows-expand fs-4"></i>
                <div className="mt-1">{trans['plugins']['Spacer']}
                   <small className="ms-1">({plugin.data.input})</small>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Spacer;