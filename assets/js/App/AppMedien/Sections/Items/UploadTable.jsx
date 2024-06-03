import * as React from "react";

import Table from "react-bootstrap/Table";
import {v5 as uuidv5} from "uuid";

const v5NameSpace = '876d0c89-529c-41dd-9781-cdaa8eb92ffa';

function SelectMediaCategory({uploadData}) {

    return (
        <React.Fragment>
            <Table id={uuidv5('uploadTable', v5NameSpace)} responsive striped bordered hover>
                <thead>
                <tr>
                    <th style={{width: '100px'}} className="fw-normal text-center text-body"></th>
                    <th className="fw-normal text-body">{trans['media']['Filename']}</th>
                    <th className="fw-normal text-body">{trans['media']['Owner']}</th>
                    <th className="fw-normal text-body">{trans['media']['Category']}</th>
                    <th className="fw-normal text-center text-body">{trans['media']['File size']}</th>
                    <th className="fw-normal text-body">{trans['media']['File type']}</th>
                </tr>
                </thead>
                <tbody>
                {uploadData.map((file, index) => {
                    return (
                        <tr key={index}>
                            <td className="fw-normal align-middle text-center text-body">
                                <span
                                    className="table-img mx-auto border rounded d-flex align-items-center justify-content-center">
                                <span className={`bs-file-file text-muted fs-1 file ext_${file.ext}`}></span>
                            </span>
                            </td>
                            <td className="fw-normal align-middle text-body">{file.filename}</td>
                            <td className="fw-normal align-middle text-body">{file.owner}</td>
                            <td className="fw-normal align-middle text-body">{file.category}</td>
                            <td className="fw-normal align-middle text-center text-body">{file.size}</td>
                            <td className="fw-normal align-middle text-body">{file.mime}</td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </React.Fragment>
    );
}

export default SelectMediaCategory;