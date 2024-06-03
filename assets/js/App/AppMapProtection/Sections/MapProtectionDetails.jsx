import * as React from "react";

import FileMangerModal from "../../AppMedien/Modal/FileMangerModal"
import Collapse from 'react-bootstrap/Collapse';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

const v5NameSpace = 'b22e5d3f-8b21-44b2-b1ed-9fd08bc78ae7';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import * as AppTools from "../../AppComponents/AppTools";


export default class MapProtectionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },

        }

        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);
    }

    fileManagerDidUpdate(state) {
        this.setState({
            didUpdateManager: state
        })
    }

    setFileManagerShow(state) {
        this.setState({
            fileManagerShow: state
        })
    }

    fileManagerCallback(files) {
        if (files.length) {
            let i = files[0];
            let img = {
                id: AppTools.randomChar(12),
                fileName: i.fileName,
                imgId: i.id,
                type: i.type,
                attr: i.sizeData.attr,
                alt: i.alt,
                labelling: i.labelling,
                title: i.title,
                file_size: i.file_size,
                customCss: i.customCss,
                description: i.description,
                original: i.original,
                urls: i.urls
            }
            this.props.onSetEdit(img, 'image')
            this.setState({
                selectedImage: ''
            })
        }
    }


    onSetAppImage(type) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true
        })
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={() => this.props.onToggleCollapse('table', true)}
                        className="btn btn-switch-blue dark btn-sm">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['back']}
                </button>
                <hr/>
                <Card className="shadow-sm">
                    <CardHeader className="py-3 d-flex align-items-center flex-wrap">
                        <div className="fs-5">
                            {trans['Map data protection']}
                        </div>
                        <div className="ms-auto">
                            <div
                                className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}>
                            </div>
                            <small>
                                <SetAjaxResponse
                                    status={this.props.spinner.ajaxStatus}
                                    msg={this.props.spinner.ajaxMsg}
                                />
                            </small>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Col xs={12} xxl={8} xl={9} lg={12} className="mx-auto">
                            <Card>
                                <CardBody>
                                    <Row className="g-2">
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('inputDesignation', v5NameSpace)}
                                                label={`${trans['Designation']} *`}
                                            >
                                                <Form.Control
                                                    value={this.props.designation || ''}
                                                    required={true}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'designation')}
                                                    className="no-blur"
                                                    type="text"
                                                    placeholder={trans['Designation']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} xl={6}></Col>
                                        <Col className="mb-2" xs={12}>
                                            <div className="fs-5 mt-1 mb-3">
                                                {trans['maps']['Placeholder map']}
                                            </div>
                                            <div style={{width: '450px', height: '300px'}}
                                                 className="text-start mb-3 overflow-hidden">
                                                {this.props.edit.image && this.props.edit.image.fileName ?
                                                    <img
                                                        className="img-fluid"
                                                        width={450}
                                                        height={300}
                                                        src={`${this.props.edit.image.type === 'data' ? publicSettings.public_mediathek + '/' + this.props.edit.image.fileName : publicSettings.medium_url + '/' + this.props.edit.image.fileName} `}
                                                        alt=""/>
                                                    :
                                                    <img height={300} style={{objectFit: 'cover'}}
                                                         className="img-fluid w-100"
                                                         src='/images/blind-karte.svg' alt=""/>

                                                }
                                            </div>
                                            <button onClick={() => this.onSetAppImage('map_image')}
                                                    className="btn btn-switch-blue dark btn-sm me-2">
                                                <i className="fa fa-random me-2"></i>
                                                {trans['maps']['Change placeholder image']}
                                            </button>
                                            {this.props.edit.image && this.props.edit.image.fileName ?
                                                <button onClick={() => this.props.onSetEdit([], 'image')}
                                                        className={`btn dark btn-danger btn-sm`}>
                                                    <i className="bi bi-trash me-2"></i>
                                                    {trans['maps']['Delete placeholder image']}
                                                </button> : ''}
                                        </Col>
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('selectPage', v5NameSpace)}
                                                label={`${trans['maps']['Select data protection page']} *`}>
                                                <Form.Select
                                                    className="no-blur mb-2"
                                                    required={true}
                                                    value={this.props.edit.page || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.currentTarget.value, 'page')}
                                                    aria-label={trans['maps']['Select data protection page']}>
                                                    <option value="">{trans['system']['select']}</option>
                                                    {this.props.selectPages.map((s, index) =>
                                                        <option value={s.value} key={index}>{s.label}</option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} xl={6}>
                                            <FloatingLabel
                                                controlId={uuidv5('inputBtnTxt', v5NameSpace)}
                                                label={`${trans['maps']['Button Text']} *`}
                                            >
                                                <Form.Control
                                                    value={this.props.edit.btn_text || ''}
                                                    required={true}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'btn_text')}
                                                    className="no-blur"
                                                    type="text"
                                                    placeholder={trans['maps']['Button Text']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('inputDsTxt', v5NameSpace)}
                                                label={`${trans['maps']['Accept data protection Text']} *`}
                                            >
                                                <Form.Control
                                                    value={this.props.edit.accept_txt || ''}
                                                    required={true}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'accept_txt')}
                                                    className="no-blur"
                                                    as="textarea"
                                                    placeholder={trans['maps']['Accept data protection Text']}
                                                    style={{height: '100px'}}
                                                />
                                            </FloatingLabel>
                                            <div className="form-text">
                                                {trans['maps']['You can use {{LINK}} as a placeholder for the data protection link. If no placeholder is inserted, the link is inserted after the text.']}
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <div className="d-flex flex-wrap">
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur my-1 me-3"
                                                    checked={this.props.edit.btn_uppercase || false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.checked, 'btn_uppercase')}
                                                    id={uuidv5('btnUppercase', v5NameSpace)}
                                                    label={trans['maps']['Button uppercase']}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur my-1 me-3"
                                                    checked={this.props.edit.img_gray || false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.checked, 'img_gray')}
                                                    id={uuidv5('linkUppercase', v5NameSpace)}
                                                    label={trans['maps']['Placeholder map grayscale']}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('inputBtnExtraCss', v5NameSpace)}
                                                label={`${trans['maps']['Button extra CSS']}`}
                                            >
                                                <Form.Control
                                                    value={this.props.edit.btn_css || ''}
                                                    required={false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'btn_css')}
                                                    className="no-blur"
                                                    type="text"
                                                    placeholder={trans['maps']['Button extra CSS']}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>
                </Card>

                <FileMangerModal
                    didUpdateManager={this.state.didUpdateManager}
                    fileManagerShow={this.state.fileManagerShow}
                    options={this.state.fmOptions}
                    fileManagerDidUpdate={this.fileManagerDidUpdate}
                    setFileManagerShow={this.setFileManagerShow}
                    fileManagerCallback={this.fileManagerCallback}
                />
            </React.Fragment>
        )
    }
}