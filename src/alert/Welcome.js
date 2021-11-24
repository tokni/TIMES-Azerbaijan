import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Octicon from "react-octicon";
import {createBreakpoint} from 'styled-components-breakpoint';
import { useTranslation } from "react-i18next";
import parseHtml from "html-react-parser"

export const breakpoint = createBreakpoint({ //
  xs: 0,
  sm: 550,
  md: 1394,
  lg: 1953,
  xl: 2512,
});

const AlertContainer = styled.div`
  position: ${props => props.isOpen ? 'relative' : 'absolute'};
  right: ${props => props.isOpen ? null : '35px'};
  padding: 10px;
  padding-left: 15px;
  margin-bottom: 10px;
  margin-right: 15px;
  background-color: #3cccfc;
  color: white;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
  flex-direction: column;
  min-height: 20px;
  width: ${props => props.isOpen ? null : '20px'};
  box-shadow: 0 0 0.5333333333rem rgb(26 26 26 / 12%);
  border-radius: .35em;
  z-index: 20;
`;
AlertContainer.displayName = "AlertContainer";
const AlertBody = styled.div`
  font-size: 1em;
  margin: 0px;
  align-self: center;
  max-width: 1090px;
`;
AlertBody.displayName = "AlertBody";
const AlertTitle = styled.div`
  font-size: 1.7em;
  font-weight: 600;
  color: white;
  max-width: 1090px;
`;
const AlertBodyParagraph = styled.div`
  color: white;
`;
AlertBodyParagraph.displayName = "AlertBodyParagraph";
const CloseWindowIcon = styled.div`
  position: absolute;
  right: ${props => props.isOpen ? '32px' : '10px'};
  top: ${props => props.isOpen ? '30px' : '12px'};
  margin: 0px;
  border: 0;
  flex-shrink: 0;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  
  :hover {
    cursor: pointer;
    transform: scale(1.15)
  }
`;
CloseWindowIcon.displayName = "CloseWindowIcon";
function Welcome(props) {
  const [t] = useTranslation()
  return (
    <AlertContainer  isOpen={props.isOpen}>
    {props.isOpen && <AlertTitle>{parseHtml(t("welcome-text." + props.tab + ".welcome1"))}</AlertTitle>}
      {props.isOpen && props.tab === "tab1" && <AlertBody>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab1.welcome2"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab1.welcome3"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab1.welcome4"))}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab2" && <AlertBody>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab2.welcome2"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab2.welcome3"))}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab3" && <AlertBody>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab3.welcome2"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab3.welcome3"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab3.welcome4"))}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab4" && <AlertBody>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab4.welcome2"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab4.welcome3"))}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab5" && <AlertBody>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab5.welcome2"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab5.welcome3"))}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab6" && <AlertBody>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab6.welcome2"))}</AlertBodyParagraph>
        <AlertBodyParagraph>{parseHtml(t("welcome-text.tab6.welcome3"))}</AlertBodyParagraph>
      </AlertBody>}
      <CloseWindowIcon
        onClick={() => props.closeWelcome(!props.isOpen)}
      >
        {props.isOpen ? <Octicon name="x" /> : <Octicon name="chevron-left" />}
      </CloseWindowIcon>
    </AlertContainer>
  )
}
Welcome.defaultProps = {
  tab: "tab1"
}

Welcome.propTypes = {
  closeWelcome: PropTypes.func.isRequired,
  tab: PropTypes.string,
};

export default Welcome;
