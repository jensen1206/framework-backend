import * as React from "react";
import Spacer from "./utils/Spacer";
import SingleImage from "./utils/SingleImage";
import EditorPlugin from "./utils/EditorPlugin";
import MedienSlider from "./utils/MedienSlider";
import MedienCarousel from "./utils/MedienCarousel";
import DividingLine from "./utils/DividingLine";
import UnfilteredHTML from "./utils/UnfilteredHTML";
import MedienGallery from "./utils/MedienGallery";
import PostTitle from "./utils/PostTitle";
import PostImage from "./utils/PostImage";
import PostExcerpt from "./utils/PostExcerpt";
import PostContent from "./utils/PostContent";
import PostDate from "./utils/PostDate";
import Icon from "./utils/Icon";
import CustomFields from "./utils/CustomFields";
import PluginAccordion from "./utils/PluginAccordion";
import DividingTextLine from "./utils/DividingTextLine";
import Button from "./utils/Button";
export default class PagePlugins extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}

        //  this.onDeletePlugin = this.onDeletePlugin.bind(this);
    }

    onDeletePlugin() {
        let formData = {
            'method': 'delete_plugin',
            'input': this.props.plugin.id,
            'grid': this.props.gridId,
            'group': this.props.groupId,
            'id': this.props.id,

        }
        let swal = {
            'title': `${trans['builder']['Delete element']}?`,
            'msg': trans['builder']['Really delete the element? The deletion cannot be undone.'],
            'btn': trans['builder']['Delete element'],
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    render() {
        return (
            <React.Fragment>
                <div className="forms-input-wrapper">
                    <div className="d-flex- align-items-center justify-content-end">
                        <div className="forms-arrow">
                            <i className="bi bi-arrows-move"></i>
                        </div>
                    </div>
                </div>
                <div className="position-relative">
                    <div className="form-input-field-type">
                        <i className={"me-2 " + (this.props.plugin.icon)}></i>
                        <div className="text-nowrap"> {this.props.plugin.designation}</div>
                    </div>
                    <div className="plugin-content position-relative">
                        {this.props.plugin.type === 'spacer' ?
                             <Spacer plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'single_image' ?
                            <SingleImage plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'tinymce' ?
                            <EditorPlugin plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'button' ?
                            <Button plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'medien-slider' ?
                            <MedienSlider plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'medien-carousel' ?
                            <MedienCarousel plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'medien-gallery' ?
                            <MedienGallery plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'dividing-line' ?
                            <DividingLine plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'unfiltered-html' ?
                            <UnfilteredHTML plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'dividing-with-text' ?
                            <DividingTextLine plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'post-title' ?
                            <PostTitle plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'featured-image' ||
                        this.props.plugin.type === 'post-category-image' ?
                            <PostImage plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'post-excerpt' ?
                            <PostExcerpt plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'icon' ?
                            <Icon plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'custom-fields' ?
                            <CustomFields plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'bs-accordion' ?
                            <PluginAccordion plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'post-content' ||
                        this.props.plugin.type === 'gmaps-api' ||
                        this.props.plugin.type === 'gmaps-iframe' ||
                        this.props.plugin.type === 'osm' ||
                        this.props.plugin.type === 'osm-leaflet' ||
                        this.props.plugin.type === 'post-category' ||
                        this.props.plugin.type === 'post-category-description' ||
                        this.props.plugin.type === 'post-loop' ||
                        this.props.plugin.type === 'post-slider' ||
                        this.props.plugin.type === 'menu' ||
                        this.props.plugin.type === 'forms' ||
                        this.props.plugin.type === 'video' ||
                        this.props.plugin.type === 'post-gallery' ?
                            <PostContent plugin={this.props.plugin}/>
                            : ''}
                        {this.props.plugin.type === 'post-date' ?
                            <PostDate plugin={this.props.plugin}/>
                            : ''}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}