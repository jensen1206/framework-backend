import * as React from "react";

import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const v5NameSpace = 'e54a65e2-14b5-4616-beb9-84ee48f6fe28';
export default class BreakpointLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}
        this.onDeleteBreakpoint = this.onDeleteBreakpoint.bind(this);

    }

    onDeleteBreakpoint(breakpoint) {
        let swal = {
            'title': `${trans['swal']['Delete breakpoint']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete breakpoint']
        }

        let formData = {
            'method': 'delete_breakpoint',
            'id': this.props.id,
            'breakpoint': breakpoint
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    render() {
        return (
            <React.Fragment>
                <Row className="g-2">
                    {this.props.breakpoint.map((b, index) => {
                        return (
                            <Col key={index} xxl={4} xl={4} lg={4} md={6} xs={12}>
                                <div className="d-flex flex-column bg-body-tertiary h-100 p-1 border rounded">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="p-2 mb-1">
                                            {trans['mediaSlider']['Breakpoint']} {b.breakpoint} px
                                        </div>
                                        <div className="ms-auto">

                                                <i onClick={() => this.onDeleteBreakpoint(b.id)}
                                                    className="cursor-pointer bi bi-trash text-danger">
                                                </i>
                                        </div>
                                    </div>
                                    <Row className="g-2">
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['Breakpoint']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    min={1}
                                                    max={2200}
                                                    value={b.breakpoint || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'breakpoint', b.id)}
                                                    placeholder= {trans['mediaSlider']['Breakpoint']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['gap']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.gap || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gap', b.id)}
                                                    placeholder= {trans['mediaSlider']['gap']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['perPage']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={b.perPage || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'perPage', b.id)}
                                                    placeholder= {trans['mediaSlider']['perPage']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['perMove']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={b.perMove || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'perMove', b.id)}
                                                    placeholder= {trans['mediaSlider']['perMove']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['height']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.height || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'height', b.id)}
                                                    placeholder= {trans['mediaSlider']['height']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['width']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.width || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'width', b.id)}
                                                    placeholder= {trans['mediaSlider']['width']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['fixedHeight']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.fixedHeight || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'fixedHeight', b.id)}
                                                    placeholder= {trans['mediaSlider']['fixedHeight']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['fixedWidth']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.fixedWidth || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'fixedWidth', b.id)}
                                                    placeholder= {trans['mediaSlider']['fixedWidth']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} className="px-2 fw-semibold">
                                            {trans['mediaSlider']['Padding']}
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['left']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.left || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'left', b.id, 'padding')}
                                                    placeholder= {trans['mediaSlider']['left']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['right']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.right || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'right', b.id, 'padding')}
                                                    placeholder= {trans['mediaSlider']['right']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['top']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.top || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'top', b.id, 'padding')}
                                                    placeholder= {trans['mediaSlider']['top']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label= {trans['mediaSlider']['bottom']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.bottom || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'bottom', b.id, 'padding')}
                                                    placeholder= {trans['mediaSlider']['bottom']}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            </React.Fragment>
        )
    }
}