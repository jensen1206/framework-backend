import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";
import {ReactSortable} from "react-sortablejs";
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";

const v5NameSpace = 'da6aa2de-c59c-11ee-aabf-325096b39f47';
export default class BackendMedienCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            sortableOptions: {
                animation: 300,
                // handle: ".arrow-sortable",
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
        }
    }

    render() {
        return (
            <React.Fragment>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('selectCarousel', v5NameSpace)}
                        label={`${trans['carousel']['Select Carousel']}`}>
                        <Form.Select
                            className="no-blur"
                            required={false}
                            value={this.props.edit.config.carousel || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'carousel')}
                            aria-label={trans['carousel']['Select Carousel']}>
                            <option value="">{trans['system']['select']}...</option>
                            {this.props.edit.options.carousel.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xs={12}>
                    <div className="image-grid-plugin pt-3">
                        {this.props.edit.images.map((i, index) => {
                            return (
                                <div key={index} data-id={i.imgId}
                                     className="image-grid-item p-1 overflow-hidden border rounded">
                                    {i.image ?
                                        <img
                                            className="rounded img-fluid"
                                            src={`${i.type === 'data' ? publicSettings.public_mediathek + '/' + i.image : publicSettings.thumb_url + '/' + i.image}`}
                                            alt={i.title}/>
                                        :
                                        <div style={{width: '135px', height: '135px'}}
                                             className="placeholder-account-image overflow-hidden p-1"></div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </Col>
            </React.Fragment>
        )
    }
}