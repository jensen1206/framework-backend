import * as React from "react";
import SiteOffcanvas from "./SiteOffcanvas";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal"
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
const v5NameSpace = '9899f164-68d5-4f56-bdb6-7bb0bd57de09';

import SiteEditor from "./SiteEditor";
import SiteFormBuilder from "./SiteFormBuilder";

export default class SiteDetails extends React.Component {
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
            this.props.onSetSite(files[0]['fileName'], 'siteImg')
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
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <button
                        onClick={() => this.props.onToggleSiteCollapse('table', true)}
                        className="btn btn-switch-blue dark">
                        <i className="bi bi-reply-all me-2"></i>
                        {trans['to overview']}
                    </button>
                    <div>
                        <button
                            onClick={() => this.props.onSetSite(false, 'builderActive')}
                            type="button"
                            className={`btn btn-switch-blue-outline btn-sm me-2 dark my-1 ${this.props.site.builderActive ? '' : 'active'}`}>
                            {trans['builder']['Editor']}
                        </button>
                        <button
                            onClick={() => this.props.onSetSite(true, 'builderActive')}
                            type="button"
                            className={`btn btn-switch-blue-outline btn-sm dark my-1 ${this.props.site.builderActive ? 'active' : ''}`}>
                            {trans['builder']['Page-Builder']}
                        </button>
                    </div>
                    <button
                        onClick={() => this.setState({showSiteOffcanvas: true})}
                        type="button" className="btn btn-switch-blue ms-auto- dark my-1">
                        <i className="bi bi-tools"></i>
                    </button>
                </div>
                <hr className="mb-2"/>

                <SiteOffcanvas
                    showSiteOffcanvas={this.state.showSiteOffcanvas}
                    selectSiteStatus={this.props.selectSiteStatus}
                    site={this.props.site}
                    categorySelect={this.props.categorySelect}
                    selectHeader={this.props.selectHeader}
                    selectFooter={this.props.selectFooter}
                    onSetShowOffcanvas={this.onSetShowOffcanvas}
                    onSetSite={this.props.onSetSite}
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

                <Collapse in={!this.props.site.builderActive}>
                    <div id={uuidv5('editorCol', v5NameSpace)}>
                        <SiteEditor
                            onSetSite={this.props.onSetSite}
                            site={this.props.site}
                            title={this.props.title || ''}
                        />
                    </div>
                </Collapse>

                <Collapse in={this.props.site.builderActive}>
                    <div id={uuidv5('builderCol', v5NameSpace)}>
                        <SiteFormBuilder
                            builderSelect={this.props.builderSelect}
                            onSetSite={this.props.onSetSite}
                            site={this.props.site}
                            site_id={this.props.site.id}
                            title={this.props.title || ''}
                            addFormBuilderSelect={this.props.addFormBuilderSelect}
                            getFormBuilderData={this.props.getFormBuilderData}
                            onSetFormBuilderData={this.props.onSetFormBuilderData}
                        />
                    </div>
                </Collapse>

            </React.Fragment>
        )
    }

}