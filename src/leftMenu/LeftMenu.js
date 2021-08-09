import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Link, useLocation } from "react-router-dom";
import ScenarioSelectionList from "../scenarioSelection/ScenarioSelectionList";
import ToggleSwitch from "./ToggleSwitch";
import { useTranslation } from "react-i18next";
import MapContainer from "../map/MapContainer";
import citation from "../data/citation"

const MenuLayout = styled.div`
  display: none;
  height: calc(100vh);
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
  max-width: 250px;
  border: 0;
  align-self: center;
  ${'' /* transform: scale(1.8) translate(43px); */}
  
  transition: .2s;
  &:hover {
    transform: scale(1.05) translate(0px);
    cursor: pointer;
  }
`;
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
    props.singleMode ? "gray" : props.selected ? "#385988" : "white"};
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
const HelpLink = styled.a`
  width: 200px;
  color: white;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
color: #666666;
`;
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
const Citation = styled.div`
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
`;
const CitationIntro = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
`;
const HelpText = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-around;
  align-items: left;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #666666;
  font-weight: bold;
`;
function ScenarioSelectionMenu(props) {
  const { t } = useTranslation();
  const location = useLocation()
  const scenarioSelectorVisible = location.pathname.includes("tab") || location.pathname === "/"
  return (
    <MenuLayout>
      <MenuHeader>
        <ExternalLink href="https://www.nordicenergy.org">
          <AppLogo
            src="./images/nordic_energy_research_cropped.png"
            alt="Nordic Energy Research"
          />
          {/* <AppLogo2
            src="./images/NER-Logo_small.png"
            alt="Nordic Energy Research"
          /> */}
        </ExternalLink>
        <MenuRoutes>
          <MenuItem
            to="/about"
            selected={props.selectedPage === "/about"}
          >
            {t("menu.desktop.about")}
          </MenuItem>
          <MenuItem
            to="/scenarios"
            selected={props.selectedPage === "/scenarios"}
          >
            {t("menu.desktop.scenarios")}
          </MenuItem>
          <MenuItem
            to="/findings"
            selected={props.selectedPage === "/findings"}
          >
            {t("menu.desktop.findings")}
          </MenuItem>
          <MenuItem
            to="/model"
            selected={props.selectedPage === "/model"}
          >
            {t("menu.desktop.model")}
          </MenuItem>
          <MenuItem
            to="/historical"
            selected={props.selectedPage === "/historical"}
          >
            {t("menu.desktop.historical")}
          </MenuItem>
          <MenuItem
            to="/how-to-use"
            selected={props.selectedPage === "/how-to-use"}
          >
            {t("menu.desktop.howto")}
          </MenuItem>
        </MenuRoutes>
      </MenuHeader>
      {scenarioSelectorVisible && 
      <>
        <MenuSeparatorLine />
        <Header narrowVersion={false}>{t("general.countries")}</Header>
          <MapContainer
            selectedCountries={props.selectedCountries}
            selectCountry={props.selectCountry}
          />
        <MenuSeparatorLine />
      </>
      }
      {location.pathname !== "/tab9" && location.pathname !== "/tab10" && scenarioSelectorVisible &&
      <>
      <ScenarioSelection>
        <ScenarioSelectionList
          updateScenarioSelection={props.updateScenarioSelection}
          name="scenarioSelection"
          selectedValue={props.scenarioSelection.scenarioSelectionNoOptions}
          selectedValue2={props.scenarioSelection.scenarioSelectionNoOptions2}
          scenarioCombinations={props.scenarioCombinations}
          dimensionTitle={t("general.scenarios")}
          narrowVersion={false}
          options={props.options}
          toggleOption={props.toggleOption}
          scenarioSelection={props.scenarioSelection}
        />
      </ScenarioSelection>
      {location.pathname !== "/tab8" && <><MenuSeparatorLine />
      
      <ToggleDifference
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
          {t("general.scenario-difference")}
        </ToggleSwitchText>
        <ToggleSwitch
          available={props.scenarioSelection.scenarioSelection2 !== ""}
          checked={props.scenarioSelection.showDifference}
        />
      </ToggleDifference></>
      }
      {props.scenarioSelection.scenarioSelection2 !== "" && <ScenarioDifferenceText
        singleMode={props.scenarioSelection.scenarioSelection2 === ""}
        selected={props.scenarioSelection.showDifference}
      >
        {t("general.red-minus-green")}
      </ScenarioDifferenceText>}
      <MenuSeparatorLine /></>}
      <MenuFooter>
        <CopyrightNotice>
          <CitationIntro>When using the results presented in the result viewer use the following citation:</CitationIntro>
          <Citation>{citation}</Citation>
          <Header> {t("general.developed-by")}</Header>
          <CopyrightItem>
            <ExternalLink href="http://www.tokni.com">
              <LinkLogo src="./images/tokni.png" alt="Tøkni" data-tip="Tøkni - Nordic Software Consultancy"/>
            </ExternalLink>
            <ExternalLink href="https://energymodellinglab.com/">
              <LinkLogo src="./images/eml.png" alt="Energy Modelling Lab" maxWidth="75px" data-tip="Energy Modelling Lab"/>
            </ExternalLink>
          </CopyrightItem>
          <CopyrightItem>
            <HelpText>If you are experiencing issues with the web tool please contact Kenneth Karlsson at The Energy Modelling Lab.</HelpText>
          </CopyrightItem>
          <CopyrightItem>
            <HelpLink href="mailto:kenneth.karlsson@energymodellinglab.com">kenneth.karlsson@ energymodellinglab.com</HelpLink>
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
  selectCountry: PropTypes.func.isRequired,
  selectedPage: PropTypes.string,
};

export default ScenarioSelectionMenu;
