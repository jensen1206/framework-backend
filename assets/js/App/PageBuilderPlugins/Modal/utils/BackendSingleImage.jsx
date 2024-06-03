import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v5 as uuidv5} from "uuid";
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";

const v5NameSpace = 'da6aa2de-c59c-11ee-aabf-325096b39f47';
export default class BackendSingleImage extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                fileType: 'image',
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
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
            // console.log(files)
            // let updImg = [...this.props.edit.images];
            let add = [];
            files.map((i, index) => {
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
                add.push(img)
            })
            this.props.onSetImages(add)
            //console.log(add)
            //     this.props.onSetSiteSeo(files[0]['fileName'], 'ogImage')
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
                <div style={{minHeight: '6rem'}}
                     className="d-flex align-items-center justify-content-center">
                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="mb-2">
                            {this.props.edit.designation}
                        </div>
                        {this.props.edit.config.source === 'mediathek' ?
                            <React.Fragment>
                                {this.props.edit.images.length ?
                                    <div className="plugin-image-grid">
                                        {this.props.edit.images.map((i, index) => {
                                            return (
                                                <div key={index} className="plugin-image-grid-item p-1 border rounded">
                                                    <img
                                                        className="rounded"
                                                        width={150}
                                                        height={150}
                                                        src={`${i.type === 'data' ? publicSettings.public_mediathek + '/' + i.fileName : publicSettings.thumb_url + '/' + i.fileName} `}
                                                        alt=""/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    :
                                    <div className="placeholder-account-image p-1 border rounded"></div>
                                }
                                <div className="d-flex align-items-center">
                                    <button
                                        type="button"
                                        onClick={() => this.onSetAppImage('single_image')}
                                        className="btn btn-switch-blue mt-2 me-2 dark btn-sm">
                                        {this.props.edit.images.length ? trans['app']['Change image'] : trans['app']['Select image']}
                                    </button>
                                </div>
                            </React.Fragment>
                            : ''}
                        {this.props.edit.config.source === 'extern' ?
                            <div className="plugin-image-grid">
                                <div className="plugin-image-grid-item p-1 border rounded">
                                    <img
                                        style={{objectFit: 'cover'}}
                                        className="rounded"
                                        width={150}
                                        height={150}
                                        src={`${this.props.edit.config.external_url}`}
                                        alt=""/>
                                </div>
                            </div>
                            : '' }

                    </div>
                </div>
                <hr/>
                <Col xl={6} xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('selectCaption', v5NameSpace)}
                        label={`${trans['plugins']['Caption options']}`}>
                        <Form.Select
                            className="no-blur mb-2"
                            required={false}
                            value={this.props.edit.config.caption_type || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'caption_type')}
                            aria-label={trans['plugins']['Caption options']}>
                            {this.props.edit.options.caption.map((s, index) =>
                                <option value={s.id} key={index}>{s.label}</option>
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col xs={12}>

                    <FloatingLabel
                        controlId={uuidv5('indCaption', v5NameSpace)}
                        label={`${trans['plugins']['Caption']}`}
                    >
                        <Form.Control
                            disabled={this.props.edit.config.caption_type !== 'individuell'}
                            required={false}
                            value={this.props.edit.config.custom_caption || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'custom_caption')}
                            className="no-blur"
                            as="textarea"
                            style={{height: '100x'}}
                            placeholder={trans['plugins']['Caption']}/>
                    </FloatingLabel>
                    <div className="form-text mb-2">
                        {trans['carousel']['HTML can be used']}
                    </div>
                </Col>
                <Col  xs={12}>
                    <FloatingLabel
                        controlId={uuidv5('customLink', v5NameSpace)}
                        label={`${trans['plugins']['Custom link']}`}
                    >
                        <Form.Control
                            required={false}
                            disabled={this.props.edit.config.action !== 'custom' || false}
                            defaultValue={this.props.edit.config.custom_link || ''}
                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'custom_link')}
                            className="no-blur mb-2"
                            type="text"
                            placeholder={trans['plugins']['Custom link']}/>
                    </FloatingLabel>
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