import * as React from "react";
import {Card, CardBody, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import FileMangerModal from "../../../AppMedien/Modal/FileMangerModal";
import ColorPicker from "../../../AppComponents/ColorPicker";

const v5NameSpace = 'c024f8a4-d2ec-11ee-8d46-325096b39f47';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MenuEditCatForm extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.menuRef = React.createRef();
        this.state = {
            didUpdateManager: false,
            fileManagerShow: false,
            selectedImage: '',
            fmOptions: {
                multiSelect: false,
                maxSelect: 1,
                fileType: 'image',
                fmTitle: trans['app']['Select image'],
                fmButtonTxt: trans['app']['Insert image'],
            },
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onColorChangeCallback = this.onColorChangeCallback.bind(this);

        this.fileManagerDidUpdate = this.fileManagerDidUpdate.bind(this);
        this.setFileManagerShow = this.setFileManagerShow.bind(this);
        this.fileManagerCallback = this.fileManagerCallback.bind(this);
        this.onSetAppImage = this.onSetAppImage.bind(this);
    }

    onColorChangeCallback(color, handle) {
        this.props.onSetMenuCategorySettings(color, handle)
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
            let img;
            files.map((i, index) => {
                img = {
                    image: i.fileName,
                    imgId: i.id,
                    type: i.type,
                    attr: i.sizeData.attr,
                    alt: i.alt,
                    labelling: i.labelling,
                    title: i.title,
                    file_size: i.file_size,
                    customCss: i.customCss,
                    description: i.description,
                    original: i.original,
                    urls: i.urls
                }
            })
            this.props.onSetMenuCategorySettings(img, 'img')
        }
    }

    onSetAppImage(type) {
        this.setState({
            selectedImage: type,
            didUpdateManager: true,
            fileManagerShow: true
        })
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'update_menu',
            'menu': JSON.stringify(this.props.menu),
            'settings': JSON.stringify(this.props.settings),
        }
        this.props.sendAxiosFormdata(formData)
    }

    render() {
        return (
            <React.Fragment>
                <Card className="shadow-sm  mt-2">
                    <CardBody>
                        <Col xl={8} xs={12} className="mx-auto">
                            <div className="d-flex align-items-center">
                                <button onClick={() => this.props.onToggleCollapseMenu('structure')}
                                        className="btn btn-success-custom btn-sm mb-3 dark">
                                    <i className="bi bi-reply-all me-2"></i>
                                    {trans['menu']['back to the menu']}
                                </button>
                                <div className="ms-auto text-muted">
                                    {this.props.menu.type === 'main' ? trans['menu']['Main menu'] : trans['menu']['Custom Menu']}
                                </div>
                            </div>
                            <Card>
                                <CardBody>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row className="g-2">
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['menu']['Menu designation']} *`}
                                                >
                                                    <Form.Control
                                                        required={true}
                                                        value={this.props.menu.title || ''}
                                                        onChange={(e) => this.props.onSetMenuCategory(e.currentTarget.value, 'title')}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['menu']['Menu designation']}/>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['system']['Slug']} *`}
                                                >
                                                    <Form.Control
                                                        required={true}
                                                        value={this.props.menu.slug || ''}
                                                        onChange={(e) => this.props.onSetMenuCategory(e.currentTarget.value, 'slug')}
                                                        className="no-blur"
                                                        type="text"
                                                        placeholder={trans['system']['Slug']}/>
                                                </FloatingLabel>
                                            </Col>

                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['system']['Description']}`}
                                                >
                                                    <Form.Control
                                                        required={false}
                                                        value={this.props.menu.description || ''}
                                                        onChange={(e) => this.props.onSetMenuCategory(e.currentTarget.value, 'description')}
                                                        className="no-blur"
                                                        as="textarea"
                                                        style={{height: '100px'}}
                                                        placeholder={trans['system']['Description']}/>
                                                </FloatingLabel>
                                            </Col>
                                            {this.props.menu.type === 'main' ?
                                            <Col xs={12}>
                                                <hr/>
                                                <div className="fw-semibold text-body fs-5">Menu Settings</div>
                                                <hr className="mb-1"/>
                                            </Col>: ''}
                                            {this.props.menu.type === 'main' ?
                                                <Col xl={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['menu']['Navigation Text']} `}
                                                    >
                                                        <Form.Control
                                                            required={false}
                                                            disabled={this.props.settings.img && this.props.settings.img.imgId}
                                                            value={this.props.settings.brand_text || ''}
                                                            onChange={(e) => this.props.onSetMenuCategorySettings(e.currentTarget.value, 'brand_text')}
                                                            className="no-blur mb-2"
                                                            type="text"
                                                            placeholder={trans['menu']['Navigation Text']}/>
                                                    </FloatingLabel>
                                                </Col> : ''}
                                            {this.props.menu.type === 'main' ?
                                                <React.Fragment>
                                                    <Col xs={12}>
                                                        <div
                                                            className="fw-semibold text-body">{trans['menu']['Menu Container']}</div>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.container === 'container' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('container', 'container')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['container']}
                                                            />
                                                            <Form.Check
                                                                className="no-blur"
                                                                checked={this.props.settings.container === 'container-fluid' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('container-fluid', 'container')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['container-fluid']}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col className="gy-0" xs={12}>
                                                        <div className="form-text">
                                                            {trans['menu']['container-fluid extends across the entire width of the browser']}
                                                        </div>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <div
                                                            className="fw-semibold text-body">{trans['menu']['Menu alignment']}</div>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_align === 'start' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('start', 'menu_align')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['Menu left']}
                                                            />
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_align === 'center' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('center', 'menu_align')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['Menu centre']}
                                                            />
                                                            <Form.Check
                                                                className="no-blur"
                                                                checked={this.props.settings.menu_align === 'end' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('end', 'menu_align')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['Menu right']}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <div
                                                            className="fw-semibold text-body">{trans['menu']['Horizontal menu alignment']}</div>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_horizontal_align === 'start' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('start', 'menu_horizontal_align')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['Menu top']}
                                                            />
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_horizontal_align === 'center' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('center', 'menu_horizontal_align')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['Menu centre']}
                                                            />
                                                            <Form.Check
                                                                className="no-blur"
                                                                checked={this.props.settings.menu_horizontal_align === 'end' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('end', 'menu_horizontal_align')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label={trans['menu']['Menu below']}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <div
                                                            className="fw-semibold text-body">{trans['menu']['Container breakpoint']}</div>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.container_breakpoint === 'md' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('md', 'container_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="MD"
                                                            />
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.container_breakpoint === 'lg' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('lg', 'container_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="LG"
                                                            />
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.container_breakpoint === 'xl' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('xl', 'container_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="XL"
                                                            />
                                                            <Form.Check
                                                                className="no-blur"
                                                                checked={this.props.settings.container_breakpoint === 'xxl' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('xxl', 'container_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="XXL"
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <div
                                                            className="fw-semibold text-body">{trans['menu']['Menu breakpoint']}</div>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div className="d-flex flex-wrap align-items-center">
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_breakpoint === 'md' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('md', 'menu_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="MD"
                                                            />
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_breakpoint === 'lg' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('lg', 'menu_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="LG"
                                                            />
                                                            <Form.Check
                                                                className="no-blur me-4"
                                                                checked={this.props.settings.menu_breakpoint === 'xl' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('xl', 'menu_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="XL"
                                                            />
                                                            <Form.Check
                                                                className="no-blur"
                                                                checked={this.props.settings.menu_breakpoint === 'xxl' || false}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings('xxl', 'menu_breakpoint')}
                                                                type="radio"
                                                                id={uuidv4()}
                                                                label="XXL"
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col xs={12}>
                                                        <div
                                                            className="fw-semibold text-body">{trans['menu']['Navigation background colour']}</div>
                                                    </Col>

                                                    <ColorPicker
                                                        color={this.props.settings.nav_bg || ''}
                                                        callback={this.onColorChangeCallback}
                                                        handle="nav_bg"
                                                    />
                                                    <hr className="mb-1"/>

                                                    <Col xs={12}>
                                                        <Col xl={4} sm={6} xs={12} className="text-center mx-auto">
                                                            <div
                                                                className="mb-2">{trans['menu']['Menu Brand Image']}</div>
                                                            <div className="d-flex flex-column align-items-stretch">
                                                                {this.props.settings.img && this.props.settings.img.imgId ?
                                                                    <React.Fragment>
                                                                        <div style={{width: 'auto', height: '150px'}}
                                                                             className="p-1 border rounded overflow-hidden d-flex mx-auto mb-3">
                                                                            <img
                                                                                // style={{objectFit: 'cover'}}
                                                                                className="rounded img-fluid"
                                                                                alt={trans['menu']['Menu Brand Image']}
                                                                                src={this.props.settings.img.type === 'image' ? `${publicSettings.medium_url}/${this.props.settings.img.image}` : `${publicSettings.public_mediathek}/${this.props.settings.img.image}`}/>
                                                                        </div>
                                                                    </React.Fragment>
                                                                    :
                                                                    <div
                                                                        className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                                                }
                                                                <div className="mt-auto">
                                                                    <button
                                                                        onClick={() => this.onSetAppImage('brand_logo')}
                                                                        type="button"
                                                                        className="btn btn-switch-blue dark btn-sm">
                                                                        {this.props.settings.img ? trans['app']['Change image'] : trans['app']['Select image']}
                                                                    </button>
                                                                    {this.props.settings.img && this.props.settings.img.imgId ?
                                                                        <button
                                                                            onClick={() => this.props.onSetMenuCategorySettings([], 'img')}
                                                                            type="button"
                                                                            className="btn btn-danger ms-2 dark btn-sm">
                                                                            {trans['delete']}
                                                                        </button> : ''}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Col>
                                                </React.Fragment> : ''}
                                            {this.props.settings.img && this.props.settings.img.imgId ?
                                                <React.Fragment>
                                                    <Col xl={4} lg={6} xs={12}>
                                                        <Form.Group controlId={uuidv4()} className="my-3">
                                                            <Form.Label className="small">
                                                                {trans['system']['Image size']}
                                                                <span className="fw-semibold mx-2">
                                                            {trans['menu']['Display']}:
                                                        </span>
                                                                {this.props.settings.size_full || ''} px
                                                            </Form.Label>
                                                            <Form.Range
                                                                min={5}
                                                                max={500}
                                                                step={5}
                                                                value={this.props.settings.size_full || ''}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings(e.currentTarget.value, 'size_full')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={4} lg={6} xs={12}>
                                                        <Form.Group controlId={uuidv4()} className="my-3">
                                                            <Form.Label className="small">
                                                                {trans['system']['Image size']}
                                                                <span className="fw-semibold mx-2">
                                                            {trans['menu']['Scroll']}:
                                                        </span>
                                                                {this.props.settings.size_scroll || ''} px
                                                            </Form.Label>
                                                            <Form.Range
                                                                min={5}
                                                                max={500}
                                                                step={5}
                                                                value={this.props.settings.size_scroll || ''}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings(e.currentTarget.value, 'size_scroll')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={4} lg={6} xs={12}>
                                                        <Form.Group controlId={uuidv4()} className="my-3">
                                                            <Form.Label className="small">
                                                                {trans['system']['Image size']}
                                                                <span className="fw-semibold mx-2">
                                                            {trans['menu']['Mobil']}:
                                                        </span>
                                                                {this.props.settings.size_mobil || ''} px
                                                            </Form.Label>
                                                            <Form.Range
                                                                min={5}
                                                                max={500}
                                                                step={5}
                                                                value={this.props.settings.size_mobil || ''}
                                                                onChange={(e) => this.props.onSetMenuCategorySettings(e.currentTarget.value, 'size_mobil')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </React.Fragment>
                                                : ''}
                                            <Col xs={12}>
                                                <hr/>
                                                <Form.Check
                                                    className="no-blur mt-2"
                                                    checked={this.props.menu.active || false}
                                                    onChange={(e) => this.props.onSetMenuCategory(e.currentTarget.checked, 'active')}
                                                    type="switch"
                                                    id={uuidv4()}
                                                    label={trans['menu']['Menu activated']}
                                                />
                                            </Col>
                                            <Col xs={12}>
                                                <hr className="mt-1"/>
                                                <button className="btn btn-switch-blue dark btn-sm" type="submit">
                                                    <i className="bi bi-save2 me-2"></i>
                                                    {trans['system']['Save']}
                                                </button>
                                            </Col>
                                        </Row>
                                    </Form>

                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>
                </Card>
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