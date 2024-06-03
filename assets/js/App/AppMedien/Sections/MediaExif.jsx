import * as React from "react";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {Card, CardBody, Container, Row} from "react-bootstrap";
import ExifTable from "./Items/ExifTable";
import Col from 'react-bootstrap/Col';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Collapse from 'react-bootstrap/Collapse';

const v5NameSpace = '2ccd18a8-8c44-4285-bb2a-bac12457f9c3';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default class MediaExif extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.state = {
            showCopied: false,
            collapseGmaps: true,
            collapseOps: false
        }
        this.onUpdateCopied = this.onUpdateCopied.bind(this);
        this.onToggleGpsCard = this.onToggleGpsCard.bind(this);

    }

    onUpdateCopied() {

    }

    onToggleGpsCard(type) {
        let gmaps = false;
        let ops = false;
        switch (type) {
            case 'gmaps':
                gmaps = true;
                break;
            case 'ops':
                ops = true;
                break;
        }
        this.setState({
            collapseGmaps: gmaps,
            collapseOps: ops
        })
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <Card.Header className="bg-body-tertiary">
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="fs-5 text-blue">
                                <small className="d-flex align-items-center">
                                    <i className="bi bi-camera2 fs-2 me-2"></i>
                                    <span>
                                  <b className="warn"> {trans['system']['Image']}</b> {trans['system']['Exif data']}
                                      </span>
                                </small>
                                <span className="small-lg d-block mt-1 text-muted">
                                       {this.props.mediaDetails.original}
                                   </span>
                            </div>
                            <button
                                onClick={() => this.props.onToggleCollapse('detail')}
                                className="btn btn-switch-blue-outline icon-circle ms-auto">
                                <i className="d-inline-block fs-5 bi bi-x-lg"></i>
                            </button>
                        </div>
                        {this.props.gpsStatus && this.props.gmapsActive ? (
                            <React.Fragment>

                                <hr/>
                                <span className="small pb-2 text-body d-block">
                                    {this.props.gpsData.display_name}
                                </span>
                                <Collapse in={this.state.collapseGmaps}>
                                    <div id={uuidv5('collapseGoogleMaps', v5NameSpace)}>
                                        <iframe src={this.props.gpsData.iframe_google}
                                                width="100%"
                                                height="300"
                                                allowFullScreen loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade">
                                        </iframe>
                                    </div>
                                </Collapse>
                                <div className="fw-normal pt-2">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    {trans['media']['Latitude']}: {this.props.gpsData.lon_short || ''}
                                    <span className="mx-1 text-muted d-inline-block">|</span>
                                    {trans['media']['Longitude']}: {this.props.gpsData.lat_short || ''}
                                    <span className="mx-1 text-muted d-inline-block">|</span>
                                    {trans['media']['Altitude']}: {this.props.gpsData.alt || ''}
                                </div>
                            </React.Fragment>
                        ) : ''}
                    </Card.Header>
                    <CardBody>

                        {publicSettings.extensions.includes(this.props.mediaDetails.extension) ? (
                            <div className="d-flex flex-wrap align-middle">
                                <a href={`${this.props.mediaDetails.large_url}/${this.props.mediaDetails.fileName}`}
                                   data-control="single"
                                   title={this.props.mediaDetails.title ? this.props.mediaDetails.title : this.props.mediaDetails.original}
                                   className="text-decoration-none img-link">
                                    <img
                                        src={`${this.props.mediaDetails.medium_url}/${this.props.mediaDetails.fileName}`}
                                        className="card-img-fit img-thumbnail me-3"
                                        alt={this.props.mediaDetails.original}
                                    />
                                </a>
                                <div
                                    className="d-flex flex-wrap text-muted justify-content-center flex-column mt-xl-0 mt-3">
                                <span className="fw-normal">
                                    <i className="bi bi-file-earmark me-2"></i>
                                    #{this.props.mediaDetails.id}
                                </span>
                                    <span className="fw-normal">
                                    <i className="bi bi-file-image me-2"></i>
                                        {this.props.mediaDetails.original}
                                </span>
                                    <span className="fw-normal">
                                       <i className="bi bi-folder2-open me-2"></i>
                                        {this.props.mediaDetails.category.designation}
                                 </span>
                                    <span className="fw-normal">
                                <i className="bi bi-file-break me-2"></i>
                                        {this.props.mediaDetails.fileSize}
                                </span>
                                </div>
                            </div>
                        ) : ''}
                        <hr className="mb-0"/>
                        {this.props.exif_status ? (
                            <ExifTable
                                gpsStatus={this.props.gpsStatus}
                                exifComputed={this.props.exifComputed}
                                exifExif={this.props.exifExif}
                                exifFile={this.props.exifFile}
                                exifIfdo={this.props.exifIfdo}
                                exifGps={this.props.exifGps}
                            />) : ''}
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }

}