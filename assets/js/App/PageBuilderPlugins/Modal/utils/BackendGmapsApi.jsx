import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import AppIcons from "../../../AppIcons/AppIcons";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const v5NameSpace = '63d164ed-67c5-4161-b516-d30431b7cddb';
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import * as AppTools from "../../../AppComponents/AppTools";

export default class BackendGmapsApi extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            colStart: true,
            colPins: false,
            didUpdateManager: false,
            fileManagerShow: false,
            selectedImage: '',
            pinId: '',
            fmOptions: {
                multiSelect: false,
                fileType: 'image',
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
        }

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetCustomPinImage = this.onSetCustomPinImage.bind(this);

        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);


    }

    componentDidMount() {
        this.onToggleCollapse('start')
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
            if (this.state.selectedImage === 'default_pin') {
                this.props.onSetStateConfig(files[0]['fileName'], this.state.selectedImage)
            }

            if (this.state.selectedImage === 'custom_pin') {
                this.props.onSetMapCustomPin(files[0]['fileName'], 'custom_pin', this.state.pinId, 'update')
            }

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

    onSetCustomPinImage(id, handle) {
        if(handle === 'add') {
            this.setState({
                pinId: id,
            })
            this.onSetAppImage('custom_pin')
        }

        if(handle === 'delete') {
            this.props.onSetMapCustomPin('', 'custom_pin', id, 'update')
        }
    }

    onToggleCollapse(target) {
        let start = false;
        let pins = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'pins':
                pins = true;
                break;
        }

        this.setState({
            colStart: start,
            colPins: pins
        })
    }

    render() {
        return (
            <React.Fragment>
                <ButtonGroup className="flex-wrap mb-3" aria-label="Basic example">
                    <Button onClick={() => this.onToggleCollapse('start')}
                            type="button"
                            size="sm"
                            variant={`switch-blue-outline dark ${this.state.colStart ? 'active' : ''}`}>{trans['Settings']}
                    </Button>
                    {this.props.edit.config.api_key ?
                        <Button onClick={() => this.onToggleCollapse('pins')}
                                type="button"
                                size="sm"
                                variant={`switch-blue-outline dark ${this.state.colPins ? 'active' : ''}`}>{trans['maps']['Manage API pins']}
                        </Button> : ''}
                </ButtonGroup>
                <Collapse in={this.state.colStart}>
                    <div id={uuidv5('collapseStart', v5NameSpace)}>
                        <Row className="g-2">
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('apiKey', v5NameSpace)}
                                    label={`${trans['maps']['API Key']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        defaultValue={this.props.edit.config.api_key || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'api_key')}
                                        className="no-blur"
                                        type="text"
                                        placeholder={trans['maps']['API Key']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('selectPolicy', v5NameSpace)}
                                    label={`${trans['maps']['Map Privacy Policy']}`}>
                                    <Form.Select
                                        className="no-blur"
                                        required={false}
                                        defaultValue={this.props.edit.config.privacy_policy || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'privacy_policy')}
                                        aria-label={trans['maps']['Map Privacy Policy']}>
                                        <option value="">{trans['system']['select']}...</option>
                                        {this.props.edit.options.protection.map((s, index) =>
                                            <option value={s.id} key={index}>{s.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('mapZoom', v5NameSpace)}
                                    label={`${trans['maps']['Map zoom']} *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.props.edit.config.zoom || ''}
                                        onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'zoom')}
                                        className="no-blur"
                                        type="number"
                                        placeholder={trans['maps']['Map zoom']}/>
                                </FloatingLabel>
                            </Col>
                            <Col className="g-0" xl={6} xs={12}></Col>
                            <Col xs={12}>
                                <div className="fs-5 mt-3 mb-1">
                                    {trans['maps']['Standard Pin']}
                                </div>
                                {this.props.edit.config.default_pin ?
                                    <div className="row gx-3  align-items-center">
                                        <div className="col-1">
                                            <img
                                                style={{
                                                    objectFit: 'cover',
                                                    width: this.props.edit.config.pin_width + 'px',
                                                    height: this.props.edit.config.pin_height + 'px'
                                                }}
                                                className="img-fluid"
                                                src={`${publicSettings.public_mediathek}/${this.props.edit.config.default_pin} `}
                                                alt=""/>
                                        </div>
                                        <div className="col-xl-4 col-lg-6 col-11">
                                            <div className="flex-column d-flex">
                                                <div>
                                                    <Form.Group
                                                        className="mt-3 d-flex"
                                                        controlId={uuidv5('rangeWidth', v5NameSpace)}>

                                                        <Form.Range
                                                            min={5}
                                                            max={100}
                                                            step={1}
                                                            value={this.props.edit.config.pin_width}
                                                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'pin_width')}
                                                        />
                                                        <Form.Label
                                                            className="mb-0 ms-3 d-block small text-nowrap">
                                                            {trans['plugins']['Width']} ({this.props.edit.config.pin_width}px)
                                                        </Form.Label>
                                                    </Form.Group>
                                                </div>
                                                <div>
                                                    <Form.Group
                                                        className="mb-3 d-flex"
                                                        controlId={uuidv5('rangeHeight', v5NameSpace)}>
                                                        <Form.Range
                                                            min={5}
                                                            max={100}
                                                            step={1}
                                                            value={this.props.edit.config.pin_height}
                                                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'pin_height')}
                                                        />
                                                        <Form.Label
                                                            className="mb-0 ms-3 d-block small text-nowrap">
                                                            {trans['plugins']['Height']} ({this.props.edit.config.pin_height}px)
                                                        </Form.Label>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div style={{width: '35px', height: '35px'}}
                                         className="placeholder-account-image p-1 border rounded"></div>
                                }
                                <div className="my-3">
                                    <button onClick={() => this.onSetAppImage('default_pin')}
                                            type="button"
                                            className="btn btn-success-custom me-2 dark btn-sm">
                                        {this.props.edit.config.default_pin ? trans['maps']['Change pin'] : trans['maps']['Select pin']}
                                    </button>
                                    {this.props.edit.config.default_pin ?
                                        <button onClick={() => this.props.onSetStateConfig('', 'default_pin')}
                                                type="button"
                                                className="btn btn-danger me-2 dark btn-sm">
                                            {trans['maps']['Delete pin']}
                                        </button> : ''}
                                </div>
                            </Col>
                            <Col xs={12}>
                                <Form.Check
                                    type="switch"
                                    checked={this.props.edit.config.colour_scheme_active || false}
                                    onChange={(e) => this.props.onSetStateConfig(e.currentTarget.checked, 'colour_scheme_active')}
                                    id={uuidv5('checkCustomColorScheme', v5NameSpace)}
                                    label={trans['maps']['User-defined colour scheme']}
                                />
                            </Col>
                        </Row>
                        <Collapse in={this.props.edit.config.colour_scheme_active}>
                            <div id={uuidv5('collapseCustomColorArray', v5NameSpace)}>
                                <hr/>
                                <Col xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv5('mapColorScheme', v5NameSpace)}
                                        label={`${trans['maps']['Map colour scheme']} *`}
                                    >
                                        <Form.Control
                                            required={this.props.edit.config.colour_scheme_active}
                                            defaultValue={this.props.edit.config.custom_colour_scheme || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.currentTarget.value, 'custom_colour_scheme')}
                                            className="no-blur mt-3"
                                            as="textarea"
                                            style={{height: '320px', overflowY: 'auto'}}
                                            placeholder={trans['maps']['Map colour scheme']}/>
                                    </FloatingLabel>
                                    <div className="form-text">
                                        {trans['maps']['JavaScript Style Array']}
                                    </div>
                                </Col>
                                <hr/>
                            </div>
                        </Collapse>
                    </div>
                </Collapse>
                <Collapse in={this.state.colPins}>
                    <div id={uuidv5('collapsePins', v5NameSpace)}>

                        {this.props.edit.pins.map((p, index) => {
                            return (
                                <Card className="mb-3" key={index}>
                                    <CardBody>
                                        <div className="fs-5 my-2">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            {trans['maps']['Pin']}: {index + 1}
                                        </div>
                                        <Row className="g-2">
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['maps']['Coordinates']} *`}
                                                >
                                                    <Form.Control
                                                        required={true}
                                                        value={p.coordinates || ''}
                                                        onChange={(e) => this.props.onSetMapCustomPin(e.currentTarget.value, 'coordinates', p.id, 'update')}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['maps']['Coordinates']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['maps']['Info text']}`}
                                                >
                                                    <Form.Control
                                                        required={false}
                                                        value={p.info_txt || ''}
                                                        onChange={(e) => this.props.onSetMapCustomPin(e.currentTarget.value, 'info_txt', p.id, 'update')}
                                                        className="no-blur"
                                                        as="textarea"
                                                        style={{height: '80px'}}
                                                        placeholder={trans['maps']['Info text']}/>
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    {trans['maps']['This text appears when you click on the pin']}
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Check
                                                    type="switch"
                                                    checked={p.custom_pin_active || false}
                                                    onChange={(e) => this.props.onSetMapCustomPin(e.currentTarget.checked, 'custom_pin_active', p.id, 'update')}
                                                    id={uuidv4()}
                                                    label={trans['maps']['Custom Pin']}
                                                />
                                            </Col>
                                            <Collapse in={p.custom_pin_active}>
                                                <div id={uuidv4()}>
                                                    <hr/>
                                                    <Col xs={12}>
                                                        <div className="fs-5 mt-3 mb-1">
                                                            {trans['maps']['Custom Pin']}
                                                        </div>
                                                        {p.custom_pin ?
                                                            <div className="row gx-3  align-items-center">
                                                                <div className="col-1">
                                                                    <img
                                                                        style={{
                                                                            objectFit: 'cover',
                                                                            width: p.pin_width + 'px',
                                                                            height: p.pin_height + 'px'
                                                                        }}
                                                                        className="img-fluid"
                                                                        src={`${publicSettings.public_mediathek}/${p.custom_pin} `}
                                                                        alt=""/>
                                                                </div>
                                                                <div className="col-xl-4 col-lg-6 col-11">
                                                                    <div className="flex-column d-flex">
                                                                        <div>
                                                                            <Form.Group
                                                                                className="mt-3 d-flex"
                                                                                controlId={uuidv4()}>

                                                                                <Form.Range
                                                                                    min={5}
                                                                                    max={100}
                                                                                    step={1}
                                                                                    value={p.pin_width}
                                                                                    onChange={(e) => this.props.onSetMapCustomPin(e.currentTarget.value, 'pin_width', p.id, 'update')}
                                                                                />
                                                                                <Form.Label
                                                                                    className="mb-0 ms-3 d-block small text-nowrap">
                                                                                    {trans['plugins']['Width']} ({p.pin_width}px)
                                                                                </Form.Label>
                                                                            </Form.Group>
                                                                        </div>
                                                                        <div>
                                                                            <Form.Group
                                                                                className="mb-3 d-flex"
                                                                                controlId={uuidv4()}>
                                                                                <Form.Range
                                                                                    min={5}
                                                                                    max={100}
                                                                                    step={1}
                                                                                    value={p.pin_height}
                                                                                    onChange={(e) => this.props.onSetMapCustomPin(e.currentTarget.value, 'pin_height', p.id, 'update')}
                                                                                />
                                                                                <Form.Label
                                                                                    className="mb-0 ms-3 d-block small text-nowrap">
                                                                                    {trans['plugins']['Height']} ({p.pin_height}px)
                                                                                </Form.Label>
                                                                            </Form.Group>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div style={{width: '35px', height: '35px'}}
                                                                 className="placeholder-account-image p-1 border rounded"></div>
                                                        }
                                                        <div className="my-3">
                                                            <button onClick={() => this.onSetCustomPinImage(p.id, 'add')}
                                                                    type="button"
                                                                    className="btn btn-success-custom me-2 dark btn-sm">
                                                                {p.custom_pin ? trans['maps']['Change pin'] : trans['maps']['Select pin']}
                                                            </button>
                                                            {p.custom_pin ?
                                                                <button onClick={() => this.onSetCustomPinImage(p.id, 'delete')}
                                                                        type="button"
                                                                        className="btn btn-danger me-2 dark btn-sm">
                                                                    {trans['maps']['Delete pin']}
                                                                </button> : ''}
                                                        </div>
                                                    </Col>
                                                    <hr/>
                                                </div>
                                            </Collapse>
                                            {index > 0 ?
                                                <Col xs={12}>
                                                    <button onClick={() => this.props.onSetMapCustomPin('', '', p.id, 'delete')}
                                                        type="button"
                                                        className="btn btn-danger mt-2 dark btn-sm">
                                                        <i className="bi bi-trash me-2"></i>
                                                        {trans['maps']['Delete pin']}
                                                    </button>
                                                </Col> : ''}
                                        </Row>
                                    </CardBody>
                                </Card>
                            )
                        })}

                        <Col xs={12}>
                            <button onClick={() => this.props.onAddMapCustomPin('add_gmaps_pin')}
                                type="button"
                                className="btn btn-switch-blue dark btn-sm">
                                <i className="bi bi-node-plus me-2"></i>
                                {trans['maps']['Add new pin']}
                            </button>
                        </Col>
                    </div>
                </Collapse>

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