import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function Link({ path, children }) {
  return (
    <NavLink
      to={path}
      activeStyle={{ color: 'red' }}
      style={{ color: 'white' }}
    >
      {children}
    </NavLink>
  );
}

function Header() {
  return (
    <Container position="static">
      <Toolbar>
        <Text variant="h6">ChemHelper</Text>
        <Text variant="h6">
          <Link path="/formula">Formula</Link>
        </Text>
        <Text variant="h6">
          <Link path="/nuclides">Nuclides</Link>
        </Text>
      </Toolbar>
    </Container>
  );
}

const Container = styled(AppBar)`
  background-color: #00285f;
`;

const Text = styled(Typography)`
  flex: 1;
`;

export default Header;
