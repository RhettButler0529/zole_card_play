import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const CustomCheckBox = styled(View)`
  height: 20px;
  width: 20px;
  border-radius: 2px;
  position: relative;
  justify-content: center;
  margin: 0px 8px 0 8px;
`;
const CheckIcon = styled(View)`
  border-radius: 0px;
  align-self: center;
  transform: rotate(-45deg);
  position: relative;
  top: 5px;
`;
/*= =============================
    Custom  checkbox styled
=============================== */
const CheckIconWrapper = styled(View)`
  position: relative;
  left: 2px;
  top: -2px;
`;
const CheckIconVertical = styled(View)`
  height: 5px;
  width: 3px;
  background: ${props => (props.checkBoxActive ? '#afe84e' : 'transparent')};
`;
const CheckIconHorizontal = styled(View)`
  height: 3px;
  width: 16px;
  background: ${props => (props.checkBoxActive ? '#afe84e' : 'transparent')};
`;
// class CheckBox extends Component {

const CheckBox = ({ checked }) => (
  <CustomCheckBox checkBoxActive={checked}>
    <LinearGradient
      colors={['#adadad', '#222']}
      style={{
        width: 20, height: 20,
      }}
    >
      <CheckIcon>
        <CheckIconWrapper>
          <CheckIconVertical checkBoxActive={checked} />
          <CheckIconHorizontal checkBoxActive={checked} />
        </CheckIconWrapper>
      </CheckIcon>
    </LinearGradient>
  </CustomCheckBox>

);

CheckBox.propTypes = {
  checked: PropTypes.bool,
};

CheckBox.defaultProps = {
  checked: false,
};

export default CheckBox;
