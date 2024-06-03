import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import InputGroup from "react-bootstrap/InputGroup";
import * as AppTools from "../../../AppComponents/AppTools";
const v5NameSpace = '9e7ae067-a1b4-40e4-9f83-b8b043856194';
export default class BackendPostLoop extends React.Component {
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
                <Row className="g-2">
                    <Col xs={12} xl={6}>
                        <FloatingLabel
                            controlId={uuidv5('selectLoopDesign', v5NameSpace)}
                            label={`${trans['posts']['Loop Design']}`}>
                            <Form.Select
                                className="no-blur"
                                required={true}
                                value={this.props.edit.config.design || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'design')}
                                aria-label={trans['posts']['Loop Design']}>
                                <option value="">{trans['system']['select']}</option>
                                {this.props.edit.options.loop_design.map((s, index) =>
                                    <option value={s.id} key={index}>{s.label}</option>
                                )}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} xl={6}></Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['posts']['Limit']}`}
                        >
                            <Form.Control
                                value={this.props.edit.config.load_limit || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'load_limit')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['posts']['Limit']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['posts']['More loading']}`}
                        >
                            <Form.Control
                                disabled={!this.props.edit.config.lazy_load_active}
                                required={true}
                                value={this.props.edit.config.lazy_load || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'lazy_load')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['posts']['More loading']}/>
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
                    {this.props.builderType !== 'loop' ?
                    <Col xs={12}>
                        <h6 className="my-2">{trans['posts']['Post categories']}</h6>
                        <React.Fragment>
                            {this.props.edit.options.post_galleries.map((s, index) => {
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
                    </Col>: ''}
                    <Col xs={12}>
                        <Form.Check
                            type="switch"
                            inline
                            checked={this.props.edit.config.lazy_load_active || false}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'lazy_load_active')}
                            id={uuidv5('checkLoadMore', v5NameSpace)}
                            label={trans['posts']['More loading']}
                        />
                    </Col>

                    <Collapse in={this.props.edit.config.lazy_load_active}>
                        <div id={uuidv5('collapseLoadMore', v5NameSpace)}>
                            <hr className="mt-0"/>
                           <Row className="g-2">
                               <Col xs={12}>
                                   <Form.Check
                                       type="radio"
                                       inline
                                       checked={this.props.edit.config.load_more_type === 'lazy'}
                                       onChange={() => this.props.onSetStateConfig('lazy', 'load_more_type')}
                                       id={uuidv5('checkLoadMoreLazy', v5NameSpace)}
                                       label={trans['posts']['Automatically more ads']}
                                   />
                                   <Form.Check
                                       type="radio"
                                       inline
                                       checked={this.props.edit.config.load_more_type === 'button'}
                                       onChange={() => this.props.onSetStateConfig('button', 'load_more_type')}
                                       id={uuidv5('checkLoadMoreButton', v5NameSpace)}
                                       label={trans['posts']['Button more ads']}
                                   />
                               </Col>
                               <Col xs={12} xl={6}>
                                   <FloatingLabel
                                       controlId={uuidv4()}
                                       label={`${trans['posts']['Button text']} *`}
                                   >
                                       <Form.Control
                                           disabled={this.props.edit.config.load_more_type !== 'button'}
                                           required={true}
                                           value={this.props.edit.config.load_more_txt || ''}
                                           onChange={(e) => this.props.onSetStateConfig(e.target.value, 'load_more_txt')}
                                           className="no-blur mt-2"
                                           type="text"
                                           placeholder={trans['posts']['Button text']}/>
                                   </FloatingLabel>
                               </Col>
                               <Col xs={12} xl={6}>
                                   <FloatingLabel
                                       controlId={uuidv4()}
                                       label={`${trans['posts']['Button CSS']}`}
                                   >
                                       <Form.Control
                                           disabled={this.props.edit.config.load_more_type !== 'button'}
                                           required={false}
                                           value={this.props.edit.config.load_more_css || ''}
                                           onChange={(e) => this.props.onSetStateConfig(e.target.value, 'load_more_css')}
                                           className="no-blur mt-2"
                                           type="text"
                                           placeholder={trans['posts']['Button CSS']}/>
                                   </FloatingLabel>
                               </Col>
                           </Row>
                        </div>
                    </Collapse>
                </Row>
            </React.Fragment>
        )
    }
}