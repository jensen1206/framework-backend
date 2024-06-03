import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class FormFieldsSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
        this.state = {}
        this.onSetFormElement = this.onSetFormElement.bind(this);

    }

    onSetFormElement(type){
        let formData = {
            'method': 'set_form_field',
            'form_type': type,
            'grid': this.props.fieldGrid,
            'group': this.props.fieldGroup,
            'form_id': this.props.formData.form_id,
            'form':  this.props.formData.id,
        }

        this.props.sendAxiosFormdata(formData)
    }

    render() {
        return (
            <>
                <Modal className="form-builder-modal forms"
                       animation={true}
                       scrollable={true}
                       show={this.props.showFormFieldsModal}
                       onHide={() => this.props.changeFormFieldsModal(false)}
                       size="xl"
                >
                    <Modal.Header className="bg-body-tertiary border text-body fs-6" closeButton>
                        <Modal.Title>
                            <i className="bi bi-node-plus me-2"></i>
                            {trans['forms']['Fields']}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.formFieldsData.map((groups, index) => {
                            return (
                                <div key={index} className="field-groups-wrapper">
                                    <div className="field-group-headline">
                                        {groups.name}
                                    </div>
                                    <div className="modal-forms-grid">
                                        {groups.forms.map((form, fIndex) => {
                                            return (
                                                <div onClick={() => this.onSetFormElement(form.type)}
                                                    className="forms-item" key={form.id}>
                                                    <i className={form.icon}></i>
                                                    <div className="item-name">
                                                        {form.select}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => this.props.changeFormFieldsModal(false)}>
                            {trans['swal']['Cancel']}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}