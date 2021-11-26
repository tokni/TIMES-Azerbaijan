import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Link, useLocation } from "react-router-dom";
import ScenarioSelectionList from "../scenarioSelection/ScenarioSelectionList";
import ToggleSwitch from "./ToggleSwitch";
import { useTranslation } from "react-i18next";
import MapContainer from "../map/MapContainer";
import { useAuth0 } from '@auth0/auth0-react';
import parseHtml from 'html-react-parser';
import queryString from 'query-string';
import unitSettings from '../translations/units';
import i18next from 'i18next';

const MenuLayout = styled.div`
  display: none;
  height: calc(100vh);
  ${breakpoint("mobile", "desktop")`
    display: flex;  
    min-height: 100vh;
    flex-direction: column;
    flex-shrink: 0;
    width: 80px;
    color: white;
    background: #cccccc;
    visibility: visible;
  `}
`;

const AppLogo = styled.img`
  max-width: 75px;
  margin: 5px;
  border: 0;
  transform: translate(-6px);
`;

const LinkLogo = styled.img`
  padding: 0px;
  max-width: 100px;
  border: 0;
  align-self: center;
  transform: scale(0.6);
`;

const MenuHeader = styled.div`
  padding: 5px;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: top;
`;

const MenuSeparatorLine = styled.hr`
  margin: 0.25em 12px 0.25em 5px;
  border-color: #555;
  border-width: 1px;
  width: 100hh;
`;

const MenuRoutes = styled.div`
  padding: 5px;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuItem = styled(Link)`
  font-weight: ${props => (props.selected ? "bold" : "normal")};
  font-size: 0.7em;
  margin: 0;
  padding: 5px 0;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => (props.selected ? "yellow" : "#212121")};
  text-decoration: none;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ScenarioSelection = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const ToggleDifference = styled.div`
  padding: 5px;
  display: flex;
  justify-content: start;
  align-content: center;
  flex-direction: column;
`;

const ToggleSwitchText = styled.div`
  font-size: 0.7em;
  color: ${props =>
    props.singleMode ? "#eeeeeeee" : props.selected ? "gray" : "#666666"};
  margin-top: 5px;
`;

const ScenarioDifferenceText = styled.div`
  font-size: 0.7em;
  color: ${props =>
    props.singleMode ? "gray" : props.selected ? "#3cccfc" : "white"};
  margin: 5px;
`;

const MenuFooter = styled.div`
  margin: 0;
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CopyrightNotice = styled.div`
  font-size: 8px;
  padding: 2px;
  margin: 0;
`;

const ExternalLink = styled.a`
  color: white;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;
const Header = styled.div`
  font-size: ${props => (props.narrowVersion ? "10px" : "12px")};
  font-weight: bold;
  padding: ${props => (props.narrowVersion ? "5px" : "0 12px 0 15px")};
  margin: 0px 0px 5px 0px;
  text-align: center;
  color: #212121;
`;
const CopyrightItem = styled.div`
  font-size: ${props => (props.narrowVersion ? "10px" : "12px")};
  padding: ${props => (props.narrowVersion ? "5px" : "0")};
  margin: 0px 0px 5px 0px;
  text-align: center;
`;
const LoginContainer = styled.div`
  display: flex;
` 
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
`;
const LanguageTitle = styled.div`
  margin-right: 5px;
  margin-left: 15px;
  color: #212121;
  opacity: 0.8;
`
const UnitContainer = styled.div`
  margin-right: 15px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
`
const UnitRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const UnitItem = styled.button`
  flex: 1;
  border-radius: 4px;
  transition: .2s;
  border: none;
  margin: 1px;
  background: ${props => props.checked ? '#3cccfc' : 'inherit'};
  &:hover {
    cursor: pointer;
    background: #3cccfc55;
    background-opacity: 0.5;
  }
  &:active {
    background: #3cccfc;
  }
