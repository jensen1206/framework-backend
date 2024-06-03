import * as React from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = 'ab510b60-edbe-11ee-b21a-325096b39f47';
export default class FormSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            responderOpen: false,
        };

    }


    render() {
        return (

            <div className="card shadow-sm mb-2">
                <div className="card-header fs-5 fw-semibold py-3">
                    <i className="bi bi-gear text-blue me-2"></i>
                    {trans['forms']['Form settings']}
                </div>
                <div className="card-body">
                    <div className="col-xxl-10 col-xl-12 col-12 mx-auto">
                        <div className="row g-3 align-items-stretch">
                            <div className="col-xl-6 col-12">
                                <div className="p-3 h-100 border rounded">
                                    <h6 className="mb-3"> {trans['forms']['Responsive settings']}: </h6>
                                    <hr/>
                                    <div className="fw-semibold mb-2">{trans['forms']['Form Columns']}</div>
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === ''}
                                        onChange={() => this.props.onChangeBuilderSettings('', 'col')}
                                        label={trans['forms']['Do not wrap columns']}
                                        id={uuidv5('collapseBreakPoint1', v5NameSpace)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'sm'}
                                        onChange={() => this.props.onChangeBuilderSettings('sm', 'col')}
                                        label="< 575 (sm)"
                                        id={uuidv5('collapseBreakPoint2', v5NameSpace)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'md'}
                                        onChange={() => this.props.onChangeBuilderSettings('md', 'col')}
                                        label="< 767 (md)"
                                        id={uuidv5('collapseBreakPoint3', v5NameSpace)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'lg'}
                                        onChange={() => this.props.onChangeBuilderSettings('lg', 'col')}
                                        label="< 991 (lg)"
                                        id={uuidv5('collapseBreakPoint4', v5NameSpace)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'xl'}
                                        onChange={() => this.props.onChangeBuilderSettings('xl', 'col')}
                                        label="< 1199 (xl)"
                                        id={uuidv5('collapseBreakPoint5', v5NameSpace)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'xxl'}
                                        onChange={() => this.props.onChangeBuilderSettings('xxl', 'col')}
                                        label="< 1399 (xxl)"
                                        id={uuidv5('collapseBreakPoint6', v5NameSpace)}
                                    />
                                </div>

                            </div>
                            <div className="col-xl-6 col-12">
                                <div className="p-3 border h-100 rounded">
                                    <h6 className="mb-3">{trans['forms']['Responsive settings']}: </h6>
                                    <hr/>
                                    <div className="fw-semibold mb-2">{trans['forms']['Grid']}</div>
                                    <FloatingLabel
                                        controlId={uuidv5('collapseGutter', v5NameSpace)}
                                        className="mb-3"
                                        label={trans['forms']['Form Gutter']}>
                                        <Form.Select
                                            value={this.props.builderSettings.gutter}
                                            onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.value, 'gutter')}
                                            className="no-blur"
                                            aria-label="Gutter Select">
                                            <option value="individuell">{trans['forms']['Customised']}</option>
                                            <option value="g-1">{trans['forms']['Gutter']} 1 (g-1)</option>
                                            <option value="g-2">{trans['forms']['Gutter']} 2 (g-2)</option>
                                            <option value="g-3">{trans['forms']['Gutter']} 3 (g-3)</option>
                                            <option value="g-4">{trans['forms']['Gutter']} 4 (g-4)</option>
                                            <option value="g-5">{trans['forms']['Gutter']} 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>

                                    <FloatingLabel
                                        controlId={uuidv5('customGrid', v5NameSpace)}
                                        label={trans['forms']['Customised grid']}
                                    >
                                        <Form.Control
                                            type="text"
                                            disabled={this.props.builderSettings.gutter !== 'individuell'}
                                            value={this.props.builderSettings.individuell || ''}
                                            onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.value, 'individuell')}
                                            className="no-blur"
                                            placeholder={trans['forms']['Customised grid']} />
                                    </FloatingLabel>
                                    <div className="form-text mb-3">
                                        {trans['forms']['Possible values e.g. gx-1 gy-2 etc.']}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}