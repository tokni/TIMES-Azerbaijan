import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Link, useLocation } from "react-router-dom";
import ScenarioSelectionList from "../scenarioSelection/ScenarioSelectionList";
import ToggleSwitch from "./ToggleSwitch";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import parseHtml from 'html-react-parser';
import { useAuth0 } from '@auth0/auth0-react';
import queryString from 'query-string';

const MenuLayout = styled.div`
  display: none;
  min-height: calc(100vh);
  ${breakpoint("desktop")`
    display: flex;
    flex-direction: column;
    width: 250px;
    color: white;
    background: #cccccc;
    visibility: visible;
    overflow: visible;
  `}
`;

const MenuHeader = styled.div`
  padding: 10px 12px 5px 10px;
  margin: 0;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: top;
  color: #212121;
`;

const AppLogo = styled.img`
  padding: 0px;
  max-width: 240px;
  border: 0;
  align-self: center;
  ${'' /* transform: scale(1.8) translate(43px); */}
  
  transition: .2s;
  &:hover {
    transform: scale(1.05) translate(0px);
    cursor: pointer;
  }
`;
const LanguageGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  margin-top: 20px;
`;

const LanguageButton = styled.button`
  margin-right: 5px;
  cursor: pointer;
  opacity:  ${props => (props.selected ? "0.8" : "0.6")};
  font-weight: ${props => (props.selected ? "bold" : "normal")};
  ${'' /* box-shadow: ${props => (props.selected ? "0 3px 5px gray" : "normal")}; */}
`;
const LanguageTitle = styled.div`
  margin-right: 5px;
  margin-left: 15px;
  color: #212121;
  opacity: 0.8;
`
/* const AppLogo2 = styled.img`
  padding: 0px;
  max-width: 180px;
  border: 0;
  align-self: center;
  
  transition: .2s;
  &:hover {
    cursor: pointer;
    transform: scale(2.3) translate(43px);
  }
`; */

const MenuSeparatorLine = styled.hr`
  margin: 0.25em 12px 0.25em 15px;
  border-color: #555;
  border-width: 1px;
  width: 100hh;
`;

const MenuRoutes = styled.div`
  padding: 10px 12px 15px 5px;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
`;

const MenuItem = styled(Link)`
  font-weight: ${props => (props.selected ? "bold" : "normal")};
  font-size: 1em;
  padding: 2px 0;
  width: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  opacity:  ${props => (props.selected ? "0.8" : "0.6")};
  transition: .2s;
  &:hover {
    opacity: 1;
    cursor: pointer;
    transform: scale(1.05)
  }
  color: inherit;
`;

const ScenarioSelection = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const ToggleDifference = styled.div`
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-content: center;
`;

const ToggleSwitchText = styled.div`
  color: ${props =>
    props.singleMode ? "#eeeeeeee" : props.selected ? "gray" : "#666666"};
  margin-left: 10px;
`;

const ScenarioDifferenceText = styled.div`
  font-size: 0.7em;
  color: ${props =>
    props.singleMode ? "gray" : props.selected ? "#3cccfc" : "white"};
  margin-left: 30px;
  margin-right: 10px;
  margin-bottom: 5px;
`;

const MenuFooter = styled.div`
  padding: 10px 0;
  margin: 0;
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CopyrightNotice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CopyrightItem = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
`;

const ExternalLink = styled.a`
  color: white;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;
/* const HelpLink = styled.a`
  width: 200px;
  color: white;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
color: #666666;
`; */
const LinkLogo = styled.img`
  padding: 0px;
  max-width: 100px;
  border: 0;
  align-self: center;
  transform: scale(0.85);
`;
const Header = styled.h1`
  font-size: ${props => (props.narrowVersion ? "0.9em" : "1em")};
  padding: ${props => (props.narrowVersion ? "5px" : "0 0 0 10px")};
  margin: 0;
  height: 26px;
  align-self: flex-start;
  color: #666666;
`;
/* const Citation = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
  font-size: 10px;
`; */
/* const CitationIntro = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
`; */
/* const HelpText = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
`; */
const Disclaimer = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
`
const FundedText = styled.div`
padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
`
const LoginContainer = styled.div`
  display: flex;
  ${'' /* justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; */}
