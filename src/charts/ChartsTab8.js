import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {createBreakpoint} from 'styled-components-breakpoint';
import Welcome from '../alert/Welcome'
import StackedBarDiffChart from './StackedBarDiffChart'
import LineChart from './LineChart'
import { MainArea, Flex, Scenario1Description, Scenario2Description  } from './Charts.style'
import stackedBar from '../data/stackedBarTab9'
import indicators from '../data/indicatorsTab9'
import scenarioCombinations from "../data/scenarioCombinations"


const Charts = props => {
  const selectedScenario = props.scenarioSelection.scenarioSelection
  const selectedScenario2 = props.scenarioSelection.scenarioSelection2
  const selectedCountries = props.selectedCountries

  return (
    <MainArea>
      <Welcome 
        tab="tab8"
        isOpen={props.scenarioSelection.showWelcome}
        closeWelcome={props.closeWelcome}  />
      <ScenarioDescriptionsContainer isWelcomeOpen={props.scenarioSelection.showWelcome}>
          <Scenario1Description>
            {selectedScenario2 && <div>FULL LINE IN CHART</div>}
            {scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>option.name.toLowerCase() === selectedScenario.toLowerCase())?.desc.toUpperCase()
            }
          </Scenario1Description>
          {selectedScenario2 && <Scenario2Description>
            <div>DASHED LINE IN CHART</div> 
          {
            scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>option.name.toLowerCase() === selectedScenario2.toLowerCase()
            )?.desc.toUpperCase()
          }</Scenario2Description>}
        </ScenarioDescriptionsContainer>
      {(props.scenarioSelection.showDifference === false ||
        (props.scenarioSelection.showDifference === true &&
          selectedScenario2 === '')) && (
        <Flex>
          {
            indicators.map((i, index) => 
            <LineChart 
                  key={i+' '+index}
                  chartName={i}
                  chartTitle={i}
                  selectedScenario={selectedScenario}
                  selectedScenario2={selectedScenario2}
                  selectedCountries={selectedCountries}
                  label=" "
                  minY={0}
                  maxY={15}
                  lineData={stackedBar}
                />
            )
          }
        </Flex>
      )}
      {props.scenarioSelection.showDifference === true &&
        selectedScenario2 !== '' && (
        <Flex>
          {
            indicators.map(i => 
              <StackedBarDiffChart
                chartName={i}
                chartTitle={i}
                selectedScenario={selectedScenario}
                selectedScenario2={selectedScenario2}
                selectedCountries={selectedCountries}
                combinedChart={false}
                label=" "
                minY={-1}
                maxY={1}
                stackedBar={stackedBar}
              />
            )
          }
          </Flex>
        )}
    </MainArea>
  )
}
export const breakpoint = createBreakpoint({
  xs: 0,
  sm: 550,
  md: 1394,
  lg: 1953,
  xl: 2512,
});
const ScenarioDescriptionsContainer = styled(Flex)`
  flex: 1;
  justify-content: space-between;
  margin-bottom: 10px;
  ${breakpoint('sm')`
    max-width: 550px;
  `}
  ${breakpoint('md')`
    max-width: 1110px;
  `}
  ${breakpoint('lg')`
    max-width: 1670px;
  `}
  ${breakpoint('xl')`
    max-width: 2230px;
  `}
`
Charts.propTypes = {
  scenarioSelection: PropTypes.object.isRequired,
  closeWelcome: PropTypes.func.isRequired,
  selectedCountries: PropTypes.array.isRequired,
}

export default Charts
