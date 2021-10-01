import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { createBreakpoint } from 'styled-components-breakpoint'
import Welcome from '../alert/Welcome'
import StackedBarChart from './StackedBarChart'
//import StackedBarDiffChart from './StackedBarDiffChart'
import { MainArea, Flex, Scenario1Description, Scenario2Description } from './Charts.style'
//import stackedBar from '../data/tab1'
//import LineChart from './LineChart'
//import indicators from '../data/chartstab1'
import { useTranslation } from 'react-i18next';
import scenarioCombinations from '../data/scenarioCombinations'
import i18next from 'i18next'

const Charts = props => {
  const selectedScenario = props.scenarioSelection.scenarioSelection
  const selectedScenario2 = props.scenarioSelection.scenarioSelection2
  const selectedCountries = props.selectedCountries
  const [t] = useTranslation()
  const [stackedBar, setStackedBar] = useState(null)
  const [indicators, setIndicators] = useState(null)
  //console.log("props ***************************** : ", props)
  import('../data/charts' + props.tab).then((indicators) => {
    console.log("indicators: ", indicators)
    setIndicators(indicators.default)
  })
  import('../data/' + props.tab).then((stack) => {
    console.log("stack: ", stack)
    setStackedBar(stack.default)
  })


  if (!stackedBar) return <div>Data not ready</div>
  
  return (
    <MainArea>
        <Welcome 
          isOpen={props.scenarioSelection.showWelcome}
          closeWelcome={props.closeWelcome} 
          tab={props.tab}
        />
        <ScenarioDescriptionsContainer isWelcomeOpen={props.scenarioSelection.showWelcome}>
          <Scenario1Description>
            {selectedScenario2 && 
              <div>{t("scenarios.selectedScenario-bar-and-line")}</div>}
            {/* {scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>option.name.toLowerCase() === selectedScenario.toLowerCase())?.desc.toUpperCase()
            } */}
            {console.log("selectedScenario: ", selectedScenario)}
            {
              //t("scenarios.description" + props.index)
              scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>{
                console.log("option: ", option)
                return((option.id.toLowerCase() === selectedScenario.toLowerCase()))
                }
              )['desc_' + i18next.language]?.toUpperCase()
            }
          </Scenario1Description>
          {selectedScenario2 && 
          <Scenario2Description>
            <div>{t("scenarios.selectedScenario2-bar-and-line")}</div> 
          
            {/* scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>option.name.toLowerCase() === selectedScenario2.toLowerCase()
            )?.desc.toUpperCase() */}
          </Scenario2Description>}
        </ScenarioDescriptionsContainer> 
      {(props.scenarioSelection.showDifference === false ||
        (props.scenarioSelection.showDifference === true &&
          selectedScenario2 === '')) && (
        <Flex>
          {
           
            indicators.map((i, index) => 
            {
              //console.log("indicator: ", i)
              let scenario = stackedBar.data.scenarios.find((scenario)=>{
                return scenario.scenario === selectedScenario
              })
              if (!scenario) return <div>Scenario not found in data</div>
              let chartCurrent = scenario.indicators.find((indicator)=>{
                return indicator.chart === i
              })
              if (!chartCurrent) return <div>Scenario found. Chart not found in data</div>
              console.log("chartCurrent: ", chartCurrent)
              if (chartCurrent.type === "stackedBar")
                return (
                  <StackedBarChart
                    key={i+' '+index}
                    chartName={i}
                    chartTitle={i}
                    selectedScenario={selectedScenario}
                    selectedScenario2={selectedScenario2}
                    selectedCountries={selectedCountries}
                    combinedChart={false}
                    label={chartCurrent.unit}
                    minY={0}
                    maxY={1500}
                    stackedBar={stackedBar}
                    tab={props.tab}
                    chart={"chart" + (index + 1)}
                  />)  
              else 
                return (<div>Unknown chart type</div>)
                }
            )
          }
        </Flex>
      )}
      {/* {props.scenarioSelection.showDifference === true &&
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
        )} */}
        {console.log("tab1 end")}
    </MainArea>
  )
}

Charts.propTypes = {
  scenarioSelection: PropTypes.object.isRequired,
  closeWelcome: PropTypes.func.isRequired,
  selectedCountries: PropTypes.array.isRequired,
}

export const breakpoint = createBreakpoint({
  xs: 0,
  sm: 550,
  md: 1394,
  lg: 1953,
  xl: 2612,
});

const ScenarioDescriptionsContainer = styled(Flex)`
  flex: 1;
  justify-content: space-between;
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-right: 15px;
`

export default Charts
