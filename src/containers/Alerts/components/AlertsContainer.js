import React, { useEffect, useState } from 'react';

import { HIDE, SHOW } from '../constants';
import emitter, { hideAlert } from '../emitter';

// import PropTypes from 'prop-types';
import Alert from './Alert';
import CloseButton from './CloseButton';
import Container from './Container';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => emitter.on(SHOW, (item) => setAlerts((state) => [].concat(state, item))), [setAlerts]);
  useEffect(() => emitter.on(HIDE, (id) => setAlerts((state) => state.filter((item) => item.id !== id))), [setAlerts]);

  return (
    <Container>
      {alerts.map(({ id, type, message }) => (
        <Alert type={type} key={id}>
          {message}
          <CloseButton onClick={() => hideAlert(id)} />
        </Alert>
      ))}
    </Container>
  );
};

Alerts.propTypes = {};
Alerts.defaultProps = {};

export default Alerts;

