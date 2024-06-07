import * as React from "react";


import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader} from "react-bootstrap";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../AppComponents/AppTools";
import {randInteger} from "../../AppComponents/AppTools";
import {ReactSortable} from "react-sortablejs";

const v5NameSpace = '61c7afb8-3e8a-475e-a428-8c8c2ffc2360';
export default class PostGallery extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            showEditor: false,
            showFormBuilder: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: true,
                maxSelect: 100,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
            sortableOptions: {
                animation: 300,
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
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);

        this.onDeleteImage = this.onDeleteImage.bind(this);
        this.onUpdateSortable = this.onUpdateSortable.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.filterArrayElementByImportId = this.filterArrayElementByImportId.bind(this);


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

    filterArrayElementByImportId(array, id) {
        return array.filter((element) => {
            return element.importId !== id;
        })
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
            let arr = [...this.props.site.postGallery];
            let ext = ['jpg', 'jpeg', 'png', 'svg']
            files.map((f, index) => {
                if (ext.includes(f.extension)) {
                    let item = {
                        id: AppTools.randomChar(12),
                        blank: false,
                        action: '',
                        page: '',
                        externer_link: '',
                        fileName: f.fileName,
                        imgId: f.id,
                        type: f.type,
                        attr: f.sizeData.attr,
                        alt: f.alt,
                        labelling: f.labelling,
                        title: f.title,
                        file_size: f.file_size,
                        customCss: f.customCss,
                        description: f.description,
                        original: f.original,
                        urls: f.urls
                    }
                    arr.push(item)
                }
            })

            this.props.onSetPost(arr, 'postGallery')
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

    onDeleteImage(id) {
        let upd = this.filterArrayElementById([...this.props.site.postGallery], id)
        this.props.onSetPost(upd, 'postGallery')
    }

    onUpdateSortable(e) {
        this.props.onSetPost([...this.props.site.postGallery], 'postGallery')
    }

    render() {
        return (
            <React.Fragment>
                <hr className="mt-2 mb-2"/>
                {/*} <button onClick={() => this.props.onToggleBuilder('builder')}
                        className="btn btn-warning-custom me-1 btn-sm dark">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['back']}
                </button> {*/}

                <button onClick={() => this.onSetAppImage('post_gallery')}
                        className="btn btn-success-custom btn-sm dark">
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['system']['Add images']}
                </button>
                <hr className="mt-2"/>
                <Card className="shadow-sm">
                    <CardHeader>
                        {trans['posts']['Post gallery']}
                    </CardHeader>
                    <CardBody>
                        {this.props.site && this.props.site.postGallery && this.props.site.postGallery.length ?
                            <React.Fragment>
                                <ReactSortable
                                    list={this.props.site.postGallery}
                                    handle=".arrow-sortable"
                                    className="fm-grid"
                                    setList={(newState) => this.props.onSetGallerySortable(newState)}
                                    {...this.state.sortableOptions}
                                    onEnd={(e) => this.onUpdateSortable(e)}
                                >
                                    {this.props.site.postGallery.map((g, index) => {
                                        return (
                                            <div
                                                className="fm-grid-item p-1 border d-flex flex-column h-100 justify-content-center position-relative rounded"
                                                key={index}>
                                                {g.type === 'data' ?
                                                    <a href={`${publicSettings.public_mediathek}/${g.fileName}`}
                                                       data-control="slide" className="img-link">
                                                        <img style={{minHeight: '100%'}} height={150} width={150}
                                                             className="rounded"
                                                             src={`${publicSettings.public_mediathek}/${g.fileName}`}
                                                             alt=""/>
                                                    </a>
                                                    :
                                                    <a href={`${publicSettings.large_xl_url}/${g.fileName}`}
                                                       data-control="slide" className="img-link">
                                                        <img className="img-fluid rounded"
                                                             src={`${publicSettings.thumb_url}/${g.fileName}`} alt=""/>
                                                    </a>
                                                }
                                                <i className="cursor-move ms-2 mt-2 text-body arrow-sortable bg-body-tertiary position-absolute bi bi-arrows-move top-0 start-0"></i>
                                                <i onClick={() => this.onDeleteImage(g.id)}
                                                   title={trans['delete']}
                                                   className="text-danger mt-auto pt-2 hover-scale d-inline-block  cursor-pointer bi bi-trash"></i>
                                            </div>
                                        )
                                    })}
                                </ReactSortable>
                            </React.Fragment>
                            :
                            <div className="text-danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['posts']['no images available']}
                            </div>}
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