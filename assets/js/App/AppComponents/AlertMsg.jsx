import * as React from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default class AlertMsg extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            data: {},
        }
    }

    render() {
        return (
            <Alert
                className="my-2"
                show={this.props.alertShow}
                variant={this.props.alertVariant}
                onClose={() => this.props.onAlertShow(false)}
                dismissible
            >
                <Alert.Heading>{this.props.alert.title}</Alert.Heading>
                <p>
                    {this.props.alert.msg}
                </p>
            </Alert>
        )
    }
}