import * as React from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from 'uuid';
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import FormBuilder from "../../PageBuilder/FormBuilder/FormBuilder";

const v5NameSpace = '99f88466-e62e-11ee-b0c0-325096b39f47';
export default class HeaderFooterFormBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}

        this.addPageBuilder = this.addPageBuilder.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);

    }


    addPageBuilder() {
        let formData = {
            'method': 'create_layout',
            'type': this.props.type
        }
        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'create_layout':
                            if (data.status) {
                                this.props.addFormBuilderSelect(data.id, data.designation)
                                AppTools.success_message(data.msg);
                            } else {
                                AppTools.warning_message(data.msg)
                            }

                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {

        return (
            <React.Fragment>
                <button onClick={() => this.props.onToggleSiteCollapse('table', true)}
                    className="btn btn-switch-blue mb-3 dark btn-sm">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['back']}
                </button>
                <div className="d-flex align-items-center justify-content-center justify-content-lg-between flex-wrap">
                    <div>
                        <Form.Select
                            size="sm"
                            id={uuidv5('builderSelect', v5NameSpace)}
                            value={this.props.site.formBuilder || ''}
                            onChange={(e) => this.props.onSetSite(e.target.value, 'formBuilder')}
                            className="no-blur my-1"
                            aria-label={trans['builder']['Select page builder']}
                        >
                            <option value="">{trans['builder']['Select page builder']}...</option>
                            {this.props.builderSelect.map((b, index) =>
                                <option value={b.id} key={index}>{b.label}</option>
                            )}
                        </Form.Select>
                    </div>

                    {this.props.site.formBuilder ?
                        <div className="d-flex align-items-center mx-2 my-1">
                            <i className="bi bi-chevron-right me-2"></i>
                            <div style={{maxWidth: '300px'}} className="text-truncate">
                                {this.props.title}
                            </div>
                            <i className="bi bi-chevron-left ms-2"></i>
                        </div> : ''}
                    <div>
                        <button
                            onClick={() => this.addPageBuilder()}
                            className="btn btn-secondary my-1 dark btn-sm">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['builder']['Create a new page builder']}
                        </button>
                    </div>
                </div>
                <hr className="mt-2"/>
                <FormBuilder
                    id={this.props.site.formBuilder}
                    getFormBuilderData={this.props.getFormBuilderData}
                    onSetFormBuilderData={this.props.onSetFormBuilderData}
                />

            </React.Fragment>
        )
    }
}