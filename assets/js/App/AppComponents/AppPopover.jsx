import * as React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {v4 as uuidv4} from "uuid";
export default class AppPopover extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {

        }

    }

    render() {
        return (
            <Popover
                id={uuidv4()}>
                <Popover.Header as="h3">Popover right</Popover.Header>
                <Popover.Body>
                    And here's some <strong>amazing</strong> content. It's very engaging.
                    right?
                </Popover.Body>
            </Popover>
        )
    }
}