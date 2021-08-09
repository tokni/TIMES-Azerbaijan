import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import parseHtml from 'html-react-parser'
import {
  VictoryChart,
  VictoryLegend,
  VictoryGroup,
  VictoryStack,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryLabel, 
} from 'victory'
import {createAccumulatedData} from './Tools'
import {colorNER} from './chartColors'
import periods from './../data/years'
import {indicatorgroup_colors} from '../charts/indicatorgroup_color'
import { CSVLink } from 'react-csv'
import CSV_citation from "../data/citation"

const ChartContainer = styled.div`
  width: 550px;
  height: 625px;
  background: white;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`
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
const StackedBarChart = props => {
  const stackedBar = props.stackedBar
  const scenario = props.selectedScenario.includes("_copy") ? props.selectedScenario.replace("_copy", "") : props.selectedScenario
  const scenario2 = props.selectedScenario2
  const selectedCountries = props.selectedCountries
  const chartName = props.chartName
  const chartTitle = props.chartTitle
  const combinedChart = false //props.combinedChart

  let maxY2 = 1
  
  const dataScenario1 = createAccumulatedData(stackedBar.data, scenario, false, chartName, selectedCountries)
  const dataScenario2 = createAccumulatedData(stackedBar.data, scenario2, false, chartName, selectedCountries)

  const accumulatedDataScenario1 = dataScenario1[0]
  const accumulatedDataScenario2 = scenario2 ? dataScenario2[0] : undefined
  const totalYearValuesPositiveScenario1 = dataScenario1[1]
  const totalYearValuesNegativeScenario1 = dataScenario1[2]
  const totalYearValuesPositiveScenario2 = scenario2 ? dataScenario2[1] : undefined
  const totalYearValuesNegativeScenario2 = scenario2 ? dataScenario2[2] : undefined
  const unit = dataScenario1[3]
  let maxY = -Infinity
  let minY = Infinity
  let base = 0
  
  Object.keys(totalYearValuesPositiveScenario1).forEach(year => {
    maxY = Math.round(Math.max(maxY, totalYearValuesPositiveScenario1[year],
      scenario2 ? totalYearValuesPositiveScenario2[year] : -Infinity))
    minY = Math.round(Math.min(minY, totalYearValuesNegativeScenario1[year],
      scenario2 ? totalYearValuesNegativeScenario2[year] : Infinity))
  })
  let t = 1
  let i = 0
  let range = [2,4,6,8,10]
  while(t < maxY) {
    t = range[i%5]*Math.pow(range[4], Math.floor(i/5))
    i++
  }
  maxY = t
  let u=0
  let j=0
  while(u > minY && j < 40) {
    u = -range[j%5]*Math.pow(range[4], Math.floor(j/5))
    j++
  }
  minY = u

  //base is used in tickFormat
  if (maxY < -minY) 
    base = -minY
  else 
    base = maxY
  let legends = new Set()
  stackedBar.data.scenarios
  .find(o => o.scenario.toLowerCase() === scenario.toLowerCase())
  .indicators.find(o => o.indicator === chartName).regions.forEach((reg)=>{
    reg.indicatorGroups.forEach((group)=>{
      legends.add(group.indicatorGroup)
    })
  })
  
  const defTick = [0, 0.25, 0.5, 0.75]
  const getTickValues = () => {
    let ret = []
    if (-minY > maxY) {
      ret=[-0.75,-0.5, -0.25, 0]
      defTick.forEach((tick, i)=> {
        if (tick !== 0.75)
        if (-tick*minY < maxY)
        ret.push(defTick[i+1])
      })
    }
    else {
      ret=[0, 0.25, 0.5, 0.75]
      defTick.forEach((tick, i)=> {
        if (tick !== 0.75)
          if (tick*maxY + maxY*0.05 < -minY)
            ret.unshift(-defTick[i+1])
      })
    }
    
    return ret
  }
const getCSVData = (accumulatedData1, scenarioName1, accumulatedData2, scenarioName2, unit) => {
  let ret = []
  console.log("accu1: ", accumulatedData1)
  Object.entries(accumulatedData1).forEach((indicatorGroup) => {
    indicatorGroup[1].forEach((item)=>{
      ret.push({scenario: scenarioName1, indicatorGroup: indicatorGroup[0], year: item.year, value: item.total, unit: unit})
    })
  })
  Object.entries(accumulatedData2).forEach((indicatorGroup) => {
    indicatorGroup[1].forEach((item)=>{
      ret.push({scenario: scenarioName2, indicatorGroup: indicatorGroup[0], year: item.year, value: item.total, unit: unit})
    })
  })
  ret.push({citation: CSV_citation})
  return ret
}
const HTMLYAxisLabel = props => {
  const text = props.text.replaceAll('§', '')
  const co2Text = text.replace("CO2", "CO<sub>2</sub>")
  return (
    <foreignObject x={props.x+3-95} y={props.y-9} width={120} height={120}>
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
const tickValueLength = getTickValues().length
let tickValueNumberOfNegativeElements = 0
getTickValues().forEach((val) => {
  if (val < 0) tickValueNumberOfNegativeElements++
})
let t1 = tickValueNumberOfNegativeElements/tickValueLength*550

  return (
    <ChartContainer>
    <ChartHeader>
      <ChartTitle>{parseHtml(chartTitle.replaceAll("CO2", "CO<sub>2</sub>"))}</ChartTitle>
      <CSVLink 
        data={getCSVData(dataScenario1[0], scenario, dataScenario2 ? dataScenario2[0] : [], scenario2, unit )}
        filename={chartTitle + " " + selectedCountries + ".csv"}
      >
        Download as CSV</CSVLink>
    </ChartHeader>
      <VictoryChart
        domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        theme={VictoryTheme.material}
        style={{parent: { height: "550px" }}}
      >
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<HTMLYAxisLabel dx={100} dy={-50}/>}
          key={2}
          offsetX={80}
          tickFormat={tick =>
            
            ((tick * base) / props.divideValues).toLocaleString()
          }
          tickValues={getTickValues()}
          label={unit}
        />
        {combinedChart === true && (
          <VictoryAxis
            dependentAxis
            key={3}
            offsetX={330}
            label={props.label2}
            style={{
              axis: { stroke: 'gray' },
              axisLabel: { fill: 'gray', padding: -50 },
              ticks: { padding: -25 },
              tickLabels: { fill: 'gray', textAnchor: 'start' },
            }}
            tickFormat={tick =>
              `${
                props.Y2Percentage === false
                  ? tick * maxY2
                  : tick * maxY2 * 100 + '%'
              }`
            }
            tickValues={[0, 0.25, 0.5, 0.75, 1.0]}
          />
        )}
        
        <VictoryGroup offset={15} style={{ data: { width: 15 } }}>
          <VictoryStack>
            {Object.keys(accumulatedDataScenario1).map((chartGroupName, i) => (
                <VictoryBar
                  key={chartGroupName}
                  data={accumulatedDataScenario1[chartGroupName].map(
                    chartGroupValue => {
                      return({
                      ...chartGroupValue,
                      label:
                        chartGroupName +
                        ': ' +
                        (props.YPercentage
                          ? (
                              (chartGroupValue.total * 100) /
                              props.divideValues
                            ).toFixed(0) + '%'
                          : 
                              Math.round(chartGroupValue.total / props.divideValues * 100, 2)/100
                            ),
                    })}
                  )}
                  x="year"
                  y={datum => datum['total'] / (base === 0 ? 100 : base)}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { fill: () => {
                      if (indicatorgroup_colors[chartGroupName]) 
                        return indicatorgroup_colors[chartGroupName]
                      else
                        return colorNER[i]
                      }, 
                    },
                  }}
                />
              ))}
          </VictoryStack>
          {scenario2 !== '' && (
            <VictoryStack>
              {Object.keys(accumulatedDataScenario2).map((chartGroupName, i) => (
                  <VictoryBar
                    key={chartGroupName}
                    data={accumulatedDataScenario2[chartGroupName].map(
                      chartGroupValue => ({
                        ...chartGroupValue,
                        label:
                          chartGroupName +
                          ': ' +
                          (props.YPercentage
                            ? (
                                (chartGroupValue.total * 100) /
                                props.divideValues
                              ).toFixed(0) + '%'
                            : (
                                chartGroupValue.total / props.divideValues
                              ).toFixed(0)),
                      })
                    )}
                    x="year"
                    y={datum => datum['total'] / (base === 0 ? 100 : base)}
                    labelComponent={<VictoryTooltip />}
                    style={{
                    data: { fill: () => {
                      if (indicatorgroup_colors[chartGroupName]) 
                        return indicatorgroup_colors[chartGroupName] + '88'
                      else
                        return colorNER[i] +'88'
                      }, 
                    },
                  }}
                  />
                ))}
            </VictoryStack>
          )}
        </VictoryGroup>
        {console.log("place dy: ", t1)}
        <VictoryAxis 
          key={0} 
          tickValues={periods} 
          tickFormat={periods} 
          style={{
            grid: { strokeWidth: 0 },
          }}
          
          tickLabelComponent={
            <VictoryLabel dy={t1} dx={0}
              backgroundStyle={[{fill: "white", opacity: 0.5}]}
              backgroundPadding={3}
            />
          }
        />
        <VictoryLegend
          x={90}
          y={5}
          orientation="horizontal"
          gutter={15}
          rowGutter={2}
          symbolSpacer={5}
          itemsPerRow={4}
          style={{
            title: { fontSize: 14, leftPadding: -10 },
          }}
          colorScale={colorNER}
          data={Array.from(legends).map((legend, i) => ({
              name: legend,
              symbol: { fill: () => {
                if (indicatorgroup_colors[legend]) 
                  return indicatorgroup_colors[legend]
                else
                  return colorNER[i]
                },
              }}
          ))}
          labelComponent={<HTMLLabel />}
        />
      </VictoryChart>
    </ChartContainer>
  )
}

StackedBarChart.defaultProps = {
  divideValues: 1,
  selectedScenario2: '',
  YPercentage: false,
}

StackedBarChart.propTypes = {
  stackedBar: PropTypes.object,
  selectedScenario: PropTypes.string.isRequired,
  selectedScenario2: PropTypes.string,
  chartName: PropTypes.string.isRequired,
  chartTitle: PropTypes.string.isRequired,
  combinedChart: PropTypes.bool.isRequired,
  minY: PropTypes.number.isRequired,
  maxY: PropTypes.number.isRequired,
  minY2: PropTypes.number,
  maxY2: PropTypes.number,
  label: PropTypes.string,
  divideValues: PropTypes.number,
  label2: PropTypes.string,
  YPercentage: PropTypes.bool,
  Y2Percentage: PropTypes.bool,
  selectedCountries: PropTypes.array.isRequired,
}


export default StackedBarChart
