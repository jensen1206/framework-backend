import * as React from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import Form from "react-bootstrap/Form";
import {Card, CardBody, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Accordion from 'react-bootstrap/Accordion';
import * as AppTools from "../../../AppComponents/AppTools";
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {ReactSortable} from "react-sortablejs";

const v5NameSpace = '424ec95e-d171-11ee-aedd-325096b39f47';
export default class MenuSelects extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formRef = React.createRef();
        this.state = {
            colSites: false,
            colIndividuell: false,
            colCategories: false,
            colPosts: false,
            colPostCategories: false
        }
        this.onToggleSelects = this.onToggleSelects.bind(this);
        this.onSetPage = this.onSetPage.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.resetSelect) {
            this.formRef.current.reset();
            this.props.onSetResetSelect(false)
        }
    }

    onToggleSelects(target, state) {
        let sites = false;
        let individuell = false;
        let categories = false;
        let posts = false;
        let postCategories = false;
        switch (target) {
            case 'sites':
                sites = state;
                break;
            case 'individuell':
                individuell = state;
                break;
            case 'categories':
                categories = state;
                break;
            case 'posts':
                 posts = true;
                break;
            case 'post_category':
                postCategories = true;
                break;
        }

        this.setState({
            colSites: sites,
            colIndividuell: individuell,
            colCategories: categories,
            colPosts: posts,
            colPostCategories: postCategories
        })
    }

    onSetPage(e, id) {
      //  console.log(e, id)
    }

    onToggleAccordion(event) {
        if (!event.target.classList.contains('collapsed')) {

        }
        this.formRef.current.reset()
        this.props.resetSelectSites()
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <Form ref={this.formRef}>
                            <Accordion>
                                <Accordion.Item eventKey={1}>
                                    <Accordion.Header
                                        onClick={(e) => this.onToggleAccordion(e)}>
                                        {trans['system']['Pages']}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {this.props.selects && this.props.selects.pages ?
                                            <React.Fragment>
                                                {this.props.selects.pages.map((s, index) => {
                                                    return (
                                                        <InputGroup key={index} className="mb-1">
                                                            <InputGroup.Checkbox
                                                                id={uuidv4()}
                                                                defaultChecked={false}
                                                                onChange={(e) => this.props.setSelectSites(e.currentTarget.checked, s.ids, s.id, s.type)}
                                                                aria-label="Checkbox Site"/>
                                                            <Form.Control
                                                                className="no-blur bg-transparent"
                                                                disabled={true}
                                                                defaultValue={s.label}
                                                                id={uuidv4()}
                                                                aria-label="Site name"
                                                            />
                                                        </InputGroup>
                                                    )
                                                })}
                                            </React.Fragment>
                                            : ''}

                                        <button
                                            onClick={() => this.props.setSelectedMenu('site')}
                                            type="button"
                                            className="btn btn-switch-blue mt-2 dark btn-sm">
                                            {trans['system']['Add to menu']}
                                        </button>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey={2}>
                                    <Accordion.Header>{trans['menu']['Individual Links']}</Accordion.Header>
                                    <Accordion.Body>
                                        <Row className="gy-2">
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${trans['system']['Link text']} *`}
                                                >
                                                    <Form.Control
                                                        required={true}
                                                        className="no-blur"
                                                        value={this.props.individuellMenu.title || ''}
                                                        onChange={(e) => this.props.setIndividuellMenu(e.currentTarget.value, 'title')}
                                                        type="text"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={trans['system']['URL']}
                                                >
                                                    <Form.Control
                                                        className="no-blur"
                                                        value={this.props.individuellMenu.url || ''}
                                                        onChange={(e) => this.props.setIndividuellMenu(e.currentTarget.value, 'url')}
                                                        type="text"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={trans['system']['Route']}
                                                >
                                                    <Form.Control
                                                        className="no-blur"
                                                        value={this.props.individuellMenu.route || ''}
                                                        onChange={(e) => this.props.setIndividuellMenu(e.currentTarget.value, 'route')}
                                                        type="text"
                                                    />
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    {trans['menu']['Route must be available']}
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={trans['system']['Slug']}
                                                >
                                                    <Form.Control
                                                        className="no-blur"
                                                        value={this.props.individuellMenu.slug || ''}
                                                        onChange={(e) => this.props.setIndividuellMenu(e.currentTarget.value, 'slug')}
                                                        type="text"
                                                    />
                                                </FloatingLabel>
                                            </Col>

                                            <Col xs={12}>
                                                <button onClick={this.props.addIndividuellMenu}
                                                    type="button"
                                                    className="btn btn-switch-blue mt-2 dark btn-sm">
                                                    {trans['system']['Add to menu']}
                                                </button>
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/*}  <Accordion.Item eventKey={3}>
                                    <Accordion.Header
                                        onClick={(e) => this.onToggleAccordion(e)}>
                                        {trans['menu']['Pages Categories']}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {this.props.selects && this.props.selects.categories ?
                                            <React.Fragment>
                                                {this.props.selects.categories.map((s, index) => {
                                                    return (
                                                        <InputGroup key={index} className="mb-1">
                                                            <InputGroup.Checkbox
                                                                id={uuidv4()}
                                                                defaultChecked={false}
                                                                onChange={(e) => this.props.setSelectSites(e.currentTarget.checked, s.ids, s.id, s.type)}
                                                                aria-label="Checkbox Site"/>
                                                            <Form.Control
                                                                className="no-blur bg-transparent"
                                                                disabled={true}
                                                                defaultValue={s.label}
                                                                id={uuidv4()}
                                                                aria-label="Site name"
                                                            />
                                                        </InputGroup>
                                                    )
                                                })}
                                            </React.Fragment>
                                            : ''}

                                        <button
                                            onClick={() => this.props.setSelectedMenu('category')}
                                            type="button"
                                            className="btn btn-switch-blue mt-2 dark btn-sm">
                                            {trans['system']['Add to menu']}
                                        </button>
                                    </Accordion.Body>
                                </Accordion.Item> {*/}

                                <Accordion.Item eventKey={4}>
                                    <Accordion.Header
                                        onClick={(e) => this.onToggleAccordion(e)}>
                                        {trans['Post categories']}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {this.props.selects && this.props.selects['post-categories'] ?
                                            <React.Fragment>
                                                {this.props.selects['post-categories'].map((s, index) => {
                                                    return (
                                                        <InputGroup key={index} className="mb-1">
                                                            <InputGroup.Checkbox
                                                                id={uuidv4()}
                                                                defaultChecked={false}
                                                                onChange={(e) => this.props.setSelectPosts(e.currentTarget.checked, s.ids, s.id, s.type)}
                                                                aria-label="Checkbox Site"/>
                                                            <Form.Control
                                                                className="no-blur bg-transparent"
                                                                disabled={true}
                                                                defaultValue={s.label}
                                                                id={uuidv4()}
                                                                aria-label="Site name"
                                                            />
                                                        </InputGroup>
                                                    )
                                                })}
                                            </React.Fragment>
                                            : ''}

                                        <button
                                            onClick={() => this.props.setSelectedMenu('post-category')}
                                            type="button"
                                            className="btn btn-switch-blue mt-2 dark btn-sm">
                                            {trans['system']['Add to menu']}
                                        </button>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey={5}>
                                    <Accordion.Header
                                        onClick={(e) => this.onToggleAccordion(e)}>
                                        {trans['posts']['Posts']}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {this.props.selects && this.props.selects.posts ?
                                            <React.Fragment>
                                                {this.props.selects.posts.map((s, index) => {
                                                    return (
                                                        <InputGroup key={index} className="mb-1">
                                                            <InputGroup.Checkbox
                                                                id={uuidv4()}
                                                                defaultChecked={false}
                                                                onChange={(e) => this.props.setSelectPosts(e.currentTarget.checked, s.ids, s.id, s.type)}
                                                                aria-label="Checkbox Site"/>
                                                            <Form.Control
                                                                title={s.label}
                                                                className="no-blur bg-transparent"
                                                                disabled={true}
                                                                defaultValue={s.label}
                                                                id={uuidv4()}
                                                                aria-label="Site name"
                                                            />
                                                        </InputGroup>
                                                    )
                                                })}
                                            </React.Fragment>
                                            : ''}

                                        <button
                                            onClick={() => this.props.setSelectedMenu('post')}
                                            type="button"
                                            className="btn btn-switch-blue mt-2 dark btn-sm">
                                            {trans['system']['Add to menu']}
                                        </button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Form>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }

}