import styled from '@emotion/styled';

export default styled.button`
  display: block;
  width: 25px;
  height: 25px;
  position: absolute;
  top: -20px;
  right: -20px;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font: 0/0 a;

  &::before,
  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 0;
    position: absolute;
    top: 10px;
    left: 7px;
    border: 1px solid;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;
