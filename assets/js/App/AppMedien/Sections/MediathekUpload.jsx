import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import MediaUpload from "../../MediaUpload/MediaUpload";
import RadioShowFile from "./Items/RadioShowFile";
import SelectMediaCategory from "./Items/SelectMediaCategory";
import {Card, CardBody, Container, Row} from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import SetAjaxData from "../../AppComponents/SetAjaxData";
import * as AppTools from "../../AppComponents/AppTools";
import Table from 'react-bootstrap/Table';
import UploadTable from "./Items/UploadTable";

const v5NameSpace = '0a103ee1-feae-4905-9524-46c4d7fa5aa9';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MediathekUpload extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.state = {
            selectCategories: [],
            not_complete: false,
            uploadData: []
        }

        this.onMediathekCallback = this.onMediathekCallback.bind(this);
        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onGetCategorySelects = this.onGetCategorySelects.bind(this);

    }


    onMediathekCallback(data, method) {
        //method = upload or delete
        switch (method) {
            case 'upload':
                this.setState({
                    uploadData: [...this.state.uploadData, {
                        id: data.id,
                        file_id: data.file_id,
                        ext: data.ext,
                        filename: data.filename,
                        owner: data.owner,
                        category: data.category,
                        size: data.size,
                        mime: data.mime
                    }]
                })
                //this.props.onUpdateAccounts(data.filename, 'imageFilename')
                break;
            case 'delete':

                break;
            case 'start_complete':
                this.setState({
                    not_complete: data.not_complete
                })
                 this.props.onSetOverviewBtnDisabled(data.not_complete)
                break;
        }

    }

    componentDidMount() {
        if (this.props.loadCategorySelects) {
            this.onGetCategorySelects()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loadCategorySelects) {
            this.onGetCategorySelects()
            this.props.onSetLoadCategorySelect(false)
            this.setState({
                uploadData: []
            })
        }
    }

    onGetCategorySelects() {
        let formData = {
            'method': 'get_category_selects'
        }
        this.sendAxiosFormdata(formData).then()
    }

    async sendAxiosFormdata(formData, isFormular = false, url = uploadSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, uploadSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'get_category_selects':
                            this.setState({
                                selectCategories: data.record
                            })
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    <Card style={{minHeight: '60vh'}} className="shadow-sm">
                        <CardBody>

                                <Form ref={this.uploadRefForm}
                                      id={uuidv5('uploadForm', v5NameSpace)}>
                                    <input type="hidden" name="method" value="media_upload"/>
                                    <input type="hidden" name="account_id"
                                           value={uploadSettings.account_id}/>
                                    <Row className="g-3 align-items-center mb-3">
                                        <Col xs={12} xl={4} lg={6}>
                                            <SelectMediaCategory
                                                readonly={this.state.not_complete}
                                                selectCategories={this.state.selectCategories}
                                            />
                                        </Col>
                                        <Col xs={12} lg={6}>

                                            <RadioShowFile
                                                readonly={this.state.not_complete}
                                            />
                                        </Col>
                                        <hr/>
                                        <Col xs={12} className="d-flex justify-content-center upload-full">
                                            <MediaUpload
                                                onMediathekCallback={this.onMediathekCallback}
                                                form_id={uuidv5('uploadForm', v5NameSpace)}
                                                showUpload={true}
                                                uploadType="mediathek"
                                                assets={uploadSettings.accept}
                                                maxFiles={100}
                                                chunking={true}
                                                delete_after={true}
                                            />
                                        </Col>
                                        <Col xs={12}>
                                            <hr/>
                                        </Col>
                                    </Row>
                                </Form>

                            <UploadTable
                                uploadData={this.state.uploadData}
                            />
                        </CardBody>
                    </Card>
                </Container>
            </React.Fragment>
        )
    }

}