import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import trash from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import styled from 'styled-components';

const RemoveCell = ({ onClick }) => (
  <Cell>
    <Button type="button" onClick={onClick}>
      <FontAwesomeIcon icon={trash} color={'#f50057'} size={'lg'} />
    </Button>
  </Cell>
);

const Cell = styled.div`
  text-align: center;
`;

const Button = styled.button`
  background-color: transparent;
  outline: none;
  border: 0;
  cursor: pointer;
`;

RemoveCell.propTypes = {
  onClick: PropTypes.func,
};

export default RemoveCell;
