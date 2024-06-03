import * as React from "react";
import {ReactSortable} from "react-sortablejs";
import {Card, CardBody, Row} from "react-bootstrap";
import MenuEditForm from "./MenuEditForm";

export default class MenuRecursive extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            sortableOptions: {
                animation: 300,
                handle: ".menu-title",
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                fallbackOnBody: true,
                swapThreshold: 0.65,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
        };

        this.editCollapse = this.editCollapse.bind(this);
        this.onUpdateIemPostion = this.onUpdateIemPostion.bind(this);
        this.onUpdatePosition = this.onUpdatePosition.bind(this);
        this.onUpdateIemEndPostion = this.onUpdateIemEndPostion.bind(this);
        this.onRemoveItem = this.onRemoveItem.bind(this);


        this.onSetMenu = this.onSetMenu.bind(this);
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

    onSetMenu(e, type = null) {

        if (type === 'group') {
            this.props.onSetMenuGroup(e);
        }
    }

    onUpdatePosition(e) {
        let arr = [];
        e.to.childNodes.forEach(sortable => {

            if (sortable.hasAttribute('data-id')) {
                let dataId = sortable.getAttribute('data-id')
                let sort = {
                    'id': dataId,
                    'parent': 0,
                }
                arr.push(sort);
            }
        })
        let formData = {
            'method': 'sortable_menu',
            'category': this.props.id,
            'elements': JSON.stringify(arr),
            'return': true
        }

        this.props.sendAxiosFormdata(formData)

    }

    onUpdateIemPostion(e, parentId) {
        let arr = [];

        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                let dataId = sortable.getAttribute('data-id')
                let parent;
                if (dataId === parentId) {
                    parent = 0;
                } else {
                    parent = parentId;
                }
                let formArr = {
                    'id': dataId,
                    'parent': parent,
                }
                arr.push(formArr)
            }
        })
        let formData = {
            'method': 'sortable_menu',
            'category': this.props.id,
            'elements': JSON.stringify(arr),
            'return': true
        }

        this.props.sendAxiosFormdata(formData)
    }

    onRemoveItem(e) {
        let arr = [];

        e.to.childNodes.forEach(sortable => {

            if (sortable.hasAttribute('data-id')) {
                let dataId = sortable.getAttribute('data-id')
                let formArr = {
                    'id': dataId,
                    'parent': 0,
                }
                arr.push(formArr)
            }
        })
        let formData = {
            'method': 'sortable_menu',
            'category': this.props.id,
            'elements': JSON.stringify(arr),
            'return': true
        }

        this.props.sendAxiosFormdata(formData)
    }

    onUpdateIemEndPostion(e, parentId) {
        let arr = [];

        e.to.childNodes.forEach(sortable => {

            if (sortable.hasAttribute('data-id')) {
                let dataId = sortable.getAttribute('data-id')
                let parent;
                if (dataId === parentId) {
                    parent = 0;
                } else {
                    parent = parentId;
                }
                let formArr = {
                    'id': dataId,
                    'parent': parent,
                }
                arr.push(formArr)
            }
        })
        let formData = {
            'method': 'sortable_menu',
            'category': this.props.id,
            'elements': JSON.stringify(arr),
            'return': true
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

        const Menu = ({list, id, i = 0}) => {
            //  console.log(list, indexs);
            {
                i++
            }
            let last;
            if (list.length) {
                return (
                    <React.Fragment>
                        <ReactSortable
                            list={list}
                            data-parent={id}
                            className={`menu-dept-${i}`}
                            setList={(e) => this.onSetMenu(e, 'item')}
                            group="groupName"
                            style={{paddingLeft: 30}}
                            {...this.state.sortableOptions}
                            onUpdate={(e) => this.onUpdateIemPostion(e, id)}
                            onAdd={(e) => this.onUpdateIemEndPostion(e, id)}
                        >
                            {list.map((g, sIndex) => {
                                return (
                                    <div key={g.id} data-parent={id}
                                         className="menu-item-bar">
                                        <div className="menu-item-handle child">
                                            <div id={`menuTitle${g.id}`}
                                                 className="flex-fill lh-1 menu-title"> {g.title}</div>
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
                                        <Menu list={g.__children} id={g.id} i={i}/>
                                    </div>
                                )
                            })}
                        </ReactSortable>
                    </React.Fragment>
                )
            }
            return (
                <ReactSortable
                    list={list}
                    data-parent={id}
                    className={`empty menu menu-dept-${i}`}
                    setList={(e) => this.onSetMenu(e, 'emptyItem')}
                    group="groupName"
                    style={{paddingLeft: 30}}
                    {...this.state.sortableOptions}
                    onUpdate={(e) => this.onUpdateIemPostion(e, id)}
                    onAdd={(e) => this.onUpdateIemEndPostion(e, id)}
                    //onRemove={(e) => this.onRemoveItem(e, id)}
                >
                    <div className="menu-item">
                        <div className="menu-item-handle child empty">

                        </div>
                    </div>

                </ReactSortable>
            );
        }
        return (
            <Card ref={this.menuSortable} className="menu-wrapper">
                <CardBody>
                    {this.props.groups.length ?
                        <ReactSortable
                            list={this.props.groups}
                            setList={(e) => this.onSetMenu(e, 'group')}
                            group="groupName"
                            {...this.state.sortableOptions}
                            onUpdate={(e) => this.onUpdatePosition(e)}
                            onAdd={(e) => this.onRemoveItem(e)}
                        >
                            {this.props.groups.map((item, index) => {
                                return (
                                    <div data-id={item.id} data-parent={item.id} key={item.id}
                                         className="list-unstyled menu-list">
                                        <div className="menu-item-bar">
                                            <div className="menu-item-handle menu-dept-0">
                                                <div id={`menuTitle${item.id}`}
                                                     className="flex-fill lh-1 menu-title"> {item.title}</div>
                                                <div className="ms-auto">
                                                    <small
                                                        className="small-lg text-muted">{trans['menu'][item.type]}</small>
                                                </div>
                                                <div style={{width: '3rem'}}
                                                     onClick={(e) => this.editCollapse(`#menuEdit${item.id}`, e, item.id)}
                                                     className="ms-auto- text-center h-100 chevron-rotate cursor-pointer"></div>
                                            </div>
                                            <div id={`menuEdit${item.id}`} className="collapse">
                                                <MenuEditForm
                                                    edit={item}
                                                    sendAxiosFormdata={this.props.sendAxiosFormdata}
                                                    id={this.props.id}
                                                />
                                            </div>
                                            <Menu
                                                list={item.__children}
                                                id={item.id}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </ReactSortable>
                        : <div className="text-center mt-1 text-danger">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {trans['menu']['no entries available']}
                        </div>}
                </CardBody>
            </Card>
        )
    }
}