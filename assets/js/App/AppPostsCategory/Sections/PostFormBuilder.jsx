import * as React from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from 'uuid';
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import FormBuilder from "../../PageBuilder/FormBuilder/FormBuilder";

const v5NameSpace = 'cd5e3018-c2c4-11ee-8027-325096b39f47';
export default class PostFormBuilder extends React.Component {
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
            'type': this.props.builderType
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
                <div className="d-flex align-items-center">
                    <button onClick={() => this.props.onToggleCategoryCollapse('table')}
                            className="btn btn-switch-blue mb-3 dark btn-sm">
                        <i className="bi bi-reply-all me-2"></i>
                        {trans['back']}
                    </button>
                    <div className="ms-auto">
                        <b className="fw-semibold"> {trans['posts']['Design']}:</b> {this.props.builderType}
                    </div>
                </div>
                <div className="d-flex align-items-end justify-content-center justify-content-lg-between flex-wrap">
                    <div>
                        <Form.Select
                            size="sm"
                            id={uuidv5('builderSelect', v5NameSpace)}
                            value={this.props.formBuilder || ''}
                            onChange={(e) => this.props.onSetBuilder(e.target.value, 'formBuilder')}
                            className="no-blur my-1"
                            aria-label={trans['builder']['Select page builder']}
                        >
                            <option value="">{trans['builder']['Select page builder']}...</option>
                            {this.props.builderSelect.map((b, index) =>
                                <option value={b.id} key={index}>{b.label}</option>
                            )}
                        </Form.Select>
                    </div>
                    {this.props.builderType === 'category' ?
                        <React.Fragment>
                            <div className="d-flex">
                                <Form.Group className="me-2"
                                            controlId={uuidv5('builderSelectCategoryHeader', v5NameSpace)}>
                                    <Form.Label className="mb-0 small">{trans['builder']['Header']}</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        disabled={!this.props.formBuilder}
                                        value={this.props.category.categoryHeader || ''}
                                        onChange={(e) => this.props.onUpdateFooterHeader(e.target.value, 'categoryHeader')}
                                        className="no-blur my-1 "
                                        aria-label={trans['builder']['Select category header']}
                                    >
                                        <option value="">{trans['builder']['Select category header']}...</option>
                                        {this.props.selectHeader.map((b, index) =>
                                            <option value={b.id} key={index}>{b.label}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="me-2"
                                            controlId={uuidv5('builderSelectCategoryFooter', v5NameSpace)}>
                                    <Form.Label className="mb-0 small">{trans['builder']['Footer']}</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        disabled={!this.props.formBuilder}
                                        value={this.props.category.categoryFooter || ''}
                                        onChange={(e) => this.props.onUpdateFooterHeader(e.target.value, 'categoryFooter')}
                                        className="no-blur my-1"
                                        aria-label={trans['builder']['Select category footer']}
                                    >
                                        <option value="">{trans['builder']['Select category footer']}...</option>
                                        {this.props.selectFooter.map((b, index) =>
                                            <option value={b.id} key={index}>{b.label}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </React.Fragment>
                        : ''}
                    {this.props.builderType === 'post' ?
                        <React.Fragment>
                            <div className="d-flex">
                                <Form.Group className="me-2"
                                            controlId={uuidv5('builderSelectPostHeader', v5NameSpace)}>
                                    <Form.Label className="mb-0 small">{trans['builder']['Header']}</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        disabled={!this.props.formBuilder}
                                        value={this.props.category.postHeader || ''}
                                        onChange={(e) => this.props.onUpdateFooterHeader(e.target.value, 'postHeader')}
                                        className="no-blur my-1"
                                        aria-label={trans['builder']['Select post header']}
                                    >
                                        <option value="">{trans['builder']['Select post header']}...</option>
                                        {this.props.selectHeader.map((b, index) =>
                                            <option value={b.id} key={index}>{b.label}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="me-2"
                                            controlId={uuidv5('builderSelectPostFooter', v5NameSpace)}>
                                    <Form.Label className="mb-0 small">{trans['builder']['Footer']}</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        disabled={!this.props.formBuilder}
                                        value={this.props.category.postFooter || ''}
                                        onChange={(e) => this.props.onUpdateFooterHeader(e.target.value, 'postFooter')}
                                        className="no-blur my-1"
                                        aria-label={trans['builder']['Select post footer']}
                                    >
                                        <option value="">{trans['builder']['Select post footer']}...</option>
                                        {this.props.selectFooter.map((b, index) =>
                                            <option value={b.id} key={index}>{b.label}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </React.Fragment>
                        : ''}
                    {/*}  {this.props.site.formBuilder ?
                        <div className="d-flex align-items-center mx-2 my-1">
                            <i className="bi bi-chevron-right me-2"></i>
                            <div style={{maxWidth: '300px'}} className="text-truncate">
                                {this.props.title}
                            </div>
                            <i className="bi bi-chevron-left ms-2"></i>
                        </div> : ''} {*/}
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
                    id={this.props.formBuilder || ''}
                    catId={this.props.catId}
                    builderType={this.props.builderType}
                    getFormBuilderData={this.props.getFormBuilderData}
                    onSetFormBuilderData={this.props.onSetFormBuilderData}
                />

            </React.Fragment>
        )
    }
}