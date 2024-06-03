import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

const v5NameSpace = 'ea1795e6-a686-11ee-a202-325096b39f47';
export default class Section2FA extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showKontoCopy: false,
            showSecretCopy: false,
            showUrlCopy: false
        }
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
    }

    onUpdateCopied(target) {
        switch (target) {
            case 'konto':
                this.setState({
                    showKontoCopy: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showKontoCopy: false
                    })
                })
                break;
            case 'secret':
                this.setState({
                    showSecretCopy: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showSecretCopy: false
                    })
                })
                break;
            case 'url':
                this.setState({
                    showUrlCopy: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showUrlCopy: false
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
                                {trans['profil']['2FA Login']}
                            </div>
                            <div className="ms-auto">
                                <button onClick={() => this.props.onToggleCollapse('edit')}
                                        type="button" className="btn btn-circle-icon btn-success-custom dark">
                                    <i className="bi bi-reply-all-fill"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body pb-4">
                            <h6 className="mb-3 fw-normal">{trans['system']['Authy or Google Authenticator']}</h6>
                            <div className="row g-3 justify-content-center align-items-center">
                                <div className="col-lg-3 col-12">
                                    <img alt={trans['system']['Authy or Google Authenticator']} className="img-fluid"
                                         src={this.props.data2Fa.qrcode}/>
                                </div>
                                <div className="col-lg-9 col-12">
                                    <div className="mb-3">
                                        {trans['system']['Use Authy or Google Authenticator to Scan the QR Code.']}
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="py-3">
                                <h6 className="fw-normal">{trans['system']['URL for authentication app']}:</h6>
                            </div>
                            <div className="row g-1">
                                <div className="col-11">
                                    <Form.Group controlId={uuidv5('fa2Konto', v5NameSpace)}>
                                        <Form.Label
                                            className="mb-1"
                                        >
                                            {trans['system']['Account']}
                                        </Form.Label>
                                        <Form.Control
                                            style={{fontSize: '13px'}}
                                            type="text"
                                            disabled={true}
                                            defaultValue={this.props.data2Fa.konto || ''}
                                            placeholder={trans['system']['Account']}/>
                                    </Form.Group>
                                </div>
                                <div className="col-1 position-relative">
                                    <div className="position-absolute bottom-0 mb-2">
                                        <CopyToClipboard text={this.props.data2Fa.konto}
                                                         onCopy={() => this.onUpdateCopied('konto')}>
                                            <i title={trans['profil']['Copy password']}
                                               className="cursor-pointer d-inline-block hover-scale ms-2 bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showKontoCopy ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <Form.Group controlId={uuidv5('fa2Secret', v5NameSpace)}>
                                        <Form.Label
                                            className="mb-1"
                                        >
                                            {trans['system']['Secret']}
                                        </Form.Label>
                                        <Form.Control
                                            style={{fontSize: '13px'}}
                                            type="text"
                                            disabled={true}
                                            defaultValue={this.props.data2Fa.totpSecret || ''}
                                            placeholder={trans['system']['Secret']}/>
                                    </Form.Group>
                                </div>
                                <div className="col-1 position-relative">
                                    <div className="position-absolute bottom-0 mb-2">
                                        <CopyToClipboard text={this.props.data2Fa.totpSecret}
                                                         onCopy={() => this.onUpdateCopied('secret')}>
                                            <i title={trans['profil']['Copy password']}
                                               className="cursor-pointer d-inline-block hover-scale ms-2 bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showSecretCopy ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <Form.Group controlId={uuidv5('fa2Url', v5NameSpace)}>
                                        <Form.Label
                                            className="mb-1"
                                        >
                                            {trans['system']['URL']}
                                        </Form.Label>
                                        <Form.Control
                                            style={{fontSize: '13px'}}
                                            type="text"
                                            disabled={true}
                                            defaultValue={this.props.data2Fa.qrCodeContent || ''}
                                            placeholder={trans['system']['Secret']}/>
                                    </Form.Group>
                                </div>
                                <div className="col-1 position-relative">
                                    <div className="position-absolute bottom-0 mb-2">
                                        <CopyToClipboard text={this.props.data2Fa.qrCodeContent}
                                                         onCopy={() => this.onUpdateCopied('url')}>
                                            <i title={trans['profil']['Copy password']}
                                               className="cursor-pointer d-inline-block hover-scale ms-2 bi bi-files"></i>
                                        </CopyToClipboard>
                                        <span
                                            className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showUrlCopy ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
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