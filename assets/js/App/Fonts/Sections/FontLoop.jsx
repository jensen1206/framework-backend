import * as React from "react";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Card, CardBody, CardHeader} from "react-bootstrap";

const v5NameSpace = 'faa7a782-e3af-11ee-9f9f-325096b39f47';
export default class FontLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.state = {}
        this.onDeleteFont = this.onDeleteFont.bind(this);
    }

    onDeleteFont(id) {
        let swal = {
            'title': `${trans['swal']['Delete font']}?`,
            'msg': trans['swal']['The deletion cannot be undone.'],
            'btn': trans['swal']['Delete font']
        }

        let formData = {
            'method': 'delete_font',
            'id': id
        }
        this.props.onDeleteSwalHandle(formData, swal)
    }

    render() {

        return (
            <React.Fragment>
                <Card className="shadow-sm">
                    <CardHeader className="bg-body-tertiary">
                        <i className="bi bi-fonts me-2"></i>
                        {trans['design']['Installed fonts']}
                    </CardHeader>
                    <CardBody>
                        <div className="d-flex flex-wrap align-items-stretch py-3">
                            {this.props.fonts.map((f, index) => {
                                return (
                                    <Col className="p-2" xxl={3} xl={4} lg={6} xs={12} key={index}>
                                        <div
                                            className="d-flex overflow-hidden position-relative border h-100 w-100 shadow-sm">
                                            <div className="p-3 d-flex flex-column w-100 h-100">
                                                <div className="header-font">
                                                    <h5 className="fw-semibold">
                                                        <i className="text-orange bi bi-arrow-right-circle-fill me-2"></i>
                                                        {f.designation}
                                                    </h5>
                                                </div>
                                                <hr/>
                                                <h6>{trans['design']['Font styles']}:</h6>
                                                <ul className="li-font-list list-unstyled mb-2">
                                                    {f.fontData.map((l, lIndex) => {
                                                        return (
                                                            <li key={lIndex}>
                                                                <span className="d-flex align-items-center flex-wrap">
                                                                 <span
                                                                     className="d-block text-truncate">{l.full_name}</span>
                                                                    <span className="ms-auto d-block">
                                                                       <i onClick={() => this.props.getFontInfo(f.id, l.id)}
                                                                          title={trans['design']['Font Info']}
                                                                          className="text-blue cursor-pointer me-2 bi bi-info-circle"></i>
                                                                       <i onClick={() => this.props.getFontEdit(f.id, l.id)}
                                                                          title={trans['design']['Font settings']}
                                                                          className="text-orange cursor-pointer bi bi-gear"></i>
                                                                    </span>
                                                                 </span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                                <div className="mt-auto">
                                                    <hr className="mt-1"/>
                                                    {designSettings.delete_font ?
                                                        <button onClick={() => this.onDeleteFont(f.id)}
                                                                className="btn btn-danger dark btn-sm">
                                                            <i className="bi bi-trash me-2"></i>
                                                            {trans['Delete']}
                                                        </button> : ''}
                                                 </div>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })}
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}