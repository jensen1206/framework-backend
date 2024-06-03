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
import InputGroup from 'react-bootstrap/InputGroup';

const v5NameSpace = '3a303532-1a9d-42d0-b85a-74890350ad7e';
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";

export default class BackendCustomFields extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.onIsChecked = this.onIsChecked.bind(this);
        this.onChangeChecked = this.onChangeChecked.bind(this);

    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    onIsChecked(id) {
        const edit = [...this.props.edit.config.fields]
        console.log(id)
        return !!this.findArrayElementById( [...this.props.edit.config.fields], id);

    }

    onChangeChecked(e, id) {
        if (e) {
            const edit = [...this.props.edit.options.custom_fields]
            const find = this.findArrayElementById(edit, id);
            const add = [...this.props.edit.config.fields, find]
            this.props.onSetStateConfig(add, 'fields')
        } else {
            const del = this.filterArrayElementById([...this.props.edit.config.fields], id);
            this.props.onSetStateConfig(del, 'fields')
        }
    }

    render() {
        return (
            <React.Fragment>
                <Row className="g-2">
                    <Col xs={12}>
                        <FloatingLabel
                            controlId={uuidv5('wrapperCss', v5NameSpace)}
                            label={`${trans['builder']['Fields wrapper extra CSS']} `}
                        >
                            <Form.Control
                                className="no-blur"
                                value={this.props.edit.config.wrapper_css || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'wrapper_css')}
                                type="text"
                                placeholder={trans['builder']['Fields wrapper extra CSS']}
                            />
                        </FloatingLabel>
                    </Col>

                    <Col xs={12}>
                        {trans['Custom Fields']}
                    </Col>
                    {this.props.edit.config.fields && this.props.edit.options.custom_fields.length ?
                        <React.Fragment>
                            {this.props.edit.options.custom_fields.map((c, index) => {
                                return (
                                    <Col key={index} xl={6} xs={12}>
                                        <InputGroup>
                                            <InputGroup.Checkbox
                                                id={uuidv4()}
                                                checked={!!this.findArrayElementById( [...this.props.edit.config.fields], c.id) }
                                                onChange={(e) => this.onChangeChecked(e.currentTarget.checked, c.id)}
                                                aria-label="checkbox input"/>
                                            <Form.Control
                                                readOnly={true}
                                                className="no-blur pe-none"
                                                id={uuidv4()}
                                                defaultValue={c.designation}
                                                aria-label="Text input with radio button"/>
                                        </InputGroup>
                                    </Col>
                                )
                            })}
                        </React.Fragment>
                        : ''}
                </Row>
            </React.Fragment>
        )
    }
}