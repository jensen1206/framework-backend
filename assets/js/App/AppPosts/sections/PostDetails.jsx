import * as React from "react";
import PostOffcanvas from "./PostOffcanvas";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal"
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';

const v5NameSpace = '9899f164-68d5-4f56-bdb6-7bb0bd57de09';

import PostEditor from "./PostEditor";
import PostGallery from "./PostGallery";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
//import SiteFormBuilder from "./SiteFormBuilder";

export default class PostDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            showSiteOffcanvas: false,
            didUpdateManager: false,
            fileManagerShow: false,
            showEditor: false,
            showFormBuilder: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },

        }

        this.onSetShowOffcanvas = this.onSetShowOffcanvas.bind(this);

        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);

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
            this.props.onSetPost(files[0]['fileName'], 'siteImg')
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

    onSetShowOffcanvas(state) {
        this.setState({
            showSiteOffcanvas: state
        })
    }

    onToggleCollapse(target) {
        let editor = false;
        let builder = false;
        switch (target) {
            case 'editor':
                editor = true;
                break;
            case 'builder':
                builder = true;
                break;
        }
        this.setState({
            showEditor: editor,
            showFormBuilder: builder,
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="d-flex align-items-center  flex-wrap">
                        <button
                            onClick={() => this.props.onToggleSiteCollapse('table', true)}
                            className="btn btn-warning-custom btn-sm me-1 dark">
                            <i className="bi bi-reply-all me-2"></i>
                            {trans['to overview']}
                        </button>

                        <button
                            onClick={() => this.setState({showSiteOffcanvas: true})}
                            type="button" className="btn btn-switch-blue dark ms-auto my-1">
                            <i className="bi bi-tools"></i>
                        </button>
                    </div>
                    <hr className="mb-2"/>
                    <div className="d-flex align-items-center flex-wrap">
                        <button
                            onClick={() => this.props.onToggleBuilder('builder')}
                            className={`btn btn-switch-blue-outline btn-sm my-1 me-1 dark ${this.props.builderActive ? 'active' : ''}`}>
                            <i className="bi bi-image me-2"></i>
                            {trans['posts']['Post']}
                        </button>
                        <button
                            onClick={() => this.props.onToggleBuilder('gallery')}
                            className={`btn btn-switch-blue-outline btn-sm my-1 me-1 dark ${this.props.galleryActive ? 'active' : ''}`}>
                            <i className="bi bi-image me-2"></i>
                            {trans['Gallery']}
                        </button>
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
                    </div>
                    <PostOffcanvas
                        showSiteOffcanvas={this.state.showSiteOffcanvas}
                        selectSiteStatus={this.props.selectSiteStatus}
                        postLayoutSelect={this.props.postLayoutSelect}
                        selectHeader={this.props.selectHeader}
                        selectFooter={this.props.selectFooter}
                        site={this.props.site}
                        categorySelect={this.props.categorySelect}
                        onSetShowOffcanvas={this.onSetShowOffcanvas}
                        onSetPost={this.props.onSetPost}
                        spinner={this.props.spinner}
                        onSetAppImage={this.onSetAppImage}
                    />

                    <FileMangerModal
                        didUpdateManager={this.state.didUpdateManager}
                        fileManagerShow={this.state.fileManagerShow}
                        options={this.state.fmOptions}
                        fileManagerDidUpdate={this.fileManagerDidUpdate}
                        setFileManagerShow={this.setFileManagerShow}
                        fileManagerCallback={this.fileManagerCallback}
                    />

                    <Collapse in={this.props.builderActive}>
                        <div id={uuidv5('editorCol', v5NameSpace)}>
                            <div className="my-2">
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('designation', v5NameSpace)}
                                        label={`${trans['system']['Title']} *`}
                                    >
                                        <Form.Control
                                            required={true}
                                            value={this.props.title || ''}
                                            onChange={(e) => this.props.onSetSiteSeo(e.currentTarget.value, 'seoTitle')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['system']['Title']}/>
                                    </FloatingLabel>
                                </Col>
                            </div>
                            <PostEditor
                                onSetSite={this.props.onSetPost}
                                site={this.props.site}
                                title={this.props.title || ''}
                            />
                        </div>
                    </Collapse>
                    <Collapse in={this.props.galleryActive}>
                        <div id={uuidv5('colGallery', v5NameSpace)}>
                            <PostGallery
                                onToggleBuilder={this.props.onToggleBuilder}
                                site={this.props.site}
                                onSetPost={this.props.onSetPost}
                                onSetGallerySortable={this.props.onSetGallerySortable}
                            />
                        </div>
                    </Collapse>

                    {/*} <Collapse in={this.props.site.builderActive}>
                    <div id={uuidv5('builderCol', v5NameSpace)}>
                         <SiteFormBuilder
                            builderSelect={this.props.builderSelect}
                            onSetSite={this.props.onSetSite}
                            site={this.props.site}
                            title={this.props.title || ''}
                            addFormBuilderSelect={this.props.addFormBuilderSelect}
                            getFormBuilderData={this.props.getFormBuilderData}
                            onSetFormBuilderData={this.props.onSetFormBuilderData}
                        />
                    </div>
                </Collapse>{*/}
                </div>
            </React.Fragment>
        )
    }

}