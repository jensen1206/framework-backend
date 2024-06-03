import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {ReactSortable} from "react-sortablejs";
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";

const v5NameSpace = 'da6aa2de-c59c-11ee-aabf-325096b39f47';
export default class BackendMedienGallery extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            colOverview: true,
            colEdit: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: true,
                fileType: 'image',
                maxSelect: 100,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
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
        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);

        this.onChangePostSelect = this.onChangePostSelect.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onResetMedia = this.onResetMedia.bind(this);

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
            let add = [];
            files.map((i, index) => {
                let img = {
                    id: AppTools.randomChar(12),
                    new_tab: false,
                    action: 'lightbox',
                    lightbox_type: 'slide',
                    show_designation: false,
                    show_description: false,
                    site_id: '',
                    url: '',
                    custom_link: '',
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
                add.push(img)
            })
            this.props.onSetImages(add, true)
            this.setState({
                selectedImage: ''
            })
        }
    }

    onChangePostSelect(id) {
        this.props.onSetStateConfig(id, 'site_id')
        if (id) {
            let formData = {
                'method': 'get_post_gallery',
                'id': id
            }
            this.sendAxiosFormdata(formData).then()
        } else {
            this.props.onSetImages([])
        }
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    if (data.status) {
                        this.props.onSetImages(data.record)
                    }
                }).catch(err => console.error(err));
        }
    }

    onSetAppImage(type) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true
        })
    }

    onResetMedia(e, type) {
        this.props.onSetImages([])
        this.props.onSetStateConfig(e, type)
        this.props.onSetStateConfig('', 'site_id')
    }

    render() {

        return (
            <React.Fragment>
                <div className="w-100">
                    <Collapse in={this.props.overviewSlideModal}>
                        <div id={uuidv5('collapseOverview', v5NameSpace)}>
                            <React.Fragment>
                                {this.props.edit.images.length ?
                                    <React.Fragment>
                                        <ReactSortable
                                            className="image-grid-plugin"
                                            list={this.props.edit.images}
                                            handle=".arrow-sortable"
                                            setList={(newState) => this.props.onSetSliderSortable(newState)}
                                            {...this.state.sortableOptions}
                                        >
                                            {this.props.edit.images.map((i, index) => {
                                                return (
                                                    <div data-id={i.id} key={index}
                                                         className="image-grid-item p-1 border rounded">
                                                        <img
                                                            className="rounded img-fluid"
                                                            src={`${i.type === 'data' ? publicSettings.public_mediathek + '/' + i.fileName : publicSettings.thumb_url + '/' + i.fileName}`}
                                                            alt={i.title}/>
                                                        <div
                                                            className="d-flex align-items-center justify-content-center mb-0 mt-2">
                                                            <i onClick={() => this.props.onDeleteSliderImage(i.id)}
                                                               className="hover-scale cursor-pointer bi bi-trash text-danger me-2"></i>
                                                            {this.props.edit.config.action === 'individual' ?
                                                                <i onClick={() => this.props.onGetSliderImage(i.id)}
                                                                   className="hover-scale cursor-pointer bi bi-tools text-muted"></i>
                                                                : ''}
                                                        </div>
                                                        {this.props.edit.config.post_type === 'medien' ?
                                                            <div className="position-absolute top-0 mt-2 ms-2 start-0">
                                                                <i className="arrow-sortable bi bi-arrows-move"></i>
                                                            </div> : ''}
                                                    </div>
                                                )
                                            })}
                                        </ReactSortable>
                                    </React.Fragment>
                                    :
                                    <div style={{width: '50px', height: '50px'}}
                                         className="placeholder-account-image p-1 border rounded"></div>
                                }
                            </React.Fragment>
                            <hr className="w-100"/>
                            <button
                                disabled={this.props.edit.config.post_type === 'post'}
                                type="button"
                                onClick={() => this.onSetAppImage('single_image')}
                                className={`btn dark align-self-baseline ${this.props.edit.config.post_type === 'post' ? 'btn-secondary-outline' : 'btn-success-custom'}`}>
                                <i className="bi bi-node-plus me-2"></i>
                                {trans['plugins']['Select images']}
                            </button>
                            <hr className="w-100"/>
                            <div className="mb-2">
                                {trans['gallery']['Select gallery']}
                            </div>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['gallery']['Gallery']}`}>
                                    <Form.Select
                                        className="no-blur mt-2"
                                        required={true}
                                        value={this.props.edit.config.gallery || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'gallery')}
                                        aria-label={trans['gallery']['Gallery']}>
                                        <option value="">{trans['system']['select']}</option>
                                        {this.props.edit.options['gallery-select'].map((s, index) =>
                                            <option value={s.id} key={index}>{s.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <hr className="w-100"/>
                            <div className="mb-2">
                                {trans['gallery']['Gallery view']}
                            </div>
                            <Col xs={12}>
                                <Form.Check
                                    type="checkbox"
                                    inline
                                    checked={this.props.edit.config.show_designation || false}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'show_designation')}
                                    id={uuidv5('checkShowDesignation', v5NameSpace)}
                                    label={trans['gallery']['Show gallery name']}
                                />

                                <Form.Check
                                    type="checkbox"
                                    inline
                                    checked={this.props.edit.config.show_description || false}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'show_description')}
                                    id={uuidv5('checkShowDescription', v5NameSpace)}
                                    label={trans['gallery']['Show gallery description']}
                                />

                            </Col>
                            <hr className="w-100"/>
                            <div className="align-self-baseline">
                                <div className="mb-2">
                                    {trans['gallery']['Gallery type']}
                                </div>
                                <Col xs={12}>
                                    <Form.Check
                                        type="radio"
                                        inline
                                        checked={this.props.edit.config.post_type === 'medien' || false}
                                        onChange={() => this.onResetMedia('medien', 'post_type')}
                                        id={uuidv5('checkMedien', v5NameSpace)}
                                        label={trans['gallery']['Media gallery']}
                                    />
                                    <Form.Check
                                        type="radio"
                                        inline
                                        checked={this.props.edit.config.post_type === 'post' || false}
                                        onChange={() => this.onResetMedia('post', 'post_type')}
                                        id={uuidv5('checkPost', v5NameSpace)}
                                        label={trans['gallery']['Post gallery']}
                                    />
                                </Col>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['gallery']['Select post']}`}>
                                        <Form.Select
                                            className="no-blur mt-2"
                                            disabled={this.props.edit.config.post_type !== 'post'}
                                            required={this.props.edit.config.post_type === 'post'}
                                            value={this.props.edit.config.site_id || ''}
                                            onChange={(e) => this.onChangePostSelect(e.currentTarget.value)}
                                            aria-label={trans['gallery']['Select post']}>
                                            <option value="">{trans['system']['select']}</option>
                                            {this.props.edit.options['posts-select'].map((s, index) =>
                                                <option value={s.id} key={index}>{s.label}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </div>
                            <hr className="w-100"/>
                            <div className="align-self-baseline">
                                <div className="mb-2">
                                    {trans['plugins']['Action on click']}
                                </div>
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
                                    <Form.Check
                                        type="radio"
                                        inline
                                        checked={this.props.edit.config.action === 'individual' || false}
                                        onChange={() => this.props.onSetStateConfig('individual', 'action')}
                                        id={uuidv5('individual', v5NameSpace)}
                                        label={trans['builder']['Individual']}
                                    />
                                </Col>
                            </div>
                            <hr className="w-100"/>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`${trans['gallery']['Lightbox Type']}`}>
                                    <Form.Select
                                        className="no-blur mt-2"
                                        disabled={this.props.edit.config.action !== 'lightbox'}
                                        required={this.props.edit.config.action === 'lightbox'}
                                        value={this.props.edit.config.lightbox_type || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'lightbox_type')}
                                        aria-label={trans['gallery']['Lightbox Type']}>
                                        <option value="">{trans['system']['select']}</option>
                                        <option value="slide">Slide</option>
                                        <option value="single">Single</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} xl={6}></Col>
                        </div>

                    </Collapse>
                    <Collapse in={this.props.editSlideModal}>
                        <div id={uuidv5('collapseEdit', v5NameSpace)}>
                            <button
                                onClick={() => this.props.toggleSliderCollapse('overview')}
                                type="button"
                                className="btn btn-success-custom dark mb-2 btn-sm">
                                <i className="bi bi-reply-all me-2"></i>
                                {trans['back']}
                            </button>
                            <Card>
                                <CardBody>
                                    <Row className="g-2">
                                        <Col xs={12}>
                                            {trans['plugins']['Image settings']}
                                            <hr/>
                                            {this.props.editImage.fileName ?
                                                <div style={{width: '130px', height: '130px'}}>
                                                    <img
                                                        className="rounded img-fluid"
                                                        src={`${this.props.editImage.type === 'data' ? publicSettings.public_mediathek + '/' + this.props.editImage.fileName : publicSettings.thumb_url + '/' + this.props.editImage.fileName}`}
                                                        alt={this.props.editImage.title}/>
                                                </div> : ''}
                                            <hr/>
                                        </Col>
                                        <Col xs={12}>
                                            <div className="mb-2">
                                                {trans['plugins']['Action on click']}
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`${trans['plugins']['Custom link']}`}>
                                                <Form.Select
                                                    className="no-blur"
                                                    value={this.props.editImage.action || ''}
                                                    onChange={(e) => this.props.onSetSliderImage(e.currentTarget.value, 'action', this.props.editImage.id)}
                                                    aria-label={trans['plugins']['Custom link']}>
                                                    {this.props.edit.options.link.map((s, index) =>
                                                        <option value={s.id} key={index}>{s.label}</option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`${trans['gallery']['Lightbox Type']}`}>
                                                <Form.Select
                                                    className="no-blur"
                                                    disabled={this.props.editImage.action !== 'lightbox'}
                                                    required={this.props.editImage.action === 'lightbox'}
                                                    value={this.props.editImage.lightbox_type || ''}
                                                    onChange={(e) => this.props.onSetSliderImage(e.currentTarget.value, 'lightbox_type', this.props.editImage.id)}
                                                    aria-label={trans['gallery']['Lightbox Type']}>
                                                    <option value="">{trans['system']['select']}</option>
                                                    <option value="slide">Slide</option>
                                                    <option value="single">Single</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`${trans['posts']['Post']}`}>
                                                <Form.Select
                                                    className="no-blur"
                                                    disabled={this.props.editImage.action !== 'url'}
                                                    required={this.props.editImage.action === 'url'}
                                                    value={this.props.editImage.site_id || ''}
                                                    onChange={(e) => this.props.onSetSliderImage(e.currentTarget.value, 'site_id', this.props.editImage.id)}
                                                    aria-label={trans['posts']['Post']}>
                                                    <option value="">{trans['system']['select']}</option>
                                                    {this.props.edit.options['posts-select'].map((s, index) =>
                                                        <option value={s.id} key={index}>{s.label}</option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('customExternalLink', v5NameSpace)}
                                                label={`${trans['plugins']['External URL']}`}
                                            >
                                                <Form.Control
                                                    disabled={this.props.editImage.action !== 'custom'}
                                                    required={this.props.editImage.action === 'custom'}
                                                    value={this.props.editImage.url || ''}
                                                    onChange={(e) => this.props.onSetSliderImage(e.currentTarget.value, 'url', this.props.editImage.id)}
                                                    className="no-blur"
                                                    type="url"
                                                    placeholder={trans['plugins']['External URL']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            {this.props.editImage.action === 'url' || this.props.editImage.action === 'custom'  ?
                                                <Form.Check
                                                    type="checkbox"
                                                    inline
                                                    checked={this.props.editImage.new_tab || false}
                                                    onChange={(e) => this.props.onSetSliderImage(e.currentTarget.checked, 'new_tab', this.props.editImage.id)}
                                                    id={uuidv5('checkShowNewTab', v5NameSpace)}
                                                    label={trans['plugins']['open in new tab']}
                                                />: ''}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                    </Collapse>
                </div>

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