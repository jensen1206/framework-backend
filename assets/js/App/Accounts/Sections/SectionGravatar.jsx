import * as React from "react";
import Form from 'react-bootstrap/Form';
export default class SectionGravatar extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            data: {},
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="shadow-sm card">
                    <div className="bg-body-tertiary d-flex align-items-center py-3 fs-5 fw-semibold card-header">
                       <div>
                        <i className="bi bi-emoji-grin me-2"></i>
                        {trans['profil']['Gravatar']}
                       </div>
                        <div className="ms-auto">
                            <small className="fs-6 small-lg text-muted fw-normal">{this.props.accountHolder.email}</small>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="mx-auto">
                            <hr/>
                            <div className="d-flex justify-content-center flex-wrap ">
                                {this.props.selects.gravatar.map((g, index) => {
                                    return (
                                        <div key={index}
                                             className="d-flex justify-content-center  align-items-center">
                                            <div className="m-1">
                                                <div className="p-1 border rounded">
                                                    <img className="gravatar-img- overflow-hidden rounded-top" src={g.url} alt=""/>
                                                    <div className="mt-2 border-top d-flex align-items-center justify-content-center">
                                                        <Form.Check
                                                            className="no-blur mt-2"
                                                            type="switch"
                                                            id={g.id}
                                                            checked={this.props.account.gravatar === g.value || false}
                                                            onChange={(e) => this.props.onUpdateGravatar(g.value)}
                                                            label="aktiv"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <hr/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}