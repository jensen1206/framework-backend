import * as React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";

const v5NameSpace = 'f69a7581-3f0a-4dde-89f4-2fd8f10e88b0';
import * as AppTools from "../../AppComponents/AppTools";

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class FileMangerModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.mediaUpdTimeOut = '';
        this.state = {
            showAjaxWait: false,
            ajaxStatus: false,
            ajaxMsg: '',
            total: '',
            rest: '',
            loaded: '',
            next: '',
            files: [],
            category_selects: [],
            types_select: [],
            user_selects: [],
            urls: {},
            user: '',
            search: '',
            category: '',
            type: '',
            options: {
                multiSelect: true,
                maxSelect: 1000
            },
            checked: [],
            selected: 0,
            selectedData: {},
            showUrlCopied: false,
            showThumbCopied: false,
            showMediumCopied: false,
            showLargeCopied: false,
            showLargeXlCopied: false,
        }

        this.getMediathek = this.getMediathek.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.setIsLoadedImg = this.setIsLoadedImg.bind(this);
        this.onChangeSelects = this.onChangeSelects.bind(this);
        this.onSetChecked = this.onSetChecked.bind(this);
        this.onGetChecked = this.onGetChecked.bind(this);
        this.onGetDataDetails = this.onGetDataDetails.bind(this);
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
        this.onUpdateMediaFile = this.onUpdateMediaFile.bind(this);
        this.onSetUpdateMediaFile = this.onSetUpdateMediaFile.bind(this);
        this.onSendFileManagerSelects = this.onSendFileManagerSelects.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.didUpdateManager) {
            this.setState({
                checked: [],
                selected: 0,
                selectedData: {},
                total: '',
                rest: '',
                loaded: '',
                next: '',
                files: [],
                showAjaxWait: false,
                ajaxStatus: false,
                ajaxMsg: '',
            })
            this.getMediathek();
            this.props.fileManagerDidUpdate(false)
        }
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

    getMediathek(page = 1, is_select = false) {
        let formData = {
            'method': 'get_filemanager_media',
            'is_select': is_select,
            'options': JSON.stringify(this.props.options),
            'page': page,
            'user': this.state.user,
            'type': this.state.type,
            'category': this.state.category,
            'search': this.state.search
        }

        this.sendAxiosFormdata(formData).then()
    }

    onUpdateCopied(type) {
        switch (type) {
            case 'url':
                this.setState({
                    showUrlCopied: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showUrlCopied: false,
                    })
                })
                break;
            case 'thumb':
                this.setState({
                    showThumbCopied: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showThumbCopied: false,
                    })
                })
                break;
            case 'medium':
                this.setState({
                    showMediumCopied: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showMediumCopied: false,
                    })
                })
                break;
            case 'large':
                this.setState({
                    showLargeCopied: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showLargeCopied: false,
                    })
                })
                break;
            case 'large_xl':
                this.setState({
                    showLargeXlCopied: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showLargeXlCopied: false,
                    })
                })
                break;
        }

    }

    setIsLoadedImg(e) {
        let query = $(e).prev();
        if (query.length) {
            query.removeClass('img-load-wait')
        }
    }

    onChangeSelects(e, type) {
        switch (type) {
            case 'user':
                this.setState({
                    user: e
                })
                break;
            case 'search':
                this.setState({
                    search: e
                })
                break;
            case 'category':
                this.setState({
                    category: e
                })
                break;
            case 'type':
                this.setState({
                    type: e
                })
                break;
        }

        sleep(150).then(() => {
            this.getMediathek(1, true);
        })

    }

    onSetChecked(e, id) {
        if (e.target.checked === true) {
            if (!this.state.options.multiSelect) {
                this.setState({
                    checked: [{
                        id: id
                    }]
                })
            } else {
                if (this.state.checked.length < this.state.options.maxSelect) {
                    this.setState({
                        checked: [...this.state.checked, {
                            'id': id
                        }]
                    })
                }
            }
        } else {
            this.setState({
                checked: this.filterArrayElementById([...this.state.checked], id)
            })
        }
    }

    onGetChecked(id) {
        return !!this.findArrayElementById([...this.state.checked], id);
    }

    onGetDataDetails(e, id) {
        if ($(e.target).hasClass('form-check-input')) {
            return false;
        }
        if (this.state.selected === id) {
            this.setState({
                selected: 0,
                selectedData: {}
            })
        } else {
            this.setState({
                selectedData: this.findArrayElementById([...this.state.files], id),
                selected: id
            })
        }
    }

    onUpdateMediaFile(e, type) {
        let upd = this.state.selectedData;
        upd[type] = e;
        this.setState({
            selectedData: upd
        })

        sleep(150).then(() => {
            this.onSetUpdateMediaFile()
        })
    }

    onSetUpdateMediaFile() {

        this.setState({
            showAjaxWait: true,
            ajaxMsg: '',
        })
        let _this = this;
        clearTimeout(this.mediaUpdTimeOut);
        this.accountUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_media_file',
                'id': _this.state.selectedData.id,
                'title': _this.state.selectedData.title,
                'description': _this.state.selectedData.description,
                'labelling': _this.state.selectedData.labelling,
                'alt': _this.state.selectedData.alt,
            }
            _this.sendAxiosFormdata(formData).then()
        }, 1000);
    }

    async sendAxiosFormdata(formData, url = fmSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, false, fmSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_filemanager_media':
                            if (data.status) {
                                if (data.next_page) {
                                    let files = [...this.state.files];
                                    data.record.map((d, index) => {
                                        files.push(d)
                                    })
                                    this.setState({
                                        next: data.next,
                                        files: files,
                                        loaded: data.loaded,
                                    })
                                } else {
                                    this.setState({
                                        // total: data.total,
                                        next: data.next,
                                        loaded: data.loaded,
                                        files: data.record,
                                    })
                                    if (!data.is_select) {
                                        this.setState({
                                            total: data.total,
                                            category_selects: data.category_selects,
                                            types_select: data.types_select,
                                            user_selects: data.user_selects,
                                            urls: data.urls,
                                            selected: 0,
                                            options: {
                                                multiSelect: data.options.multiSelect,
                                                maxSelect: data.options.maxSelect || 1000
                                            },
                                        })
                                    }
                                }
                                this.props.setFileManagerShow(true)
                            } else {
                                this.setState({
                                    files: [],
                                    next: false

                                })
                                AppTools.warning_message(data.msg)
                            }
                            break;
                        case 'update_media_file':
                            this.setState({
                                showAjaxWait: false,
                                ajaxStatus: data.status,
                                ajaxMsg: data.msg
                            })
                            break;
                    }
                })
        }
    }

    onSendFileManagerSelects() {
        let selectedArr = [];
        const allFiles = [...this.state.files]
        this.state.checked.map((s, index) => {
            let find = this.findArrayElementById(allFiles, s.id);
            if (find) {
                selectedArr.push(find);
            }
        })
        this.props.setFileManagerShow(false)
        this.props.fileManagerCallback(selectedArr)
    }


    render() {

        return (
            <Modal
                show={this.props.fileManagerShow}
                onHide={() => this.props.setFileManagerShow(false)}
                centered
                //dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                //scrollable={false}
                fullscreen
            >
                <Modal.Header className="bg-body-tertiary position-relative fm-modal-header align-items-baseline"
                              closeButton>
                    <div className="d-flex w-100 flex-column">
                        <Modal.Title className="fs-5 d-flex align-items-center">
                            <span className="me-2"> {trans['fm']['Filemanager']}:</span>
                            <span className="fw-light">
                            {this.props.options.fmTitle || ''}
                        </span>
                            {this.state.checked.length > 0 ?
                                <span className="fw-light ms-2 text-muted small">
                                ( {this.state.checked.length} {this.state.checked.length === 1 ? trans['fm']['File selected'] : trans['fm']['Files selected']} )
                            </span> : ''}
                            <div
                                className={`ajax-spinner ms-2 text-muted ${this.state.showAjaxWait ? 'wait' : ''}`}></div>
                            <span className="fs-6 fw-normal small">
                            <SetAjaxResponse
                                status={this.state.ajaxStatus}
                                msg={this.state.ajaxMsg}
                            />
                            </span>
                        </Modal.Title>
                        <Row className="gx-1 mt-2 gy-1">
                            <Col xs={12} lg={6} xl={3}>
                                <FloatingLabel
                                    controlId={uuidv5('fmSearch', v5NameSpace)}
                                    label={trans['fm']['Search']}
                                >
                                    <Form.Control
                                        type="text"
                                        className="no-blur"
                                        value={this.state.search || ''}
                                        onChange={(e) => this.onChangeSelects(e.target.value, 'search')}
                                        //disabled={this.state.files.length < 1}
                                        placeholder={trans['fm']['Search']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} lg={6} xl={3}>
                                <FloatingLabel
                                    controlId={uuidv5('catSelect', v5NameSpace)}
                                    label={trans['medien']['Category']}>
                                    <Form.Select
                                        aria-label={trans['medien']['Category']}
                                        className="no-blur"
                                        value={this.state.category || ''}
                                        onChange={(e) => this.onChangeSelects(e.target.value, 'category')}
                                        disabled={this.state.category_selects.length < 3}
                                    >
                                        {this.state.category_selects.map((cat, index) =>
                                            <option value={cat.id} key={index}>{cat.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} lg={6} xl={3}>
                                <FloatingLabel
                                    controlId={uuidv5('typeSelect', v5NameSpace)}
                                    label={trans['medien']['File type']}>
                                    <Form.Select
                                        aria-label={trans['medien']['File type']}
                                        className="no-blur"
                                        value={this.state.type || ''}
                                        onChange={(e) => this.onChangeSelects(e.target.value, 'type')}
                                        disabled={this.state.types_select.length < 3}
                                    >
                                        {this.state.types_select.map((cat, index) =>
                                            <option value={cat.id} key={index}>{cat.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            {fmSettings.su ? (
                                <Col xs={12} lg={6} xl={3}>
                                    <FloatingLabel
                                        controlId={uuidv5('userSelect', v5NameSpace)}
                                        label={trans['media']['Owner']}>
                                        <Form.Select
                                            aria-label={trans['media']['Owner']}
                                            className="no-blur"
                                            value={this.state.user || ''}
                                            onChange={(e) => this.onChangeSelects(e.target.value, 'user')}
                                            disabled={this.state.user_selects.length < 3}
                                        >
                                            {this.state.user_selects.map((us, index) =>
                                                <option value={us.id} key={index}>{us.label}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            ) : ''}
                        </Row>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col className="fm-body-items" xs={12} xxl={10} xl={8} lg={6}>
                            <div className="fm-grid">
                                {this.state.files.map((f, index) => {
                                    return (
                                        <div title={f.original} key={index}

                                             className={`fm-grid-item cursor-pointer position-relative ${this.state.selected === f.id ? 'item-selected' : ''}`}>
                                            <div style={{zIndex: 10}}
                                                 className="position-absolute ms-3 mt-2 top-0 start-0">
                                                <Form.Check
                                                    className="no-blur check-fm"
                                                    type="checkbox"
                                                    checked={this.onGetChecked(f.id)}
                                                    onChange={(e) => this.onSetChecked(e, f.id)}
                                                    id={uuidv4()}
                                                    label={""}
                                                />
                                            </div>
                                            {this.state.urls.liip_extensions.includes(f.extension) ?
                                                <React.Fragment>
                                                    <div className="img-load-wait"></div>
                                                    <img onClick={(e) => this.onGetDataDetails(e, f.id)}
                                                         alt={f.original}
                                                         src={`${this.state.urls.thumb_url}/${f.fileName}`}
                                                         onLoad={(e) => this.setIsLoadedImg(e.target)}
                                                         className="fm-grid-img"/>

                                                </React.Fragment>
                                                : (
                                                    <React.Fragment>
                                                        {f.extension === 'svg' ?
                                                            <React.Fragment>
                                                                <div
                                                                    onClick={(e) => this.onGetDataDetails(e, f.id)}
                                                                    className="w-100 h-100 d-flex align-items-center">
                                                                    <img alt={f.original}
                                                                         onClick={(e) => this.onGetDataDetails(e, f.id)}
                                                                         src={`${this.state.urls.media_url}/${f.fileName}`}
                                                                         className="fm-grid-img"/>
                                                                </div>

                                                            </React.Fragment> :
                                                            <React.Fragment>
                                                                <div
                                                                    onClick={(e) => this.onGetDataDetails(e, f.id)}
                                                                    className="w-100 h-100 d-flex align-items-center mb-4">
                                                                    <div
                                                                        className="w-100">
                                                                        <div style={{fontSize: '50px'}}
                                                                             className={`fm-grid-img opacity-50 d-block text-muted  text-center bs-file-file file ext_${f.extension}`}>
                                                                        </div>
                                                                        <div
                                                                            className="position-absolute bottom-0 overflow-hidden start-0 w-100 bg-body-secondary bg-opacity-50 p-2 text-truncate">
                                                                            {f.original}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                                )}
                                        </div>
                                    )
                                })}
                            </div>
                            <hr/>
                            {
                                this.state.next ?
                                    <div className="text-center my-2">
                                        <small className="text-muted small-lg d-block my-2">
                                                    <span
                                                        className="me-1">{this.state.files.length}/{this.state.total}</span>
                                            {trans['fm']['loaded']}
                                        </small>
                                        <button
                                            onClick={() => this.getMediathek(this.state.next)}
                                            type="button"
                                            className="btn btn-switch-blue dark btn-sm">
                                            {trans['fm']['Load more']} {`(${this.state.total - this.state.loaded})`}
                                        </button>
                                    </div>
                                    : <small className="text-muted text-center small-lg d-block my-2">
                                        <span className="me-1">{this.state.files.length}/{this.state.total}</span>
                                        {trans['fm']['loaded']}
                                    </small>
                            }
                        </Col>

                        <Col xs={12} xxl={2} xl={4} lg={6}>
                            {this.state.selectedData.id ?
                                <React.Fragment>
                                    <Row className="g-2 text-body px-lg-1">
                                        <Col className="small" xs={12}>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['Uploaded on']}: </span>
                                                {this.state.selectedData.created_de}
                                            </span>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['last editing']}: </span>
                                                {this.state.selectedData.last_modified_de}
                                            </span>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['Uploaded from']}: </span>
                                                {this.state.selectedData.user.email}
                                            </span>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['Category']}: </span>
                                                {this.state.selectedData.category.designation}
                                            </span>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['File name']}: </span>
                                                {this.state.selectedData.original}
                                            </span>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['File type']}: </span>
                                                {this.state.selectedData.mime}
                                            </span>
                                            <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['File size']}: </span>
                                                {this.state.selectedData.file_size}
                                            </span>
                                            {this.state.urls.liip_extensions.includes(this.state.selectedData.extension) ?
                                                <span className="text-truncate d-block">
                                                <span
                                                    style={{minWidth: '8rem'}}
                                                    className="fw-semibold d-inline-block">{trans['fm']['Dimensions']}: </span>
                                                    {this.state.selectedData.sizeData.width} {trans['fm']['to']} {this.state.selectedData.sizeData.height} {trans['fm']['Pixel']}
                                            </span>
                                                : ''}
                                        </Col>
                                        <hr className="mb-1"/>
                                        <Col xs={12}>
                                            <Form.Control
                                                className="no-blur"
                                                id={uuidv5('fmTitle', v5NameSpace)}
                                                type="text"
                                                size="sm"
                                                value={this.state.selectedData.title || ''}
                                                onChange={(e) => this.onUpdateMediaFile(e.target.value, 'title')}
                                                aria-label={trans['fm']['Title']}
                                                placeholder={trans['fm']['Title']}/>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Control
                                                className="no-blur"
                                                id={uuidv5('fmAlt', v5NameSpace)}
                                                type="text"
                                                size="sm"
                                                value={this.state.selectedData.alt || ''}
                                                onChange={(e) => this.onUpdateMediaFile(e.target.value, 'alt')}
                                                aria-label={trans['fm']['Alternative text']}
                                                placeholder={trans['fm']['Alternative text']}/>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Control
                                                id={uuidv5('fmLabelling', v5NameSpace)}
                                                className="no-blur"
                                                size="sm"
                                                value={this.state.selectedData.labelling || ''}
                                                onChange={(e) => this.onUpdateMediaFile(e.target.value, 'labelling')}
                                                aria-label={trans['fm']['Labelling']}
                                                // as="textarea" rows={2}
                                                placeholder={trans['fm']['Labelling']}/>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Control
                                                id={uuidv5('fmDescription', v5NameSpace)}
                                                className="no-blur"
                                                size="sm"
                                                value={this.state.selectedData.description || ''}
                                                onChange={(e) => this.onUpdateMediaFile(e.target.value, 'description')}
                                                aria-label={trans['fm']['Description']}
                                                as="textarea" rows={2}
                                                placeholder={trans['fm']['Description']}/>
                                        </Col>
                                        <Col xs={11}>
                                            <Form.Group
                                                controlId={uuidv5('fmFullUrl', v5NameSpace)}>
                                                <Form.Label
                                                    className="mb-0 small-lg text-muted"
                                                >
                                                    {trans['fm']['File URL']}
                                                </Form.Label>

                                                <Form.Control
                                                    className="no-blur"
                                                    type="text"
                                                    readOnly
                                                    size="sm"
                                                    defaultValue={`${fmSettings.base_url}/${fmSettings.public_mediathek}/${this.state.selectedData.fileName}`}
                                                    disabled={true}/>
                                            </Form.Group>
                                        </Col>
                                        <Col className="position-relative" xs={1}>
                                            <div className="position-absolute mb-1 bottom-0">
                                                <CopyToClipboard
                                                    text={`${fmSettings.base_url}/${fmSettings.public_mediathek}/${this.state.selectedData.fileName}`}
                                                    onCopy={() => this.onUpdateCopied('url')}>
                                                    <i title={trans['system']['Copy']}
                                                       className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                                </CopyToClipboard>
                                                <span style={{top: '-1.5rem', left: '-1rem'}}
                                                      className={`small-lg copy-client copied position-absolute  ms-1 text-danger ${this.state.showUrlCopied ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                            </div>
                                        </Col>
                                        {this.state.urls.liip_extensions.includes(this.state.selectedData.extension) ? (
                                            <React.Fragment>
                                                <Col className="gy-0" xs={11}>
                                                    <Form.Group
                                                        controlId={uuidv5('fmThumbUrl', v5NameSpace)}>
                                                        <Form.Label
                                                            className="mb-0 small-lg text-muted"
                                                        >
                                                            {trans['fm']['Thumbnail URL']} (<small>webp</small>)
                                                        </Form.Label>

                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            readOnly
                                                            size="sm"
                                                            defaultValue={`${fmSettings.thumb_url}/${this.state.selectedData.fileName}`}
                                                            disabled={true}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col className="position-relative" xs={1}>
                                                    <div className="position-absolute mb-1 bottom-0">
                                                        <CopyToClipboard
                                                            text={`${fmSettings.thumb_url}/${this.state.selectedData.fileName}`}
                                                            onCopy={() => this.onUpdateCopied('thumb')}>
                                                            <i title={trans['system']['Copy']}
                                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                                        </CopyToClipboard>
                                                        <span style={{top: '-1.5rem', left: '-1rem'}}
                                                              className={`small-lg copy-client copied position-absolute  ms-1 text-danger ${this.state.showThumbCopied ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                                    </div>
                                                </Col>
                                                <Col className="gy-0" xs={11}>
                                                    <Form.Group
                                                        controlId={uuidv5('fmMediumUrl', v5NameSpace)}>
                                                        <Form.Label
                                                            className="mb-0 small-lg text-muted"
                                                        >
                                                            {trans['fm']['Medium URL']} (<small>webp</small>)
                                                        </Form.Label>

                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            readOnly
                                                            size="sm"
                                                            defaultValue={`${fmSettings.medium_url}/${this.state.selectedData.fileName}`}
                                                            disabled={true}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col className="position-relative" xs={1}>
                                                    <div className="position-absolute mb-1 bottom-0">
                                                        <CopyToClipboard
                                                            text={`${fmSettings.medium_url}/${this.state.selectedData.fileName}`}
                                                            onCopy={() => this.onUpdateCopied('medium')}>
                                                            <i title={trans['system']['Copy']}
                                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                                        </CopyToClipboard>
                                                        <span style={{top: '-1.5rem', left: '-1rem'}}
                                                              className={`small-lg copy-client copied position-absolute  ms-1 text-danger ${this.state.showMediumCopied ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                                    </div>
                                                </Col>
                                                <Col className="gy-0" xs={11}>
                                                    <Form.Group
                                                        controlId={uuidv5('fmLargeUrl', v5NameSpace)}>
                                                        <Form.Label
                                                            className="mb-0 small-lg text-muted"
                                                        >
                                                            {trans['fm']['Large URL']} (<small>webp</small>)
                                                        </Form.Label>

                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            readOnly
                                                            size="sm"
                                                            defaultValue={`${fmSettings.large_url}/${this.state.selectedData.fileName}`}
                                                            disabled={true}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col className="position-relative" xs={1}>
                                                    <div className="position-absolute mb-1 bottom-0">
                                                        <CopyToClipboard
                                                            text={`${fmSettings.large_url}/${this.state.selectedData.fileName}`}
                                                            onCopy={() => this.onUpdateCopied('large')}>
                                                            <i title={trans['system']['Copy']}
                                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                                        </CopyToClipboard>
                                                        <span style={{top: '-1.5rem', left: '-1rem'}}
                                                              className={`small-lg copy-client copied position-absolute  ms-1 text-danger ${this.state.showLargeCopied ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                                    </div>
                                                </Col>
                                                <Col className="gy-0" xs={11}>
                                                    <Form.Group
                                                        controlId={uuidv5('fmLargeXlUrl', v5NameSpace)}>
                                                        <Form.Label
                                                            className="mb-0 small-lg text-muted"
                                                        >
                                                            {trans['fm']['Large XL URL']} (<small>webp</small>)
                                                        </Form.Label>

                                                        <Form.Control
                                                            className="no-blur"
                                                            type="text"
                                                            readOnly
                                                            size="sm"
                                                            defaultValue={`${fmSettings.large_xl_url}/${this.state.selectedData.fileName}`}
                                                            disabled={true}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col className="position-relative" xs={1}>
                                                    <div className="position-absolute mb-1 bottom-0">
                                                        <CopyToClipboard
                                                            text={`${fmSettings.large_xl_url}/${this.state.selectedData.fileName}`}
                                                            onCopy={() => this.onUpdateCopied('large_xl')}>
                                                            <i title={trans['system']['Copy']}
                                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                                        </CopyToClipboard>
                                                        <span style={{top: '-1.5rem', left: '-1rem'}}
                                                              className={`small-lg copy-client copied position-absolute  ms-1 text-danger ${this.state.showLargeXlCopied ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                                    </div>
                                                </Col>
                                            </React.Fragment>
                                        ) : ''}
                                    </Row>

                                </React.Fragment> : <div className="text-center text-muted fs-5 p-3">
                                    {trans['fm']['No file selected']}
                                </div>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => this.props.setFileManagerShow(false)}
                        variant="secondary dark">
                        {trans['swal']['Close']}
                    </Button>
                    <Button
                        onClick={this.onSendFileManagerSelects}
                        disabled={this.state.checked.length < 1}
                        variant="switch-blue dark">
                        {this.props.options.fmButtonTxt || trans['fm']['Select and close']}
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}