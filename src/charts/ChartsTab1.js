import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { createBreakpoint } from 'styled-components-breakpoint'
import Welcome from '../alert/Welcome'
import StackedBarChart from './StackedBarChart'
import StackedBarDiffChart from './StackedBarDiffChart'
import { MainArea, Flex, Scenario1Description, Scenario2Description } from './Charts.style'
//import stackedBar from '../data/tab1'
import LineChart from './LineChart'
//import indicators from '../data/chartstab1'
import { useTranslation } from 'react-i18next';
import scenarioCombinations from '../data/scenarioCombinations'
import i18next from 'i18next'
import chartSettings from "../translations/charts"
import unitSettings from "../translations/units" 

const Charts = props => {
  const selectedScenario = props.scenarioSelection.scenarioSelection
  const selectedScenario2 = props.scenarioSelection.scenarioSelection2
  const selectedCountries = props.selectedCountries
  const [t] = useTranslation()
  const [stackedBar, setStackedBar] = useState(null)
  const [indicators, setIndicators] = useState(null)
  const [indicatorReady, setIndicatorReady] = useState(false)
  const [stackReady, setStackReady] = useState(false)
  const [previousTab, setPreviousTab] = useState(null)
  

  //console.log("props charts***************************** : ", props) 
  //console.log("previous tab: ", previousTab)
  if (previousTab !== props.tab) {
    setIndicatorReady(false)
    setStackReady(false)
    setPreviousTab(props.tab)
  }
//console.log("data charts ----: ", props.tab)
  import(`../data/charts${props.tab}`).then((indicators) => {
    //console.log("indicators: ", indicators.default)
    setIndicators(indicators.default)
    setIndicatorReady(true)
  })
  //console.log("'../data/' + props.tab: ", '../data/' + props.tab)
  import(`../data/${props.tab}`).then((stack) => {
    //console.log("stack: ", stack.default)
    setStackedBar(stack.default)
    setStackReady(true)
  })
  

//console.log("indicatorready: ", indicatorReady)
//console.log("stackready: ", stackReady)
  if (!indicatorReady || !stackReady) return <div>Loading Data ...</div>
  
  //setIndicatorReady(false)
  //setStackReady(false)
  //console.log("stackedBar: ", stackedBar)
  //console.log("indicators: ", indicators)
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
            {
              //console.log("selectedScenario: ", selectedScenario)
              }
            {
              //t("scenarios.description" + props.index)
              scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>{
                //console.log("option: ", option)
                return((option.id.toLowerCase() === selectedScenario.toLowerCase()))
                }
              )['desc_' + i18next.language]
            }
          </Scenario1Description>
          {selectedScenario2 && 
          <Scenario2Description>
            <div>{t("scenarios.selectedScenario2-bar-and-line")}</div> 
          
            {scenarioCombinations.scenarioCombinations.scenarioOptions.find(
              (option)=>{
                //console.log("option: ", option)
                return((option.id.toLowerCase() === selectedScenario2.toLowerCase()))
                }
              )['desc_' + i18next.language]}
          </Scenario2Description>}
        </ScenarioDescriptionsContainer> 
      {(props.scenarioSelection.showDifference === false ||
        (props.scenarioSelection.showDifference === true &&
          selectedScenario2 === '')) && (
            <Flex>
          {
           
            indicators.map((i, index) => 
            {
              //console.log("i: ", i)
              //console.log("stackedBar: ", stackedBar)
              if (chartSettings[i]) {
                if (chartSettings[i].type==="stackedBar")
                return (
                <StackedBarChart
                  key={i+' '+index}
                  chartName={i}
                  chartTitle={i}
                  selectedScenario={selectedScenario}
                  selectedScenario2={selectedScenario2}
                  selectedCountries={selectedCountries}
                  combinedChart={false}
                  label={unitSettings[chartSettings[i].unit] ? props.selectedUnits[chartSettings[i].unit].displayName : chartSettings[i].unit}
                  unitFactor={unitSettings[chartSettings[i].unit] ? props.selectedUnits[chartSettings[i].unit].factor : 1}
                  minY={0}
                  maxY={1500}                    
                  stackedBar={stackedBar}
                  tab={"tab1"}
                  chart={"chart" + (index + 1)}
                />
              )
              else if (chartSettings[i].type==="line") 
              return(<LineChart 
                key={i+' '+index}
                chartName={i}
                chartTitle={i}
                selectedScenario={selectedScenario}
                selectedScenario2={selectedScenario2}
                selectedCountries={selectedCountries}
                label={unitSettings[chartSettings[i].unit] ? props.selectedUnits[chartSettings[i].unit].displayName : chartSettings[i].unit}
                unitFactor={unitSettings[chartSettings[i].unit] ? props.selectedUnits[chartSettings[i].unit].factor : 1}
                minY={0}
                maxY={15}
                lineData={stackedBar}
              />)
              else 
                return (<div>Chart type mismatch, must be stackedbar or line: {chartSettings[i].type==="line"}</div>)                
              }
              else {
                console.log("chart name mismatch, check data files and charts.js tag must correspond") 
                return(<div>chart name mismatch, check data files and charts.js tag must correspond</div>)
              } 
            })
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
                label={unitSettings[chartSettings[i].unit] ? props.selectedUnits[chartSettings[i].unit].displayName : chartSettings[i].unit}
                unitFactor={unitSettings[chartSettings[i].unit] ? props.selectedUnits[chartSettings[i].unit].factor : 1}
                minY={-1}
                maxY={1}
                stackedBar={stackedBar}
              />
            )
          }
          </Flex>
        )}
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
