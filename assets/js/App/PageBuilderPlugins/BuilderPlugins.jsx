import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import PluginSelectModal from "./Modal/PluginSelectModal";
import * as AppTools from "../AppComponents/AppTools";

export default class BuilderPlugins extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            showPluginModal: false,
            toggleElementsAll: false,
            plugins: [],
            medien: [],
            structure: [],
            savedElm: [],
            settings: {},
            loop: [],
            category: [],
            content: [],
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            }
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.setShowPluginModal = this.setShowPluginModal.bind(this);
        this.onSetPlugin = this.onSetPlugin.bind(this);
        this.onSetSavedElement = this.onSetSavedElement.bind(this);

        this.onSetToggleElementsAll = this.onSetToggleElementsAll.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadOverviewModal) {
            this.onGetPlugins()
            this.props.setLoadOverviewModal(false);
        }
    }

    onSetToggleElementsAll(state) {
        this.setState({
            toggleElementsAll: state
        })
    }

    setShowPluginModal(state) {
        this.setState({
            showPluginModal: state
        })
    }

    onGetPlugins() {
        let formData = {
            'method': 'get_plugins',
            'builderType': this.props.builderType || ''
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSetPlugin(type){
        let formData = {
            'method': 'set_builder_plugin',
            'type' : type,
            'group': this.props.loadPlugin.group,
            'grid': this.props.loadPlugin.grid,
            'id': this.props.id
        }

        this.sendAxiosFormdata(formData).then()
    }

    onSetSavedElement(element) {
        let formData = {
            'method': 'set_saved_element',
            'element' : element,
            'group': this.props.loadPlugin.group,
            'grid': this.props.loadPlugin.grid,
            'id': this.props.id
        }
        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_plugins':
                            if (data.status) {
                                this.setState({
                                    plugins: data.record,
                                    loop: data.loop,
                                    category: data.post_category,
                                    medien: data.medien,
                                    content: data.contents,
                                    structure: data.structure,
                                    savedElm: data.saved_elements,
                                    showPluginModal: true,
                                    toggleElementsAll: true
                                })
                            }
                            break;
                        case 'set_builder_plugin':
                            this.setState({
                                showPluginModal: false
                            })
                            this.props.callbackSetPlugin(data.record, data.grid, data.group);
                            break;
                        case 'set_saved_element':
                            this.setState({
                                showPluginModal: false
                            })
                            this.props.callbackSetPlugin(data.record, data.grid, data.group);
                            break;

                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <PluginSelectModal
                    showPluginModal={this.state.showPluginModal}
                    plugins={this.state.plugins}
                    medien={this.state.medien}
                    content={this.state.content}
                    structure={this.state.structure}
                    savedElm={this.state.savedElm}
                    toggleElementsAll={this.state.toggleElementsAll}
                    loop={this.state.loop}
                    category={this.state.category}
                    builderType={this.props.builderType}
                    setShowPluginModal={this.setShowPluginModal}
                    onSetPlugin={this.onSetPlugin}
                    onSetSavedElement={this.onSetSavedElement}
                    onSetToggleElementsAll={this.onSetToggleElementsAll}
                />
            </React.Fragment>
        )
    }
}