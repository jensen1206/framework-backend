import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = '7b81f7cc-150b-4bb4-9a2d-184e648ac7bd';
export default class BackendPostGallery extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

    }

    render() {
        return (
            <React.Fragment>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('lightboxTypeSelect', v5NameSpace)}
                        label={`${trans['gallery']['Lightbox Type']}`}>
                        <Form.Select
                            className="no-blur"
                            disabled={this.props.edit.config.action !== 'lightbox'}
                            required={true}
                            value={this.props.edit.config.lightbox_type || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'lightbox_type')}
                            aria-label={trans['gallery']['Lightbox Type']}>
                            <option value="single">{trans['gallery']['Single']}</option>
                            <option value="slide">{trans['gallery']['Slide']}</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('galleryTypeSelect', v5NameSpace)}
                        label={`${trans['gallery']['Select gallery']}`}>
                        <Form.Select
                            className="no-blur"
                            disabled={this.props.edit.config.output_type !== 'gallery'}
                            required={true}
                            value={this.props.edit.config.gallery_id || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'gallery_id')}
                            aria-label={trans['gallery']['Select gallery']}>
                            <option value="">{trans['system']['select']}</option>
                            {this.props.edit.options['gallery-select'].map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <div className="mt-2">
                        {trans['plugins']['Action on click']}
                    </div>
                </Col>
                <Col xs={12}>
                    <Form.Check
                        type="radio"
                        inline
                        checked={this.props.edit.config.action === '' || false}
                        onChange={() => this.props.onSetStateConfig('', 'action')}
                        id={uuidv5('noAction', v5NameSpace)}
                        label={trans['plugins']['No action']}
                    />
                    <Form.Check
                        type="radio"
                        inline
                        checked={this.props.edit.config.action === 'lightbox' || false}
                        onChange={() => this.props.onSetStateConfig('lightbox', 'action')}
                        id={uuidv5('lightbox', v5NameSpace)}
                        label={trans['medien']['Lightbox']}
                    />
                </Col>

                <Collapse in={this.props.edit.config.output_type === 'slider'}>
                    <div id={uuidv5('collapsePostSliderSettings', v5NameSpace)}>
                        <Row className="g-2">
                            <Col xs={12}>
                                <h6 className="my-2">
                                    {trans['gallery']['Gallery slider settings']}
                                </h6>
                            </Col>
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('sliderFixedHeight', v5NameSpace)}
                                    label={`${trans['builder']['Fixed image height']} `}
                                >
                                    <Form.Control
                                        className="no-blur"
                                        value={this.props.edit.config.height || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'height')}
                                        type="text"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('sliderObjectPosition', v5NameSpace)}
                                    label={`${trans['builder']['Object position']} `}
                                >
                                    <Form.Control
                                        className="no-blur"
                                        value={this.props.edit.config.slider_object_position || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'slider_object_position')}
                                        type="text"
                                    />
                                </FloatingLabel>
                            </Col>

                        </Row>
                    </div>
                </Collapse>


            </React.Fragment>
        )
    }

}