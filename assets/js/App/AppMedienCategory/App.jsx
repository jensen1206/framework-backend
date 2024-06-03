import * as React from "react";
import * as AppTools from "../AppComponents/AppTools";
import {v5 as uuidv5} from "uuid";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import MedienCategoryTable from "./Sections/MedienCategoryTable";
import CategoryModal from "../AppMedien/Modal/CategoryModal";
import Button from "react-bootstrap/Button";

const reactSwal = withReactContent(Swal);
const v5NameSpace = '92cfd306-8233-47bd-92b8-80f12f407733';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            mediaCategoryDraw: false,
            showCategoryModal: false,
            loadCategoryModalData: false,
            catId: '',
            userSelects: []
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);

        this.setMediaCategoryDraw = this.setMediaCategoryDraw.bind(this);
        this.onShowCategoryModal = this.onShowCategoryModal.bind(this);
        this.sortableCallback = this.sortableCallback.bind(this);
        this.onSetTableSelects = this.onSetTableSelects.bind(this);
        this.onSetLoadCategoryModalData = this.onSetLoadCategoryModalData.bind(this);
        this.addCategoryCallback = this.addCategoryCallback.bind(this);
        this.onGetCategoryModal = this.onGetCategoryModal.bind(this);



    }

    setMediaCategoryDraw(state) {
        this.setState({
            mediaCategoryDraw: state
        })
    }

    onShowCategoryModal(state) {
        this.setState({
            showCategoryModal: state
        })
    }

    onSetTableSelects(select) {
            this.setState({
                userSelects: select
            })
   }

    addCategoryCallback(id, label){
        this.setState({
            mediaCategoryDraw: true
        })
    }

    onGetCategoryModal(id){
        this.setState({
            loadCategoryModalData: true,
            catId: id
        })
    }

    onSetLoadCategoryModalData(state){
        this.setState({
            loadCategoryModalData: state
        })
    }

    sortableCallback(elements) {
        let formData = {
            'method': 'media_category_sortable',
            'ids': JSON.stringify(elements),
        }

        this.sendAxiosFormdata(formData).then()
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
                this.sendAxiosFormdata(formData).then()
            }
        });
    }

    async sendAxiosFormdata(formData, isFormular = false, url = uploadSettings.ajax_url) {
        if (formData) {
            await axios.post(url, SetAjaxData(formData, isFormular, uploadSettings))
                .then(({data = {}} = {}) => {
                    switch (data.type) {
                        case 'media_category':
                            if (!data.status) {
                                AppTools.warning_message(data.msg)
                            }

                            break;
                        case 'delete_media_category':
                             AppTools.swalAlertMsg(data)
                            if(data.status){
                                this.setState({
                                    mediaCategoryDraw: true
                                })
                            }
                            break;
                    }
                }).catch(err => console.error(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                <CategoryModal
                    loadCategoryModalData={this.state.loadCategoryModalData}
                    onSetLoadCategoryModalData={this.onSetLoadCategoryModalData}
                    addCategoryCallback={this.addCategoryCallback}
                    id={this.state.catId}
                />
                <h3 className="fw-semibold text-body pb-3">
                    {trans['system']['Media library category']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <Button
                    onClick={() => this.setState({loadCategoryModalData: true, catId: ''})}
                    variant={`success-custom dark`}>
                    <i className="bi bi-node-plus me-2"></i>
                    {trans['medien']['Create a new category']}
                </Button>
                <hr/>
                <MedienCategoryTable
                    mediaCategoryDraw={this.state.mediaCategoryDraw}
                    userSelects={this.state.userSelects}
                    setMediaCategoryDraw={this.setMediaCategoryDraw}
                    sortableCallback={this.sortableCallback}
                    onSetTableSelects={this.onSetTableSelects}
                    onGetCategoryModal={this.onGetCategoryModal}
                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                />
            </React.Fragment>
        )
    }
}