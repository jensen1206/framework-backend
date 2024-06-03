import * as React from "react";

import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const v5NameSpace = '180c4d8c-c77c-11ee-a214-325096b39f47';
export default class CarouselSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

        this.onDeleteCarousel = this.onDeleteCarousel.bind(this);

    }

    onDeleteCarousel(id) {

    }

    render() {
        return (
            <React.Fragment>
                <button
                    onClick={() => this.props.onToggleCollapse('overview')}
                    className="btn btn-switch-blue mb-2 btn-sm dark">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['back']}
                </button>
                <Card className="shadow-sm">
                    <CardHeader className="bg-body-tertiary py-3 fs-5">
                        <i className="bi bi-tools me-2"></i>
                        {trans['carousel']['Carousel']}
                        <span className="fw-light ms-2">{this.props.carouselEdit.carousel.designation}</span>
                    </CardHeader>
                    <CardBody>
                        <Col xxl={8} xl={10} xs={12} className="mx-auto">
                            <Card>
                                <CardBody>
                                    {trans['Settings']}
                                    <hr/>
                                    <Row className="g-2">
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('designation', v5NameSpace)}
                                                label={trans['Designation']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.carouselEdit.carousel.designation || ''}
                                                    onChange={(e) => this.props.onSetCarousel(e.target.value, 'designation')}
                                                    placeholder={trans['Designation']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('height', v5NameSpace)}
                                                label={trans['carousel']['Carousel height']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.carouselEdit.carousel.height || ''}
                                                    onChange={(e) => this.props.onSetCarousel(e.target.value, 'height')}
                                                    placeholder={trans['carousel']['Carousel height']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <hr className="mt-3"/>
                                        <Col xs={12}>
                                            <Row className="g-2">
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.lazy_load || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'lazy_load')}
                                                        id={uuidv5('lazyLoad', v5NameSpace)}
                                                        label={trans['carousel']['lazy load active']}
                                                    />
                                                </Col>
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.controls || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'controls')}
                                                        id={uuidv5('controlsCheck', v5NameSpace)}
                                                        label={trans['carousel']['Show control elements']}
                                                    />
                                                </Col>
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.indicator || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'indicator')}
                                                        id={uuidv5('indicatorsCheck', v5NameSpace)}
                                                        label={trans['carousel']['Show indicators']}
                                                    />
                                                </Col>
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.autoplay || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'autoplay')}
                                                        id={uuidv5('autoplayCheck', v5NameSpace)}
                                                        label={trans['carousel']['autoplay']}
                                                    />
                                                </Col>
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.stop_hover || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'stop_hover')}
                                                        id={uuidv5('SlideHoverCheck', v5NameSpace)}
                                                        label={trans['carousel']['Slide hover stop']}
                                                    />
                                                </Col>
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.touch_active || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'touch_active')}
                                                        id={uuidv5('TouchCheck', v5NameSpace)}
                                                        label={trans['carousel']['Touch active']}
                                                    />
                                                </Col>
                                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                                    <Form.Check
                                                        className="no-blur"
                                                        type="switch"
                                                        checked={this.props.carouselEdit.carousel.keyboard_active || false}
                                                        onChange={(e) => this.props.onSetCarousel(e.target.checked, 'keyboard_active')}
                                                        id={uuidv5('KeyboardCheck', v5NameSpace)}
                                                        label={trans['carousel']['Keyboard active']}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <hr className="mt-3 mb-2"/>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('imageSize', v5NameSpace)}
                                                label={`${trans['system']['Image size']}`}>
                                                <Form.Select
                                                    className="no-blur mb-2"
                                                    value={this.props.carouselEdit.carousel.image_size || ''}
                                                    onChange={(e) => this.props.onSetCarousel(e.currentTarget.value, 'image_size')}
                                                    aria-label={trans['system']['Image size']}>
                                                    {this.props.selects.select_image_size.map((s, index) =>
                                                      <option key={index} value={s.id}>{s.label}</option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('carouselAnimation', v5NameSpace)}
                                                label={`${trans['carousel']['Animation']}`}>
                                                <Form.Select
                                                    className="no-blur mb-2"
                                                    value={this.props.carouselEdit.carousel.animate || ''}
                                                    onChange={(e) => this.props.onSetCarousel(e.currentTarget.value, 'animate')}
                                                    aria-label={trans['carousel']['Animation']}>
                                                    {this.props.selects.select_carousel_type.map((s, index) =>
                                                        <option key={index} value={s.id}>{s.label}</option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['carousel']['Animation for the transitions']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('StaticText', v5NameSpace)}
                                                label={trans['carousel']['Static text']}>
                                                <Form.Control
                                                    className="no-blur"
                                                    as="textarea"
                                                    value={this.props.carouselEdit.carousel.static_text || ''}
                                                    onChange={(e) => this.props.onSetCarousel(e.currentTarget.value, 'static_text')}
                                                    placeholder={trans['carousel']['Static text']}
                                                    style={{ height: '100px' }}
                                                />
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['carousel']['The text entered is displayed with each slider. HTML can be used.']}
                                            </div>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}