`
let unitList = []
let unitRow = []
Object.entries(unitSettings).forEach(unitType => {
  unitRow = []
  Object.entries(unitType[1]).forEach(unit => {
    unitRow.push({displayName: unit[0], factor: unit[1]})
  })
  unitList.push(unitRow)
})
function ScenarioSelectionMenu(props) {
  const { t } = useTranslation()
  const location = useLocation()
  const {user, isAuthenticated, isLoading, loginWithRedirect, logout} = useAuth0()
  const scenarioSelectorVisible = location.pathname.includes("tab") || location.pathname === "/"
  let params = queryString.parse(location.search)
  let dev
  if(process.env.NODE_ENV === 'development'){
    dev = true
    console.log("developement build")
  }
  console.log("dev: ", dev)
  console.log("isAuth: ", isAuthenticated)
  return (
    <MenuLayout>
      <MenuHeader>
        <ExternalLink href="https://minenergy.gov.az/">
        <AppLogo
            src="./images/LOGO AZ_transparent.png"
            alt="The Ministry of Energy of the Republic of Azerbaijan"
          />
        </ExternalLink>
        {
    isAuthenticated && <><div>Logged in as: {user?.name} </div><div><button
      onClick={() => logout({ returnTo: "http://localhost:3000"})}>{t("general.logout")}</button></div></>
  }
  {
    !isAuthenticated && !isLoading && params.error!=="unauthorized" && <LoginContainer><button onClick={()=> loginWithRedirect()}>{t("general.login")}</button></LoginContainer>}
      
      {params.error==="unauthorized" ? <>
        <div>{t("general." + params?.error_description?.replaceAll(" ", "_").replaceAll(",", "").replaceAll(".", ""))}</div>
        <div>{t("general.access_contact")}</div>
        <a href = "mailto:bl@tokni.com">bl@tokni.com</a>
      </> : <div></div>}
  {
    isLoading && <div>{t("general.loading")}</div>
  }
        {(dev || isAuthenticated) && <MenuRoutes>
          <MenuItem
            to="/page1"
            selected={props.selectedPage === "/page1"}
          >
            {parseHtml(t("menu.mobile.page1"))}
          </MenuItem>
          <MenuItem
            to="/page2"
            selected={props.selectedPage === "/page2"}
          >
            {parseHtml(t("menu.mobile.page2"))}
          </MenuItem>
          <MenuItem
            to="/page3"
            selected={props.selectedPage === "/page3"}
          >
            {parseHtml(t("menu.mobile.page3"))}
          </MenuItem>
          <MenuItem
            to="/page4"
            selected={props.selectedPage === "/page4"}
          >
            {parseHtml(t("menu.mobile.page4"))}
          </MenuItem>
          <MenuItem
            to="/page5"
            selected={props.selectedPage === "/page5"}
          >
            {parseHtml(t("menu.mobile.page5"))}
          </MenuItem>
        </MenuRoutes>}
      </MenuHeader>
      <MenuSeparatorLine />
      <MenuSeparatorLine />
          <LanguageTitle>{parseHtml(t("general.change-language"))}</LanguageTitle>
          <LanguageGroup>
            <LanguageButton
              selected={i18next.languages[0] === "az"}
              onClick={() => i18next.changeLanguage("az")}
            >
              AZ
            </LanguageButton>
            <LanguageButton
              selected={i18next.languages[0] === "en"}
              onClick={() => i18next.changeLanguage("en")}
            >
              EN
            </LanguageButton>
          </LanguageGroup>
        <MenuSeparatorLine />
        {(dev || isAuthenticated) && <><LanguageTitle>{parseHtml(t("general.change-unit"))}</LanguageTitle>
          <UnitContainer>
            {unitList.map((unitRow, i) => {
              return(<UnitRow key={'unitRow'+i}>
                {
                  unitRow.map((unitItem) => {
                    console.log("unitRow: ", unitRow)
                    console.log("unitItem: ", unitItem)
                    return(
                      <UnitItem
                        key={unitItem.displayName} 
                        onClick={() => props.selectUnit(unitRow[0].displayName, unitItem)}
                        checked={unitItem.displayName === props.selectedUnits[unitRow[0].displayName].displayName}
                      >
                        {unitItem.displayName}
                      </UnitItem>
                    )
                  })
                }
              </UnitRow>)
            })}
          </UnitContainer>
          <MenuSeparatorLine /></>}
      <Header narrowVersion={true}> {t("general.countries")}</Header>
      {(dev || isAuthenticated) && <>
        <MenuSeparatorLine />
        <Header narrowVersion={false}>{t("general.countries")}</Header>
          <MapContainer
            selectedCountries={props.selectedCountries}
            selectCountry={props.selectCountry}
            narrowVersion={false}
          />
        <MenuSeparatorLine />
      </>}
      {(dev || isAuthenticated) && scenarioSelectorVisible &&
      <>
      <ScenarioSelection>
        <ScenarioSelectionList
          updateScenarioSelection={props.updateScenarioSelection}
          name="scenarioSelection"
          selectedValue={props.scenarioSelection.scenarioSelectionNoOptions}
          selectedValue2={props.scenarioSelection.scenarioSelectionNoOptions2}
          scenarioCombinations={props.scenarioCombinations}
          dimensionTitle={parseHtml(t("general.scenarios"))}
          narrowVersion={true}
          options={props.options}
          toggleOption={props.toggleOption}
          scenarioSelection={props.scenarioSelection}
        />
      </ScenarioSelection>
      {location.pathname !== "/tab8" && <><MenuSeparatorLine />
      
      {(dev || isAuthenticated) && <ToggleDifference
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
          <Header> {t("general.developed-by")}</Header>
          <CopyrightItem>
            <ExternalLink href="http://www.tokni.com">
              <LinkLogo src="./images/tokni.png" alt="Tøkni" data-tip="Tøkni - Nordic Software Consultancy"/>
            </ExternalLink>
          </CopyrightItem>
          <CopyrightItem>
            <ExternalLink href="https://energymodellinglab.com/">
              <LinkLogo src="./images/eml.png" alt="Energy Modelling Lab" maxWidth="75px" data-tip="Energy Modelling Lab"/>
            </ExternalLink>
          </CopyrightItem>
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
  selectCountry: PropTypes.func.isRequired
};

export default ScenarioSelectionMenu;
