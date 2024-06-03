import * as React from "react";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {ReactSortable} from "react-sortablejs";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import Accordion from 'react-bootstrap/Accordion';

const v5NameSpace = 'a05868e4-05fe-49f8-b0b7-e0962847fde7';
import ColorPicker from "../../../AppComponents/ColorPicker";
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";
import * as AppTools from "../../../AppComponents/AppTools";

export default class BackenOSMLeaflet extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            collAdd: false,
            pinId: '',
            selectedImage: '',
            addOsm: {
                zip: '',
                city: '',
                street: '',
                hnr: ''
            },
            fmOptions: {
                multiSelect: false,
                fileType: 'image',
                maxSelect: 1,
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
            sortableOptions: {
                animation: 300,
                // handle: ".arrow-sortable",
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
        }
        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);
        this.onSetAddOsm = this.onSetAddOsm.bind(this);
        this.addSearchOsm = this.addSearchOsm.bind(this);
        this.deletePin = this.deletePin.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onSetPinEdit = this.onSetPinEdit.bind(this);
        this.setSortablePins = this.setSortablePins.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

        //Filemanager
        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);

    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    deletePin(id) {
        let edit = this.props.edit;
        const updPin = this.filterArrayElementById([...edit.pins], id);
        this.props.onSetOsmLeaflet(updPin)
    }

    addSearchOsm() {
        if (!this.state.addOsm.city) {
            AppTools.warning_message(trans['maps']['No address found']);
            return false;
        }
        let formData = {
            'method': 'search_osm_address',
            'address': JSON.stringify(this.state.addOsm)
        }
        this.sendAxiosFormdata(formData).then()
    }

    onSetAddOsm(e, type) {
        let upd = this.state.addOsm;
        upd[type] = e;
        this.setState({
            addOsm: upd
        })
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
            this.props.onSetStateConfig(files[0]['fileName'], this.state.selectedImage)
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

    onColorChangeCallback(color, handle, id) {
        if (id) {
            let edit = this.props.edit;
            const updPin = this.findArrayElementById([...edit.pins], id);
            updPin[handle] = color;
            this.props.onSetOsmLeaflet(edit.pins)
        }
    }


    onSetPinEdit(e, type, id) {
        let edit = this.props.edit;
        const updPin = this.findArrayElementById([...edit.pins], id);
        updPin[type] = e;
        this.props.onSetOsmLeaflet(edit.pins)
    }

    setSortablePins(newState) {
        this.props.onSetOsmLeaflet(newState)
    }

    async sendAxiosFormdata(formData, isFormular = false, url = builderPluginSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, builderPluginSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'search_osm_address':
                            if (data.status) {
                                let edit = this.props.edit;
                                edit['pins'] = [...edit['pins'], data.record]

                                this.props.onSetOsmLeaflet(edit['pins'])
                                this.props.onSetColOsmLeaflet(false);
                                this.setState({
                                    addOsm: {
                                        zip: '',
                                        city: '',
                                        street: '',
                                        hnr: ''
                                    },
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
                <Row className="g-2">
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
                            controlId={uuidv4()}
                            label={`${trans['maps']['max Cluster Radius']} `}
                        >
                            <Form.Control
                                required={true}
                                value={this.props.edit.config.maxClusterRadius || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'maxClusterRadius')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['maps']['max Cluster Radius']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['plugins']['Width']} `}
                        >
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.width || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'width')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['plugins']['Width']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={6} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['plugins']['Height']} `}
                        >
                            <Form.Control
                                required={false}
                                value={this.props.edit.config.height || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'height')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['plugins']['Height']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={4} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['maps']['Zoom']} `}
                        >
                            <Form.Control
                                required={true}
                                min={1}
                                max={18}
                                value={this.props.edit.config.zoom || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'zoom')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['maps']['Zoom']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={4} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['maps']['Min zoom']} `}
                        >
                            <Form.Control
                                required={true}
                                value={this.props.edit.config.min_zoom || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'min_zoom')}
                                className="no-blur"
                                type="number"
                                min={1}
                                max={18}
                                placeholder={trans['maps']['Min zoom']}/>
                        </FloatingLabel>
                    </Col>
                    <Col xl={4} xs={12}>
                        <FloatingLabel
                            controlId={uuidv4()}
                            label={`${trans['maps']['Max zoom']} `}
                        >
                            <Form.Control
                                required={true}
                                min={1}
                                max={18}
                                value={this.props.edit.config.max_zoom || ''}
                                onChange={(e) => this.props.onSetStateConfig(e.target.value, 'max_zoom')}
                                className="no-blur"
                                type="number"
                                placeholder={trans['maps']['Max zoom']}/>
                        </FloatingLabel>
                    </Col>


                    <Col xs={12}>
                        <Form.Check
                            type="switch"
                            className="me-4"
                            checked={this.props.edit.config.mini_map_active || false}
                            onChange={(e) => this.props.onSetStateConfig(e.target.checked, 'mini_map_active')}
                            id={uuidv4()}
                            label={trans['maps']['Show MiniMap']}
                        />
                    </Col>
                    <Collapse in={this.props.edit.config.mini_map_active}>
                        <div id={uuidv4()}>
                            <Row className="g-2">
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['maps']['MiniMap width']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            value={this.props.edit.config.mini_map_width || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'mini_map_width')}
                                            className="no-blur"
                                            type="number"
                                            placeholder={trans['maps']['MiniMap width']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['maps']['MiniMap height']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            value={this.props.edit.config.mini_map_height || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'mini_map_height')}
                                            className="no-blur"
                                            type="number"
                                            placeholder={trans['maps']['MiniMap height']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['maps']['MiniMap min. zoom']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            min={1}
                                            max={18}
                                            value={this.props.edit.config.mini_map_min_zoom || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'mini_map_min_zoom')}
                                            className="no-blur"
                                            type="number"
                                            placeholder={trans['maps']['MiniMap min. zoom']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['maps']['MiniMap max. zoom']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            min={1}
                                            max={18}
                                            value={this.props.edit.config.mini_map_max_zoom || ''}
                                            onChange={(e) => this.props.onSetStateConfig(e.target.value, 'mini_map_max_zoom')}
                                            className="no-blur"
                                            type="number"
                                            placeholder={trans['maps']['MiniMap max. zoom']}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                        </div>
                    </Collapse>

                    <Col xl={6} xs={12}>
                        <div className="fs-6 mb-1">
                            {trans['maps']['Standard Pin']}
                        </div>
                        {this.props.edit.config.pin ?
                            <img
                                style={{
                                    objectFit: 'cover',
                                    width: '21px',
                                    height: '30px'
                                }}
                                className="img-fluid"
                                src={`${publicSettings.public_mediathek}/${this.props.edit.config.pin} `}
                                alt=""/>
                            :
                            <div style={{width: '30px', height: '30px'}}
                                 className="placeholder-account-image p-1 border rounded"></div>
                        }
                        <div className="my-3">
                            <button onClick={() => this.onSetAppImage('pin')}
                                    type="button"
                                    className="btn btn-switch-blue me-2 dark btn-sm">
                                {this.props.edit.config.pin ? trans['maps']['Change pin'] : trans['maps']['Select pin']}
                            </button>
                            {this.props.edit.config.pin ?
                                <button onClick={() => this.props.onSetStateConfig('', 'pin')}
                                        type="button"
                                        className="btn btn-danger me-2 dark btn-sm">
                                    {trans['maps']['Delete pin']}
                                </button> : ''}
                        </div>
                    </Col>
                    <Col xs={12}>
                        <hr className="mt-1 mb-2"/>
                        <div className="fs-5 mb-2">
                            <i className="bi bi-pin me-2"></i>
                            {trans['maps']['Cards Pins']}
                        </div>
                        {this.props.edit.pins && this.props.edit.pins.length ?
                            <Accordion>
                                <ReactSortable
                                    className="sortable-pins"
                                    list={this.props.edit.pins}
                                    handle=".cursor-move"
                                    setList={(newState) => this.setSortablePins(newState)}
                                    {...this.state.sortableOptions}
                                >
                                    {this.props.edit.pins.map((p, index) => {
                                        return (
                                            <Accordion.Item key={index} eventKey={p.id}>
                                                <Accordion.Header className="position-relative">
                                                    <div className="d-flex align-items-center text-truncate">
                                                        <div className="text-truncate ps-1 ms-4 me-2">
                                                            <div className="arrow-sortable-before cursor-move"></div>
                                                            {p.geo_json.display_name || ''}
                                                        </div>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <Row className="g-2">
                                                        <Col xs={12}>
                                                            <FloatingLabel
                                                                controlId={uuidv4()}
                                                                label={`${trans['maps']['Pin Textbox']}`}
                                                            >
                                                                <Form.Control
                                                                    required={false}
                                                                    value={p.textbox || ''}
                                                                    onChange={(e) => this.onSetPinEdit(e.target.value, 'textbox', p.id)}
                                                                    className="no-blur"
                                                                    as="textarea"
                                                                    style={{height: '100px'}}
                                                                    placeholder={trans['maps']['Pin Textbox']}/>
                                                            </FloatingLabel>
                                                            <div className="form-text">
                                                                {trans['carousel']['HTML can be used']}
                                                            </div>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <div className="d-flex flex-wrap">
                                                                <Form.Check
                                                                    type="switch"
                                                                    className="me-4"
                                                                    checked={p.show_pin || false}
                                                                    onChange={(e) => this.onSetPinEdit(e.target.checked, 'show_pin', p.id)}
                                                                    id={uuidv4()}
                                                                    label={trans['maps']['Show pin']}
                                                                />
                                                                <Form.Check
                                                                    type="switch"
                                                                    className="me-4"
                                                                    checked={p.polygone_show || false}
                                                                    onChange={(e) => this.onSetPinEdit(e.target.checked, 'polygone_show', p.id)}
                                                                    id={uuidv4()}
                                                                    label={trans['maps']['Custom Polygon active']}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Collapse in={p.polygone_show}>
                                                            <div id={uuidv4()}>
                                                                <hr/>
                                                                <Row className="g-2">
                                                                    <Col xl={6} xs={12}>
                                                                        <div className="mb-1">
                                                                            <div className="mb-1">
                                                                                {trans['maps']['Fill colour']}
                                                                            </div>
                                                                            <div
                                                                                className="picker-color position-relative">
                                                                                <ColorPicker
                                                                                    color={p.polygone_fill}
                                                                                    callback={this.onColorChangeCallback}
                                                                                    handle="polygone_fill"
                                                                                    id={p.id}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <div className="mb-1">
                                                                                {trans['maps']['Border colour']}
                                                                            </div>
                                                                            <div
                                                                                className="picker-color position-relative">
                                                                                <ColorPicker
                                                                                    color={p.polygone_border}
                                                                                    callback={this.onColorChangeCallback}
                                                                                    handle="polygone_border"
                                                                                    id={p.id}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    <Col className="align-self-end" xl={6} xs={12}>
                                                                        <Form.Group className="mb-3"
                                                                                    controlId={uuidv4()}>
                                                                            <Form.Label
                                                                                className="mb-1">
                                                                                {trans['maps']['Polygon border width']} ({p.polygone_border_width})
                                                                            </Form.Label>
                                                                            <Form.Range
                                                                                value={p.polygone_border_width}
                                                                                onChange={(e) => this.onSetPinEdit(e.target.value, 'polygone_border_width', p.id)}
                                                                                min={0.1}
                                                                                max={5}
                                                                                step={0.1}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                                <hr/>
                                                            </div>
                                                        </Collapse>

                                                        <Col xs={12}>
                                                            <button onClick={() => this.deletePin(p.id)}
                                                                    type="button"
                                                                    className="btn btn-danger mt-2 dark btn-sm">
                                                                <i className="bi bi-trash me-2"></i>
                                                                {trans['maps']['Delete pin']}
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
                                    })}
                                </ReactSortable>
                            </Accordion> :
                            <div className="text-danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['maps']['no locations available']}
                            </div>
                        }
                    </Col>
                    <Col xs={12}>
                        <hr className="mt-1"/>
                        <button onClick={() => this.props.onSetColOsmLeaflet(!this.props.colOsmLeaflet)}
                                type="button"
                                className="btn btn-success-custom btn-sm dark">
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['maps']['Add address']}
                        </button>
                    </Col>

                    <Collapse in={this.props.colOsmLeaflet}>
                        <div id={uuidv5('collapseAddAddress', v5NameSpace)}>
                            <Row className="g-2">
                                <Col xxl={3} xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['profil']['Zip code']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            value={this.state.addOsm.zip || ''}
                                            onChange={(e) => this.onSetAddOsm(e.target.value, 'zip')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['profil']['Zip code']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xxl={9} xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['profil']['City']} *`}
                                    >
                                        <Form.Control
                                            required={false}
                                            value={this.state.addOsm.city || ''}
                                            onChange={(e) => this.onSetAddOsm(e.target.value, 'city')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['profil']['City']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xxl={9} xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['profil']['Street']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            value={this.state.addOsm.street || ''}
                                            onChange={(e) => this.onSetAddOsm(e.target.value, 'street')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['profil']['Street']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xxl={3} xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`${trans['profil']['House number']} `}
                                    >
                                        <Form.Control
                                            required={false}
                                            value={this.state.addOsm.hnr || ''}
                                            onChange={(e) => this.onSetAddOsm(e.target.value, 'hnr')}
                                            className="no-blur"
                                            type="text"
                                            placeholder={trans['profil']['House number']}/>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <button onClick={this.addSearchOsm}
                                            type="button"
                                            className="btn btn-warning-custom dark">
                                        <i className="bi bi-pin-map me-2"></i>
                                        {trans['maps']['Search address']}
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                </Row>
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