import * as React from "react";
import parser from "react-html-parser";


function SingleImage({plugin}) {
    return (
        <React.Fragment>
            {plugin.config.source === 'mediathek' ?
                <React.Fragment>
                    {plugin.images.length ?
                        <div className={`${plugin.config.css_class} plugin-image-grid w-100 text-${plugin.config.align}`}>
                            {plugin.images.map((i, index) => {
                                return (
                                    <div key={index} className="plugin-image-grid-item pt-2">
                                        <img
                                            width={100}
                                            height={100}
                                            src={`${i.type === 'data' ? publicSettings.public_mediathek + '/' + i.fileName : publicSettings.thumb_url + '/' + i.fileName}`}
                                            alt=""/>
                                    </div>
                                )
                            })}
                        </div>
                        : <div>
                            {parser(plugin.data.input)}
                        </div>}
                </React.Fragment>
                :
                <div className={`${plugin.config.css_class} plugin-image-grid w-100  text-${plugin.config.align}`}>
                    <div className={`plugin-image-grid-item pt-2`}>
                        <img
                            style={{objectFit: 'cover'}}
                            width={100}
                            height={100}
                            src={`${plugin.config.external_url}`}
                            alt=""/>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

export default SingleImage;