` 
function ScenarioSelectionMenu(props) {
  const { t } = useTranslation();
  const location = useLocation()
  const {user, isAuthenticated, isLoading, loginWithRedirect, logout} = useAuth0()
  const scenarioSelectorVisible = location.pathname.includes("tab") || location.pathname === "/"
  let params = queryString.parse(location.search)
  /* console.log("this.props: ", this.props)
      console.log("this.props.match.params: ", queryString.parse(this.props.location.search).error_description )
      let params = queryString.parse(this.props.location.search)
      if(params.error === "unauthorized") {
        return(<div>{params.error_description}</div>)
      }
      return(<LoginContainer><this.LoginButton>Log in</this.LoginButton></LoginContainer>) */
  return (
    <MenuLayout>
      <MenuHeader>
        <ExternalLink href="https://minenergy.gov.az/">
          <AppLogo
            src="./images/LOGO AZ_transparent.png"
            alt="The Ministry of Energy of the Republic of Azerbaijan"
          />
        </ExternalLink>
        {console.log("auth0.user: ", user)}
        {
          isAuthenticated && <><div>Logged in as: {user?.name} </div><div><button
            onClick={() => logout({ returnTo: "http://localhost:3000"})}>Log out</button></div></>
        }
        {
          !isAuthenticated && !isLoading && params.error!=="unauthorized" && <LoginContainer><button onClick={()=> loginWithRedirect()}>Log in</button></LoginContainer>}
            
            {params.error==="unauthorized" ? <>
              <div>{t("general." + params?.error_description?.replaceAll(" ", "_").replaceAll(",", "").replaceAll(".", ""))}</div>
              <div>{t("general.access_contact")}</div>
              <a href = "mailto:bl@tokni.com">bl@tokni.com</a>
            </> : <div></div>}
        {
          isLoading && <div>loading ... </div>
        }
        {isAuthenticated && <MenuRoutes>
          <MenuItem
            to="/about"
            selected={props.selectedPage === "/about"}
          >
            {parseHtml(t("menu.desktop.page1"))}
          </MenuItem>
          {/* <MenuItem
            to="/scenarios"
            selected={props.selectedPage === "/scenarios"}
          >
            {parseHtml(t("menu.desktop.page2"))}
          </MenuItem> */}
          {/* <MenuItem
            to="/findings"
            selected={props.selectedPage === "/findings"}
          >
            {parseHtml(t("menu.desktop.page3"))}
          </MenuItem> */}
          {/* <MenuItem
            to="/model"
            selected={props.selectedPage === "/model"}
          >
            {parseHtml(t("menu.desktop.page4"))}
          </MenuItem> */}
          {/* <MenuItem
            to="/historical"
            selected={props.selectedPage === "/historical"}
          >
            {parseHtml(t("menu.desktop.page5"))}
          </MenuItem> */}
          {/* <MenuItem
            to="/how-to-use"
            selected={props.selectedPage === "/how-to-use"}
          >
            {parseHtml(t("menu.desktop.page6"))}
          </MenuItem> */}
        </MenuRoutes>}
      </MenuHeader>
      <>
        <MenuSeparatorLine />
          <LanguageTitle>{parseHtml(t("general.change-language"))}</LanguageTitle>
          <LanguageGroup>
            <LanguageButton
              selected={i18next.languages[0] === "dk"}
              onClick={() => i18next.changeLanguage("dk")}
            >
              DK
            </LanguageButton>
            <LanguageButton
              selected={i18next.languages[0] === "en"}
              onClick={() => i18next.changeLanguage("en")}
            >
              EN
            </LanguageButton>
          </LanguageGroup>
        <MenuSeparatorLine />
      </>
      
      {isAuthenticated && scenarioSelectorVisible &&
      <>
      <ScenarioSelection>
        <ScenarioSelectionList
          updateScenarioSelection={props.updateScenarioSelection}
          name="scenarioSelection"
          selectedValue={props.scenarioSelection.scenarioSelectionNoOptions}
          selectedValue2={props.scenarioSelection.scenarioSelectionNoOptions2}
          scenarioCombinations={props.scenarioCombinations}
          dimensionTitle={parseHtml(t("general.scenarios"))}
          narrowVersion={false}
          options={props.options}
          toggleOption={props.toggleOption}
          scenarioSelection={props.scenarioSelection}
        />
      </ScenarioSelection>
      {location.pathname !== "/tab8" && <><MenuSeparatorLine />
      
      {isAuthenticated && <ToggleDifference
        onClick={e => {
          if (props.scenarioSelection.scenarioSelection2 !== "") {
            props.toggleDifference(e);
          }
        }}
      > 
        <ToggleSwitchText
          singleMode={props.scenarioSelection.scenarioSelection2 === ""}
          selected={props.scenarioSelection.showDifference}
        >
          {parseHtml(t("general.scenario-difference"))}
        </ToggleSwitchText>
        <ToggleSwitch
          available={props.scenarioSelection.scenarioSelection2 !== ""}
          checked={props.scenarioSelection.showDifference}
        />
      </ToggleDifference>}</>
      }
      {props.scenarioSelection.scenarioSelection2 !== "" && <ScenarioDifferenceText
        singleMode={props.scenarioSelection.scenarioSelection2 === ""}
        selected={props.scenarioSelection.showDifference}
      >
        {parseHtml(t("general.red-minus-green"))}
      </ScenarioDifferenceText>}
      <MenuSeparatorLine /></>}
      <MenuFooter>
        <CopyrightNotice>
          {/* <CitationIntro>{parseHtml(t("general.citation-title"))}</CitationIntro>
          <Citation>{parseHtml(t("general.citation"))}</Citation> */}
          <Disclaimer>{t('general.disclaimer')}</Disclaimer>
          <ExternalLink href="http://www.eu.com">
              <LinkLogo src="./images/EU LOGO.jpg" alt="EU" data-tip="EU"/>
            </ExternalLink>
          <FundedText>{t('general.funded_by')}</FundedText>
          <Header> {parseHtml(t("general.developed-by"))}</Header>
          <CopyrightItem>
            <ExternalLink href="http://www.equinoccio.eu/en/" style={{alignSelf: 'flex-end'}}>
              <LinkLogo src="./images/equinoccio_transparent.png" alt="Equinoccio" data-tip="Equinoccio"/>
            </ExternalLink>
            <ExternalLink href="https://www.niras.com/">
              <LinkLogo src="./images/niras_logo_red.png" alt="Niras" data-tip="Niras"/>
            </ExternalLink>
            <ExternalLink href="http://www.tokni.com">
              <LinkLogo src="./images/tokni.png" alt="Tøkni" data-tip="Tøkni - Nordic Software Consultancy"/>
            </ExternalLink>
            <ExternalLink href="https://energymodellinglab.com/">
              <LinkLogo src="./images/eml.png" alt="Energy Modelling Lab" maxWidth="75px" data-tip="Energy Modelling Lab"/>
            </ExternalLink>
          </CopyrightItem>
          {/* <CopyrightItem>
            <HelpText>{parseHtml(t("general.troubleshoot-title"))}
            </HelpText>
          </CopyrightItem>
          <CopyrightItem>
            <HelpLink href="mailto:kenneth.karlsson@energymodellinglab.com">kenneth.karlsson@ energymodellinglab.com</HelpLink>
          </CopyrightItem> */}
        </CopyrightNotice>
      </MenuFooter>
    </MenuLayout>
  );
}

ScenarioSelectionMenu.propTypes = {
  selectedChartgroup: PropTypes.string.isRequired,
  updateScenarioSelection: PropTypes.func.isRequired,
  scenarioSelection: PropTypes.object.isRequired,
  scenarioCombinations: PropTypes.object.isRequired,
  toggleDifference: PropTypes.func.isRequired,
  options: PropTypes.any.isRequired,
  toggleOption: PropTypes.func.isRequired,
  selectedCountries: PropTypes.array.isRequired,
  selectCountry: PropTypes.func.isRequired,
  selectedPage: PropTypes.string,
};

export default ScenarioSelectionMenu;
