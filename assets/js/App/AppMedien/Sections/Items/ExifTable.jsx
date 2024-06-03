import * as React from "react";

export default class ExifTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.uploadRefForm = React.createRef();
        this.state = {
            showCopied: false
        }
        this.onUpdateCopied = this.onUpdateCopied.bind(this);

    }

    onUpdateCopied() {

    }

    render() {
        return (
            <React.Fragment>
                <div className="exif-details-wrapper">
                    <div className="table-responsive">
                        <table className="table border-start border-end">
                            <tbody>
                            {this.props.exifIfdo.ImageDescription ? (
                                <tr>
                                    <td className="align-middle text-nowrap" style={{width: '20%'}}>
                                        <i className="bi bi-textarea-t"></i>
                                        <b>{trans['system']['Image']} {trans['system']['Description']}:</b>
                                    </td>
                                    <td style={{width: '18%'}} className="align-middle">
                                        {this.props.exifIfdo.ImageDescription}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ) : ''}
                            <tr>
                                <td style={{width: '20%'}} className="align-middle text-nowrap">
                                    <i className="bi bi-c-circle"></i>
                                    <b>{trans['system']['Copyright']}:</b>
                                </td>
                                <td style={{width: '18%'}}
                                    className="align-middle text-truncate">{this.props.exifComputed.Copyright}</td>
                                <td style={{width: '4%'}} className="align-middle"></td>
                                <td style={{width: '16%'}} className="text-nowrap align-middle">
                                    <i className="bi bi-speedometer2"></i>
                                    <b>{trans['medien']['Messmodus']}</b>
                                </td>
                                <td style={{width: '15%'}} className="align-middle text-truncate">
                                    {this.props.exifExif.MeteringMode}
                                </td>
                                <td style={{width: '23%'}} className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Latitude Ref']}:</b>
                                </td>
                                <td style={{width: '8%'}} className="align-middle text-truncate">
                                    {this.props.gpsStatus ? this.props.exifGps.GPSLatitudeRef : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-camera"></i>
                                    <b>{trans['medien']['Camera']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifIfdo.Make ? this.props.exifIfdo.Make : trans['unknown']}
                                </td>
                                <td className="align-middle"></td>
                                <td className="align-middle">
                                    <i className="bi bi-camera2"></i>
                                    <b>{trans['medien']['Model']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifIfdo.Model  ? this.props.exifIfdo.Model : trans['unknown']}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Latitude 1']}:</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLatitude1}°` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle text-nowrap text-truncate">
                                    <i className="bi bi-calendar3"></i>
                                    <b>{trans['medien']['Recorded']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifExif.DateTimeOriginal ? (
                                    <span className="mb-0 lh-1">
                                        {`${this.props.exifExif.DateTimeOriginal} ${trans['Clock']}`}
                                    </span>) : (
                                        <span>{trans['unknown']}</span>)}

                                </td>
                                <td></td>
                                <td className="align-middle">
                                    <i className="bi bi-bullseye"></i>
                                    <b>{trans['medien']['Lens']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifExif.Objectiv}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Latitude 2']}:</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLatitude2}°` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-calendar-check"></i>
                                    <b>{trans['medien']['last modification']}</b>
                                </td>
                                <td className="align-middle text-nowrap">
                                    {this.props.exifIfdo.LastEditTime ? (
                                    <span className="mb-0 lh-1">
                                        {`${this.props.exifIfdo.LastEditTime} ${trans['Clock']}`}
                                    </span>) : (
                                        <span>{trans['unknown']}</span>
                                    )}
                                </td>
                                <td className="align-middle"></td>
                                <td className="align-middle">
                                    <i className="bi bi-info-circle"></i>
                                    <b>{trans['medien']['ISO']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifExif.ISOSpeedRatings ? this.props.exifExif.ISOSpeedRatings : trans['unknown']}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Latitude 3']}:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLatitude3}°` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-calendar4-week"></i>
                                    <b>{trans['medien']['Digitized']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifFile.uploadTime ? (
                                    <span className="mb-0 lh-1">
                                        {this.props.exifFile.uploadTime  ? `${this.props.exifFile.uploadTime} ${trans['Clock']}` : ''}
                                    </span>) : (
                                        <span className="fw-normal">{trans['unknown']}</span>
                                    )}
                                </td>
                                <td></td>
                                <td className="align-middle">
                                    <i className="bi bi-eye"></i>
                                    <b>{trans['medien']['Blende']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifComputed.ApertureFNumber}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Longitude Ref']}:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLongitudeRef}` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-filetype-jpg"></i>
                                    <b>{trans['medien']['File type']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifFile.MimeType}
                                </td>
                                <td></td>
                                <td className="align-middle">
                                    <i className="bi bi-clock"></i>
                                    <b>{trans['medien']['Exposure']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifExif.ExposureTime}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Longitude 1']}:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLongitude1}°` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-display"></i>
                                    <b>{trans['medien']['Software']}</b>
                                </td>
                                <td className="td-small align-middle">
                                    {this.props.exifIfdo.Software}
                                </td>
                                <td></td>
                                <td className="align-middle">
                                    <i className="bi bi-circle"></i>
                                    <b>{trans['medien']['Focal length']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifExif.FocalLength}{this.props.exifExif.FocalLength !== 'unbekannt' ? 'mm' : ''}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Longitude 2']}:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLongitude2}°` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-arrows"></i>
                                    <b>{trans['medien']['Image width']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifComputed.Width}{this.props.exifComputed.Width ? 'px' : ''}
                                </td>
                                <td></td>
                                <td className="align-middle">
                                    <i className="bi bi-circle"></i>
                                    <b>{trans['medien']['in']} 35mm:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifExif.FocalLengthIn35mmFilm}{this.props.exifExif.FocalLengthIn35mmFilm !== 'unbekannt' ? 'mm' : ''}
                                </td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Longitude 3']}:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSLongitude3}°` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-arrows-vertical"></i>
                                    <b>{trans['medien']['Image height']}</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.exifComputed.Height}{this.props.exifComputed.Height ? 'px' : ''}
                                </td>
                                <td></td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-gear"></i>
                                    <b>{trans['medien']['White balance']}</b>
                                </td>
                                <td className="align-middle">{this.props.exifExif.WhiteBalance}</td>
                                <td className="align-middle text-nowrap">
                                    <i className="bi bi-geo-alt"></i>
                                    <b>{trans['medien']['GPS Altitude']}:</b>
                                </td>
                                <td className="align-middle">
                                    {this.props.gpsStatus ? `${this.props.exifGps.GPSAltitude}` : trans['unknown']}
                                </td>
                            </tr>

                            <tr>
                                <td className="align-middle">
                                    <i className="bi bi-tags"></i>
                                    <b>{trans['medien']['Program']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifExif.ExposureProgram}
                                </td>
                                <td></td>
                                <td className="align-middle">
                                    <i className="bi bi-circle-half"></i>
                                    <b>{trans['medien']['Light source']}</b>
                                </td>
                                <td className="align-middle text-truncate">
                                    {this.props.exifExif.LightSource}
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer rounded-0 border text-center fw-semibold text-muted">
                    {trans['medien']['Upload']}:
                    <span className="fw-normal ms-1">
                    {this.props.exifFile.uploadTime !== 'unbekannt' ? `${this.props.exifFile.uploadTime} ${trans['Clock']}` : 'unbekannt'}
                      </span>
                    <span className="mx-1 fw-light d-inline-block"> | </span>
                    {trans['system']['last modified']}:
                    <span className="fw-normal ms-1">
                       {this.props.exifIfdo.LastEditTime !== 'unbekannt' ? `${this.props.exifIfdo.LastEditTime} ${trans['Clock']}` : 'unbekannt'}
                    </span>
                </div>
            </React.Fragment>
        )
    }

}