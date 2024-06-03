import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';

const v5NameSpace = 'a9d8af8c-16d7-4370-a5eb-d08f5c84d9d7';
export default class PluginSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {
            allCol: true,
            savedCol: false,
            medienCol: false,
            structureCol: false,
            loopCol: false,
            categoryCol: false,
            contentsCol: false
        }

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.toggleElementsAll){
            this.onToggleCollapse('all')
            this.props.onSetToggleElementsAll(false)
        }
    }

    onToggleCollapse(target) {
        let all = false;
        let saved = false;
        let medien = false;
        let structure = false;
        let loop = false;
        let category = false;
        let content = false;
        switch (target) {
            case 'all':
                all = true;
                break;
            case 'saved':
                saved = true;
                break;
            case 'content':
                 content = true;
                break;
            case 'medien':
                medien = true;
                break;
            case 'structure':
                 structure = true;
                break;
            case 'loop':
                 loop = true;
                break;
            case 'category':
                  category = true;
                break;
        }

        this.setState({
            allCol: all,
            savedCol: saved,
            medienCol: medien,
            structureCol: structure,
            loopCol: loop,
            categoryCol: category,
            contentsCol: content
        })
    }

    render() {

        return (
            <>
                <Modal className="form-builder-modal"
                       animation={true}
                       scrollable={true}
                       show={this.props.showPluginModal}
                       onHide={() => this.props.setShowPluginModal(false)}
                       size="xl"
                >
                    <Modal.Header className="bg-body-tertiary pb-2 fs-6 align-items-start text-body" closeButton>
                        <div className="d-flex flex-column w-100">
                            <Modal.Title>
                                <i className="bi bi-node-plus me-2"></i>
                                {trans['plugins']['Add element']}
                            </Modal.Title>
                            <div>
                                <hr className="mb-2 mt-2"/>
                                <div className="d-flex align-items-center">
                                    <button
                                        onClick={() => this.onToggleCollapse('all')}
                                        className={`btn btn-switch-blue-outline me-1 dark btn-sm ${this.state.allCol ? 'active' : ''}`}>
                                        {trans['All']}
                                    </button>
                                    <button
                                        onClick={() => this.onToggleCollapse('content')}
                                        className={`btn btn-switch-blue-outline me-1 dark btn-sm ${this.state.contentsCol ? 'active' : ''}`}>
                                        {trans['plugins']['Content']}
                                    </button>
                                    <button
                                        onClick={() => this.onToggleCollapse('medien')}
                                        className={`btn btn-switch-blue-outline me-1 dark btn-sm ${this.state.medienCol ? 'active' : ''}`}>
                                        {trans['medien']['Media']}
                                    </button>
                                    <button
                                        onClick={() => this.onToggleCollapse('structure')}
                                        className={`btn btn-switch-blue-outline me-1 dark btn-sm ${this.state.structureCol ? 'active' : ''}`}>
                                        {trans['plugins']['Structure']}
                                    </button>
                                    {this.props.builderType === 'loop' || this.props.builderType === 'post'  ?
                                        <button
                                            onClick={() => this.onToggleCollapse('loop')}
                                            className={`btn btn-switch-blue-outline me-1 dark btn-sm ${this.state.loopCol ? 'active' : ''}`}>
                                            {trans['posts']['Post']}
                                        </button>
                                        : ''}
                                    {this.props.builderType !== 'loop' ? '': ''}
                                        <button
                                            onClick={() => this.onToggleCollapse('category')}
                                            className={`btn btn-switch-blue-outline me-1 dark btn-sm ${this.state.categoryCol ? 'active' : ''}`}>
                                            {trans['posts']['Post category']}
                                        </button>

                                    <div className="ms-auto">
                                        <button
                                            onClick={() => this.onToggleCollapse('saved')}
                                            className={`btn btn-switch-blue-outline dark btn-sm ${this.state.savedCol ? 'active' : ''}`}>
                                            <i title={trans['Saved']} className="bi bi-cloud-download"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Collapse in={this.state.allCol}>
                            <div id={uuidv5('collapseAll', v5NameSpace)}>
                                <div className="modal-forms-grid">
                                    {this.props.plugins.map((plugin, fIndex) => {
                                        return (
                                            <div onClick={() => this.props.onSetPlugin(plugin.type)}
                                                 className="forms-item bg-body-tertiary" key={fIndex}>
                                                <i className={plugin.icon}></i>
                                                <div className="item-name mb-1">
                                                    {plugin.designation}
                                                </div>
                                                <small className="small-lg text-muted pb-2 lh-12">
                                                    {plugin.description}
                                                </small>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.contentsCol}>
                            <div id={uuidv5('collapseContents', v5NameSpace)}>
                                <div className="modal-forms-grid">
                                    {this.props.content.map((plugin, fIndex) => {
                                        return (
                                            <div onClick={() => this.props.onSetPlugin(plugin.type)}
                                                 className="forms-item bg-body-tertiary" key={fIndex}>
                                                <i className={plugin.icon}></i>
                                                <div className="item-name mb-1">
                                                    {plugin.designation}
                                                </div>
                                                <small className="small-lg text-muted pb-2 lh-12">
                                                    {plugin.description}
                                                </small>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.medienCol}>
                            <div id={uuidv5('collapseMedien', v5NameSpace)}>
                                <div className="modal-forms-grid">
                                    {this.props.medien.map((plugin, fIndex) => {
                                        return (
                                            <div onClick={() => this.props.onSetPlugin(plugin.type)}
                                                 className="forms-item bg-body-tertiary" key={fIndex}>
                                                <i className={plugin.icon}></i>
                                                <div className="item-name mb-1">
                                                    {plugin.designation}
                                                </div>
                                                <small className="small-lg text-muted pb-2 lh-12">
                                                    {plugin.description}
                                                </small>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        </Collapse>
                        <Collapse in={this.state.structureCol}>
                            <div id={uuidv5('collapseStructure', v5NameSpace)}>
                                <div className="modal-forms-grid">
                                    {this.props.structure.map((plugin, fIndex) => {
                                        return (
                                            <div onClick={() => this.props.onSetPlugin(plugin.type)}
                                                 className="forms-item bg-body-tertiary" key={fIndex}>
                                                <i className={plugin.icon}></i>
                                                <div className="item-name mb-1">
                                                    {plugin.designation}
                                                </div>
                                                <small className="small-lg text-muted pb-2 lh-12">
                                                    {plugin.description}
                                                </small>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        </Collapse>
                        <Collapse in={this.state.loopCol}>
                            <div id={uuidv5('collapseLoop', v5NameSpace)}>
                                {this.props.loop  && this.props.loop.plugins  ?
                                <div className="modal-forms-grid">
                                    {this.props.loop.plugins.map((plugin, fIndex) => {
                                        return (
                                            <div onClick={() => this.props.onSetPlugin(plugin.type)}
                                                 className="forms-item bg-body-tertiary" key={fIndex}>
                                                <i className={plugin.icon}></i>
                                                <div className="item-name mb-1">
                                                    {plugin.designation}
                                                </div>
                                                <small className="small-lg text-muted pb-2 lh-12">
                                                    {plugin.description}
                                                </small>
                                            </div>
                                        )
                                    })}
                                </div> : ''}

                            </div>
                        </Collapse>
                        <Collapse in={this.state.categoryCol}>
                            <div id={uuidv5('collapsePostCat', v5NameSpace)}>
                                {this.props.category  && this.props.category.plugins  ?
                                    <div className="modal-forms-grid">
                                        {this.props.category.plugins.map((plugin, fIndex) => {
                                            return (
                                                <div onClick={() => this.props.onSetPlugin(plugin.type)}
                                                     className="forms-item bg-body-tertiary" key={fIndex}>
                                                    <i className={plugin.icon}></i>
                                                    <div className="item-name mb-1">
                                                        {plugin.designation}
                                                    </div>
                                                    <small className="small-lg text-muted pb-2 lh-12">
                                                        {plugin.description}
                                                    </small>
                                                </div>
                                            )
                                        })}
                                    </div> : ''}

                            </div>
                        </Collapse>

                        <Collapse in={this.state.savedCol}>
                            <div id={uuidv5('collapseSaved', v5NameSpace)}>
                                <div className="fs-5">
                                    {trans['plugins']['Saved elements']}
                                </div>
                                <hr/>
                                {this.props.savedElm.length ?
                                    <div className="modal-forms-grid">
                                        {this.props.savedElm.map((saved, fIndex) => {
                                            return (
                                                <div onClick={() => this.props.onSetSavedElement(saved.id)}
                                                     className="forms-item bg-body-tertiary" key={fIndex}>
                                                    <i className={saved.icon}></i>
                                                    <small className="small text-muted pb-2 lh-12">
                                                        {saved.designation}
                                                    </small>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    :
                                    <div className="text-danger fs-5">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {trans['plugins']['No elements available']}
                                    </div>
                                }
                            </div>
                        </Collapse>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => this.props.setShowPluginModal(false)}>
                            {trans['swal']['Cancel']}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}