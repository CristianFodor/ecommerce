import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const Wrapper = styled.div`
    margin: 40px;
`;

export const StyledButton = styled(IconButton)`
    postion: fixed;
    z-index: 100;
    margin:  10px 30px 20px 20px;
`;
export const CategoryButton = styled.div`
  margin:  10px 30px 20px 120px;
  display: inline-block;
  border: 1px solid cadetblue;
  background-color: white;
  padding: 2px 4px;
  font-size: 14px;
  cursor: pointer;
  position: center;
`;
