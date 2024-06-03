import React from 'react';
import Dropzone from 'react-dropzone'

export default class DropzoneUpload extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            acceptFiles: []
        }

        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(acceptedFiles) {
        this.setState({
            acceptFiles: acceptedFiles
        })
        let formData;
        acceptedFiles.map((file) => {
            formData = {
                'file': file,
                'method': 'import_page_builder'
            }
            this.props.sendAxiosFormdata(formData)
        })
    }


    render() {
        return (
            <>
                <div className="col-xl-6 mx-auto ">
                    <Dropzone
                        onDrop={this.onDrop}
                        accept={{
                            'application/json': ['.json'],
                        }}
                        multiple={false}
                    >
                        {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                            return (
                                <div
                                    className="react-dropzone border rounded bg-body-tertiary mt-4 mb-2 text-center p-3" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {!isDragActive && trans['builder']['Drag & drop or click the file here.']}
                                    {isDragActive && !isDragReject && trans['builder']['Drop file']}
                                    {isDragReject && trans['builder']['File type not accepted!']}
                                </div>
                            )
                        }
                        }
                    </Dropzone>
                    <div className="form-text text-center">{trans['builder']['Upload json File']}</div>
                </div>
            </>
        )
    }
}

