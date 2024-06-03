import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v5 as uuidv5} from 'uuid';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";

const v5NameSpace = 'de60c21a-b62e-11ee-9eff-325096b39f47';

export default class ActivityModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            showActivityModal: false,
            log: {},
            context: []
        }

        this.onCloseActivityModal = this.onCloseActivityModal.bind(this);
        this.onGetActivityData = this.onGetActivityData.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadActivityModal) {
            this.onGetActivityData()

            this.props.onSetLoadActivityModal(false);
        }
    }

    onGetActivityData() {
        let formData = {
            'method': 'get_activity',
            'id': this.props.id || '',
        }
        this.sendAxiosFormdata(formData).then()
    }

    onCloseActivityModal() {
        this.setState({
            showActivityModal: false
        })
        this.props.onSetDrawActivityTable(true)
    }

    async sendAxiosFormdata(formData, isFormular = false, url = logSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, logSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_activity':
                            if (data.status) {
                                this.setState({
                                    showActivityModal: true,
                                    log: data.record,
                                    context: data.record.context
                                })
                            }
                            break;

                    }
                }).catch(err => console.error(err));
        }
    }


    render() {

        return (
            <Modal
                show={this.state.showActivityModal}
                onHide={this.onCloseActivityModal}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header
                    closeButton
                    className="bg-body-tertiary"
                >
                    <Modal.Title
                        className="fw-normal"
                    >
                        {trans['activity']['System Log']}
                        <small className="text-muted ms-3 small-lg">
                            ( {this.state.log.createdAt || ''} )
                        </small>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col xs={12}>
                            <div className="fs-5 mb-2">
                                {this.props.channel === 'queue' ? trans['system']['Activity Log'] : trans['reg']['Registration'] }
                            </div>
                            <div className="d-flex flex-wrap align-items-baseline">
                                <div style={{minWidth: '9rem'}} className="fs-6 me-2">
                                    {trans['activity']['Entry']}:
                                </div>
                                <div className="fs-6 fw-normal ms-2">
                                    {this.state.log.message ||''}
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-baseline">
                                <div style={{minWidth: '9rem'}} className="fs-6 me-2">
                                    {trans['activity']['User']}:
                                </div>
                                <div className="fs-6 fw-normal ms-2">
                                    {this.state.log.user || ''}
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-baseline">
                                <div style={{minWidth: '9rem'}} className="fs-6 me-2">
                                    {trans['activity']['Request ID']}:
                                </div>
                                <div className="fs-6 fw-normal ms-2">
                                    {this.state.log.request_id ||''}
                                </div>
                            </div>

                            <div className="d-flex flex-wrap align-items-baseline">
                                <div style={{minWidth: '9rem'}} className="fs-6 me-2">
                                    {trans['activity']['Channel']}:
                                </div>
                                <div className="fs-6 fw-normal ms-2">
                                    {this.state.log.channel ||''}
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-baseline">
                                <div style={{minWidth: '9rem'}} className="fs-6 me-2">
                                    {trans['activity']['Level']}:
                                </div>
                                <div className="fs-6 fw-normal ms-2">
                                    {this.state.log.level ||''}
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-baseline">
                                <div style={{minWidth: '9rem'}} className="fs-6 me-2">
                                    {trans['activity']['Level Name']}:
                                </div>
                                <div className="fs-6 fw-normal ms-2">
                                    {this.state.log.levelName ||''}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <hr className="mt-0"/>
                            <div className="fs-5 mb-1">Context</div>
                            <ul>
                                {this.state.context.map((c, index) => {
                                   return(
                                       <li key={index}>
                                         <span style={{minWidth: '8rem'}} className="d-inline-block">{c.label}:</span>
                                           {c.value}
                                       </li>
                                   )
                                })}
                            </ul>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary dark" onClick={this.onCloseActivityModal}>
                        {trans['swal']['Close']}
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}