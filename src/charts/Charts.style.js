import styled from "styled-components";
import {createBreakpoint} from 'styled-components-breakpoint';

export const breakpoint = createBreakpoint({
  xs: 0,
  sm: 550,
  md: 1394,
  lg: 1953,
  xl: 2612,
});

export const MainArea = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 2360px;
  box-sizing: border-box;
  ${breakpoint('sm')`
    width: 570px;
  `}
  ${breakpoint('md')`
    width: 1165px;
  `}
  ${breakpoint('lg')`
    width: 1725px;
  `}
  ${breakpoint('xl')`
    width: 2285px;
  `}
  transition: width 0.3s;
`;

export const Flex = styled.div`
  display: flex;
  flex: 1;
  box-sizing: border-box;
  position: relative;
  flex-wrap: wrap;
  align-content: flex-start;
  flex-direction: ${props => (props.direction === "column" ? "column" : "row")};
`;

export const Scenario1Description = styled.div`
  box-sizing: border-box;
  background-color: #385988;
  padding: 15px 25px;
  color: white;
  width: calc(50% - 5px);
  border-radius: 4px;
`
export const Scenario2Description = styled.div`
  flex: 1;
  box-sizing: border-box;
  background-color: #bcbde2;
  padding: 15px 25px;
  color: white;
  border-radius: 4px;
  margin-left: 10px;
`