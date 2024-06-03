import * as React from "react";
import parser from "react-html-parser";


function PostDate({plugin}) {
    return (
        <React.Fragment>
            <div className="d-flex flex-column w-100 align-items-center">
                <div className="w-100">
                    {parser(plugin.data.input)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default PostDate;