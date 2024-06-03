import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import FileMangerModal from "../../AppMedien/Modal/FileMangerModal";

const v5NameSpace = '81a8bea8-bc53-11ee-a675-325096b39f47';
export default class LogoSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
        }
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);
    }

    fileManagerDidUpdate(state) {
        this.setState({
            didUpdateManager: state
        })
    }

    setFileManagerShow(state) {
        this.setState({
            fileManagerShow: state
        })
    }

    fileManagerCallback(files) {
        if (files.length) {
            this.props.onChangeAppSettings(files[0]['fileName'], this.state.selectedImage)
            this.setState({
                selectedImage: ''
            })
        }
    }

    onSetAppImage(type) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true
        })
    }

    render() {
        return (
            <React.Fragment>
                {systemSettings.manage_app ?
                    <Card className="shadow-sm mt-3">
                        <Card.Header
                            className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                <i className="bi bi-image me-2"></i>
                                {trans['app']['App Logos']}
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
                            <Row className="g-3">
                                <Col xl={4} sm={6} xs={12} className="text-center mx-auto">
                                    <div className="my-2">{trans['app']['E-mail signature logo']}</div>
                                    <div className="d-flex flex-column align-items-stretch">
                                        {this.props.app.signature_logo ?
                                            <React.Fragment>
                                                <div style={{width: '150px', height: '150px'}}
                                                     className="p-1 border rounded overflow-hidden d-flex mx-auto mb-3">
                                                    <img
                                                        style={{objectFit: 'cover'}}
                                                        className="rounded img-fluid"
                                                        alt={trans['app']['E-mail signature logo']}
                                                        src={`${publicSettings.thumb_url}/${this.props.app.signature_logo}`}/>
                                                </div>
                                                <div className="mx-auto" style={{width: '200px'}}>
                                                    <Form.Group
                                                        className="mb-2"
                                                        controlId={uuidv5('rangeLoginLogo', v5NameSpace)}>
                                                        <Form.Label className="mb-0">
                                                            {trans['app']['Image size']} {this.props.app.signature_logo_size || ''} px
                                                        </Form.Label>
                                                        <Form.Range
                                                            min={5}
                                                            max={500}
                                                            step={10}
                                                            value={this.props.app.signature_logo_size || ''}
                                                            onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'signature_logo_size')}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div
                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                        }
                                        <div className="mt-auto">
                                            <button
                                                onClick={() => this.onSetAppImage('signature_logo')}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                {this.props.app.signature_logo ? trans['app']['Change image'] : trans['app']['Select image']}
                                            </button>
                                            {this.props.app.signature_logo ?
                                                <button
                                                    onClick={() => this.props.onChangeAppSettings('', 'signature_logo')}
                                                    type="button"
                                                    className="btn btn-danger ms-2 dark btn-sm">
                                                    {trans['delete']}
                                                </button> : ''}
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={4} sm={6} xs={12} className="text-center mx-auto">
                                    <div className="my-2">{trans['app']['Dashboard Logo']}</div>
                                    <div className="d-flex flex-column align-items-stretch">
                                        {this.props.app.dashboard_logo ?
                                            <React.Fragment>
                                                <div style={{width: '150px', height: '150px'}}
                                                     className="p-1 border rounded overflow-hidden mx-auto mb-3">
                                                    <img
                                                        style={{objectFit: 'cover'}}
                                                        className="rounded img-fluid"
                                                        alt={trans['app']['Dashboard Logo']}
                                                        src={`${publicSettings.thumb_url}/${this.props.app.dashboard_logo}`}/>
                                                </div>
                                                <div className="mx-auto" style={{width: '200px'}}>
                                                    <Form.Group
                                                        className="mb-2"
                                                        controlId={uuidv5('rangeLoginLogo', v5NameSpace)}>
                                                        <Form.Label className="mb-0">
                                                            {trans['app']['Image size']} {this.props.app.dashboard_logo_size || ''} px
                                                        </Form.Label>
                                                        <Form.Range
                                                            min={5}
                                                            max={500}
                                                            step={10}
                                                            value={this.props.app.dashboard_logo_size || ''}
                                                            onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'dashboard_logo_size')}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div
                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                        }
                                        <div className="mt-auto">
                                            <button
                                                onClick={() => this.onSetAppImage('dashboard_logo')}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                {this.props.app.dashboard_logo ? trans['app']['Change image'] : trans['app']['Select image']}
                                            </button>
                                            {this.props.app.dashboard_logo ?
                                                <button
                                                    onClick={() => this.props.onChangeAppSettings('', 'dashboard_logo')}
                                                    type="button"
                                                    className="btn btn-danger ms-2 dark btn-sm">
                                                    {trans['delete']}
                                                </button> : ''}
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={4} sm={6} xs={12} className="text-center">
                                    <div className="my-2">{trans['app']['Login Logo']}</div>
                                    <div className="d-flex flex-column align-items-stretch">
                                        {this.props.app.login_logo ?
                                            <React.Fragment>
                                                <div style={{width: '150px', height: '150px'}}
                                                     className="p-1 border rounded overflow-hidden mx-auto mb-3">
                                                    <img
                                                        style={{objectFit: 'cover'}}
                                                        className="rounded img-fluid"
                                                        alt={trans['app']['Login Logo']}
                                                        src={`${publicSettings.thumb_url}/${this.props.app.login_logo}`}/>
                                                </div>
                                                <div className="mx-auto" style={{width: '200px'}}>
                                                    <Form.Group
                                                        className="mb-2"
                                                        controlId={uuidv5('rangeLoginLogo', v5NameSpace)}>
                                                        <Form.Label className="mb-0">
                                                            {trans['app']['Image size']} {this.props.app.login_logo_size || ''} px
                                                        </Form.Label>
                                                        <Form.Range
                                                            min={5}
                                                            max={500}
                                                            step={10}
                                                            value={this.props.app.login_logo_size || ''}
                                                            onChange={(e) => this.props.onChangeAppSettings(e.target.value, 'login_logo_size')}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div
                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                        }
                                        <div className="mt-auto">
                                            <button
                                                onClick={() => this.onSetAppImage('login_logo')}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                {this.props.app.login_logo ? trans['app']['Change image'] : trans['app']['Select image']}
                                            </button>
                                            {this.props.app.login_logo ?
                                                <button
                                                    onClick={() => this.props.onChangeAppSettings('', 'login_logo')}
                                                    type="button"
                                                    className="btn btn-danger ms-2 dark btn-sm">
                                                    {trans['delete']}
                                                </button> : ''}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
                <FileMangerModal
                    didUpdateManager={this.state.didUpdateManager}
                    fileManagerShow={this.state.fileManagerShow}
                    options={this.state.fmOptions}
                    fileManagerDidUpdate={this.fileManagerDidUpdate}
                    setFileManagerShow={this.setFileManagerShow}
                    fileManagerCallback={this.fileManagerCallback}
                />
            </React.Fragment>
        )
    }
}