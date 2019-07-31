import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';

import config from 'constants/formulaConfig';

import FormulaGroup from './FormulaGroup';

class FormulaList extends React.Component {
  render() {
    return (
      <Container>
        <List component="nav">
          {config.map(groupItem => (
            <FormulaGroup
              key={groupItem.id}
              title={groupItem.title}
              items={groupItem.items}
            />
          ))}
        </List>
      </Container>
    );
  }
}

const Container = styled.div`
  flex-shrink: 0;
  margin-right: 5px;
  height: 100%;
  width: 100%;
  max-width: 250px;
  background-color: #fff;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

export default FormulaList;
