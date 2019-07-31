import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

function FormulaGroup({ title, items }) {
  const [isOpen, setOpen] = useState(false);

  function toggle() {
    setOpen(prevOpen => !prevOpen);
  }

  return (
    <>
      <ListItem button onClick={toggle}>
        <ListItemText primary={title} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      {items.length > 0 && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {items.map(item => (
              <Link key={item.id} exact to={item.link}>
                <NestedListItem button>
                  <ListItemText primary={item.title} />
                </NestedListItem>
              </Link>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

const Link = styled(NavLink)`
  color: inherit;
  text-decoration: inherit;
`;

const NestedListItem = styled(ListItem)`
  padding-left: 32px;
`;

FormulaGroup.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
};

export default FormulaGroup;
