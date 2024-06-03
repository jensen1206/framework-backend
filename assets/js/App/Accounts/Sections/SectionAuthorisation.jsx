import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import SetAjaxData from "../../AppComponents/SetAjaxData";
import Form from 'react-bootstrap/Form';

const v5NameSpace = '96aab39a-abe8-11ee-a996-325096b39f47';
import Collapse from 'react-bootstrap/Collapse';

export default class SectionAuthorisation extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

    }

    render() {

        let voterArr = [];
        this.props.voter.map((voter, index) =>
            voterArr.push(voter.section)
        )
        voterArr = [...new Set(voterArr)]

        return (
            <React.Fragment>
                <div className="shadow-sm card">
                    <div
                        className="bg-body-tertiary py-3 fs-5 fw-semibold d-flex flex-wrap align-items-center card-header">
                        <div>
                            <i className="bi bi-person-fill-lock me-2"></i>
                            {trans['system']['Authorisations']}
                            <small
                                className="small-lg fw-normal text-muted ms-2">({this.props.isNotUser ? trans['Admin'] : trans['User']})</small>
                        </div>
                        <div className="ms-auto">
                            <small
                                className="fs-6 small-lg text-muted fw-normal">{this.props.accountHolder.email}</small>
                        </div>
                    </div>
                    <div className="card-body">

                        <div className="fs-5 mb-2">
                            {trans['system']['Account authorisations']}
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            {this.props.voter.map((v, index) => {
                                return (
                                    <div key={index}
                                         className={`${v.section === 'user' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                        {v.section === 'user' ? (<>
                                            {v.label}
                                            <Form.Check
                                                type="switch"
                                                className="no-blur mb-3"
                                                checked={v.aktiv}
                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                id={v.id}
                                                label={trans['active']}
                                            /></>) : ''}
                                    </div>
                                )
                            })}
                        </div>
                        {this.props.isNotUser ? (
                            <>
                                {voterArr.includes('menu') ?
                                    <React.Fragment>
                                        <hr className="mt-0"/>
                                        <div className="fs-5 mb-2">
                                            {trans['system']['Page menu']}
                                        </div>
                                    </React.Fragment>
                                    : ''}

                                <div className="d-flex flex-wrap align-items-center">
                                    {this.props.voter.map((v, index) => {
                                        return (
                                            <div key={index}
                                                 className={`${v.section === 'menu' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                                {v.section === 'menu' ? (<>
                                                    {v.label}
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur mb-3"
                                                        checked={v.aktiv}
                                                        onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                        id={v.id}
                                                        label={trans['active']}
                                                    /></>) : ''}
                                            </div>
                                        )
                                    })}
                                </div>
                            </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('page') ?
                                <React.Fragment>
                                    <hr className="mt-0"/>
                                    <div className="fs-5 mb-2">
                                        {trans['system']['Page settings']}
                                    </div>
                                </React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'page' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'page' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('design') ?
                                <React.Fragment>
                                    <hr className="mt-0"/>
                                    <div className="fs-5 mb-2">
                                        {trans['builder']['Design settings']}
                                    </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'design' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'design' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('posts') ?
                                <React.Fragment>
                            <hr className="mt-0"/>
                            <div className="fs-5 mb-2">
                                {trans['posts']['Posts']}
                            </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'posts' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'posts' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('forms') ?
                                <React.Fragment>
                                    <hr className="mt-0"/>
                                    <div className="fs-5 mb-2">
                                        {trans['forms']['Forms']}
                                    </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'forms' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'forms' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('tools') ?
                                <React.Fragment>
                                    <hr className="mt-0"/>
                                    <div className="fs-5 mb-2">
                                        {trans['Tools']}
                                    </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'tools' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'tools' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('email') ?
                                <React.Fragment>
                            <hr className="mt-0"/>
                            <div className="fs-5 mb-2">
                                {trans['system']['E-mail authorisations']}
                            </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'email' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'email' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}
                        {this.props.isNotUser ? (<>
                            {voterArr.includes('api') ?
                                <React.Fragment>
                            <hr className="mt-0"/>
                            <div className="fs-5 mb-2">
                                {trans['system']['API authorisations']}
                            </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'api' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'api' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('log') ?
                                <React.Fragment>
                            <hr className="mt-0"/>
                            <div className="fs-5 mb-2">
                                {trans['system']['System settings']}
                            </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'log' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'log' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        {this.props.isNotUser ? (<>
                            {voterArr.includes('backup') ?
                                <React.Fragment>
                            <hr className="mt-0"/>
                            <div className="fs-5 mb-2">
                                {trans['system']['System backups']}
                            </div></React.Fragment>
                                : ''}
                            <div className="d-flex flex-wrap align-items-center">
                                {this.props.voter.map((v, index) => {
                                    return (
                                        <div key={index}
                                             className={`${v.section === 'backup' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                            {v.section === 'backup' ? (<>
                                                {v.label}
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    checked={v.aktiv}
                                                    onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                    id={v.id}
                                                    label={trans['active']}
                                                /></>) : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </>) : ''}

                        <hr className="mt-0"/>
                        <div className="fs-5 mb-2">
                            {trans['system']['Media library authorisations']}
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            {this.props.voter.map((v, index) => {
                                return (
                                    <div key={index}
                                         className={`${v.section === 'media' ? 'col-xl-3 col-lg-4 col-md-6' : ''}`}>
                                        {v.section === 'media' ? (<>
                                            {v.label}
                                            <Form.Check
                                                type="switch"
                                                className="no-blur mb-3"
                                                checked={v.aktiv}
                                                onChange={(e) => this.props.onUpdateVoter(e.target.checked, v.id)}
                                                id={v.id}
                                                label={trans['active']}
                                            /></>) : ''}
                                    </div>
                                )
                            })}
                        </div>


                    </div>
                </div>
            </React.Fragment>
        )
    }
}
