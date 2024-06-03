import * as React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
export default class TinyMce extends React.Component {
    constructor(props) {
        super(props);
        this.editor
        this.props = props;
        this.state = {

        };
        this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    handleEditorChange(value, editor) {
        this.props.editorCallbackContent(value, this.props.handle || '')
    }

    render() {

        return (
            <React.Fragment>
                <Editor
                    disabled={this.props.disabled || false}
                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                    initialValue={this.props.initialValue || ''}
                    id={this.props.id || ''}
                    onEditorChange={this.handleEditorChange}
                    value={this.props.content || ''}
                    init={{
                        trapFocus:false,
                        height: this.props.editorOptions && this.props.editorOptions.height || 650,
                        menubar: this.props.editorOptions && this.props.editorOptions.menubar || true,
                        promotion: this.props.editorOptions && this.props.editorOptions.promotion || false,
                        branding: this.props.editorOptions && this.props.editorOptions.branding || false,
                        language: this.props.editorOptions && this.props.editorOptions.language || 'de',
                        image_advtab: this.props.editorOptions && this.props.editorOptions.image_advtab || true,
                        image_uploadtab: this.props.editorOptions && this.props.editorOptions.image_uploadtab || true,
                        image_caption: this.props.editorOptions && this.props.editorOptions.image_caption || true,
                        importcss_append: this.props.editorOptions && this.props.editorOptions.importcss_append || false,
                        browser_spellcheck: this.props.editorOptions && this.props.editorOptions.browser_spellcheck || true,
                        toolbar_sticky: this.props.editorOptions && this.props.editorOptions.toolbar_sticky || true,
                        toolbar_mode: this.props.editorOptions && this.props.editorOptions.toolbar_mode || 'wrap',
                        statusbar: this.props.editorOptions && this.props.editorOptions.statusbar ||true,
                        draggable_modal: this.props.editorOptions && this.props.editorOptions.draggable_modal ||true,
                        relative_urls: this.props.editorOptions && this.props.editorOptions.relative_urls ||true,
                        remove_script_host: this.props.editorOptions && this.props.editorOptions.remove_script_host ||false,
                        convert_urls: this.props.editorOptions && this.props.editorOptions.convert_urls ||false,
                        content_css: this.props.editorOptions && this.props.editorOptions.content_css || false,
                        valid_elements: this.props.editorOptions && this.props.editorOptions.valid_elements || '*[*]',
                        schema: this.props.editorOptions && this.props.editorOptions.schema || "html5",
                        verify_html: this.props.editorOptions && this.props.editorOptions.verify_html ||false,
                        valid_children: this.props.editorOptions && this.props.editorOptions.valid_children || "+a[div], +div[*]",
                        extended_valid_elements: this.props.editorOptions && this.props.editorOptions.extended_valid_elements || "div[*]",
                        file_picker_types: this.props.editorOptions && this.props.editorOptions.file_picker_types || 'image',
                        protect: [
                            /<\/?(if|endif)>/g,  // Protect <if> & </endif>
                            /<xsl:[^>]+>/g,  // Protect <xsl:...>
                            /<\?php.*?\?>/g  // Protect php code
                        ],
                        external_plugins: {
                            'textpattern': '/tiny-plugins/textpattern/plugin.min.js',
                            'noneditable': '/tiny-plugins/noneditable/plugin.min.js',
                        },
                        plugins: [
                            'advlist', 'importcss', 'save', 'autolink', 'directionality', 'lists', 'link', 'image', 'charmap', 'pagebreak', 'nonbreaking',
                            'anchor', 'searchreplace', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime', 'charmap',
                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'quickbars', 'emoticons', 'codesample'
                        ],
                        toolbar1: `undo redo | blocks | fontsize |
                                   bold italic forecolor | alignleft aligncenter
                                   alignright aligncenter alignjustify|bullist numlist outdent indent  codesample removeformat code help|fullscreen`,
                        quickbars_selection_toolbar: `bold italic | forecolor backcolor | quicklink | alignleft aligncenter 
                                                      alignright alignjustify | blocks | fontsize`,
                        //toolbar2: 'openMediaInsertButton',
                        font_size_formats: "8px 10px 12px 14px 16px 18px 24px 36px 40px",
                        //content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                        setup: function (editor) {

                        }
                    }}
                />
            </React.Fragment>
        )
    }
}