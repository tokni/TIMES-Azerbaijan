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
//import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'
import chartSettings from "../translations/charts"
import i18next from 'i18next';

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
const LineChart = ({
  lineData, 
  selectedScenario, 
  selectedScenario2, 
  selectedCountries, 
  chartName, 
  label,
  unitFactor
}) => {
  const [t] = useTranslation()
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.country)) {
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
  
  legends = selectedDataRegions
  let dataFailure = "no"
  let indicatorData1 = []
  let selectedScenarioData = lineData[selectedScenario.toLowerCase()]
  
  if (!selectedScenarioData) {
    console.log("Scenario: " + selectedScenario + " not found in data")
    dataFailure = "Scenario: " + selectedScenario + " not found in data"
  }
  indicatorData1 = selectedScenarioData.charts[chartName]
  
  if (!indicatorData1) {
    console.log("Indicator " + chartName + " not found in data")
    dataFailure = "Indicator " + chartName + " not found in data"
  }
  const HTMLYAxisLabel = props => {
    const text = props.text.replaceAll('§', '')
    const co2Text = text.replace("CO2", "CO<sub>2</sub>")
    return (
      <foreignObject x={props.x+3-140} y={props.y-9} width={180} height={120}>
        <div style={{ fontSize: '18px', transform: "rotate(-90deg)"}}>{parseHtml(co2Text)}</div>
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

  return (
    <>
    {dataFailure === "no" ?
  <ChartContainer>
    <ChartHeader>
      <ChartTitle>{chartSettings[chartName]["name_" + i18next.language]}</ChartTitle>
      {/* <CSVLink 
        data={getCSVData(indicatorData1, selectedScenario, indicatorData2, selectedScenario2)}
        filename={indicatorData1.indicator + " " + selectedCountries + ".csv"}
      >
        {t("general.download-as-csv")}</CSVLink> */}
    </ChartHeader>
      <VictoryChart domainPadding={20}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => {
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
            label={t(label)}
          />
          <VictoryGroup >
            {selectedDataRegions.map((country, i)=>{
            let lineChartData = []
            Object.entries(indicatorData1).forEach((region)=>{
              if (region[0] === country) {
                Object.values(region[1]).forEach(legend => {
                  Object.values(legend).forEach(item => {
                    lineChartData.push({x: item.year, y: item.total*unitFactor, country: country})
                  })
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
                  } 
                },
              }}
              labelComponent={<VictoryTooltip />}
              >
            </VictoryLine>
          )
        })}
        {selectedScenario2 !== "" && selectedDataRegions.map((country, i)=>{
          let lineChartData2 = []
          let selectedScenarioData = lineData[selectedScenario2.toLowerCase()]
          let indicatorData = selectedScenarioData.charts[chartName]
          Object.entries(indicatorData).forEach((region)=>{
              if (region[0] === country) {
                Object.values(region[1]).forEach(legend => {
                  Object.values(legend).forEach(item => {
                    lineChartData2.push({x: item.year, y: item.total*unitFactor, country: country})
                  })
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
                  }, strokeDasharray: "8" 
                },
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
            data={Array.from(legends).map(
              (legend, i) => ({
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
                })
              )
            }
              
            labelComponent={<HTMLLabel />}
          />
      </VictoryChart>
      </ChartContainer>
  : <div>{dataFailure}</div>}
  </> 
    )
}

export default LineChart