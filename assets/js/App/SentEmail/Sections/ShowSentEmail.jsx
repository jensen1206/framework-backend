import * as React from "react";
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";

export default class ShowSentEmail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            data: {},
            iframe: '',
            attachments: [],
            id: '',
        }

        this.getEmailSentData = this.getEmailSentData.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);

    }

    componentDidMount() {
        if (this.props.id) {
            this.getEmailSentData();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.load_email_data) {
            this.getEmailSentData();
            this.props.onSetGetEmailData(false);
        }
    }

    getEmailSentData() {
        let formData = {
            'method': 'get_sent_email',
            'id': this.props.id
        }

        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = emailSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, emailSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_sent_email':
                            if (data.status) {
                                this.setState({
                                    data: data.record,
                                    attachments: data.attachments,
                                    iframe: data.iframe
                                })
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
                <h3 className="fw-semibold text-body pb-3">
                    {trans['system']['Sent email']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        Email Details
                    </small>
                </h3>
                <hr/>
                {this.props.isSingle ? '' : (
                    <React.Fragment>
                        <button
                            onClick={() => this.props.onToggleSeCollapse('table', true)}
                            className="btn btn-success-custom dark btn-sm"
                            type="button">
                            <i className="bi bi-reply-all me-2"></i>
                            {trans['to overview']}
                        </button>
                        <hr/>
                    </React.Fragment>
                )}
                <div className="card shadow-sm">
                    <div className="card-header fs-5 py-3">
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="d-flex flex-column">

                                <small className="d-block lh-1- fw-normal">
                                    {trans['email']['Subject']}: {this.state.data.emailSubject}
                                </small>
                                <small className="small-lg fs-6 fw-light text-muted"> {trans['email']['Sent on']}: {this.state.data.createdAt}</small>
                                <small className="d-block mt-2 text-muted small-lg">
                                    <span className="d-inline-block" style={{minWidth: '2rem'}}> Cc:</span>
                                    {this.state.data.emailCc}
                                </small>
                                <small className="d-block text-muted small-lg">
                                    <span className="d-inline-block" style={{minWidth: '2rem'}}> Bcc:</span>
                                    {this.state.data.emailBcc}
                                </small>
                            </div>
                            <div className="ms-auto">
                                <small title={trans['email']['Sent from']} className="d-block fw-normal small-lg text-muted fs-6">
                                    <i className="bi bi-person me-2"></i> {this.state.data.absUser}
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {this.state.attachments.length ? (
                            <React.Fragment>
                                <h5 className="fw-normal">
                                    {trans['email']['Attachment']}:
                                </h5>
                                <div className="d-flex  align-items-center flex-wrap">
                                    {this.state.attachments.map((f, index) => {
                                        return (
                                            <a href={f.download_url} title={trans['email']['Download']}
                                               key={index}
                                               className="btn-file-download text-decoration-none text-reset d-flex mb-1 pe-2 align-items-center border rounded">
                                                <i className={`bs-file-file border-end fs-5 h-100  file ext_${f.extension}`}></i>
                                                <div className="ps-2">{f.filename}</div>
                                            </a>
                                        )
                                    })}
                                </div>
                                <hr/>
                            </React.Fragment>
                        ) : ''}
                        <h5 className="fw-normal"> {trans['email']['Message']}:</h5>
                        <div className="iframe-wrapper px-2 pt-2 border rounded">
                            <iframe
                                className="email-iframe rounded overflow-hidden ratio ratio-16x9"
                                src={this.state.iframe}
                                width="100%"
                                height="700"
                                frameBorder="0"
                                marginHeight="0"
                                marginWidth="0">
                            </iframe>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}