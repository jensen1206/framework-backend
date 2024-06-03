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

export default class BackendForms extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {

        }

    }


    render() {
        return (
            <React.Fragment>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('selectForm', v5NameSpace)}
                        label={`${trans['forms']['Forms']} *`}>
                        <Form.Select
                            className="no-blur"
                            required={true}
                            value={this.props.edit.config.formular || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'formular')}
                            aria-label={trans['forms']['Forms']}>
                            <option value="">{trans['system']['select']}...</option>
                            {this.props.edit.options.forms.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </React.Fragment>
        )
    }
}