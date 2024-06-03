import * as React from "react";
import parser from "react-html-parser";


function MedienSlider({plugin}) {
    return (
        <React.Fragment>
            {plugin.images.length ?
                <div className={`${plugin.config.css_class} image-grid-plugin small pt-3`}>
                    {plugin.images.map((i, index) => {
                        return (
                            <div key={index} className="plugin-image-grid-item">
                                <img
                                    width={55}
                                    height={55}
                                    src={`${i.type === 'data' ? publicSettings.public_mediathek+'/'+i.image : publicSettings.thumb_url + '/'+i.image}`}
                                    alt=""/>
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

export default MedienSlider;