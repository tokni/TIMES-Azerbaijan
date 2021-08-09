import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Link, useLocation } from "react-router-dom";
import ScenarioSelectionList from "../scenarioSelection/ScenarioSelectionList";
import ToggleSwitch from "./ToggleSwitch";
import { useTranslation } from "react-i18next";
import MapContainer from "../map/MapContainer";

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
    props.singleMode ? "gray" : props.selected ? "#385988" : "white"};
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

function ScenarioSelectionMenu(props) {
  const { t } = useTranslation()
  const location = useLocation()
  const scenarioSelectorVisible = location.pathname.includes("tab") || location.pathname === "/"
  return (
    <MenuLayout>
      <MenuHeader>
        <ExternalLink href="http://www.nordicenergy.org/flagship/project-shift/">
        <AppLogo
            src="./images/nordic_energy_research_cropped.png"
            alt="Nordic Energy Research"
          />
        </ExternalLink>
        <MenuRoutes>
          <MenuItem
            to="/about"
            selected={props.selectedChartgroup === "/about"}
          >
            {t("menu.mobile.about")}
          </MenuItem>
          <MenuItem
            to="/scenarios"
            selected={props.selectedChartgroup === "/scenarios"}
          >
            {t("menu.mobile.scenarios")}
          </MenuItem>
          <MenuItem
            to="/findings"
            selected={props.selectedChartgroup === "/findings"}
          >
            {t("menu.mobile.findings")}
          </MenuItem>
          <MenuItem
            to="/model"
            selected={props.selectedChartgroup === "/model"}
          >
            {t("menu.desktop.model")}
          </MenuItem>
          <MenuItem
            to="/historical"
            selected={props.selectedChartgroup === "/historical"}
          >
            {t("menu.desktop.historical")}
          </MenuItem>
        </MenuRoutes>
      </MenuHeader>
      <MenuSeparatorLine />
      <Header narrowVersion={true}> {t("general.countries")}</Header>
      <MapContainer
        narrowVersion={true}
        selectedCountries={props.selectedCountries}
        selectCountry={props.selectCountry}
      />
      <MenuSeparatorLine />
      {location.pathname !== "/tab9" && location.pathname !== "/tab10" && scenarioSelectorVisible &&<><ScenarioSelection>
        <ScenarioSelectionList
          updateScenarioSelection={props.updateScenarioSelection}
          name="scenarioSelection"
          selectedValue={props.scenarioSelection.scenarioSelectionNoOptions}
          selectedValue2={props.scenarioSelection.scenarioSelectionNoOptions2}
          scenarioCombinations={props.scenarioCombinations}
          dimensionTitle={t("general.scenarios")}
          narrowVersion={true}
          options={props.options}
          toggleOption={props.toggleOption}
        />
      </ScenarioSelection>
      <MenuSeparatorLine />
      <ToggleDifference onClick={e => props.toggleDifference(e)}>
        <ToggleSwitchText
          singleMode={props.scenarioSelection.scenarioSelection2 === ""}
          selected={props.scenarioSelection.showDifference}
        >
          {t("general.scenario-difference")}
        </ToggleSwitchText>
        <ToggleSwitch
          dimmed={props.scenarioSelection.scenarioSelection2 === ""}
          checked={props.scenarioSelection.showDifference}
        />
      </ToggleDifference>
      <ScenarioDifferenceText
        singleMode={props.scenarioSelection.scenarioSelection2 === ""}
        selected={props.scenarioSelection.showDifference}
      >
        {t("general.red-minus-green")}
      </ScenarioDifferenceText></>}
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
