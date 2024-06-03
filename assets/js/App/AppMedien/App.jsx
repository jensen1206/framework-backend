import * as React from "react";
import MediaTable from "./Sections/MediaTable";
import MediathekUpload from "./Sections/MediathekUpload";
import MediaDetails from "./Sections/MediaDetails";
import MediaExif from "./Sections/MediaExif";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from "uuid";
import axios from "axios";
import SetAjaxData from "../AppComponents/SetAjaxData";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import * as AppTools from "../AppComponents/AppTools";
import CategoryModal from "./Modal/CategoryModal";

const reactSwal = withReactContent(Swal);

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
const v5NameSpace = '362483be-b52c-11ee-b2f4-325096b39f47';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            data: {},
            selectedIds: [],
            showGrid: false,
            drawShowGrid: false,
            categorySelect: [],
            suCategorySelect: [],
            userSelects: [],
            typeSelects: [],
            multiSelects: [],
            selectedMultiple: 0,
            selectedMultiCategory: 0,
            overviewBtnDisabled: false,
            drawMediaTable: false,
            collapseMediaTable: true,
            collapseMediaUpload: false,
            collapseMediaDetail: false,
            collapseMediaExif: false,
            loadCategorySelects: false,
            loadCategoryModalData: false,
            showCategoryModal: false,
            mediaDetails: {},
            gpsStatus: false,
            gmapsActive: false,
            exif_status: false,
            gpsData: {
                address: {},
                display_name: '',
                iframe_google: '',
                iframe_ops: '',
                lat: '',
                lon: '',
                alt: '',
                lat_short: '',
                lon_short: '',
                bbox: '',
                marker: ''
            },
            exifComputed: {
                ApertureFNumber: '',
                Copyright: '',
                Height: '',
                IsColor: '',
                Width: '',
            },
            exifExif: {
                CustomRendered: '',
                DateTimeOriginal:'',
                ExposureProgram:'',
                ExposureTime: '',
                FNumber: '',
                FocalLength: '',
                FocalLengthIn35mmFilm :'',
                ISOSpeedRatings: '',
                LightSource: '',
                MeteringMode: '',
                Objectiv: '',
                WhiteBalance: '',
            },
            exifFile: {
                FileSize: '',
                FileSizeConvert: '',
                Filetype: '',
                MimeType: '',
                uploadTime: ''
            },
            exifIfdo: {
                Artist: '',
                Copyright: '',
                Exif_IFD_Pointer: '',
                ImageDescription: '',
                LastEditTime: '',
                Make: '',
                Model: '',
                Software: '',
                XResolution: '',
                YResolution: '',
            },
            exifGps: {
                GPSLatitude1: '',
                GPSLatitude2: '',
                GPSLatitude3: '',
                GPSLatitudeRef: '',
                GPSLongitude1: '',
                GPSLongitude2: '',
                GPSLongitude3: '',
                GPSLongitudeRef: '',
                GPSAltitude: ''
            }
        }

        this.sendAxiosFormdata = this.sendAxiosFormdata.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);

        this.onSetDrawMediaTable = this.onSetDrawMediaTable.bind(this);
        this.onSetLoadCategoryModalData = this.onSetLoadCategoryModalData.bind(this);
        this.onClickAddCategory = this.onClickAddCategory.bind(this);

        this.addCategoryCallback = this.addCategoryCallback.bind(this);

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetLoadCategorySelect = this.onSetLoadCategorySelect.bind(this);
        this.onSetSelectTable = this.onSetSelectTable.bind(this);
        this.onSetSelects = this.onSetSelects.bind(this);
        this.onChangeSelected = this.onChangeSelected.bind(this);
        this.onExecuteMultipleBtn = this.onExecuteMultipleBtn.bind(this);
        this.onShowCategoryModal = this.onShowCategoryModal.bind(this);
        this.onSetDetail = this.onSetDetail.bind(this);
        this.onSetDrawShowGrid = this.onSetDrawShowGrid.bind(this);
        this.onSetOverviewBtnDisabled = this.onSetOverviewBtnDisabled.bind(this);

        this.onToggleGridTable = this.onToggleGridTable.bind(this);


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

    onShowCategoryModal(state) {
        this.setState({
            showCategoryModal: state
        })
    }

    onSetDrawMediaTable(state) {
        this.setState({
            drawMediaTable: state
        })
    }

    onChangeSelected(e, type) {
        switch (type) {
            case 'multi-cat':
                this.setState({
                    selectedMultiCategory: e
                })
                break;
            case 'multiple':
                this.setState({
                    selectedMultiple: e
                })
                break;
        }
    }

    onSetSelects(select, type) {
        switch (type) {
            case 'category':
                this.setState({
                    categorySelect: select
                })
                break;
            case 'su-category':
                this.setState({
                    suCategorySelect: select,
                })
                break;
            case 'types':
                this.setState({
                    typeSelects: select
                })
                break;
            case 'multiple':
                this.setState({
                    multiSelects: select
                })
                break;
            case 'user':
                this.setState({
                    userSelects: select
                })
                break;
        }
    }

    onSetSelectTable(id, type) {
        switch (type) {
            case 'add_all':
                this.setState({
                    selectedIds: id
                })
                break;
            case 'remove_all':
                this.setState({
                    selectedIds: []
                })
                break;
            case 'add':
                this.setState({
                    selectedIds: [...this.state.selectedIds, {
                        id: id
                    }]
                })
                break;
            case 'remove':
                const selUpd = [...this.state.selectedIds];

                this.setState({
                    selectedIds: this.filterArrayElementById(selUpd, id)
                })

                break;
        }

        sleep(150).then(() => {
            if (!this.state.selectedIds.length) {
                this.setState({
                    selectedMultiCategory: 0,
                    selectedMultiple: 0
                })
            }
        })
    }

    onSetLoadCategorySelect(state) {
        this.setState({
            loadCategorySelects: state
        })
    }

    onSetLoadCategoryModalData(state) {
        this.setState({
            loadCategoryModalData: state
        })
    }

    onToggleCollapse(type, drawTable = false) {
        let table = false;
        let upload = false;
        let detail = false;
        let exif = false;
        switch (type) {
            case 'table':
                table = true;
                this.setState({
                    mediaDetails: {}
                })
                break;
            case 'upload':
                upload = true;
                this.setState({
                    loadCategorySelects: true,
                    mediaDetails: {}
                })
                break;
            case 'detail':
                detail = true;
                break;
            case 'exif':
                exif = true;
                break;
        }

        this.setState({
            drawMediaTable: drawTable,
            collapseMediaTable: table,
            collapseMediaUpload: upload,
            collapseMediaDetail: detail,
            collapseMediaExif: exif,
        })
    }

    onExecuteMultipleBtn() {
        let formData;
        if (parseInt(this.state.selectedMultiple) === 1) {
            formData = {
                'method': 'media_change_category',
                'ids': JSON.stringify(this.state.selectedIds),
                'category': this.state.selectedMultiCategory
            }
            this.sendAxiosFormdata(formData).then()
        }
        if (parseInt(this.state.selectedMultiple) === 2) {
            formData = {
                'method': 'delete_media_selects',
                'ids': JSON.stringify(this.state.selectedIds),
            }

            let swal = {
                'title': `${trans['swal']['Delete files']}?`,
                'msg': trans['swal']['All files are deleted. The deletion cannot be undone.'],
                'btn': trans['swal']['Delete files']
            }
            this.onDeleteSwalHandle(formData, swal)
        }
    }

    onClickAddCategory() {
        this.setState({
            loadCategoryModalData: true
        })
    }

    addCategoryCallback(id, label) {
        this.setState({
            suCategorySelect: [...this.state.suCategorySelect, {
                id: id,
                label: label
            }]
        })
    }

    onSetDetail(e, type, handle) {
        let upd = this.state.mediaDetails;
        switch (handle) {
            case 'record':
                upd[type] = e;
                break;
            case 'category':
                let updCat = this.state.mediaDetails.category;
                updCat[type] = e;
                upd = this.state.mediaDetails
                break;
        }
        this.setState({
            mediaDetails: upd
        })
    }

    onToggleGridTable(){
        this.setState({
            showGrid: !this.state.showGrid,
            drawShowGrid: true
        })
    }

    onSetDrawShowGrid(state){
        this.setState({
            drawShowGrid: state
        })
    }

    onSetOverviewBtnDisabled(state) {
        this.setState({
            overviewBtnDisabled: state
        })
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
                        case 'delete_media_selects':
                        case 'media_change_category':
                            AppTools.swalAlertMsg(data);
                            if (data.status) {
                                this.setState({
                                    drawMediaTable: true,
                                    selectedMultiple: 0,
                                    selectedMultiCategory: 0,
                                    selectedIds: []
                                })
                            }
                            break;
                        case 'delete_media':
                            AppTools.swalAlertMsg(data);
                            if (data.status) {
                                this.onToggleCollapse('table', true);
                             }
                            break;
                        case 'media_details':
                            if (data.status) {
                                this.setState({
                                    mediaDetails: data.record,
                                    gpsStatus: data.gps_status,
                                    gpsData: data.gps_daten,
                                    exif_status: data.exif_status
                                })
                                if(data.exif_status){
                                    this.setState({
                                        gmapsActive: data.gmaps_active,
                                        exifComputed: data.exifComputed,
                                        exifExif: data.exifExif,
                                        exifFile: data.exifFile,
                                        exifIfdo:data.exifIfdo,
                                        exifGps: data.exifGps
                                    })
                                }
                                this.onToggleCollapse('detail')
                            }
                            break;
                        case 'update_media_file':
                            if (data.status) {
                                this.state.mediaDetails.user.email = data.user_email;
                                this.setState({
                                    drawMediaTable: true,
                                    mediaDetails: this.state.mediaDetails
                                })
                            }
                            AppTools.swalAlertMsg(data)
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
                    id=''
                />
                <h3 className="fw-semibold text-body pb-3">
                    {trans['system']['Media library']}
                    <small className="d-block fw-normal mt-2 text-secondary small-lg">
                        <i className="bi bi-caret-right me-1"></i>
                        {trans['Overview']}
                    </small>
                </h3>
                <ButtonGroup className="flex-wrap" aria-label="Basic example">
                    <Button
                        disabled={this.state.overviewBtnDisabled}
                        onClick={() => this.onToggleCollapse('table', true)}
                        variant={`collapse-icon dark ${this.state.collapseMediaTable ? 'btn-switch-blue active pe-none' : 'btn-switch-blue-outline'}`}>{trans['Overview']}
                    </Button>
                    {uploadSettings.user_upload ? (
                        <Button
                            onClick={() => this.onToggleCollapse('upload')}
                            variant={`collapse-icon dark ${this.state.collapseMediaUpload ? 'btn-switch-blue active pe-none' : 'btn-switch-blue-outline'}`}>{trans['medien']['Upload']}
                        </Button>
                    ) : ''}
                </ButtonGroup>
                <hr/>
                <Collapse in={this.state.collapseMediaTable}>
                    <div id={uuidv5('collapseMediaTable', v5NameSpace)}>
                        <MediaTable
                            drawMediaTable={this.state.drawMediaTable}
                            categorySelect={this.state.categorySelect}
                            typeSelects={this.state.typeSelects}
                            multiSelects={this.state.multiSelects}
                            selectedMultiple={this.state.selectedMultiple}
                            selectedMultiCategory={this.state.selectedMultiCategory}
                            selectedIds={this.state.selectedIds}
                            suCategorySelect={this.state.suCategorySelect}
                            userSelects={this.state.userSelects}
                            showGrid={this.state.showGrid}
                            drawShowGrid={this.state.drawShowGrid}
                            onSetDrawMediaTable={this.onSetDrawMediaTable}
                            onSetSelectTable={this.onSetSelectTable}
                            onSetSelects={this.onSetSelects}
                            onChangeSelected={this.onChangeSelected}
                            onExecuteMultipleBtn={this.onExecuteMultipleBtn}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                            onClickAddCategory={this.onClickAddCategory}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onToggleGridTable={this.onToggleGridTable}
                            onSetDrawShowGrid={this.onSetDrawShowGrid}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.collapseMediaUpload}>
                    <div id={uuidv5('collapseUpload', v5NameSpace)}>
                        <MediathekUpload
                            loadCategorySelects={this.state.loadCategorySelects}
                            onSetLoadCategorySelect={this.onSetLoadCategorySelect}
                            onSetOverviewBtnDisabled={this.onSetOverviewBtnDisabled}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.collapseMediaDetail}>
                    <div id={uuidv5('collapseDetail', v5NameSpace)}>
                        <MediaDetails
                            mediaDetails={this.state.mediaDetails}
                            exif_status={this.state.exif_status}
                            suCategorySelect={this.state.suCategorySelect}
                            sendAxiosFormdata={this.sendAxiosFormdata}
                            onToggleCollapse={this.onToggleCollapse}
                            onSetDetail={this.onSetDetail}
                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.collapseMediaExif}>
                    <div id={uuidv5('collapseExif', v5NameSpace)}>
                        <MediaExif
                            mediaDetails={this.state.mediaDetails}
                            gpsStatus={this.state.gpsStatus}
                            gpsData={this.state.gpsData}
                            exif_status={this.state.exif_status}
                            exifComputed={this.state.exifComputed}
                            exifExif={this.state.exifExif}
                            exifFile={this.state.exifFile}
                            exifIfdo={this.state.exifIfdo}
                            exifGps={this.state.exifGps}
                            gmapsActive={this.state.gmapsActive}
                            onToggleCollapse={this.onToggleCollapse}
                        />
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}