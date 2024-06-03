import * as React from "react";
import styled from 'styled-components';
import parser from "react-html-parser";
export default class DividingTextLine extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {}
    }

    render() {
        const ComponentWithPseudoClass = styled.div`
          
          position: relative;
          display: flex;
          align-items: center;
          &:before {
            content: '';
            width: 100%;
            height: ${this.props.plugin.config.height};
            background: rgba(${this.props.plugin.config.color.r},${this.props.plugin.config.color.g},${this.props.plugin.config.color.b},${this.props.plugin.config.color.a} );
            margin-right: .75rem;
          }
          &:after {
            content: '';
            width: 100%;
            height: ${this.props.plugin.config.height};
            background: rgba(${this.props.plugin.config.color.r},${this.props.plugin.config.color.g},${this.props.plugin.config.color.b},${this.props.plugin.config.color.a} );
            margin-left: .75rem;
          }`;
        return (
            <React.Fragment>
                <div className={`d-flex flex-column w-100 align-items-center`}>
                    <div style={{width: `100%`}} className="mt-3">
                        <ComponentWithPseudoClass>
                            <div className="text-nowrap">
                               {parser(`<${this.props.plugin.config.fontStyle}>${this.props.plugin.config.text}</${this.props.plugin.config.fontStyle}>`)}
                            </div>
                        </ComponentWithPseudoClass>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}




