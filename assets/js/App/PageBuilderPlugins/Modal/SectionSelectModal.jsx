import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';

const v5NameSpace = 'a9d8af8c-16d7-4370-a5eb-d08f5c84d9d7';
export default class SectionSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {

        }


    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        return (
            <>
                <Modal className="form-builder-modal"
                       animation={true}
                       scrollable={true}
                       show={this.props.showSectionModal}
                       onHide={() => this.props.setShowSectionModal(false)}
                       size="xl"
                >
                    <Modal.Header className="bg-body-tertiary pb-2 fs-6 align-items-start text-body" closeButton>
                        <div className="d-flex flex-column w-100">
                            <Modal.Title>
                                <i className="bi bi-node-plus me-2"></i>
                                {trans['system']['Add section']}
                            </Modal.Title>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="fs-5">
                            {trans['system']['Saved sections']}
                        </div>
                        <hr/>
                        {this.props.savedSections.length ?
                            <div className="modal-forms-grid">
                                {this.props.savedSections.map((saved, fIndex) => {
                                    return (
                                        <div onClick={() => this.props.onSetSavedSection(saved.id)}
                                             className="forms-item bg-body-tertiary" key={fIndex}>
                                            <i className={saved.icon}></i>
                                            <small className="small text-muted pb-2 lh-12">
                                                {saved.designation}
                                            </small>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div className="text-danger fs-5">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {trans['plugins']['No elements available']}
                            </div>
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => this.props.setShowSectionModal(false)}>
                            {trans['swal']['Cancel']}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}