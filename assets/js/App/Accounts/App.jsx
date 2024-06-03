import * as React from "react";
import AccountForm from "./AccountForm";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            data: {},
        }
    }
    render() {
        return (
            <>
               <AccountForm
                   id={this.props.id}
                   type={"profil"}
                   load_account={false}
                   handle='update'
               />
            </>
        )
    }
}