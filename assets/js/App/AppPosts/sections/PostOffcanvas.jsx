import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import {v5 as uuidv5} from 'uuid';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import AddTagModal from "./AddTagModal";
const v5NameSpace = '15cb1620-d8ac-11ee-a817-325096b39f47';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import SetAjaxResponse from "../../AppComponents/SetAjaxResponse";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const reactSwal = withReactContent(Swal);
export default class PostOffcanvas extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            collapseExcerpt: false,
            collapseAttributes: false,
            collapseFile: false,
            collapseCustom: false,
            collapseCategories: false,
            collapseTags: false,
            selectedCat: '',
            selectedTag: '',
            showAddTagModal: false,
            resetName: false,
            tagId: '',
            tagDesignation: ''
        }

        this.setCollapse = this.setCollapse.bind(this);
        this.onChangeCatSelect = this.onChangeCatSelect.bind(this);
        this.onAddCategory = this.onAddCategory.bind(this);
        this.onDeleteCategory = this.onDeleteCategory.bind(this);
        this.onAddTag = this.onAddTag.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.setShowAddTagModal = this.setShowAddTagModal.bind(this);
        this.setResetName = this.setResetName.bind(this);
        this.onCreatedTag = this.onCreatedTag.bind(this);
        this.onUpdateTag = this.onUpdateTag.bind(this);
        this.onGetUpdateInsertTag = this.onGetUpdateInsertTag.bind(this);
        this.deleteTag = this.deleteTag.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
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

    setShowAddTagModal(state) {
        this.setState({
            showAddTagModal: state
        })
    }

    setResetName(state) {
        this.setState({
            resetName: state
        })
    }

    onChangeCatSelect(id) {
        this.setState({
            selectedCat: id
        })
    }

    onAddCategory() {
        const cat = [...this.props.categoriesSelect]
        const find = this.findArrayElementById(cat, parseInt(this.state.selectedCat));
        const del = this.filterArrayElementById(cat, parseInt(this.state.selectedCat))
        const categories = [...this.props.site.categories, {
            'id': find.id,
            'title': find.label
        }];
        this.setState({
            selectedCat: ''
        })
        this.props.onSetCategoryTagSelects(categories, del, 'category')

    }

    onDeleteCategory(id) {
        const del = [...this.props.site.categories];
        const find = this.findArrayElementById(del, parseInt(id));
        const select = [...this.props.categoriesSelect, {
            'id': find.id,
            'label': find.title
        }]
        const newCats = this.filterArrayElementById(del, parseInt(id))
        this.props.onSetCategoryTagSelects(newCats, select, 'category')

    }

    onChangeTagSelect(id) {
        this.setState({
            selectedTag: id
        })
    }

    onAddTag() {
        const tag = [...this.props.tagSelects]
        const find = this.findArrayElementById(tag, parseInt(this.state.selectedTag));
        const del = this.filterArrayElementById(tag, parseInt(this.state.selectedTag))
        const tags = [...this.props.site.tags, {
            'id': find.id,
            'designation': find.label
        }];
        this.setState({
            selectedTag: ''
        })
        this.props.onSetCategoryTagSelects(tags, del, 'tag')
    }

    onCreatedTag(data) {
        const tags = [...this.props.site.tags, {
            'id': data.id,
            'designation': data.designation
        }];
        this.props.onSetCategoryTagSelects(tags, this.props.tagSelects, 'tag')
    }

    onUpdateTag(data) {
        const tags = [...this.props.site.tags];
        const find = this.findArrayElementById(tags, data.id);
        find.designation = data.designation
        this.props.onSetCategoryTagSelects(tags, this.props.tagSelects, 'tag')

    }

    onGetUpdateInsertTag(id, designation){
      this.setState({
          tagId: id,
          tagDesignation: designation,
          showAddTagModal: true,
          resetName: true
      })
    }

    onDeleteTag(id) {
        const del = [...this.props.site.tags];
        const find = this.findArrayElementById(del, parseInt(id));
        const select = [...this.props.tagSelects, {
            'id': find.id,
            'label': find.designation
        }]
        const newTags = this.filterArrayElementById(del, parseInt(id))
        this.props.onSetCategoryTagSelects(newTags, select, 'tag')

    }

    deleteTag() {
        let swal = {
            'title': `${trans['system']['Delete tag']}?`,
            'msg': trans['system']['The tag is deleted from all posts.'],
            'btn': trans['system']['Delete tag']
        }

        let formData = {
            'method': 'delete_tag',
            'id': this.state.selectedTag
        }



        this.onDeleteSwalHandle(formData, swal)
    }

    onDeleteSwalHandle(formData, swal) {
        reactSwal.fire({
            title: swal.title,
            reverseButtons: true,
            html: `<span class="swal-delete-body">${swal.msg}</span>`,
            confirmButtonText: swal.btn,
            cancelButtonText: trans['swal']['Cancel'],
            customClass: {
                popup: 'swal-delete-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.sendAxiosFormdata(formData).then()
                this.setState({
                    selectedTag: ''
                })
            }
        });
    }

    setCollapse(type) {
        switch (type) {
            case 'excerpt':
                this.setState({
                    collapseExcerpt: !this.state.collapseExcerpt
                })
                break;
            case 'attr':
                this.setState({
                    collapseAttributes: !this.state.collapseAttributes
                })
                break;
            case 'file':
                this.setState({
                    collapseFile: !this.state.collapseFile
                })
                break;
            case 'custom':
                this.setState({
                    collapseCustom: !this.state.collapseCustom
                })
                break;
            case 'cat':
                this.setState({
                    collapseCategories: !this.state.collapseCategories
                })
                break;
            case 'tag':
                this.setState({
                    collapseTags: !this.state.collapseTags
                })
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Offcanvas
                    show={this.props.showSiteOffcanvas}
                    placement="end"
                    onHide={() => this.props.onSetShowOffcanvas(false)}>
                    <Offcanvas.Header className="bg-body-tertiary" closeButton>
                        <Offcanvas.Title>{trans['system']['Page Settings']}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Row className="g-2">
                            <Col xs={12}>
                                <div className="d-flex align-items-center" style={{minHeight: '35px'}}>
                                    {this.props.spinner.ajaxMsg || this.props.spinner.showAjaxWait ? '' :
                                        <div>{trans['system']['Status']}:</div>
                                    }
                                    <div
                                        className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}>
                                    </div>
                                    <small>
                                        <SetAjaxResponse
                                            status={this.props.spinner.ajaxStatus}
                                            msg={this.props.spinner.ajaxMsg}
                                        />
                                    </small>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv5('siteSlug', v5NameSpace)}
                                    label={trans['system']['Slug']}
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={false}
                                        type="text"
                                        value={this.props.site.postSlug || ''}
                                        onChange={(e) => this.props.onSetPost(e.target.value, 'postSlug')}
                                        placeholder={trans['system']['Slug']}/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                {this.props.selectSiteStatus ?
                                    <FloatingLabel controlId={uuidv5('selectSiteStatus', v5NameSpace)}
                                                   label={trans['system']['Site status']}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.site.postStatus || ''}
                                            onChange={(e) => this.props.onSetPost(e.target.value, 'postStatus')}
                                            aria-label={trans['system']['Site status']}>
                                            {(this.props.selectSiteStatus).map((select, index) =>
                                                <option key={index} value={select.value}>
                                                    {select.label}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel> : ''}

                            </Col>
                            <Col xs={12}>
                                {this.props.categorySelect ?
                                    <FloatingLabel controlId={uuidv5('selectSiteCategory', v5NameSpace)}
                                                   label={trans['system']['Design category']}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.site.siteCategory || ''}
                                            onChange={(e) => this.props.onSetPost(e.target.value, 'siteCategory')}
                                            aria-label={trans['system']['Design category']}>
                                            {(this.props.categorySelect).map((select, index) =>
                                                <option key={index} value={select.id}>
                                                    {select.label}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel> : ''}
                            </Col>
                            {/*} <Col xs={12}>
                                {this.props.postLayoutSelect ?
                                    <FloatingLabel controlId={uuidv5('selectSiteDesign', v5NameSpace)}
                                                   label={trans['posts']['Post Design']}>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.site.builder || ''}
                                            onChange={(e) => this.props.onSetPost(e.target.value, 'builder')}
                                            aria-label={trans['posts']['Post Design']}>
                                            <option value="">{trans['system']['select']}</option>
                                            {(this.props.postLayoutSelect).map((select, index) =>
                                                <option key={index} value={select.id}>
                                                    {select.label}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>:''}
                            </Col> {*/}
                            {/*}  <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('custom')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['builder']['Header']} / {trans['builder']['Footer']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseCustom ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseCustom}>
                                    <div className="mt-2 pt-1 bg-body-tertiary border rounded"
                                         id={uuidv5('colCustom', v5NameSpace)}>
                                        <div className="p-2">
                                            <Col xs={12}>
                                                <FloatingLabel controlId={uuidv5('selectSiteHeader', v5NameSpace)}
                                                               label={trans['builder']['Header']}>
                                                    <Form.Select
                                                        className="no-blur mb-2"
                                                        value={this.props.site.header || ''}
                                                        onChange={(e) => this.props.onSetPost(e.target.value, 'header')}
                                                        aria-label={trans['builder']['Header']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {(this.props.selectHeader).map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel controlId={uuidv5('selectSiteFooter', v5NameSpace)}
                                                               label={trans['builder']['Footer']}>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.site.footer || ''}
                                                        onChange={(e) => this.props.onSetPost(e.target.value, 'footer')}
                                                        aria-label={trans['builder']['Footer']}>
                                                        <option value="">{trans['system']['select']}</option>
                                                        {(this.props.selectFooter).map((select, index) =>
                                                            <option key={index} value={select.id}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                        </div>
                                    </div>
                                </Collapse>
                            </Col> {*/}
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('cat')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['system']['Categories']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseCategories ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseCategories}>
                                    <div className="mt-2 py-1 bg-body-tertiary border rounded"
                                         id={uuidv5('colCat', v5NameSpace)}>

                                        {this.props.site.categories ?
                                            <React.Fragment>
                                                {this.props.categoriesSelect ?
                                                    <div className="px-2">
                                                        <FloatingLabel controlId={uuidv5('selectCategory', v5NameSpace)}
                                                                       label={trans['system']['Category']}>
                                                            <Form.Select
                                                                className="no-blur"
                                                                value={this.state.selectedCat || ''}
                                                                onChange={(e) => this.onChangeCatSelect(e.target.value)}
                                                                aria-label={trans['system']['Category']}>
                                                                <option value="">{trans['system']['select']}</option>
                                                                {(this.props.categoriesSelect).map((select, index) =>
                                                                    <option key={index} value={select.id}>
                                                                        {select.label}
                                                                    </option>
                                                                )}
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                        <button
                                                            onClick={this.onAddCategory}
                                                            disabled={this.state.selectedCat === ''}
                                                            className={`btn  mt-2 btn-sm ${this.state.selectedCat ? 'btn-secondary dark' : 'btn-outline-secondary'}`}>
                                                            <i className="bi bi-node-plus me-2"></i>
                                                            {trans['system']['Add category']}
                                                        </button>
                                                    </div>
                                                    : ''}
                                                <hr className="mb-2 "/>
                                                {this.props.site.categories.length ?
                                                    <div className="d-md-flex d-grid px-2 flex-wrap">
                                                        {this.props.site.categories.map((s, i) => {
                                                            return (
                                                                <small key={i}
                                                                       className="ps-2 me-1 mb-1 border small-lg rounded d-flex  align-items-center">
                                                                    <span className="d-inline-block me-2"> {s.title} </span>
                                                                    <span onClick={() => this.onDeleteCategory(s.id)}
                                                                          title={trans['system']['Remove category']}
                                                                          className="px-1 ms-auto fs-6 overflow-hidden d-inline-block bg-danger text-light text-danger cursor-pointer">
                                                                <i className="bi bi-x"></i>
                                                            </span>
                                                                </small>
                                                            )
                                                        })}
                                                    </div>
                                                    : <small
                                                        className="d-block px-2">{trans['system']['not assigned to a category']}</small>
                                                }
                                                <hr className="mt-2"/>
                                            </React.Fragment>

                                            : ''}
                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('tag')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['system']['Tags']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseTags ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseTags}>
                                    <div className="mt-2 py-2 bg-body-tertiary border rounded"
                                         id={uuidv5('colTags', v5NameSpace)}>

                                        {this.props.site.tags ?
                                            <React.Fragment>
                                                <div className="px-2">
                                                    <button onClick={() => this.onGetUpdateInsertTag('', '')}
                                                        className="btn btn-success-custom dark mb-2 btn-sm">
                                                        <i className="bi bi-plus me-1"></i>
                                                        {trans['system']['Create tag']}
                                                    </button>
                                                    <InputGroup>
                                                        <Form.Select
                                                            id={uuidv5('selectTags', v5NameSpace)}
                                                            className="no-blur"
                                                            value={this.state.selectedTag || ''}
                                                            onChange={(e) => this.onChangeTagSelect(e.target.value)}
                                                            aria-label="Default select example">
                                                            <option value="">{trans['system']['select']}</option>
                                                            {this.props.tagSelects.map((s, i) => {
                                                                return (
                                                                    <option key={i} value={s.id}>{s.label}</option>
                                                                )
                                                            })}
                                                        </Form.Select>
                                                        <Button
                                                            onClick={this.onAddTag}
                                                            disabled={!this.state.selectedTag}
                                                            title={trans['system']['Add tag']}
                                                            variant={`${this.state.selectedTag ? 'success-custom dark' : 'btn-outline-secondary'}`}>
                                                            <i className="bi bi-node-plus"></i>
                                                        </Button>
                                                        <Button
                                                            onClick={this.deleteTag}
                                                            disabled={!this.state.selectedTag}
                                                            title={trans['system']['Delete tag']}
                                                            variant={`${this.state.selectedTag ? 'danger dark' : 'btn-outline-secondary'}`}>
                                                            <i className="bi bi-trash"></i>
                                                        </Button>
                                                    </InputGroup>
                                                </div>

                                                <hr className="mb-2 "/>
                                                {this.props.site.tags.length ?
                                                    <div className="d-md-flex d-grid px-2 flex-wrap">
                                                        {this.props.site.tags.map((s, i) => {
                                                            return (
                                                                <small key={i}
                                                                       className="ps-2 me-1 mb-1 border small-lg rounded d-flex  align-items-center">
                                                                    <span onClick={() => this.onGetUpdateInsertTag(s.id, s.designation)}
                                                                        className="d-inline-block cursor-pointer me-2">
                                                                        {s.designation}
                                                                    </span>
                                                                    <span onClick={() => this.onDeleteTag(s.id)}
                                                                          title={trans['system']['Remove tag']}
                                                                          className="px-1 ms-auto fs-6 overflow-hidden d-inline-block bg-danger text-light text-danger cursor-pointer">
                                                                <i className="bi bi-x"></i></span>
                                                                </small>
                                                            )
                                                        })}
                                                    </div>
                                                    : <small className="d-block px-2">
                                                        {trans['system']['no tags assigned']}
                                                    </small>
                                                }
                                                <hr className="mt-2"/>
                                            </React.Fragment> : ''}

                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('file')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['Cover picture']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseFile ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseFile}>
                                    <div className="mt-2 pt-3 bg-body-tertiary border rounded"
                                         id={uuidv5('colFile', v5NameSpace)}>
                                        {this.props.site.siteImg ?
                                            <React.Fragment>
                                                <div style={{width: '300px', height: '200px'}}
                                                     className="p-1 border rounded overflow-hidden d-flex mx-auto mb-3">
                                                    <img
                                                        style={{objectFit: 'cover', width: '300px'}}
                                                        className="rounded img-fluid"
                                                        alt={trans['Cover picture']}
                                                        src={`${publicSettings.medium_url}/${this.props.site.siteImg}`}/>
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div
                                                className="placeholder-account-image mb-3 p-1 border rounded mx-auto"></div>
                                        }
                                        <div className="mt-auto text-center pb-2 mx-3 mb-2">
                                            <button
                                                onClick={() => this.props.onSetAppImage('site_logo')}
                                                type="button"
                                                className="btn btn-switch-blue dark btn-sm">
                                                {this.props.site.siteImg ? trans['app']['Change image'] : trans['app']['Select image']}
                                            </button>
                                            {this.props.site.siteImg ?
                                                <button
                                                    onClick={() => this.props.onSetPost('', 'siteImg')}
                                                    type="button"
                                                    className="btn btn-danger ms-2 dark btn-sm">
                                                    {trans['delete']}
                                                </button> : ''}
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('excerpt')}
                                    className="cursor-pointer border rounded bg-body-tertiary  p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['system']['Text excerpt']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseExcerpt ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseExcerpt}>
                                    <div className="mt-2 bg-body-tertiary border rounded"
                                         id={uuidv5('colExcerpt', v5NameSpace)}>
                                        <div className="p-2">
                                            <FloatingLabel
                                                controlId={uuidv5('siteExcerpt', v5NameSpace)}
                                                label={trans['system']['Text excerpt']}
                                            >
                                                <Form.Control
                                                    className="no-blur mb-2"
                                                    as="textarea"
                                                    required={false}
                                                    value={this.props.site.postExcerpt || ''}
                                                    onChange={(e) => this.props.onSetPost(e.target.value, 'postExcerpt')}
                                                    style={{height: '100px'}}
                                                    placeholder={trans['system']['Text excerpt']}/>
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId={uuidv5('excerptSign', v5NameSpace)}
                                                label={trans['system']['Character Limit']}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.site.excerptLimit || ''}
                                                    onChange={(e) => this.props.onSetPost(e.target.value, 'excerptLimit')}
                                                    placeholder={trans['system']['Character Limit']}/>
                                            </FloatingLabel>
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                            <Col xs={12}>
                                <div
                                    onClick={() => this.setCollapse('attr')}
                                    className="cursor-pointer border rounded bg-body-tertiary p-3">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            {trans['system']['Page attributes']}
                                        </div>
                                        <i className={`ms-auto bi ${this.state.collapseAttributes ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </div>
                                </div>
                                <Collapse
                                    in={this.state.collapseAttributes}>
                                    <div className="mt-2 bg-body-tertiary border rounded"
                                         id={uuidv5('colAttr', v5NameSpace)}>
                                        <div className="p-2">
                                            <FloatingLabel
                                                controlId={uuidv5('extraCss', v5NameSpace)}
                                                label={trans['system']['Extra Css']}
                                            >
                                                <Form.Control
                                                    className={`no-blur mb-2`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.site.extraCss || ''}
                                                    onChange={(e) => this.props.onSetPost(e.target.value, 'extraCss')}
                                                    placeholder={trans['system']['Extra Css']}/>
                                            </FloatingLabel>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur mt-3"
                                                id={uuidv5('comments', v5NameSpace)}
                                                checked={this.props.site.commentStatus || false}
                                                onChange={(e) => this.props.onSetPost(e.target.checked, 'commentStatus')}
                                                label={trans['system']['Allow comments']}
                                            />
                                        </div>
                                    </div>
                                </Collapse>
                            </Col>
                        </Row>
                    </Offcanvas.Body>
                </Offcanvas>
                <AddTagModal
                    showAddTagModal={this.state.showAddTagModal}
                    resetName={this.state.resetName}
                    site={this.props.site}
                    tagId={this.state.tagId}
                    tagDesignation={this.state.tagDesignation}
                    setShowAddTagModal={this.setShowAddTagModal}
                    setResetName={this.setResetName}
                    onCreatedTag={this.onCreatedTag}
                    onUpdateTag={this.onUpdateTag}
                />
            </React.Fragment>
        )
    }
}