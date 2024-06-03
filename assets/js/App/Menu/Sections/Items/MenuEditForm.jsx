import * as React from "react";
import {Card, CardBody, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from 'uuid';
import Col from "react-bootstrap/Col";
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";
import * as AppTools from "../../../AppComponents/AppTools";

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MenuEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.menuRef = React.createRef();
        this.state = {}

        this.updateMenu = this.updateMenu.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteAppMenu = this.onDeleteAppMenu.bind(this);

    }
    onDeleteAppMenu() {
        let formData = {
            'method': 'delete_app_menu',
            'id': this.props.edit.id,
            'cat': this.props.id
        }
        this.props.sendAxiosFormdata(formData).then()
    }
    updateMenu(e, type) {

        let upd = this.props.edit;
        upd[type] = e;
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
         let formData = {
             'method': 'update_group',
             'group': JSON.stringify(upd)
         }
         _this.sendAxiosFormdata(formData).then()

        }, 1000);

    }

    async sendAxiosFormdata(formData, isFormular = false, url = menuSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, menuSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'update_group':
                             $('#menuTitle'+data.id).html(data.title)
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }


    render() {
        return (
            <Card className="shadow-sm menu-card mt-2 border-success">
                <CardBody>
                    <Form.Group className="mb-2" controlId={uuidv4()}>
                        <Form.Label className="small mb-1">
                            {`${trans['menu']['Displayed name']} *`}
                        </Form.Label>
                        <Form.Control
                            size="sm"
                            required={true}
                            defaultValue={this.props.edit.title || ''}
                            onChange={(e) => this.updateMenu(e.currentTarget.value, 'title')}
                            className="no-blur"
                            type="text"
                        />
                    </Form.Group>
                    <div className="d-flex align-items-center small mt-3 mb-2">
                        <Form.Check
                            className="no-blur"
                            defaultChecked={this.props.edit.newTab || false}
                            onChange={(e) => this.updateMenu(e.currentTarget.checked, 'newTab')}
                            type="checkbox"
                            id={uuidv4()}
                            label={trans['menu']['Open link in a new tab']}
                        />
                    </div>
                    <Form.Group className="mb-2" controlId={uuidv4()}>
                        <Form.Label className="small mb-1">
                            {`${trans['menu']['Attribut title (optional)']}`}
                        </Form.Label>
                        <Form.Control
                            size="sm"
                            required={false}
                            defaultValue={this.props.edit.attr || ''}
                            onChange={(e) => this.updateMenu(e.currentTarget.value, 'attr')}
                            className="no-blur"
                            type="text"
                        />
                    </Form.Group>
                    <Row className="gx-2">
                        <Col xs={12} xl={6}>
                            <Form.Group className="mb-2" controlId={uuidv4()}>
                                <Form.Label className="small mb-1">
                                    {`${trans['menu']['CSS classes (optional)']}`}
                                </Form.Label>
                                <Form.Control
                                    size="sm"
                                    required={false}
                                    defaultValue={this.props.edit.cssClass || ''}
                                    onChange={(e) => this.updateMenu(e.currentTarget.value, 'cssClass')}
                                    className="no-blur"
                                    type="text"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} xl={6}>
                            <Form.Group className="mb-2" controlId={uuidv4()}>
                                <Form.Label className="small mb-1">
                                    {`${trans['menu']['Link relationships (XFN)']}`}
                                </Form.Label>
                                <Form.Control
                                    size="sm"
                                    required={false}
                                    defaultValue={this.props.edit.xfn || ''}
                                    onChange={(e) => this.updateMenu(e.currentTarget.value, 'xfn')}
                                    className="no-blur"
                                    type="text"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group
                                className="mb-2"
                                controlId={uuidv4()}>
                                <Form.Label
                                    className="small mb-1"
                                >
                                    {trans['system']['Description']}
                                </Form.Label>
                                <Form.Control
                                    className="no-blur"
                                    as="textarea"
                                    defaultValue={this.props.edit.description || ''}
                                    onChange={(e) => this.updateMenu(e.currentTarget.value, 'description')}
                                    rows={3}/>
                            </Form.Group>
                        </Col>
                        <div className="d-flex align-items-center small mt-2">
                            <Form.Check
                                className="no-blur"
                                type="checkbox"
                                id={uuidv4()}
                                defaultChecked={this.props.edit.active || false}
                                onChange={(e) => this.updateMenu(e.currentTarget.checked, 'active')}
                                label={trans['menu']['Menu activated']}
                            />
                        </div>
                        <div className="d-flex align-items-center small">
                            <Form.Check
                                className="no-blur"
                                type="checkbox"
                                id={uuidv4()}
                                defaultChecked={this.props.edit.showLogin || false}
                                onChange={(e) => this.updateMenu(e.currentTarget.checked, 'showLogin')}
                                label={trans['menu']['show only with login']}
                            />
                        </div>
                        <div className="d-flex align-items-center small mb-2">
                            <Form.Check
                                className="no-blur"
                                type="checkbox"
                                id={uuidv4()}
                                defaultChecked={this.props.edit.showNotLogin || false}
                                onChange={(e) => this.updateMenu(e.currentTarget.checked, 'showNotLogin')}
                                label={trans['menu']['Do not display on login']}
                            />
                        </div>
                        <Col xs={12}>
                            <hr className="mt-1 mb-2"/>
                            <div className="small text-muted mb-3">
                                {trans['menu']['Original name']}:
                                <a className="text-decoration-none"
                                   href={this.props.edit.url}> {this.props.edit.originalTitle || ''}
                                </a>
                            </div>
                            <div onClick={this.onDeleteAppMenu}
                                className="small hover-scale min d-inline-block text-danger cursor-pointer">
                                <i className="bi bi-trash small me-2"></i>
                                {trans['menu']['Remove']}
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}