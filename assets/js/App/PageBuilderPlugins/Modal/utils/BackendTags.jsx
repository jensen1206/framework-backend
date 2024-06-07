import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import AppIcons from "../../../AppIcons/AppIcons";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const v5NameSpace = '4773ac39-8081-4ec8-a794-9b5c8231f093';
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";

export default class BackendTags extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {

        }

    }


    render() {
        return (
            <Row className="g-2">
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`Tag wrapper CSS`}
                    >
                        <Form.Control
                            className="no-blur"
                            value={this.props.edit.config.wrapper_css || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'wrapper_css')}
                            type="text"
                            placeholder='Index'
                        />
                    </FloatingLabel>
                </Col>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`Tag item CSS`}
                    >
                        <Form.Control
                            className="no-blur"
                            value={this.props.edit.config.item_css || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'item_css')}
                            type="text"
                            placeholder='Index'
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={trans['builder']['Tag separator']}
                    >
                        <Form.Control
                            className="no-blur"
                            value={this.props.edit.config.separator || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'separator')}
                            type="text"
                            placeholder='Index'
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={trans['builder']['Tag Icon']}
                    >
                        <Form.Control
                            className="no-blur"
                            value={this.props.edit.config.tag_icon || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'tag_icon')}
                            type="text"
                            placeholder='Index'
                        />
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <Form.Check
                        inline
                        type="switch"
                        defaultChecked={this.props.edit.config.show_link || false}
                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'show_link')}
                        id={uuidv4()}
                        label={trans['plugins']['Link to category']}
                    />
                </Col>
            </Row>
        )
    }
}