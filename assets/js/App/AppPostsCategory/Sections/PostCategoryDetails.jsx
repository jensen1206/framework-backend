import * as React from "react";
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v5 as uuidv5} from 'uuid';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";

const v5NameSpace = '032f1953-0bef-4518-bbe7-056bef05643c';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class PostCategoryDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;


        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
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

        this.onAddSeoSite = this.onAddSeoSite.bind(this);

        //this.handleSubmit = this.handleSubmit.bind(this);
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
            this.props.onSetCategory(files[0]['fileName'], 'catImg')
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

    onAddSeoSite() {
        let formData = {
            'method': 'add_category_seo',
            'id': this.props.category.id
        }
        this.props.sendAxiosFormdata(formData);
    }

    render() {
        return (
            <React.Fragment>
                <Col xxl={6} xl={8} lg={10} xs={12} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi bi-front me-2"></i>
                                {trans['medien']['Edit category']}
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                                <div
                                    className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                <small>
                                    <SetAjaxResponse
                                        status={this.props.spinner.ajaxStatus}
                                        msg={this.props.spinner.ajaxMsg}
                                    />
                                </small>
                                <button
                                    onClick={() => this.props.onToggleCategoryCollapse('table', true)}
                                    className="btn btn-success-custom dark ms-3 icon-circle">
                                    <i className="d-inline-block fs-5 bi bi-reply-all-fill"></i>
                                </button>
                            </div>
                        </Card.Header>
                        <CardBody>

                            <Row className="g-3">
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('titleInput', v5NameSpace)}
                                        label={`${trans['system']['Title']} *`}
                                    >
                                        <Form.Control
                                            required={true}
                                            value={this.props.category.title || ''}
                                            onChange={(e) => this.props.onSetCategory(e.target.value, 'title')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['system']['Title']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('slugInput', v5NameSpace)}
                                        label={`${trans['system']['Slug']} *`}
                                    >
                                        <Form.Control
                                            required={true}
                                            value={this.props.category.slug || ''}
                                            onChange={(e) => this.props.onSetCategory(e.target.value, 'slug')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['system']['Slug']}/>
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['menu']['After changes, update menu permalinks']}
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('descriptionInput', v5NameSpace)}
                                        label={trans['system']['Description']}>
                                        <Form.Control
                                            as="textarea"
                                            className="no-blur"
                                            placeholder={trans['system']['Description']}
                                            style={{height: '100px'}}
                                            value={this.props.category.description || ''}
                                            onChange={(e) => this.props.onSetCategory(e.target.value, 'description')}
                                        />
                                    </FloatingLabel>
                                    <hr className="mb-0"/>
                                </Col>

                                <Col xl={4} sm={6} xs={12} className="text-center mx-auto">
                                    <div className="my-2">{trans['Cover picture']}</div>
                                    <div className="d-flex flex-column align-items-stretch">
                                        {this.props.category.catImg ?
                                            <React.Fragment>
                                                <div style={{width: '150px', height: '150px'}}
                                                     className="p-1 border rounded overflow-hidden d-flex mx-auto mb-3">
                                                    <img
                                                        style={{objectFit: 'cover'}}
                                                        className="rounded img-fluid"
                                                        alt={trans['app']['Cover picture']}
                                                        src={`${publicSettings.thumb_url}/${this.props.category.catImg}`}/>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div
                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                        }
                                        <div className="mt-auto">
                                            <button
                                                onClick={() => this.onSetAppImage('category_logo')}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                {this.props.category.catImg ? trans['app']['Change image'] : trans['app']['Select image']}
                                            </button>
                                            {this.props.category.catImg ?
                                                <button
                                                    onClick={() => this.props.onSetCategory('', 'catImg')}
                                                    type="button"
                                                    className="btn btn-danger ms-2 dark btn-sm">
                                                    {trans['delete']}
                                                </button> : ''}
                                        </div>
                                    </div>
                                </Col>
                                <hr/>
                                <Col xs={12}>
                                    <div className="d-flex align-items-center">
                                        <button
                                            onClick={() => this.props.onToggleCategoryCollapse('table', true)}
                                            className="btn btn-switch-blue dark">
                                            <i className="bi bi-reply-all-fill me-2"></i>
                                            {trans['to overview']}
                                        </button>
                                        {!this.props.category.seo ?
                                            <div className="ms-auto">
                                                <button onClick={this.onAddSeoSite}
                                                        className="btn btn-warning-custom dark">
                                                    <i className="bi bi-globe-americas me-2"></i>
                                                    {trans['menu']['Create Seo page']}
                                                </button>
                                            </div> : ''}
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
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