import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import circle from '@fortawesome/fontawesome-free-regular/faCircle';
import checkCircle from '@fortawesome/fontawesome-free-regular/faCheckCircle';
import Checkbox from '@material-ui/core/Checkbox';

const CheckBoxCell = ({ value, onClick }) => (
  <Cell>
    <StyledCheckBox
      checked={value}
      icon={<FontAwesomeIcon icon={circle} color="#B00020" />}
      checkedIcon={<FontAwesomeIcon icon={checkCircle} color="#25bf75" />}
      inputProps={{ onClick }}
    />
  </Cell>
);

const Cell = styled.div`
  text-align: center;
`;

const StyledCheckBox = styled(Checkbox)`
  width: 30px;
  height: 30px;
  padding: 3px;
`;

CheckBoxCell.propTypes = {
  value: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CheckBoxCell;
