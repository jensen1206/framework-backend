import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import {Card, CardBody, CardHeader, Row} from "react-bootstrap";
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const v5NameSpace = '6d281f52-95d4-4129-9a94-bec886ccc067';
export default class GalleryDetails extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            animation: ''
        }
        this.onSetAnimation = this.onSetAnimation.bind(this);

    }

    onSetAnimation(e, type) {
        this.setState({animation: e})
        this.props.onSetEdit(e, type)
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={() => this.props.onToggleCollapse('overview', true)}
                        className="btn btn-switch-blue dark btn-sm">
                    <i className="bi bi-reply-all me-2"></i>
                    {trans['back']}
                </button>
                <hr/>
                <Card className="shadow-sm mb-4">
                    <CardHeader className="d-flex align-items-center">
                        <div className="fs-5">
                            {trans['gallery']['Edit gallery']}
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
                    </CardHeader>
                    <CardBody>
                        <Col xxl={7} xl={9} lg={10} xs={12} className="mx-auto">
                            <Card>
                                <CardBody>
                                    {trans['Settings']}
                                    <hr/>
                                    <Row className="g-2">
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('galleryDesignation', v5NameSpace)}
                                                label={trans['Designation']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.edit.designation || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'designation')}
                                                    placeholder={trans['Designation']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('galleryDescription', v5NameSpace)}
                                                label={trans['system']['Description']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    as="textarea"
                                                    value={this.props.edit.description || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'description')}
                                                    style={{height: '100px'}}
                                                    placeholder={trans['system']['Designation']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel controlId={uuidv5('galleryType', v5NameSpace)}
                                                           label={trans['gallery']['Gallery type']}>
                                                <Form.Select
                                                    className="no-blur"
                                                    value={this.props.edit.galleryType || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'galleryType')}
                                                    aria-label={trans['posts']['Post Design']}>
                                                    <option value="gallery">{trans['gallery']['Gallery Grid']}</option>
                                                    <option value="masonry">{trans['gallery']['Masonry Grid']}</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        {this.props.selects && this.props.selects.select_img_size ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv5('imgSize', v5NameSpace)}
                                                               label={trans['system']['Image size']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.edit.size || ''}
                                                        onChange={(e) => this.props.onSetEdit(e.target.value, 'size')}
                                                        aria-label={trans['posts']['Post Design']}>
                                                        {this.props.selects.select_img_size.map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col> : ''}

                                        <Col xs={12}>
                                            <div className="d-flex align-items-center flex-wrap">
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur me-4 my-2"
                                                    checked={this.props.edit.crop || false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.checked, 'crop')}
                                                    id={uuidv5('checkCrop', v5NameSpace)}
                                                    label={trans['gallery']['Image Crop']}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur me-4 my-2"
                                                    disabled={true}
                                                    checked={this.props.edit.lazy_load || false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.checked, 'lazy_load')}
                                                    id={uuidv5('checkLazyLoad', v5NameSpace)}
                                                    label={trans['gallery']['Lazy Load']}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur me-4 my-2"
                                                    checked={this.props.edit.lazy_load_animation || false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.checked, 'lazy_load_animation')}
                                                    id={uuidv5('checkLazyLoadAnimation', v5NameSpace)}
                                                    label={trans['gallery']['Lazy Load Animation']}
                                                />
                                                {this.props.edit.lazy_load_animation ?
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur my-2"
                                                    checked={this.props.edit.animation_repeat || false}
                                                    onChange={(e) => this.props.onSetEdit(e.target.checked, 'animation_repeat')}
                                                    id={uuidv5('checkLazyLoadAnimationRepeat', v5NameSpace)}
                                                    label={trans['animate']['Repeat animation']}
                                                />: ''}
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('imgWidth', v5NameSpace)}
                                                label={`${trans['gallery']['Image width']} px`}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    disabled={this.props.edit.galleryType === 'masonry'}
                                                    type="number"
                                                    value={this.props.edit.width || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'width')}
                                                    placeholder={trans['gallery']['Image width']}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('imgHeight', v5NameSpace)}
                                                label={`${trans['gallery']['Image height']} px`}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    disabled={this.props.edit.crop || this.props.edit.galleryType === 'masonry'}
                                                    type="number"
                                                    value={this.props.edit.height || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'height')}
                                                    placeholder={trans['gallery']['Image height']}/>
                                            </FloatingLabel>
                                        </Col>

                                        {this.props.selects && this.props.selects.select_animation ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv5('animationSelect', v5NameSpace)}
                                                               label={trans['carousel']['Animation']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        disabled={!this.props.edit.lazy_load_animation}
                                                        value={this.props.edit.animation || ''}
                                                        onChange={(e) => this.onSetAnimation(e.target.value, 'animation')}
                                                        aria-label={trans['carousel']['Animation']}>
                                                        <option value="">{trans['system']['select']}...</option>
                                                        {this.props.selects.select_animation.map((s, index) =>
                                                            <option
                                                                disabled={s.divider && s.divider === true}
                                                                key={index} value={s.animate}>{s.animate}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col> : ''}

                                        <Col xl={6} xs={12}>
                                            {this.props.edit.lazy_load_animation ?
                                            <div className="d-flex align-items-center h-100 justify-content-center">
                                                <b className={`d-block fw-semibold animate__animated animate__${this.state.animation}`}>
                                                    {trans['carousel']['Animation']}
                                                </b>
                                            </div> : ''}
                                        </Col>

                                        <Col xs={12}>
                                            <h6 className="lh-1 mb-1 mt-3">{trans['gallery']['Breakpoints ( Responsive )']}</h6>
                                            <div className="form-text mb-0">
                                                {trans['gallery']['Properties that are to be changed in a specific screen width.']}
                                            </div>
                                        </Col>
                                        {this.props.edit && this.props.edit.breakpoints ?
                                            <React.Fragment>
                                                <Col xs={12}>
                                                    <h6 className="mb-0 mt-2">{trans['mediaSlider']['Breakpoint']} XXL
                                                        1400px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Row column']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                             value={this.props.edit.breakpoints.xxl.columns || ''}
                                                             onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'columns', 'xxl')}
                                                            placeholder={trans['gallery']['Row column']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Gutter']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            min={1}
                                                            max={5}
                                                            type="number"
                                                             value={this.props.edit.breakpoints.xxl.gutter || ''}
                                                             onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gutter', 'xxl')}
                                                            placeholder={trans['gallery']['Gutter']}/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">{trans['mediaSlider']['Breakpoint']} XL
                                                        1200px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Row column']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.xl.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'columns', 'xl')}
                                                            placeholder={trans['gallery']['Row column']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Gutter']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.xl.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gutter', 'xl')}
                                                            placeholder={trans['gallery']['Gutter']}/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">{trans['mediaSlider']['Breakpoint']} LG
                                                        992px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Row column']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.lg.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'columns', 'lg')}
                                                            placeholder={trans['gallery']['Row column']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Gutter']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.lg.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gutter', 'lg')}
                                                            placeholder={trans['gallery']['Gutter']}/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">{trans['mediaSlider']['Breakpoint']} MD
                                                        768px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Row column']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.md.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'columns', 'md')}
                                                            placeholder={trans['gallery']['Row column']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Gutter']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.md.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gutter', 'md')}
                                                            placeholder={trans['gallery']['Gutter']}/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">{trans['mediaSlider']['Breakpoint']} SM
                                                        576px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Row column']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.sm.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'columns', 'sm')}
                                                            placeholder={trans['gallery']['Row column']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Gutter']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.sm.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gutter', 'sm')}
                                                            placeholder={trans['gallery']['Gutter']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <h6 className="mb-0">{trans['mediaSlider']['Breakpoint']} XS
                                                        450px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Row column']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.xs.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'columns', 'xs')}
                                                            placeholder={trans['gallery']['Row column']}/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`${trans['gallery']['Gutter']}`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.xs.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gutter', 'xs')}
                                                            placeholder={trans['gallery']['Gutter']}/>
                                                    </FloatingLabel>
                                                </Col>
                                            </React.Fragment>
                                            : ''}

                                        {/*}
                                        <Col xs={12}>
                                            <div className="my-3">
                                                <h6 className="lh-1 mb-1">{trans['gallery']['Image options']}</h6>
                                                <div className="form-text mb-0">
                                                    {trans['gallery']['The options can also be set individually for each image.']}
                                                </div>
                                            </div>
                                        </Col>
                                        {this.props.selects && this.props.selects.select_link_option ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv5('imgLink', v5NameSpace)}
                                                               label={trans['gallery']['Image link']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.edit.url_type || ''}
                                                        onChange={(e) => this.props.onSetEdit(e.target.value, 'url_type')}
                                                        aria-label={trans['gallery']['Image link']}>
                                                        {this.props.selects.select_link_option.map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col> : ''}
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel controlId={uuidv5('lightboxType', v5NameSpace)}
                                                           label={trans['gallery']['Lightbox Type']}>
                                                <Form.Select
                                                    disabled={this.props.edit.url_type !== 'lightbox'}
                                                    className="no-blur"
                                                    value={this.props.edit.lightbox_type || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'lightbox_type')}
                                                    aria-label={trans['posts']['Post Design']}>
                                                    <option value="slide">{trans['gallery']['Slide']}</option>
                                                    <option value="single">{trans['gallery']['Single']}</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        {this.props.selects && this.props.selects.select_site_posts ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv5('postPageSelect', v5NameSpace)}
                                                               label={trans['gallery']['Post/Page']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.edit.url || ''}
                                                        disabled={this.props.edit.url_type !== 'url'}
                                                        onChange={(e) => this.props.onSetEdit(e.target.value, 'url')}
                                                        aria-label={trans['gallery']['Post/Page']}>
                                                        <option value="">{trans['system']['select']}...</option>
                                                        {this.props.selects.select_site_posts.map((select, index) =>
                                                            <option
                                                                className={select.type === 'category' ? 'text-orange' : ''}
                                                                key={index} value={select.id}
                                                                disabled={select.type === 'disabled'}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col> : ''}
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv5('customLink', v5NameSpace)}
                                                label={`${trans['plugins']['Custom link']} `}
                                            >
                                                <Form.Control
                                                    disabled={this.props.edit.url_type !== 'custom'}
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="url"
                                                    value={this.props.edit.custom_link || ''}
                                                    onChange={(e) => this.props.onSetEdit(e.target.value, 'custom_link')}
                                                    placeholder={trans['plugins']['Custom link']}/>
                                            </FloatingLabel>
                                        </Col>
                                        {*/}

                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}
