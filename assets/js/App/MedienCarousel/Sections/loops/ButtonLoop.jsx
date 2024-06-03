import * as React from "react";

import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const v5NameSpace = '180c4d8c-c77c-11ee-a214-325096b39f47';
export default class ButtonLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}
        this.deleteBtn = this.deleteBtn.bind(this);

    }
    deleteBtn(id) {
        let swal = {
            'title': `${trans['swal']['Delete button']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete button']
        }

        let formData = {
            'method': 'delete_carousel_slider_button',
            'id': id,
            'slider': this.props.s.id,
            'carousel': this.props.carouselId
        }
        this.props.onDeleteSwalHandle(formData, swal)

    }
    render() {

        return (
            <React.Fragment>
                {this.props.s.slide_button.length ?
                    <div className="button-wrapper mt-3">
                        {this.props.s.slide_button.map((b, index) => {
                            return (
                                <Card className="mb-3 border-success" key={index}>
                                    <CardHeader className="d-flex align-items-center border-success">
                                        <div>
                                            {trans['plugins']['Button']} {index + 1}
                                        </div>
                                        <div
                                            onClick={() => this.deleteBtn(b.id)}
                                            className="ms-auto hover-scale">
                                            <i title={trans['delete']}
                                               className="cursor-pointer bi bi-trash text-danger"></i>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <Row className="g-2">
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Button Text']}`}
                                                >
                                                    <Form.Control
                                                        required={true}
                                                        value={b.text || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'text', this.props.s.id, b.id)}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['plugins']['Button Text']}/>
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    {trans['carousel']['HTML can be used']}
                                                </div>
                                            </Col>
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Action on click']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        required={false}
                                                        value={b.action || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'action', this.props.s.id, b.id)}
                                                        aria-label={trans['plugins']['Action on click']}>

                                                        {this.props.selects.select_link_options.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Select page']}`}>
                                                    <Form.Select
                                                        disabled={b.action !== 'url'}
                                                        className="no-blur"
                                                        required={false}
                                                        value={b.page || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'page', this.props.s.id, b.id)}
                                                        aria-label={trans['plugins']['Select page']}>

                                                        {this.props.selects.site_selects.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Button variant']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        required={false}
                                                        value={b.variant || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'variant', this.props.s.id, b.id)}
                                                        aria-label={trans['plugins']['Button variant']}>

                                                        {this.props.selects.select_button_variant.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Button size']}`}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        required={false}
                                                        value={b.size || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'size', this.props.s.id, b.id)}
                                                        aria-label={trans['plugins']['Button size']}>

                                                        {this.props.selects.select_button_size.map((s, index) =>
                                                            <option value={s.id} key={index}>{s.label}</option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>

                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['External URL']}`}
                                                >
                                                    <Form.Control
                                                        disabled={b.action !== 'custom'}
                                                        value={b.external_url || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'external_url', this.props.s.id, b.id)}
                                                        className="no-blur"
                                                        type="url"
                                                        placeholder={trans['plugins']['External URL']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Data attributes']}`}
                                                >
                                                    <Form.Control
                                                        required={false}
                                                        disabled={b.action === ''}
                                                        value={b.data || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'data', this.props.s.id, b.id)}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['plugins']['Data attributes']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <hr/>
                                                <Form.Check
                                                    type="switch"
                                                    inline
                                                    checked={b.blank || false}
                                                    onChange={(e) => this.props.onSetSliderButton(e.currentTarget.checked, 'blank', this.props.s.id, b.id)}
                                                    id={uuidv4()}
                                                    label={trans['system']['open in new window']}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    inline
                                                    checked={b.block || false}
                                                    onChange={(e) => this.props.onSetSliderButton(e.currentTarget.checked, 'block', this.props.s.id, b.id)}
                                                    id={uuidv4()}
                                                    label={trans['plugins']['Block button']}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    inline
                                                    checked={b.disabled || false}
                                                    onChange={(e) => this.props.onSetSliderButton(e.currentTarget.checked, 'disabled', this.props.s.id, b.id)}
                                                    id={uuidv4()}
                                                    label={trans['plugins']['Disabled']}
                                                />
                                                <hr/>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['Element-ID']}`}
                                                >
                                                    <Form.Control
                                                        required={false}
                                                        value={b.container_id || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'container_id', this.props.s.id, b.id)}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['plugins']['Element-ID']}/>
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    {trans['plugins']['Enter element ID (Note make sure it is unique and valid according to w3c specification).']}
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['plugins']['CSS class name (without dot or hash in front)']}`}
                                                >
                                                    <Form.Control
                                                        required={false}
                                                        value={b.css_class || ''}
                                                        onChange={(e) => this.props.onSetSliderButton(e.currentTarget.value, 'css_class', this.props.s.id, b.id)}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['plugins']['CSS class name (without dot or hash in front)']}/>
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    {trans['plugins']['Style particular content element differently - add a class name and refer to it in custom CSS.']}
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            )
                        })}
                    </div> :
                    <div className="text-danger text-center">
                        <hr/>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {trans['carousel']['No button available']}
                        <hr/>
                    </div>
                }
            </React.Fragment>
        )
    }
}