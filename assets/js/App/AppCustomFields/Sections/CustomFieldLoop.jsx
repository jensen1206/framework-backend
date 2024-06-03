import * as React from "react";
import Accordion from 'react-bootstrap/Accordion';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {Card, CardBody, CardHeader, ButtonGroup, Col, Row} from "react-bootstrap";
import {ReactSortable} from "react-sortablejs";
import AppIcons from "../../AppIcons/AppIcons";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";

export default class CustomFieldLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showModalIcons: false,
            editId: '',
            sortableOptions: {
                animation: 300,
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

        this.onSetShowModalIcons = this.onSetShowModalIcons.bind(this);
        this.onIconCallback = this.onIconCallback.bind(this);
        this.onGetIconModal = this.onGetIconModal.bind(this);
        this.onSetActive = this.onSetActive.bind(this);


    }

    onSetShowModalIcons(state) {
        this.setState({
            showModalIcons: state
        })
    }

    onGetIconModal(id) {
        this.setState({
            editId: id,
            showModalIcons: true
        })
    }

    onSetActive(e) {
        let currentActive = e.currentTarget.classList.contains('active');
        $('.header-item').removeClass('active')
        if (!currentActive) {
            e.currentTarget.classList.add('active')
        }
    }

    onIconCallback(icon) {
        this.props.onSetValue(icon, 'icon', this.state.editId)
    }

    render() {
        return (
            <React.Fragment>
                <Col style={{minHeight: '55vh'}} xxl={8} xl={10} xs={12} className="mx-auto">
                    <Card>
                        <CardHeader className="bg-body-tertiary fs-5 text-bod py-3 align-items-center d-flex flex-wrap">
                            <div>
                                {trans['system']['Custom Fields']}
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                                <div
                                    className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                <small>
                                    <SetAjaxResponse
                                        status={this.props.spinner.ajaxStatus}
                                        msg={this.props.spinner.ajaxMsg}
                                    />
                                </small>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {this.props.customTypes && this.props.customTypes.length ?
                                <Accordion className="overflow-hidden">
                                    <ReactSortable
                                        list={this.props.customTypes}
                                        handle=".cursor-move"
                                        setList={(newState) => this.props.onSetCustomSortable(newState)}
                                        {...this.state.sortableOptions}
                                        onEnd={(e) => this.props.onUpdateSortable(e)}
                                    >
                                        {this.props.customTypes.map((c, index) => {
                                            return (
                                                <Accordion.Item key={index} eventKey={c.id}>
                                                    <div onClick={(e) => this.onSetActive(e)}
                                                         className="position-relative header-item">
                                                        <div
                                                            className="slider-edit-box d-flex align-items-center justify-content-center bg-body-tertiary h-100">
                                                            <div
                                                                className="border-end cursor-move slider-edit-icon d-flex align-items-center justify-content-center h-100"
                                                                style={{width: '2.75rem'}}>
                                                                <i className="bi bi-arrows-move"></i>
                                                            </div>
                                                            <div
                                                                onClick={() => this.props.onDeleteCustomField(c.id)}
                                                                className="h-100 cursor-pointer slider-edit-icon border-end d-flex align-items-center justify-content-center"
                                                                style={{width: '2.75rem'}}>
                                                                <i className="bi bi-trash text-danger"></i>
                                                            </div>
                                                        </div>
                                                        <Accordion.Header>
                                                            <div className="slider-edit-item">
                                                                {c.icon ?
                                                                    <i className={`${c.icon} me-2`}></i>
                                                                    : ''}
                                                                {c.designation || ''}
                                                                <small className="d-block small-lg">{c.value}</small>
                                                            </div>
                                                        </Accordion.Header>
                                                    </div>
                                                    <Accordion.Body>
                                                        <Row className="g-2">
                                                            <Col xl={6} xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`${trans['Designation']} *`}
                                                                >
                                                                    <Form.Control
                                                                        required={true}
                                                                        value={c.designation || ''}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'designation', c.id)}
                                                                        className="no-blur"
                                                                        type="text"
                                                                        placeholder={trans['Designation']}/>
                                                                </FloatingLabel>
                                                            </Col>
                                                            {this.props.selectType ?
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv4()}
                                                                        label={`${trans['Field type']} *`}>
                                                                        <Form.Select
                                                                            className="no-blur"
                                                                            required={true}
                                                                            value={c.type || ''}
                                                                            onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'type', c.id)}
                                                                            aria-label={trans['Field type']}>
                                                                            {this.props.selectType.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                : ''}
                                                            <Col xl={6} xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`${trans['forms']['Value']}`}
                                                                >
                                                                    <Form.Control
                                                                        required={false}
                                                                        value={c.value || ''}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'value', c.id)}
                                                                        className="no-blur"
                                                                        type="text"
                                                                        placeholder={trans['forms']['Value']}/>
                                                                </FloatingLabel>
                                                            </Col>
                                                            <Col xl={6} xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`${trans['forms']['Extra CSS']}`}
                                                                >
                                                                    <Form.Control
                                                                        required={false}
                                                                        value={c.extra_css || ''}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'extra_css', c.id)}
                                                                        className="no-blur"
                                                                        type="text"
                                                                        placeholder={trans['forms']['Extra CSS']}/>
                                                                </FloatingLabel>
                                                            </Col>
                                                            {c.icon ?
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv4()}
                                                                        label={`${trans['plugins']['Icon CSS']}`}
                                                                    >
                                                                        <Form.Control
                                                                            required={false}
                                                                            value={c.icon_css || ''}
                                                                            onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'icon_css', c.id)}
                                                                            className="no-blur"
                                                                            type="text"
                                                                            placeholder={trans['plugins']['Icon CSS']}/>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                : ''}
                                                            {c.type === 'url' ?
                                                                <Col xl={6} xs={12}>
                                                                    <div className="d-flex flex-wrap">
                                                                        <div className="">
                                                                            <Form.Check
                                                                                label={trans['Show URL']}
                                                                                type="radio"
                                                                                checked={c.show_url === 'url'}
                                                                                onChange={(e) => this.props.onSetValue('url', 'show_url', c.id)}
                                                                                id={uuidv4()}
                                                                            />
                                                                            <Form.Check
                                                                                label={trans['Show name']}
                                                                                type="radio"
                                                                                checked={c.show_url === ''}
                                                                                onChange={(e) => this.props.onSetValue('', 'show_url', c.id)}
                                                                                id={uuidv4()}
                                                                            />
                                                                        </div>
                                                                        <div className="ms-xl-auto">
                                                                            <Form.Check
                                                                                label={trans['forms']['Open in new tab']}
                                                                                type="checkbox"
                                                                                checked={c.new_tab || false}
                                                                                onChange={(e) => this.props.onSetValue(e.currentTarget.checked, 'new_tab', c.id)}
                                                                                id={uuidv4()}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col> : ''}
                                                            <Col xs={12}>
                                                                <div className="my-3">
                                                                    {c.icon ?
                                                                        <div className="mb-3 ms-5">
                                                                            <i style={{fontSize: '40px'}}
                                                                               className={`${c.icon}`}></i>
                                                                        </div> : ''}
                                                                    <button onClick={() => this.onGetIconModal(c.id)}
                                                                            type="button"
                                                                            className="btn btn-switch-blue dark btn-sm">
                                                                        {c.icon ? trans['plugins']['Change icon'] : trans['plugins']['Select icon']}
                                                                    </button>
                                                                    {c.icon ?
                                                                        <button
                                                                            onClick={() => this.props.onSetValue('', 'icon', c.id)}
                                                                            type="button"
                                                                            title={trans['plugins']['Delete icon']}
                                                                            className="btn btn-danger ms-1 dark btn-sm">
                                                                            <i className="bi bi-trash"></i>
                                                                        </button> : ''}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            )
                                        })}
                                    </ReactSortable>
                                </Accordion>
                                :
                                <div className="text-danger fs-5">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {trans['system']['No custom fields available']}
                                </div>
                            }
                        </CardBody>
                    </Card>
                </Col>
                <AppIcons
                    showModalIcons={this.state.showModalIcons}
                    onSetShowModalIcons={this.onSetShowModalIcons}
                    onIconCallback={this.onIconCallback}
                />
            </React.Fragment>
        )
    }
}