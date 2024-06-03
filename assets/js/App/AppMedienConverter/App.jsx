import * as React from "react";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import * as AppTools from "../AppComponents/AppTools";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import Container from 'react-bootstrap/Container';
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import MediaUpload from "../MediaUpload/MediaUpload";
import Collapse from 'react-bootstrap/Collapse';
import RadioShowFile from "../AppMedien/Sections/Items/RadioShowFile";
import SelectMediaCategory from "../AppMedien/Sections/Items/SelectMediaCategory";
import AlertMsg from "../AppComponents/AlertMsg";

const v5NameSpace = '142d3941-e487-4f80-9d28-6356f02d580f';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.state = {
            selectCategories: [],
            alertShow: false,
            alertVariant: 'danger',
            alert: {
                title: '',
                msg: ''
            },
            alertTitle: '',
            alertMsg: '',
            uploadData: [],
            convertData: {
                img_convert: 1,
                save_media: false,
                category: '',
                is_filemanager: false,
                quality: 80
            },
        }

        this.onMediathekCallback = this.onMediathekCallback.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.changeConvertMethod = this.changeConvertMethod.bind(this);
        this.onGetConvertFormData = this.onGetConvertFormData.bind(this);
        this.onAlertShow = this.onAlertShow.bind(this);


    }

    componentDidMount() {
        this.onGetConvertFormData();
    }

    onAlertShow(state) {
        this.setState({
            alertShow: state
        })
    }

    onGetConvertFormData() {
        let formData = {
            'method': 'get_category_selects'
        }

        this.sendAxiosFormdata(formData).then()

    }

    onMediathekCallback(data, method) {
        //method = upload or delete

        switch (method) {
            case 'upload':
                if (data.upload_status) {
                    this.setState({
                        uploadData: [...this.state.uploadData, {
                            directory: data.directory,
                            filename: data.filename,
                            save_convert_img: data.save_convert_img,
                        }]
                    })
                } else {
                    this.setState({
                        alertShow: true,
                        alert: {
                            msg: data.msg,
                            title: data.title
                        }
                    })
                }
                //this.props.onUpdateAccounts(data.filename, 'imageFilename')
                break;
            case 'delete':

                break;
        }
    }

    changeConvertMethod(e, type) {
        let conv = this.state.convertData;
        conv[type] = e;

        this.setState({
            convertData: conv,
        })

    }

    async sendAxiosFormdata(formData, isFormular = false, url = uploadSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, uploadSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_category_selects':
                            if (data.status) {
                                this.setState({
                                    selectCategories: data.record
                                })
                            }
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {

        return (
            <React.Fragment>
                <Container>
                    <h3 className="fw-semibold text-body">
                        {trans['converter']['Image converter']}
                        <small className="d-block fw-normal mt-2 text-secondary small-lg">
                            <i className="bi bi-caret-right me-1"></i>
                         {trans['converter']['webP - SVG - Image - Converter']}
                        </small>
                    </h3>
                    <hr/>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-body-tertiary py-3 fs-5 fw-semibold">
                            <i className="bi bi-exclude me-2"></i>
                            {trans['converter']['Image converter']}
                        </Card.Header>

                        <CardBody>
                            <Form ref={this.uploadRefForm}
                                  id={uuidv5('uploadForm', v5NameSpace)}>
                                <input type="hidden" name="method" value="convert_media"/>
                                <input type="hidden" name="account_id"
                                       value={uploadSettings.account_id}/>
                                <Row className="g-2 pb-3">
                                    <Col xs={12} className="text-center">
                                        <Form.Check
                                            inline
                                            label={trans['converter']['Image to WebP']}
                                            name="convert"
                                            value={1}
                                            defaultChecked={true}
                                            type="radio"
                                            id={uuidv5('imgToWebP', v5NameSpace)}
                                        />
                                        <Form.Check
                                            inline
                                            label={trans['converter']['WebP to PNG']}
                                            name="convert"
                                            value={4}
                                            defaultChecked={false}
                                            type="radio"
                                            id={uuidv5('webPToPng', v5NameSpace)}
                                        />
                                        <Form.Check
                                            inline
                                            label={trans['converter']['WebP to JPEG']}
                                            name="convert"
                                            value={5}
                                            defaultChecked={false}
                                            type="radio"
                                            id={uuidv5('webPToJpeg', v5NameSpace)}
                                        />
                                        <Form.Check
                                            inline
                                            label={trans['converter']['SVG to PNG']}
                                            name="convert"
                                            value={2}
                                            type="radio"
                                            id={uuidv5('svgToPng', v5NameSpace)}
                                        />
                                        <Form.Check
                                            inline
                                            label={trans['converter']['SVG to WebP']}
                                            name="convert"
                                            value={3}
                                            type="radio"
                                            id={uuidv5('svgToWebP', v5NameSpace)}
                                        />
                                        <Col className="mx-auto" xl={6} lg={10} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('quality', v5NameSpace)}
                                                label={trans['converter']['Quality']}
                                                className="my-3"
                                            >
                                                <Form.Control
                                                    type="number"
                                                    className="no-blur"
                                                    name="quality"
                                                    defaultValue={this.state.convertData.quality || 80}
                                                    placeholder={trans['converter']['Quality']} />
                                            </FloatingLabel>
                                        </Col>
                                        <hr/>
                                        <span className="d-inline-block">
                                            <Form.Check // prettier-ignore
                                                type="switch"
                                                className="no-blur"
                                                name="save_convert_img"
                                                checked={this.state.save_media || false}
                                                onChange={(e) => this.setState({save_media: e.target.checked})}
                                                id={uuidv5('saveMedia', v5NameSpace)}
                                                label={trans['converter']['Save results in media library']}
                                            />
                                        </span>
                                        <hr/>
                                    </Col>
                                    <Collapse in={this.state.save_media}>
                                        <div id={uuidv5('collapseSaveMedia', v5NameSpace)}>
                                            <Col className="mx-auto" xl={6} lg={10} xs={12}>
                                                <SelectMediaCategory
                                                    selectCategories={this.state.selectCategories}
                                                />
                                                <div className="my-3">
                                                    <RadioShowFile/>
                                                </div>
                                            </Col>
                                        </div>
                                    </Collapse>
                                    <Col xl={8} xs={12} className="mx-auto gy-0">
                                        <AlertMsg
                                            alertShow={this.state.alertShow}
                                            alertVariant={this.state.alertVariant}
                                            alert={this.state.alert}
                                            onAlertShow={this.onAlertShow}
                                        />
                                    </Col>
                                    <Col xs={12} className="d-flex justify-content-center upload-full">
                                        <MediaUpload
                                            onMediathekCallback={this.onMediathekCallback}
                                            form_id={uuidv5('uploadForm', v5NameSpace)}
                                            showUpload={true}
                                            uploadType="mediathek"
                                            assets='.jpg,.jpeg,.png,.webp,.svg'
                                            maxFiles={10}
                                            chunking={true}
                                            delete_after={true}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                            {this.state.uploadData.length ? (
                                <React.Fragment>
                                    <div className="convert-grid">
                                        {this.state.uploadData.map((c, index) => {
                                            return (
                                                <div className="convert-item" key={index}>
                                                    <div className="d-flex flex-column h-100">
                                                   <img height={150} className="convert-img flex-fill img-fluid" src={`/stream-media/${c.directory}/${c.filename}`} alt="" />
                                                    <div className="mt-auto text-center border-top border-bottom bg-body-tertiary text-body">
                                                      <a className="text-reset w-100 h-100 text-decoration-none"
                                                         href={`/download-media/1/${c.directory}/${c.filename}`}>
                                                          Download
                                                      </a>
                                                    </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </React.Fragment>
                            ) : ''}
                        </CardBody>
                    </Card>
                </Container>
            </React.Fragment>
        )
    }
}
