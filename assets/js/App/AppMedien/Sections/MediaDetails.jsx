import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {Card, CardBody, Container, Row} from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const v5NameSpace = '818805d0-b6f6-11ee-8692-325096b39f47';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MediaDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.loadRef = React.createRef();
        this.loadImage =  React.createRef();
        this.state = {
            showCopied: false
        }
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onloadImage = this.onloadImage.bind(this);


    }

    onUpdateCopied() {
        this.setState({
            showCopied: true
        })
        sleep(1500).then(() => {
            this.setState({
                showCopied: false
            })
        })
    }

    onClickDelete() {
        let swal = {
            'title': `${trans['swal']['Delete file']}?`,
            'msg': trans['swal']['The deletion cannot be undone.'],
            'btn': trans['swal']['Delete file']
        }

        let formData = {
            'method': 'delete_media',
            'id': this.props.mediaDetails.id
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    onFormSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }

        let formData = {
            'method': 'update_media_file',
            'id': this.props.mediaDetails.id,
            'category': this.props.mediaDetails.category.id,
            'showFilemanager': this.props.mediaDetails.showFilemanager,
            'title': this.props.mediaDetails.title,
            'alt': this.props.mediaDetails.alt,
            'description': this.props.mediaDetails.description,
            'customCss': this.props.mediaDetails.customCss
        }
        this.props.sendAxiosFormdata(formData);

    }
    onloadImage(){
        this.loadRef.current.remove()
        this.loadImage.current.classList.add('border')
    }

    render() {

        return (
            <React.Fragment>
                <Card>
                    <Card.Header className="fs-5 bg-body-tertiary d-flex align-items-center flex-wrap">

                        <div className={`bs-file bs-file-file file ext_${this.props.mediaDetails.extension}`}>
                            <div className="ms-2">
                                {this.props.mediaDetails.original}
                            </div>
                        </div>
                        <small className="d-block fw-lighter ms-2 text-muted small-lg">
                            ({this.props.mediaDetails.fileSize})
                        </small>

                        <button
                            onClick={() => this.props.onToggleCollapse('table', true)}
                            className="btn btn-switch-blue-outline icon-circle ms-auto">
                            <i className="d-inline-block fs-5 bi bi-x-lg"></i>
                        </button>
                    </Card.Header>
                    <CardBody>
                        <Row className="g-2 py-3 align-items-center justify-content-center">
                            <Col xs={12} xl={6} xxl={8} className="text-center">
                                {publicSettings.extensions.includes(this.props.mediaDetails.extension) ? (
                                    <div className="media-details-wrapper position-relative">
                                        <div  ref={this.loadRef} className="media-load">
                                            <div className="img-load-wait"></div>
                                        </div>
                                        <a ref={this.loadImage} href={`${this.props.mediaDetails.large_url}/${this.props.mediaDetails.fileName}`}
                                           data-control="single"
                                           className="img-link overflow-hidden d-inline-block rounded p-1">
                                            <img
                                                onLoad={this.onloadImage}
                                                src={`${this.props.mediaDetails.medium_url}/${this.props.mediaDetails.fileName}`}
                                                alt={this.props.mediaDetails.original}
                                                className="rounded media-details-img img-fluid"/>
                                        </a>
                                    </div>

                                ) : (
                                    <>
                                        {this.props.mediaDetails.extension === 'svg' ?
                                            (<a href={`/uploads/mediathek/${this.props.mediaDetails.fileName}`}
                                                data-control="single"
                                                className="img-link overflow-hidden border d-inline-block rounded p-1">
                                                <img
                                                    src={`/uploads/mediathek/${this.props.mediaDetails.fileName}`}
                                                    alt={this.props.mediaDetails.original}
                                                    className="rounded media-details-img img-fluid"/>
                                            </a>) :
                                            (<div
                                                className={`bs-file bs-file-file file ext_${this.props.mediaDetails.extension} fs-media-icon`}></div>)
                                        }
                                    </>
                                )}
                                <div className="d-flex justify-content-center mb-xl-0 mb-3 align-items-center">
                                    {this.props.exif_status ? (
                                        <span
                                            onClick={() => this.props.onToggleCollapse('exif')}
                                            title={trans['system']['Exif data']}
                                            className="cursor-pointer d-inline-block hover-scale me-3">
                                        {trans['media']['Exif']}
                                    </span>) : ''}
                                    <a href={`${publicSettings.download_media_uri}/${this.props.mediaDetails.fileName}`}
                                       title={trans['system']['Download']}
                                       className="cursor-pointer text-reset d-inline-block hover-scale bi bi-download me-3">
                                    </a>
                                    <div>
                                        <CopyToClipboard
                                            text={`${this.props.mediaDetails.baseUrl}/uploads/mediathek/${this.props.mediaDetails.fileName}`}
                                            onCopy={() => this.onUpdateCopied()}>
                                            <i title={trans['system']['Copy url']}
                                               className="cursor-pointer d-inline-block hover-scale bi bi-copy"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showCopied ? ' show-copied' : ''}`}>
                                                            {trans['system']['Copied!']}
                                                    </span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} xl={6} xxl={4}>
                                <Form onSubmit={this.onFormSubmit}>
                                    <Card className="shadow-sm">
                                        <Card.Header className="d-flex align-items-center fs-5">
                                            <span>{trans['system']['File details']}</span>
                                            <small className="ms-auto fs-6 text-muted fw-lighter small-lg">
                                                #{this.props.mediaDetails.id}
                                            </small>
                                        </Card.Header>
                                        <CardBody>
                                            <Row className="gy-3">
                                                <Col xs={12}>
                                                    <h5 className="fw-normal lh-1">{trans['media']['Owner']}:</h5>
                                                    <div className="text-muted lh-1">
                                                        {this.props.mediaDetails.user ? this.props.mediaDetails.user.email : ''}
                                                    </div>
                                                </Col>
                                                <hr className="mb-0"/>
                                                <Col xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('selectCategory', v5NameSpace)}
                                                        label={`${trans['media']['Category']} *`}>
                                                        <Form.Select
                                                            className="no-blur"
                                                            value={this.props.mediaDetails.category ? this.props.mediaDetails.category.id : ''}
                                                            onChange={(e) => this.props.onSetDetail(parseInt(e.target.value), 'id', 'category')}
                                                            aria-label={trans['media']['Category']}>
                                                            {this.props.suCategorySelect.map((select, index) =>
                                                                <option key={index} value={select.id}>
                                                                    {select.label}
                                                                </option>
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <Form.Check
                                                        inline
                                                        label="Public"
                                                        name="show_filemanager"
                                                        type="radio"
                                                        checked={this.props.mediaDetails.showFilemanager === 1}
                                                        onChange={(e) => this.props.onSetDetail(1, 'showFilemanager', 'record')}
                                                        value={1}
                                                        id={uuidv5('publicRadio', v5NameSpace)}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        label="Private"
                                                        name="show_filemanager"
                                                        checked={this.props.mediaDetails.showFilemanager === 0}
                                                        onChange={(e) => this.props.onSetDetail(0, 'showFilemanager', 'record')}
                                                        type="radio"
                                                        id={uuidv5('privateRadio', v5NameSpace)}
                                                    />
                                                    <Form.Text className="d-block">
                                                        {trans['system']['If Public is active, the file is displayed in the file manager and is visible to all registered users.']}
                                                    </Form.Text>
                                                </Col>
                                                <Col xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('detailTitle', v5NameSpace)}
                                                        label={trans['system']['Title']}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            value={this.props.mediaDetails.title || ''}
                                                            onChange={(e) => this.props.onSetDetail(e.target.value, 'title', 'record')}
                                                            placeholder={trans['system']['Title']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('detailAlt', v5NameSpace)}
                                                        label={trans['medien']['alt']}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            value={this.props.mediaDetails.alt || ''}
                                                            onChange={(e) => this.props.onSetDetail(e.target.value, 'alt', 'record')}
                                                            placeholder={trans['medien']['alt']}/>
                                                    </FloatingLabel>
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
                                                            value={this.props.mediaDetails.description || ''}
                                                            onChange={(e) => this.props.onSetDetail(e.target.value, 'description', 'record')}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv5('extraCss', v5NameSpace)}
                                                        label={trans['system']['Extra Css']}
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            value={this.props.mediaDetails.customCss || ''}
                                                            onChange={(e) => this.props.onSetDetail(e.target.value, 'customCss', 'record')}
                                                            placeholder={trans['system']['Extra Css']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className="d-flex align-items-center flex-wrap">
                                                        <button type="submit"
                                                                className="btn btn-switch-blue dark">
                                                            {trans['system']['Save changes']}
                                                        </button>
                                                        <div className="ms-auto">
                                                            <button
                                                                onClick={this.onClickDelete}
                                                                type="button"
                                                                className="btn btn-danger dark">
                                                                {trans['delete']}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}