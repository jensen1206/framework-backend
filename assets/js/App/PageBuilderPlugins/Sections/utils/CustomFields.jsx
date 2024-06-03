import * as React from "react";
import parser from "react-html-parser";
import config from "bootstrap/js/src/util/config";


function CustomFields({plugin}) {
    const UrlType = ({d, type}) => {
        let url = '';
        let urlTxt;
        if(type === 'url') {
            if(d.show_url === 'url'){
                urlTxt = d.value
            } else {
                urlTxt = d.designation
            }
            url = d.value;
        } else {
            url = 'mailto:'+d.value
            urlTxt = d.value
        }
        return (
            <React.Fragment>
                <a className="pe-none" href={url}>
                {d.icon?<i className={`${d.icon} me-2`}></i>:''}
                {urlTxt}
            </a>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <div className="d-flex flex-column py-3 w-100 align-items-center">
                <div className="w-100">
                    {plugin.config.fields && plugin.config.fields.length ?
                        <div className={plugin.config.wrapper_css}>
                            {plugin.config.fields.map((c, index) => {
                                return (
                                    <div className="mb-1" key={index}>
                                        {c.type === 'mailto' || c.type === 'url' ?
                                            <React.Fragment>

                                                <UrlType
                                                    d={c}
                                                    type={c.type}
                                                />

                                            </React.Fragment> :
                                            <React.Fragment>
                                                {c.icon ?
                                                    <i className={`${c.icon} me-2`}></i>
                                                    : ''}
                                                {c.value}
                                            </React.Fragment>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        : parser(plugin.data.input)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default CustomFields;