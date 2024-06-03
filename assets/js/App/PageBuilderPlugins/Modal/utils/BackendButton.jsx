import * as React from "react";

import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from "uuid";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import SelectMediaCategory from "../../../AppMedien/Sections/Items/SelectMediaCategory";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AppIcons from "../../../AppIcons/AppIcons";
const v5NameSpace = '0c0cdc85-17ff-439d-af7b-ceb5c5fe68fe';

export default class BackendButton extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showModalIcons: false,
        }
        this.onSetShowModalIcons = this.onSetShowModalIcons.bind(this);
        this.onIconCallback = this.onIconCallback.bind(this);
    }
    onSetShowModalIcons(state) {
        this.setState({
            showModalIcons: state
        })
    }

    onIconCallback(icon) {
        this.props.onSetStateConfig(icon, 'icon')
    }

    render() {
        return (
            <React.Fragment>
                <Col xs={12}>
                    <Form.Check
                        type="switch"
                        inline
                        defaultChecked={this.props.edit.config.outline || ''}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked ? 'outline-' : '', 'outline')}
                        id={uuidv5('btnOutline', v5NameSpace)}
                        label={trans['plugins']['Button Outline']}

                    />
                    <Form.Check
                        inline
                        type="switch"
                        defaultChecked={this.props.edit.config.new_tab || ''}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'new_tab')}
                        id={uuidv5('newTab', v5NameSpace)}
                        label={trans['plugins']['open in new tab']}
                    />
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('buttonText', v5NameSpace)}
                        label={`${trans['plugins']['Button Text']}`}
                    >
                        <Form.Control
                            required={true}
                            defaultValue={this.props.edit.data.input || ''}
                            onChange={(e) => this.props.onSetData(e.currentTarget.value, 'input')}
                            className="no-blur"
                            type="text"
                            placeholder={trans['plugins']['Button Text']}/>
                    </FloatingLabel>
                    <div className="form-text">
                        {trans['carousel']['HTML can be used']}
                    </div>
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('dataAttr', v5NameSpace)}
                        label={`${trans['plugins']['Data attributes']}`}
                    >
                        <Form.Control
                            required={false}
                            defaultValue={this.props.edit.config.data || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'data')}
                            className="no-blur"
                            type="text"
                            placeholder={trans['plugins']['Data attributes']}/>
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('customLink', v5NameSpace)}
                        label={`${trans['plugins']['Custom link']}`}
                    >
                        <Form.Control
                            required={false}
                            disabled={this.props.edit.config.action !== 'custom' || false}
                            defaultValue={this.props.edit.config.custom_link || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'custom_link')}
                            className="no-blur"
                            type="text"
                            placeholder={trans['plugins']['Custom link']}/>
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <Form.Check
                        type="switch"
                        inline
                        defaultChecked={this.props.edit.config.block || false}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'block')}
                        id={uuidv5('blockCheck', v5NameSpace)}
                        label={trans['plugins']['Block button']}
                    />
                    <Form.Check
                        type="switch"
                        inline
                        defaultChecked={this.props.edit.config.disabled || false}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'disabled')}
                        id={uuidv5('disabledCheck', v5NameSpace)}
                        label={trans['plugins']['Disabled']}
                    />
                    <Form.Check
                        type="switch"
                        inline
                        defaultChecked={this.props.edit.config.post_button || false}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'post_button')}
                        id={uuidv5('checkPostButton', v5NameSpace)}
                        label={trans['plugins']['Post button']}
                    />
                </Col>
                <Col xs={12}>
                    <hr className="mt-1 mb-1"/>
                    <div className="fs-5 d-flex align-items-center">Icon: <i className={`${this.props.edit.config.icon} fs-6 ms-2 mt-1 fw-normal`}></i></div>
                    <div className="mt-3 d-flex flex-wrap align-items-center">
                        <button onClick={() => this.onSetShowModalIcons(true)}
                            type="button"
                            className="btn btn-switch-blue dark btn-sm me-2">
                            {this.props.edit.config.icon ? trans['plugins']['Change icon'] : trans['plugins']['Select icon']}
                        </button>
                        {this.props.edit.config.icon ?
                            <button onClick={() => this.props.onSetStateConfig('', 'icon')}
                                type="button"
                                className="btn btn-danger  dark btn-sm">
                                {trans['delete']}
                            </button>
                            : ''}
                    </div>
                    <hr className="mb-1"/>
                </Col>
                <AppIcons
                    showModalIcons={this.state.showModalIcons}
                    onSetShowModalIcons={this.onSetShowModalIcons}
                    onIconCallback={this.onIconCallback}
                />
            </React.Fragment>
        )
    }
}
