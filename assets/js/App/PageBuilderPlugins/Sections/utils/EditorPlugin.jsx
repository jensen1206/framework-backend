import * as React from "react";
import parser from "react-html-parser";

function EditorPlugin({plugin}) {
    return (
        <React.Fragment>
            {parser(plugin.data.input)}
        </React.Fragment>
    )
}

export default EditorPlugin;