import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
const v5NameSpace = 'ea1795e6-a686-11ee-a202-325096b39f47';
export default class SectionApi extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            copyClientId: false,
            copyClientSecret: false,
            copyGrants: false,
            copyScopes: false,
            copyRedirect: false
        }
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
    }

    onUpdateCopied(target) {
        switch (target) {
            case 'client':
                this.setState({
                    copyClientId: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        copyClientId: false
                    })
                })
                break;
            case 'secret':
                this.setState({
                    copyClientSecret: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        copyClientSecret: false
                    })
                })
                break;
            case 'grant':
                this.setState({
                    copyGrants: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        copyGrants: false
                    })
                })
                break;
            case 'scope':
                this.setState({
                    copyScopes: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        copyScopes: false
                    })
                })
                break;
            case 'redirect':
                this.setState({
                    copyRedirect: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        copyRedirect: false
                    })
                })
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-xxl-10 col-xl-10 col-12 mx-auto">
                    <div className="shadow-sm card">
                        <div
                            className="bg-body-tertiary py-3 fs-5 fw-semibold d-flex flex-wrap align-items-center card-header">
                            <div>
                                <i className="bi bi-incognito me-2"></i>
                                {trans['system']['OAuth2 security']}
                                <small className="small-xl d-block pt-2">
                                    {this.props.dataApi.uuid || ''}
                                </small>
                            </div>
                            <div className="ms-auto">
                                <button onClick={() => this.props.onToggleCollapse('edit')}
                                        type="button" className="btn btn-circle-icon btn-success-custom dark">
                                    <i className="bi bi-reply-all-fill"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body pb-4">
                            <div className="row align-items-center g-3">
                                <div className="col-11">
                                    <FloatingLabel
                                        controlId={uuidv5('clientId', v5NameSpace)}
                                        label={trans['system']['Client ID']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={true}
                                            defaultValue={this.props.dataApi.identifier || ''}
                                            type="text"
                                            placeholder={trans['system']['Client ID']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-1">
                                    <div>
                                        <CopyToClipboard text={this.props.dataApi.identifier}
                                                         onCopy={() => this.onUpdateCopied('client')}>
                                            <i title={trans['system']['Copy']}
                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute ms-2 text-danger ${this.state.copyClientId ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <FloatingLabel
                                        controlId={uuidv5('clientSecret', v5NameSpace)}
                                        label={trans['system']['Client Secret']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={true}
                                            defaultValue={this.props.dataApi.secret || ''}
                                            type="text"
                                            placeholder={trans['system']['Client Secret']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-1">
                                    <div>
                                        <CopyToClipboard text={this.props.dataApi.secret}
                                                         onCopy={() => this.onUpdateCopied('secret')}>
                                            <i title={trans['system']['Copy']}
                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute ms-2 text-danger ${this.state.copyClientSecret ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <FloatingLabel
                                        controlId={uuidv5('clientGrants', v5NameSpace)}
                                        label={trans['system']['Grants']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={true}
                                            defaultValue={this.props.dataApi.grants || ''}
                                            type="text"
                                            placeholder={trans['system']['Grants']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-1">
                                    <div>
                                        <CopyToClipboard text={this.props.dataApi.grants}
                                                         onCopy={() => this.onUpdateCopied('grant')}>
                                            <i title={trans['system']['Copy']}
                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute ms-2 text-danger ${this.state.copyGrants ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <FloatingLabel
                                        controlId={uuidv5('clientScope', v5NameSpace)}
                                        label={trans['system']['Scope']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={true}
                                            defaultValue={this.props.dataApi.scopes || ''}
                                            type="text"
                                            placeholder={trans['system']['Scope']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-1">
                                    <div>
                                        <CopyToClipboard text={this.props.dataApi.scopes}
                                                         onCopy={() => this.onUpdateCopied('scope')}>
                                            <i title={trans['system']['Copy']}
                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute ms-2 text-danger ${this.state.copyScopes ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <FloatingLabel
                                        controlId={uuidv5('clientRedirect', v5NameSpace)}
                                        label={trans['system']['Redirect uris']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            disabled={true}
                                            defaultValue={this.props.dataApi.redirectUris || ''}
                                            type="text"
                                            placeholder={trans['system']['Redirect uris']}/>
                                    </FloatingLabel>
                                </div>
                                <div className="col-1">
                                    <div>
                                        <CopyToClipboard text={this.props.dataApi.redirectUris}
                                                         onCopy={() => this.onUpdateCopied('redirect')}>
                                            <i title={trans['system']['Copy']}
                                               className="cursor-pointer d-inline-block hover-scale bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute ms-2 text-danger ${this.state.copyRedirect ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}