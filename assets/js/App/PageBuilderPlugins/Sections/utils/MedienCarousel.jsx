import * as React from "react";
import parser from "react-html-parser";


function MedienCarousel({plugin}) {
    return (
        <React.Fragment>
            {plugin.images.length ?
                <div className={`${plugin.config.css_class} image-grid-plugin overflow-hidden small pt-3`}>
                    {plugin.images.map((i, index) => {
                        return (
                            <div key={index} className="plugin-image-grid-item ">
                                {i.image ?
                                <img
                                    width={55}
                                    height={55}
                                    src={`${i.type === 'data' ? publicSettings.public_mediathek+'/'+i.image : publicSettings.thumb_url + '/'+i.image}`}
                                    alt=""/>:
                                    <div style={{width: '50px', height: '50px'}} className="placeholder-account-image overflow-hidden p-1"></div>
                                    }
                            </div>
                        )
                    })}
                </div>
                : <div>
                    {parser(plugin.data.input)}
                </div>}
        </React.Fragment>
    )
}

export default MedienCarousel;