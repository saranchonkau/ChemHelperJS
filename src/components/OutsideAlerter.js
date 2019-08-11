import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Component that alerts if you click outside of it
 */
class OutsideAlerter extends Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.handleClickOutside();
    }
  };

  render() {
    const { children, className } = this.props;
    return (
      <div ref={this.setWrapperRef} className={className || ''}>
        {children}
      </div>
    );
  }
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
  handleClickOutside: PropTypes.func,
  className: PropTypes.string,
};

export default OutsideAlerter;
