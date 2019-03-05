import React, { Component } from 'react';

class SvgIcon extends Component {
  render () {
    return (
      <svg width={this.props.width} height={this.props.height}
           xmlns="http://www.w3.org/2000/svg"
           xmlnsXlink="http://www.w3.org/1999/xlink"
           className={`icon icon-${this.props.icon}`}>
        <use xlinkHref={this.props.url + "#" + this.props.icon} />
      </svg>
    )
  };
};

export default SvgIcon;