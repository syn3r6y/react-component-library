import React from 'react';
import { PropTypes } from 'prop-types';

/** A hello world component description */
const HelloWorld = ({ message }) =>
  <div>
    Hello {message}
  </div>;

HelloWorld.propTypes = {
  /** Message to display */
  message: PropTypes.string
};

HelloWorld.defaultProps = {
  message: 'World'
};

export default HelloWorld;
