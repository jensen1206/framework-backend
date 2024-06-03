import * as React from "react";
import {v5 as uuidv5} from 'uuid';
import SetAjaxData from "../../AppComponents/SetAjaxData";

const v5NameSpace = '96aab39a-abe8-11ee-a996-325096b39f47';
import Collapse from 'react-bootstrap/Collapse';

export default class SectionUserConsent extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
        this.onDeleteConsent = this.onDeleteConsent.bind(this);

    }

    onDeleteConsent() {
        let swal = {
            'btn': trans['profil']['Delete authentication'],
            'title': `${trans['profil']['Delete authentication']}?`,
            'msg': trans['profil']['After deletion, the user must re-authenticate.']
        }

        let formData = {
            'method': 'delete_consent',
            'id': this.props.oAuth.consentId
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    render() {
        return (
            <React.Fragment>
                <div className="shadow-sm card">
                    <div
                        className="bg-body-tertiary py-3 fs-5 fw-semibold d-flex flex-wrap align-items-center card-header">
                        <div>
                            <i className="bi bi-person-fill-lock me-2"></i>
                            {trans['profil']['User consent']}
                        </div>
                    </div>
                    <div className="card-body">

                        <div className="d-flex flex-wrap">
                            <div
                                style={{minWidth: '5rem'}}
                                className="fw-semibold">
                                {trans['profil']['Created']}:
                            </div>
                            <div className="ms-2">
                                {this.props.oAuth.consentCreated}
                            </div>
                        </div>
                        <div className="d-flex flex-wrap">
                            <div
                                style={{minWidth: '5rem'}}
                                className="fw-semibold">
                                {trans['profil']['expires']}:
                            </div>
                            <div className={`ms-2 ${this.props.oAuth.consentExpired ? 'text-danger' : 'text-green'}`}>
                                {this.props.oAuth.expires}
                            </div>
                        </div>
                        <div className="d-flex flex-wrap">
                            <div
                                style={{minWidth: '5rem'}}
                                className="fw-semibold">
                                {trans['profil']['IP']}:
                            </div>
                            <div className="ms-2">
                                {this.props.oAuth.ipAddress}
                            </div>
                        </div>
                        {this.props.oAuth.consentExpired ? (
                            <div className="fs-5 text-danger my-1">
                                <i className="bi bi-person-slash me-2"></i>
                                {trans['profil']['Consent expired']}
                            </div>
                        ) : ''}
                        <button onClick={this.onDeleteConsent}
                                type="button" className="btn btn-danger btn-sm mt-3 dark">
                            <i className="bi bi-trash me-2"></i>
                            {trans['profil']['Delete authentication']}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
