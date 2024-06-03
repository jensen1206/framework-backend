import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import AppIcons from "../../../AppIcons/AppIcons";

const v5NameSpace = '63d164ed-67c5-4161-b516-d30431b7cddb';
export default class BackendIcon extends React.Component {
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
                <div
                     className={`text-center ${this.props.edit.config.icon ? '' : 'text-danger fs-5'}`}>
                    {this.props.edit.config.icon ?
                        <i style={{fontSize: this.props.edit.config.icon ? '50px' : '21px'}} className={this.props.edit.config.icon}></i>
                        : <div>
                            <i  className="bi bi-exclamation-triangle me-2"></i>
                            {trans['plugins']['No icon selected']}
                        </div>
                    }
                </div>
                {this.props.edit.config.icon ?
                    <div className="text-center">
                        <div onClick={() => this.props.onSetStateConfig('', 'icon')}
                             className="d-inline-block cursor-pointer text-center small text-danger">
                            {trans['delete']}
                        </div>
                    </div>
                    : ''}
                <hr/>
                <Col xs={12}>
                    <button onClick={() => this.onSetShowModalIcons(true)}
                            type="button"
                            className="btn btn-switch-blue dark">
                        {this.props.edit.config.icon ? trans['plugins']['Change icon'] : trans['plugins']['Select icon']}
                    </button>
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('iconCss', v5NameSpace)}
                        label={`${trans['plugins']['Icon CSS']} `}
                    >
                        <Form.Control
                            required={false}
                            defaultValue={this.props.edit.config.extra_css || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'extra_css')}
                            className="no-blur mt-3"
                            type="text"
                            placeholder={trans['plugins']['Icon CSS']}/>
                    </FloatingLabel>
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