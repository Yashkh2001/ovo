import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import capitalize from 'lodash/capitalize';

import * as types from '../types';

const colors = {
    [types.DEFAULT]: '#004085',
    [types.PRIMARY]: '#004085',
    [types.SECONDARY]: '#464a4e',
    [types.SUCCESS]: '#155724',
    [types.DANGER]: '#721c24',
    [types.WARNING]: '#856404',
    [types.INFO]: '#0c5460',
    [types.LIGHT]: '#818182',
    [types.DARK]: '#1b1e21',
};

const backgroundColors = {
    [types.DEFAULT]: '#cce5ff',
    [types.PRIMARY]: '#cce5ff',
    [types.SECONDARY]: '#e7e8ea',
    [types.SUCCESS]: '#d4edda',
    [types.DANGER]: '#f8d7da',
    [types.WARNING]: '#fff3cd',
    [types.INFO]: '#d1ecf1',
    [types.LIGHT]: '#fefefe',
    [types.DARK]: '#d6d8d9',
};

const borderColors = {
    [types.DEFAULT]: '#b8daff',
    [types.PRIMARY]: '#b8daff',
    [types.SECONDARY]: '#dddfe2',
    [types.SUCCESS]: '#c3e6cb',
    [types.DANGER]: '#f5c6cb',
    [types.WARNING]: '#ffeeba',
    [types.INFO]: '#bee5eb',
    [types.LIGHT]: '#fdfdfe',
    [types.DARK]: '#c6c8ca',
};

const Alert = styled.div`
display:block;
position: relative;
padding: 12px 20px;
margin: 0 0 1em;
border: 1px solid;
border-radius: 4px;
font-size: 14px;
color: ${(props) => colors[props.types] || colors[types.DEFAULT]};
border-color: ${(props) => borderColors[props.types] || borderColors[types.DEFAULT]};
background-color: ${(props) => backgroundColors[props.types] || backgroundColors[types.DEFAULT]};
white-space: normal;
word-wrap: break-word;
word-break: break-word;
`

Alert.propTypes={
    type: PropTypes.oneOf(Object.values(types))
}

Alert.defaultProps={
    type:types.DEFAULT
}

Object.values(types).reduce(
  (result, type) =>
    Object.defineProperty(result, capitalize(type), {
      value: (props) => <Alert {...props} type={type} />,
    }),
  Alert,
);

export default Alert;