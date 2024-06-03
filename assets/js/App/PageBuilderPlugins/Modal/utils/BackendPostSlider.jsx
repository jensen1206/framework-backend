import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import InputGroup from "react-bootstrap/InputGroup";

const v5NameSpace = '1c110b98-e865-11ee-a77d-325096b39f47';
export default class BackendPostSlider extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

        this.onCheckCategory = this.onCheckCategory.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
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

    onCheckCategory(e, id){
        let upd;
        if(e){
            upd = [...this.props.edit.config.categories, {
                'id': id,
            }]
        } else {
            upd = this.filterArrayElementById([...this.props.edit.config.categories], id)
        }
        this.props.onSetStateConfig(upd, 'categories')

    }

    render() {
        return (
            <React.Fragment>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('selectLoop', v5NameSpace)}
                        label={`${trans['posts']['Loop Design']} *`}>
                        <Form.Select
                            required={true}
                            className="no-blur"
                            defaultValue={this.props.edit.config.design || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'design')}
                            aria-label={trans['posts']['Loop Design']}>
                            <option value="">{trans['system']['select']}</option>
                            {this.props.edit.options.loop_design.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xs={12} xl={6}>
                    <FloatingLabel
                        controlId={uuidv5('selectOrderBy', v5NameSpace)}
                        label={`${trans['posts']['Order by']}`}>
                        <Form.Select
                            className="no-blur"
                            required={false}
                            defaultValue={this.props.edit.config.order_by || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'order_by')}
                            aria-label={trans['posts']['Order by']}>
                            <option value="">{trans['system']['select']}</option>
                            {this.props.edit.options.order_by.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xs={12} xl={6}>
                    <FloatingLabel
                        controlId={uuidv5('selectOrder', v5NameSpace)}
                        label={`${trans['posts']['Order']}`}>
                        <Form.Select
                            className="no-blur"
                            required={false}
                            value={this.props.edit.config.order || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'order')}
                            aria-label={trans['posts']['Order']}>
                            <option value="">{trans['system']['select']}</option>
                            {this.props.edit.options.order.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
              {this.props.edit.options && this.props.edit.options.post_categories ?
                <Col xs={12}>
                    <h6 className="mb-2">{trans['posts']['Post categories']}</h6>
                    <React.Fragment>
                        {this.props.edit.options.post_categories.map((s, index) => {
                            return (
                                <InputGroup
                                    key={index}
                                    className="mb-2">
                                    <InputGroup.Checkbox
                                        id={uuidv4()}
                                        checked={!!this.findArrayElementById([...this.props.edit.config.categories], s.id)}
                                        onChange={(e) => this.onCheckCategory(e.currentTarget.checked, s.id)}
                                        aria-label="Checkbox Category"/>
                                    <Form.Control
                                        className="no-blur bg-transparent"
                                        disabled={true}
                                        defaultValue={s.label}
                                        id={uuidv4()}
                                        aria-label="Category"
                                    />
                                </InputGroup>
                            )
                        })}
                    </React.Fragment>
                </Col> : ''}

            </React.Fragment>
        )
    }
}