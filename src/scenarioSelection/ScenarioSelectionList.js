import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import {
  ScenarioList,
  ScenarioDivider,
  ScenarioHeader,
  ScenarioOption,
  MenuSeparatorLine,
  IconContainer,
  Icon,
  ScenarioNameContainer
} from "./ScenarioSelectionList.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faDatabase,
  faBolt,
  faCar,
  faUserFriends
} from "@fortawesome/free-solid-svg-icons";

function cancelBubble(e) {
  //Stop propagation to the underlying div
  //(used to prevent onclick for scenario being fired when clicking on an option)
  e.cancelBubble = true;
  if (e.stopPropagation) e.stopPropagation();
}

const ScenarioSelectionList = props => {
  const { t } = useTranslation();
  const handleChange = (event, value) => {
    props.updateScenarioSelection(event, props.name, value);
  };
  const scenarioSwitches = props.options;
  const { scenarioCombinations, dimensionTitle, narrowVersion } = props;
  let stringValue = props.selectedValue.toString();
  let stringValue2 = props.selectedValue2.toString();
  let OptionDisplay = []
  scenarioCombinations.scenarioOptions
    .filter(s => {
      return (
        !s.opt0 && 
        !s.opt1 && 
        !s.opt2 && 
        !s.opt3) //ensure that each scenario is only listed once
    }).forEach((element)=>{
      let newOption = scenarioCombinations.scenarioOptions.find((option) => {
        return(
          option.nameNoOptions === element.nameNoOptions &&
          option.opt0===props.options[element.nameNoOptions].opt0 && 
          option.opt1===props.options[element.nameNoOptions].opt1 && 
          option.opt2===props.options[element.nameNoOptions].opt2 && 
          option.opt3===props.options[element.nameNoOptions].opt3
        )
      })
      OptionDisplay.push(newOption)
    })
  let scenarioOptions = OptionDisplay.map(option => {
      let optionValue = option.nameNoOptions;
      if (optionValue === "division_line") {
        return <MenuSeparatorLine key={option.id} />;
      } else {
        return (
          <ScenarioOption
            key={option.id}
            value={optionValue}
            selected={optionValue === stringValue}
            selected2={optionValue === stringValue2}
            narrowVersion={narrowVersion}
            
          >
            <ScenarioNameContainer
              data-tip={option.desc}
              narrowVersion={narrowVersion}
              onClick={event => {
              handleChange(event, optionValue);
            }}
            >
              {narrowVersion === false &&
                option.short_description
                }
              {narrowVersion === true &&
                option.ultra_short_description
                }
            </ScenarioNameContainer>
            <IconContainer narrowVersion={narrowVersion}>
              {scenarioCombinations.optionsAvailable[optionValue].opt0 && <Icon
                available={
                  scenarioCombinations.optionsAvailable[optionValue].opt0
                }
                onClick={event => {
                  if (scenarioCombinations.optionsAvailable[optionValue].opt0) {
                    props.toggleOption(optionValue, "opt0");
                  }
                  cancelBubble(event); //prevent onclick for scenario being fired
                }}
                data-tip={
                  t("options.opt0") +
                  " " +
                  (!scenarioCombinations.optionsAvailable[optionValue].opt0
                    ? t("options.unavailable")
                    : "")
                }
                selected={scenarioSwitches[optionValue].opt0}
              >
                <FontAwesomeIcon icon={faDatabase} />
              </Icon>}
              {scenarioCombinations.optionsAvailable[optionValue].opt1 && <Icon
                available={
                  scenarioCombinations.optionsAvailable[optionValue].opt1
                }
                onClick={event => {
                  if (scenarioCombinations.optionsAvailable[optionValue].opt1) {
                    props.toggleOption(optionValue, "opt1");
                  }
                  cancelBubble(event); //prevent onclick for scenario being fired
                }}
                data-tip={
                  t("options.opt1") +
                  " " +
                  (!scenarioCombinations.optionsAvailable[optionValue].opt1
                    ? t("options.unavailable")
                    : "")
                }
                selected={scenarioSwitches[optionValue].opt1}
              >
                <FontAwesomeIcon icon={faLeaf} />
              </Icon>}
              {scenarioCombinations.optionsAvailable[optionValue].opt2 && <Icon
                available={
                  scenarioCombinations.optionsAvailable[optionValue].opt2
                }
                onClick={event => {
                  if (scenarioCombinations.optionsAvailable[optionValue].opt2) {
                    props.toggleOption(optionValue, "opt2");
                  }
                  cancelBubble(event); //prevent onclick for scenario being fired
                }}
                data-tip={
                  t("options.opt2") +
                  " " +
                  (!scenarioCombinations.optionsAvailable[optionValue].opt2
                    ? t("options.unavailable")
                    : "")
                }
                selected={scenarioSwitches[optionValue].opt2}
              >
                <FontAwesomeIcon icon={faBolt} />
                <FontAwesomeIcon icon={faCar} />
              </Icon>}
              {scenarioCombinations.optionsAvailable[optionValue].opt3 && <Icon
                available={
                  scenarioCombinations.optionsAvailable[optionValue].opt3
                }
                onClick={event => {
                  if (scenarioCombinations.optionsAvailable[optionValue].opt3) {
                    props.toggleOption(optionValue, "opt3");
                  }
                  cancelBubble(event); //prevent onclick for scenario being fired
                }}
                data-tip={
                  t("options.opt3") +
                  " " +
                  (!scenarioCombinations.optionsAvailable[optionValue].opt3
                    ? t("options.unavailable")
                    : "")
                }
                selected={scenarioSwitches[optionValue].opt3}
              >
                <FontAwesomeIcon icon={faUserFriends} />
                <FontAwesomeIcon icon={faCar} />
              </Icon>}
              <ReactTooltip
                multiline={true}
                place="top"
                type="dark"
                effect="solid"
              />
            </IconContainer>
          </ScenarioOption>
        );
      }
    });
  return (
    <ScenarioList>
      <ScenarioDivider />
      <ScenarioHeader narrowVersion={narrowVersion}>
        {dimensionTitle}
      </ScenarioHeader>
      {scenarioOptions}
    </ScenarioList>
  );
};

ScenarioSelectionList.propTypes = {
  updateScenarioSelection: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedValue: PropTypes.any.isRequired,
  selectedValue2: PropTypes.any.isRequired,
  scenarioCombinations: PropTypes.any.isRequired,
  dimensionTitle: PropTypes.string.isRequired,
  narrowVersion: PropTypes.bool.isRequired,
  options: PropTypes.any.isRequired,
  toggleOption: PropTypes.func.isRequired
};

export default ScenarioSelectionList;
