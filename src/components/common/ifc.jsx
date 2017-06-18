import React from 'react';

export class Else extends React.Component {
  render() {
    return this.props.children;
  }
}

export class If extends React.Component {
  render() {
    const {condition, children} = this.props;
    let thenBranch = children;
    let elseBranch = this.props.else ? this.props.else : null;
    if (Array.isArray(children)) {
      thenBranch = [];
      children.forEach((node) => {
        if (node.type != Else) {
          thenBranch.push(node)
        } else {
          elseBranch = node;
        }
      });
    }
    return (<div>{(condition) ? thenBranch : elseBranch}</div>);
  }
}

If.propTypes = {
  condition: React.PropTypes.any
};
