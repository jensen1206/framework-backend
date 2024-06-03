import * as React from "react";
import {sortableNested} from "../../../AppComponents/sortableNested";
import {Card, CardBody, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from 'uuid';
import Col from "react-bootstrap/Col";
import MenuEditForm from "./MenuEditForm";
import axios from "axios";
import SetAjaxData from "../../../AppComponents/SetAjaxData";
import * as AppTools from "../../../AppComponents/AppTools";

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MenuTree extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.menuSortable = React.createRef();
        this.state = {};
        this.onSetMenu = this.onSetMenu.bind(this);
        this.editCollapse = this.editCollapse.bind(this);

    }

    onSetMenu(e) {
        let formData = {
            'method': 'sortable_menu',
            'category': this.props.id,
            'elements': JSON.stringify(e)
        }

        this.props.sendAxiosFormdata(formData)
    }

    editCollapse(target, e, id) {
        if (e.currentTarget.classList.contains('active')) {
            e.currentTarget.classList.remove('active')
        } else {
            e.currentTarget.classList.add('active')
        }
        new bootstrap.Collapse(target, {
            toggle: true,
            ///  parent: '#collEditParent'
        })
    }


    render() {
        if (this.props.groups.length) {
            sleep(100).then(() => {
                if (this.menuSortable.current && this.menuSortable.current.children.length) {
                    let sort = $(this.menuSortable.current.children);
                    let sortable;
                    if (sort[0]) {
                        let childSortable = $('.tree-sortable ', sort);
                        sortable = [...childSortable, sort[0]]
                    }
                    for (let i = 0; i < sortable.length; i++) {
                        let options = {
                            'target': sortable[i],
                            'handle': '.menu-title'
                        }
                        sortableNested(this.onSetMenu, options, this.props.id)
                    }
                }
            })
        }
        const Menu = ({items, id, i = 0}) => {
            {
                i++
            }
            let last;
            if (items.length) {
                return (
                    <React.Fragment>
                        {items.map((g, sIndex) => {
                            {
                                last = g.id
                            }
                            return (
                                <div key={g.id} data-parent={id} className={`tree-sortable menu-dept-${i}`}>
                                    <div data-parent={id} data-id={g.id} className="menu-item-bar">
                                        <div className="menu-item-handle child">
                                            <div id={`menuTitle${g.id}`}
                                                 className="flex-fill menu-title"> {g.title}</div>
                                            <div className="ms-auto">
                                                <small className="small-lg text-muted">{trans['menu'][g.type]}</small>
                                            </div>
                                            <div style={{width: '3rem'}}
                                                 onClick={(e) => this.editCollapse(`#menuEdit${g.id}`, e, g.id)}
                                                 className="ms-auto- text-center h-100 chevron-rotate cursor-pointer"></div>
                                        </div>
                                        <div id={`menuEdit${g.id}`} className="collapse">
                                            <MenuEditForm
                                                edit={g}
                                                sendAxiosFormdata={this.props.sendAxiosFormdata}
                                                id={this.props.id}
                                            />
                                        </div>
                                        <Menu items={g.__children} id={g.id} i={i}/>
                                    </div>

                                </div>
                            )
                        })}
                    </React.Fragment>
                )
            }
            return (
                <div data-parent={id} className={`tree-sortable empty menu-dept-${i}`}>
                    <div className="menu-item">
                        <div className="menu-item-handle child empty">

                        </div>
                    </div>
                </div>
            );
        }
        return (
            <Card ref={this.menuSortable} className="menu-wrapper">
                <CardBody>
                    {this.props.groups.length ?
                        <React.Fragment>
                            <div id="collEditParent" className="tree-sortable">
                                {this.props.groups.map((g, index) => {
                                    return (
                                        <div data-id={g.id} data-parrent={g.id} key={g.id}
                                             className="list-unstyled menu-list nested-sortable">
                                            <div className="menu-item-bar">
                                                <div className="menu-item-handle">
                                                    <div id={`menuTitle${g.id}`}
                                                         className="flex-fill menu-title"> {g.title}</div>
                                                    <div className="ms-auto">
                                                        <small
                                                            className="small-lg text-muted">{trans['menu'][g.type]}</small>
                                                    </div>
                                                    <div style={{width: '3rem'}}
                                                         onClick={(e) => this.editCollapse(`#menuEdit${g.id}`, e, g.id)}
                                                         className="ms-auto- text-center h-100 chevron-rotate cursor-pointer"></div>
                                                </div>
                                                <div id={`menuEdit${g.id}`} className="collapse">
                                                    <MenuEditForm
                                                        edit={g}
                                                        sendAxiosFormdata={this.props.sendAxiosFormdata}
                                                        id={this.props.id}

                                                    />
                                                </div>
                                                {g.__children && <Menu items={g.__children} id={g.id}/>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </React.Fragment>
                        :
                        <div className="text-center mt-1 text-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {trans['menu']['no entries available']}
                        </div>}
                </CardBody>
            </Card>
        );
    }
}