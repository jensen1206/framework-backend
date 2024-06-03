import * as React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import TinyMce from "../../AppComponents/TinyMce";
const reactSwal = withReactContent(Swal);

import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';


const v5NameSpace = '57c8b6ed-3473-4c06-9c1a-479dc280cba7';
export default class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            editorOptions: {
                height: 600,
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
          this.props.onSetSite(content, 'postContent')
      }

    render() {
        return (
            <React.Fragment>

                <div className="iframe-padding">
                    <TinyMce
                        editorCallbackContent={this.editorCallbackContent}
                        initialValue=""
                        content={this.props.site.postContent || ''}
                        editorOptions={this.state.editorOptions}
                    />
                </div>
            </React.Fragment>
        )
    }
}