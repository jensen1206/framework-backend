import * as React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import TinyMce from "../../AppComponents/TinyMce";
const reactSwal = withReactContent(Swal);

import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';


const v5NameSpace = 'd3e035f8-c2c4-11ee-b28e-325096b39f47';
export default class SiteEditor extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            editorOptions: {
                height: 950,
                menubar: true,
                promotion: false,
                branding: false,
                language: 'de',
                image_advtab: true,
                image_uploadtab: true,
                image_caption: true,
                importcss_append: false,
                browser_spellcheck: true,
                toolbar_sticky: true,
                toolbar_mode: 'wrap',
                statusbar: true,
                draggable_modal: true,
                relative_urls: true,
                remove_script_host: false,
                convert_urls: false,
                content_css: '/css/bs-tiny/bootstrap.min.css',
                //content_css: false,
                valid_elements: '*[*]',
                schema: "html5",
                verify_html: false,
                valid_children: "+a[div], +div[*]",
                extended_valid_elements: "div[*]",
                file_picker_types: 'image',
            }
        }

        this.editorCallbackContent = this.editorCallbackContent.bind(this);
    }
    editorCallbackContent(content) {
        if(this.props.site.builderActive === false) {
            this.props.onSetSite(content, 'siteContent')
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="text-center my-2">
                    <i className="bi bi-chevron-right me-2"></i>
                    {this.props.title}
                    <i className="bi bi-chevron-left ms-2"></i>
                </div>
                <div className="iframe-padding">
                    <TinyMce
                        editorCallbackContent={this.editorCallbackContent}
                        initialValue=""
                        content={this.props.site.siteContent || ''}
                        editorOptions={this.state.editorOptions}
                    />
                </div>
            </React.Fragment>
        )
    }
}