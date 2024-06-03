import * as React from "react";
import parser from "react-html-parser";


function Icon({plugin}) {
    return (
        <React.Fragment>
            <div className="d-flex flex-column w-100 align-items-center">
                <div className="w-100">
                    {plugin.config.icon ?
                        <div className="text-center mt-2 fs-2">
                        <i className={plugin.config.icon}></i>
                        </div>
                        : parser(plugin.data.input)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Icon;