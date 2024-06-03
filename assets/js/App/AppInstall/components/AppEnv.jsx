import * as React from "react";
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);
import * as AppTools from "../../AppComponents/AppTools";
import Collapse from 'react-bootstrap/Collapse';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, Col, FloatingLabel, Form, Row} from "react-bootstrap";


const v5NameSpace = '4777a06c-6cb0-4d6f-a7ee-9e0fe56cae5c';
export default class AppEnv extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onSubmitNext = this.onSubmitNext.bind(this);
        this.generateNewKey = this.generateNewKey.bind(this);
    }


    onSubmitNext(event) {
        event.preventDefault();
        event.stopPropagation();

        this.props.collapseToggle('vier');

    }

    generateNewKey(type) {
        let formData = {
            'method': type
        }
        this.props.sendAxiosFormdata(formData)
    }

    render() {
        return (
            <React.Fragment>
                <div className="fs-5 mb-3">
                    {trans['install']['Settings']}
                    <small className="small-lg d-block">
                        <b className="fw-semibold d-inline-block me-1">PHP Version:</b>
                        {`${this.props.env.php_version}`} |
                        <b className="fw-semibold d-inline-block mx-1">PHP INI Path:</b>
                        {`${this.props.env.php_ini_path}`}
                    </small>
                </div>
                <Form onSubmit={this.onSubmitNext}>
                    <Row className="g-2">
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('envSiteName', v5NameSpace)}
                                label={`${trans['install']['Page name']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.env.site_name || ''}
                                    onChange={(e) => this.props.onSetEnv(e.target.value, 'site_name')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Page name']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('envPostCat', v5NameSpace)}
                                label={`${trans['install']['Post category']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.env.postCatName || ''}
                                    onChange={(e) => this.props.onSetEnv(e.target.value, 'postCatName')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Post category']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('envCatName', v5NameSpace)}
                                label={`${trans['install']['Page category']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.env.categoryName || ''}
                                    onChange={(e) => this.props.onSetEnv(e.target.value, 'categoryName')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Page category']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('envTimeZone', v5NameSpace)}
                                label={`${trans['install']['Timezone']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.env.timeZone || ''}
                                    onChange={(e) => this.props.onSetEnv(e.target.value, 'timeZone')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Timezone']}/>
                            </FloatingLabel>
                        </Col>

                        <Col xs={12} xl={6}>
                            <FloatingLabel
                                controlId={uuidv5('envInstallUrl', v5NameSpace)}
                                label={`${trans['install']['Install URL']} *`}
                            >
                                <Form.Control
                                    className="no-blur"
                                    value={this.props.env.install_url || ''}
                                    onChange={(e) => this.props.onSetEnv(e.target.value, 'install_url')}
                                    aria-required={true}
                                    required={true}
                                    type="url"
                                    placeholder={trans['install']['Install URL']}/>
                            </FloatingLabel>
                        </Col>
                        <Col xl={6} xs={12}>
                            <FloatingLabel
                                controlId={uuidv5('envAppSecret', v5NameSpace)}
                                label={`${trans['install']['App secret']} *`}
                            >
                                <Form.Control
                                    readOnly={true}
                                    className="no-blur"
                                    defaultValue={this.props.env.app_secret || ''}
                                    //onChange={(e) => this.props.onSetEnv(e.target.value, 'timeZone')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['App secret']}/>
                            </FloatingLabel>
                            <button onClick={() => this.generateNewKey('generate_secret')}
                                type="button" className="btn btn-outline-secondary mt-2 btn-sm">
                                {trans['install']['Generate new key']}
                            </button>
                        </Col>
                        <Col xs={12}>
                            <FloatingLabel
                                controlId={uuidv5('envDefuse', v5NameSpace)}
                                label={`${trans['install']['Oauth2 defuse key']} *`}
                            >
                                <Form.Control
                                    readOnly={true}
                                    className="no-blur"
                                    defaultValue={this.props.env.defuse_key || ''}
                                    //onChange={(e) => this.props.onSetEnv(e.target.value, 'timeZone')}
                                    aria-required={true}
                                    required={true}
                                    type="text"
                                    placeholder={trans['install']['Oauth2 defuse key']}/>
                            </FloatingLabel>
                            <button  onClick={() => this.generateNewKey('make_defuse_key')}
                                type="button" className="btn btn-outline-secondary mt-2 btn-sm">
                                {trans['install']['Generate new key']}
                            </button>
                        </Col>

                        <Col xs={12}>
                            <hr/>
                            <button onClick={() => this.props.collapseToggle('zwei')}
                                type="button" className="btn btn-secondary me-2">
                                <i className="bi bi-arrow-left me-1"></i>
                                {trans['install']['back']}
                            </button>
                            <button type="submit" className="btn btn-secondary">{trans['install']['next']}
                                <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }
}