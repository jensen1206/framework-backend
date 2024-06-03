import * as React from "react";
import {v5 as uuidv5} from 'uuid';

const v5NameSpace = 'f49b238d-8702-4f05-823c-040994ef3ed5';
export default class GalleryLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}

        this.onDeleteGallery = this.onDeleteGallery.bind(this);
        this.onGetEditGallery = this.onGetEditGallery.bind(this);

    }
    onGetEditGallery(id){
        let formData = {
            'method': 'get_edit_gallery',
            'id': id
        }

        this.props.sendAxiosFormdata(formData)
    }

    onDeleteGallery(id){
        let swal = {
            'title': `${trans['swal']['Delete gallery']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete gallery']
        }

        let formData = {
            'method': 'delete_gallery',
            'id': id
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }
   render() {
        return(
            <React.Fragment>
                {this.props.gallery.length ?
                <div className="overview-grid">
                    {this.props.gallery.map((g, index) => {
                        return (
                            <div
                                key={index}
                                className="overview-item border rounded  mx-sm-auto text-center position-relative">
                                <div
                                    title={trans['edit']}
                                    onClick={() => this.onGetEditGallery(g.id)}
                                    className="p-2 d-flex flex-column align-items-center cursor-pointer h-100 ">
                                    <i className="bi bi-images mb-3 fs-4"></i>
                                    <div>{g.label}</div>
                                </div>
                                <small
                                    onClick={() => this.onDeleteGallery(g.id)}
                                    className="position-absolute hover-scale top-0 end-0 mt-1 me-1">
                                    <i title={trans['delete']} className="bi bi-trash  cursor-pointer text-danger"></i>
                                </small>
                            </div>
                        )
                    })}
                </div>
                    :
                <div className="text-danger fs-5">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {trans['gallery']['no gallery available']}
                </div>
                }
            </React.Fragment>
        )
   }
}