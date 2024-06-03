import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from 'react-bootstrap/InputGroup';
const v5NameSpace = 'c9b6ddd4-bcf2-11ee-9e49-325096b39f47';
import Button from 'react-bootstrap/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class OAuthSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showDefuseCopy: false,
            showKidCopy: false
        }

    }

    onUpdateCopied(target) {
        switch (target) {
            case 'defuse':
                this.setState({
                    showDefuseCopy: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showDefuseCopy: false
                    })
                })
                break;
            case 'kid':
                this.setState({
                    showKidCopy: true
                })
                sleep(1500).then(() => {
                    this.setState({
                        showKidCopy: false
                    })
                })
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                {systemSettings.manage_oauth ?
                    <Card className="shadow-sm mt-3">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-incognito me-2"></i>
                                {trans['app']['oAuth2 settings']}
                            </div>
                            <div className="ms-auto">
                                <div
                                    className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                <small>
                                    <SetAjaxResponse
                                        status={this.props.spinner.ajaxStatus}
                                        msg={this.props.spinner.ajaxMsg}
                                    />
                                </small>
                            </div>
                        </Card.Header>
                        <CardBody>
                            <Row className="g-2">
                                <Col xs={12} className="mb-3">
                                    <div className="fs-5 mb-2">
                                        {trans['app']['Properties of the JSON web key set']}:
                                    </div>
                                    <small
                                        className="text-muted fw-semibold small-lg d-block">{trans['app']['Defuse Crypto Key']}:</small>
                                    <small className="d-block small-lg text-muted">
                                        {this.props.oauth_config.encryption_key || ''}
                                    </small>
                                    <small
                                        className="text-muted fw-semibold mt-1 small-lg d-block">{trans['app']['Scopes']}:</small>
                                    <small className="d-block small-lg text-muted">
                                        [{this.props.oauth_config.scopes || ''}]
                                    </small>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('alg', v5NameSpace)}
                                        label={trans['app']['alg']}

                                    >
                                        <Form.Control
                                            className="no-blur"
                                            defaultValue={this.props.oauth.jwks_alg || ''}
                                            disabled={true}
                                            type="text"
                                            placeholder={trans['app']['alg']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('kty', v5NameSpace)}
                                        label={trans['app']['kty']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            defaultValue={this.props.oauth.jwks_kty || ''}
                                            disabled={true}
                                            type="text"
                                            placeholder={trans['app']['kty']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('use', v5NameSpace)}
                                        label={trans['app']['use']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            defaultValue={this.props.oauth.jwks_use || ''}
                                            disabled={true}
                                            type="text"
                                            placeholder={trans['app']['use']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('x5t', v5NameSpace)}
                                        label={trans['app']['x5t']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            defaultValue={this.props.oauth.jwks_x5t || ''}
                                            disabled={true}
                                            type="text"
                                            placeholder={trans['app']['x5t']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('defScopes', v5NameSpace)}
                                        label={trans['app']['Standard scope']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            defaultValue={this.props.oauth_config.def_scopes || ''}
                                            disabled={true}
                                            type="text"
                                            placeholder={trans['app']['Standard scope']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('x5c', v5NameSpace)}
                                        label={trans['app']['x5c']}
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            defaultValue={this.props.oauth.jwks_x5c || ''}
                                            disabled={true}
                                            type="text"
                                            placeholder={trans['app']['x5c']}/>
                                    </FloatingLabel>
                                </Col>

                                <Col xs={12}>
                                    <hr/>
                                    <div className="fs-5 fw-semibold">
                                        {trans['app']['Certificates']}
                                    </div>
                                </Col>
                                <Col xxl={6} xl={8} xs={12}>
                                    <InputGroup>
                                        <Form.Select
                                            aria-label="select bitrate"
                                            className="no-blur"
                                            value={this.props.certificate || ''}
                                            onChange={(e) => this.props.onChangeCertificate(e.target.value)}
                                        >
                                            <option value={1024}>1024 bit</option>
                                            <option value={2048}>2048 bit</option>
                                            <option value={4096}>4096 bit</option>
                                        </Form.Select>
                                        <Button
                                            onClick={() => this.props.onGenerateNewKeys('certificate')}
                                            role="button"
                                            variant="success-custom dark">
                                            <i className="bi bi-key me-2"></i>
                                            {trans['app']['Create new certificates']}
                                        </Button>
                                    </InputGroup>

                                </Col>
                                <Col xs={12}>
                                    <hr/>
                                    <Button
                                        onClick={() => this.props.onGenerateNewKeys('defuse_key')}
                                        variant="switch-blue dark me-2 btn-sm">
                                        <i className="bi bi-key me-2"></i>
                                        {trans['app']['Generate Defuse Crypto Key']}
                                    </Button>
                                    <Button
                                        onClick={() => this.props.onGenerateNewKeys('kid')}
                                        variant="warning-custom btn-sm">
                                        <i className="bi bi-key me-2"></i>
                                        {trans['app']['Generate kid key']}
                                    </Button>
                                </Col>
                                <Col xs={12}>
                                    {this.props.defuseKey || this.props.kidKey ?
                                        <hr className="mb-1"/>
                                        : ''}
                                    {this.props.defuseKey ?
                                        <div className="mb-2 small text-muted fw-semibold">

                                            {trans['app']['Defuse Crypto Key']}:
                                            <small className="d-block fw-normal">
                                                {this.props.defuseKey}
                                            </small>
                                            <div className="mt-2">
                                                <div className="position-absolute- bottom-0 mb-2">
                                                    <CopyToClipboard text={this.props.defuseKey}
                                                                     onCopy={() => this.onUpdateCopied('defuse')}>
                                                        <button className="btn btn-secondary dark btn-sm">
                                                            <i className="bi bi-files me-2"></i>
                                                            {trans['system']['Copy']}
                                                        </button>
                                                    </CopyToClipboard>
                                                    <span
                                                        className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showDefuseCopy ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                                </div>
                                            </div>

                                        </div>
                                        : ''}
                                    {this.props.kidKey ?
                                        <div className="mb-2 small text-muted fw-semibold">
                                            {trans['app']['kid']}:
                                            <small className="d-block fw-normal">
                                                {this.props.kidKey}
                                            </small>
                                            <div className="mt-2">
                                                <div className="position-absolute- bottom-0 mb-2">
                                                    <CopyToClipboard text={this.props.kidKey}
                                                                     onCopy={() => this.onUpdateCopied('kid')}>
                                                        <button className="btn btn-secondary dark btn-sm">
                                                            <i className="bi bi-files me-2"></i>
                                                            {trans['system']['Copy']}
                                                        </button>
                                                    </CopyToClipboard>
                                                    <span
                                                        className={`small-lg copy-client copied position-absolute text-danger ms-2${this.state.showKidCopy ? ' show-copied' : ''}`}> {trans['system']['Copied!']} </span>
                                                </div>
                                            </div>

                                        </div>
                                        : ''}
                                    {this.props.defuseKey || this.props.kidKey ?
                                        <hr className="mt-1"/>
                                        : ''}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
            </React.Fragment>
        )
    }
}
