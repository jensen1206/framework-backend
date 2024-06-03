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

const v5NameSpace = 'da6aa2de-c59c-11ee-aabf-325096b39f47';
export default class BackendMedienSlider extends React.Component {
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
                    blank: false,
                    action: '',
                    page: '',
                    externer_link: '',
                    image: i.fileName,
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
                                                            src={`${i.type === 'data' ? publicSettings.public_mediathek + '/' + i.image : publicSettings.thumb_url + '/' + i.image}`}
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
                                                        <div className="position-absolute top-0 mt-2 ms-2 start-0">
                                                            <i className="arrow-sortable bi bi-arrows-move"></i>
                                                        </div>
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
                                type="button"
                                onClick={() => this.onSetAppImage('single_image')}
                                className="btn btn-success-custom dark align-self-baseline">
                                <i className="bi bi-node-plus me-2"></i>
                                {trans['plugins']['Select images']}
                            </button>
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
                            {this.props.edit.config.action === 'lightbox'  ?
                               <React.Fragment>
                                <Form.Check
                                    type="switch"
                                    defaultChecked={this.props.edit.config.lightboxSingle || false}
                                    onChange={(e) => this.props.onSetStateConfig(e.target.checked, 'lightboxSingle')}
                                    id={uuidv4()}
                                    label={trans['builder']['Lightbox single']}
                                />
                                   <hr className="w-100"/>
                               </React.Fragment>
                                : ''}
                            <Row className="g-2">
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('fixedHeight', v5NameSpace)}
                                        label={`${trans['builder']['Fixed image height']}`}
                                    >
                                        <Form.Control
                                            required={true}
                                            value={this.props.edit.config.height || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'height')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['builder']['Fixed image height']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('objectPosition', v5NameSpace)}
                                        label={`${trans['builder']['Object position']}`}
                                    >
                                        <Form.Control
                                            required={true}
                                            value={this.props.edit.config.objectPosition || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'objectPosition')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['builder']['Object position']}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
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
                                            {this.props.editImage.image ?
                                                <div style={{width: '130px', height: '130px'}}>
                                                    <img
                                                        className="rounded img-fluid"
                                                        src={`${this.props.editImage.type === 'data' ? publicSettings.public_mediathek + '/' + this.props.editImage.image : publicSettings.thumb_url + '/' + this.props.editImage.image}`}
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
                                            {/*} <Form.Check
                                                type="radio"
                                                inline
                                                checked={this.props.editImage.action === '' || false}
                                                onChange={() => this.props.onSetSliderImage('', 'action', this.props.editImage.id)}
                                                id={uuidv5('noImgCheckAction', v5NameSpace)}
                                                label={trans['plugins']['No action']}
                                            />
                                            <Form.Check
                                                type="radio"
                                                inline
                                                checked={this.props.editImage.action === 'lightbox' || false}
                                                onChange={() => this.props.onSetSliderImage('lightbox', 'action', this.props.editImage.id)}
                                                id={uuidv5('lightboxImgCheck', v5NameSpace)}
                                                label={trans['medien']['Lightbox']}
                                            />
                                            <Form.Check
                                                type="radio"
                                                inline
                                                checked={this.props.editImage.action === 'extern' || false}
                                                onChange={() => this.props.onSetSliderImage('extern', 'action', this.props.editImage.id)}
                                                id={uuidv5('externImgCheck', v5NameSpace)}
                                                label={trans['plugins']['External URL']}
                                            /> {*/}
                                        </Col>
                                        <Col xl={6} xs={12}></Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`${trans['Page / Article']}`}>
                                                <Form.Select
                                                    required={this.props.editImage && this.props.editImage.action === 'url'}
                                                    disabled={this.props.editImage.action !== 'url'}
                                                    className="no-blur"
                                                    value={this.props.editImage.page || ''}
                                                    onChange={(e) => this.props.onSetSliderImage(e.currentTarget.value, 'page', this.props.editImage.id)}
                                                    aria-label={trans['Page / Article']}>
                                                    <option value="">{trans['system']['select']}...</option>
                                                    {this.props.edit.options.pages.map((s, index) =>
                                                        <option value={s.id} key={index}>{s.label}</option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`${trans['plugins']['External URL']}`}
                                            >
                                                <Form.Control
                                                    required={this.props.editImage && this.props.editImage.action === 'custom'}
                                                    disabled={this.props.editImage.action !== 'custom'}
                                                    defaultValue={this.props.editImage.externer_link || ''}
                                                    onChange={(e) => this.props.onSetSliderImage(e.target.value, 'externer_link', this.props.editImage.id)}
                                                    className="no-blur"
                                                    type="url"
                                                    placeholder={trans['plugins']['External URL']}/>
                                            </FloatingLabel>
                                        </Col>
                                        {this.props.editImage.action === 'custom' || this.props.editImage.action === 'url' ?
                                            <Col xs={12}>
                                                <Form.Check
                                                    type="switch"
                                                    defaultChecked={this.props.editImage.blank || false}
                                                    onChange={(e) => this.props.onSetSliderImage(e.target.checked, 'blank', this.props.editImage.id)}
                                                    id={uuidv4()}
                                                    label={trans['plugins']['open in new tab']}
                                                />
                                            </Col> : ''}
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