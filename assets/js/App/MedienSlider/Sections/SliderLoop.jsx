import * as React from "react";

import {v5 as uuidv5} from 'uuid';

const v5NameSpace = '180c4d8c-c77c-11ee-a214-325096b39f47';
export default class SliderLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}

        this.onDeleteSlider = this.onDeleteSlider.bind(this);

    }
    onDeleteSlider(id) {
        let swal = {
            'title': `${trans['swal']['Delete slider']}?`,
            'msg': trans['swal']['All data will be deleted. The deletion cannot be reversed.'],
            'btn': trans['swal']['Delete slider']
        }

        let formData = {
            'method': 'delete_slider',
            'id': id
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    render() {
        return (
            <React.Fragment>
                <div className="overview-grid">
                    {this.props.sliders.map((s, index) => {
                        return (
                            <div
                                key={index}
                                className="overview-item border rounded  mx-sm-auto text-center position-relative">
                                <div

                                    title={trans['edit']}
                                    onClick={() => this.props.onGetEditSlider(s.id)}
                                    className="p-2 d-flex flex-column align-items-center cursor-pointer h-100 ">
                                    <i className="bi bi-arrow-left-right mb-3 fs-4"></i>
                                    <div>{s.slider.designation}</div>
                                </div>
                                <small
                                    onClick={() => this.onDeleteSlider(s.id)}
                                    className="position-absolute hover-scale top-0 end-0 mt-1 me-1">
                                    <i title={trans['delete']} className="bi bi-trash  cursor-pointer text-danger"></i>
                                </small>
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }

}