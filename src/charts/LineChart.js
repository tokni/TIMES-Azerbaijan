import React from 'react'
import styled from 'styled-components'
import parseHtml from 'html-react-parser'
import {
  VictoryChart,
  VictoryLegend,
  VictoryGroup,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryTooltip, 
  VictoryVoronoiContainer,
} from 'victory' 
import {colorNER} from './chartColors'
import periods from './../data/years'
import mapRegionToDataRegions from "./../data/mapRegionToDataRegions"
import {indicatorgroup_colors} from '../charts/indicatorgroup_color'
import { CSVLink } from 'react-csv'
import CSV_citation from "../data/citation"

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 70px;
  margin-right: 30px;
  margin-top: 20px;
  margin-bottom: 10px;
`
const ChartTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`
const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 550px;
  background: white;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`
const LineChart = ({lineData, selectedScenario, selectedScenario2, selectedCountries, chartName }) => {
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })
    if (selectedScenario.includes("_copy"))
  selectedScenario = selectedScenario.replace("_copy", "")
  if (selectedScenario2.includes("_copy"))
  selectedScenario2 = selectedScenario2.replace("_copy", "")
  let legends = new Set()
    lineData.data.scenarios
    .find(o => o.scenario.toLowerCase() === selectedScenario.toLowerCase())
    .indicators.find(o => o.indicator === chartName).regions.forEach((reg)=>{
      reg.indicatorGroups.forEach((group)=>{
        legends.add(group.indicatorGroup)
      })
    })
    
  legends = selectedDataRegions

  let indicatorData1 = []
  let indicatorData2 = []
  let selectedScenarioData = lineData.data.scenarios.find((scenario)=>{
    return scenario.scenario.toLowerCase() === selectedScenario.toLowerCase()
  })
  indicatorData1 = selectedScenarioData.indicators.find((indicator) => {
    return indicator.indicator === chartName
  })
  selectedScenario2 !== "" && selectedDataRegions.forEach((country, i)=>{
    let selectedScenarioData = lineData.data.scenarios.find((scenario)=>{
      return scenario.scenario.toLowerCase() === selectedScenario2.toLowerCase()
    })
    indicatorData2 = selectedScenarioData.indicators.find((indicator) => {
      return indicator.indicator === chartName
    })
  })
  const getCSVData = (lineData1, scenarioName1, lineData2 = [], scenarioName2) => {
    let ret = []
    
    lineData1.regions.forEach((region) => {
      region.indicatorGroups[0].indicatorGroupValues.forEach((item)=>{
        ret.push({scenario: scenarioName1, indicatorGroup: region.region, year: item.year, value: item.total, unit: indicatorData1.unit})
      })
    })
    lineData2 && lineData2.length !== 0 && lineData2.regions.forEach((region) => {
      region.indicatorGroups[0].indicatorGroupValues.forEach((item)=>{
        ret.push({scenario: scenarioName2, indicatorGroup: region.region, year: item.year, value: item.total, unit: indicatorData1.unit})
      })
    })
    ret.push({citation: CSV_citation})

    return ret
  }
  const HTMLYAxisLabel = props => {
    const text = props.text.replaceAll('§', '')
    const co2Text = text.replace("CO2", "CO<sub>2</sub>")
    return (
      <foreignObject x={props.x+3-115} y={props.y-9} width={120} height={90}>
        <div style={{ fontSize: '12px', transform: "rotate(-90deg)" }}>{parseHtml(co2Text)}</div>
      </foreignObject>
    );
  };
  const HTMLLabel = props => {
    const text = props.text.replaceAll('§', '')
    const co2Text = text.replace("CO2", "CO<sub>2</sub>")
    return (
      <foreignObject x={props.x+3} y={props.y-9} width={90} height={60}>
        <div style={{ fontSize: '12px' }}>{parseHtml(co2Text)}</div>
      </foreignObject>
    );
  };

  //let tempValue = null
  //let tempLine = null
  return (
    <>
  <ChartContainer>
    <ChartHeader>
      <ChartTitle>{parseHtml(indicatorData1.indicator.replaceAll("CO2", "CO<sub>2</sub>"))}</ChartTitle>
      <CSVLink 
        data={getCSVData(indicatorData1, selectedScenario, indicatorData2, selectedScenario2)}
        filename={indicatorData1.indicator + " " + selectedCountries + ".csv"}
      >
        Download as CSV</CSVLink>
    </ChartHeader>
      <VictoryChart domainPadding={20}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => {
              /* if (datum.y === tempValue){
                if(datum.childName === tempLine){
                  return (`${datum.country}, ${Math.round(100*datum.y, 2)/100}`)
                }
              } 
              else {
                tempValue = datum.y
                tempLine = datum.childName
                return(`${datum.x}, ${Math.round(100*datum.y, 2)/100}`)
              }  */
              return (`${datum.country}, ${Math.round(100*datum.y, 2)/100}`)
            }}
            labelComponent={<VictoryTooltip />}
          />
        }
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        theme={VictoryTheme.material}>
        <VictoryAxis 
          key={0} tickValues={periods} tickFormat={periods} />
          <VictoryAxis
            dependentAxis
            axisLabelComponent={<HTMLYAxisLabel dx={10} dy={-50}/>}
            key={2}
            offsetX={80}
            domain={[0, .001]}
            label={indicatorData1.unit}
          />
          <VictoryGroup >
            {selectedDataRegions.map((country, i)=>{
            let lineChartData = []
          
            indicatorData1.regions.forEach((region)=>{
              if (region.region === country) {
                region.indicatorGroups[0].indicatorGroupValues.forEach((item)=>{
                  lineChartData.push({x: item.year, y: item.total, country: country})
                })
              }
            })
          return(
            <VictoryLine 
              key={"lini"+i} 
              data={lineChartData} 
              style={{
                data: { stroke: () => {
                      if (indicatorgroup_colors[country]) 
                        return indicatorgroup_colors[country]
                      else
                        return colorNER[i]
                      } },
              }}
              labelComponent={<VictoryTooltip />}
              >
            </VictoryLine>
          )
        })}
        {selectedScenario2 !== "" && selectedDataRegions.map((country, i)=>{
          let lineChartData2 = []
          let selectedScenarioData = lineData.data.scenarios.find((scenario)=>{
            return scenario.scenario.toLowerCase() === selectedScenario2.toLowerCase()
          })
          let indicatorData = selectedScenarioData.indicators.find((indicator) => {
            return indicator.indicator === chartName
          })
          indicatorData.regions.forEach((region)=>{
            if (region.region === country) {
              region.indicatorGroups[0].indicatorGroupValues.forEach((item)=>{
              lineChartData2.push({x: item.year, y: item.total, country: country})
              })
            }
          })
          return(
            <VictoryLine 
              key={"lini"+i} 
              data={lineChartData2} 
              style={{
                data: { stroke: () => {
                      if (indicatorgroup_colors[country]) 
                        return indicatorgroup_colors[country]
                      else
                        return colorNER[i]
                      }, strokeDasharray: "4" },
              }}
            >
            </VictoryLine>
          )
        })}
        
        </VictoryGroup>
        <VictoryLegend
            x={90}
            y={10}
            orientation="horizontal"
            gutter={10}
            rowGutter={10}
            symbolSpacer={4}
            itemsPerRow={5}
            style={{
              title: { fontSize: 34, leftPadding: -10 },
            }}
            colorScale={colorNER}
            data={Array.from(legends).map((legend, i) => ({
                name: legend
                  .concat('        ')
                  .substr(0, 16),
                  symbol: { fill: () => {
                    if (indicatorgroup_colors[legend]) 
                      return indicatorgroup_colors[legend]
                    else
                      return colorNER[i]
                    },
                  }
              }))}
              
            labelComponent={<HTMLLabel />}
          />
      </VictoryChart>
      </ChartContainer>
  </>
    )
}

export default LineChart