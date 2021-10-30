import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import years from "../data/years"

import {
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryGroup,
  VictoryStack,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
} from 'victory'
import {createAccumulatedData} from './Tools'
import parseHtml from 'html-react-parser'
import { colorNER } from "./chartColors"
import {indicatorgroup_colors} from '../charts/indicatorgroup_color'
import i18next from 'i18next';
import charts from '../translations/charts'
import legendsForColor from '../translations/legends'
import scenarioCombinations from '../data/scenarioCombinations'

const ChartTitle = styled.div`
  margin-left: 70px;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
`
const ChartContainer = styled.div`
  width: 550px;
  background: white;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`

const StackedBarChart = props => {
  const stackedBar = props.stackedBar
  const scenario = props.selectedScenario
  const scenario2 = props.selectedScenario2
  const selectedCountries = props.selectedCountries
  const chartName = props.chartName
  const chartTitle = props.chartTitle
  const combinedChart = props.combinedChart
  const unit = props.label
  const unitFactor = props.unitFactor
  const periods = years
  let gutter, rowGutter
  let minY = props.minY
  let maxY = props.maxY

  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    gutter = 0
    rowGutter = 0
  } else {
    gutter = -40
    rowGutter = -5
  }

  let maxY2 = 1
  let minY2 = 0
  if (combinedChart === true) {
    maxY2 = props.maxY2
    minY2 = props.minY2
  }

  let yDomain = [0, 1]
  if (minY < 0 || minY2 < 0) {
    let stackedRatio = minY / maxY
    let lineRatio = minY2 / maxY2
    yDomain = stackedRatio < lineRatio ? [stackedRatio, 1] : [lineRatio, 1]
  }

  const dataScenario1 = createAccumulatedData(stackedBar, scenario, false, chartName, selectedCountries)
  const dataScenario2 = createAccumulatedData(stackedBar, scenario2, false, chartName, selectedCountries)
  const accumulatedDataScenario1 = dataScenario1[0]
  const accumulatedDataScenario2 = scenario2 ? dataScenario2[0] : undefined
  let diffData = JSON.parse(JSON.stringify(accumulatedDataScenario1))
  //const unit = dataScenario1[3]
  Object.keys(accumulatedDataScenario2).forEach(indicatorName => {
    accumulatedDataScenario2[indicatorName].forEach((yearValue, index) => {
      diffData[indicatorName][index].total =  diffData[indicatorName][index].total - yearValue.total
    })
  }) 
  let maxValue = -Infinity
  let minValue = Infinity
  let base = 0

  let totalYearValuesPos = {}
  let totalYearValuesNeg = {}
  
  years.forEach(year => {
    totalYearValuesPos[year] = 0
    totalYearValuesNeg[year] = 0
  })
  Object.keys(diffData).forEach(indicatorName => {
    diffData[indicatorName].forEach(yearValue => {
      let value = yearValue.total
      if (value < 0) {
        totalYearValuesNeg[yearValue.year] += yearValue.total

      } else {
        totalYearValuesPos[yearValue.year] += yearValue.total

      }
    })
  })
  Object.keys(totalYearValuesPos).forEach(year => {
    maxValue = Math.round(Math.max(maxValue, totalYearValuesPos[year]))
    minValue = Math.round(Math.min(minValue, totalYearValuesNeg[year]))
  })
  let t = 1
  let i = 0
  let range = [2,4,6,8,10]
  while(t < maxValue) {
    t = range[i%5]*Math.pow(range[4], Math.floor(i/5))
    i++
  }
  maxValue = t
  let u=1
  let j=0
  while(u > minValue && j < 20) {
    u = -range[j%5]*Math.pow(range[4], Math.floor(j/5))
    j++
  }
  minValue = u

  //base is used in tickFormat
  if (maxValue < -minValue) 
    base = -minValue
  else 
    base = maxValue

  const defTick = [0, 0.25, 0.5, 0.75]
  const getTickValues = () => {
      let ret = []
      if (-minValue > maxValue) {
        ret=[-0.75,-0.5, -0.25, 0]
        defTick.forEach((tick, i)=> {
          if (tick !== 0.75)
          if (-tick*minValue < maxValue)
          ret.push(defTick[i+1])
        })
      }
      else {
        ret=[0, 0.25, 0.5, 0.75]
        defTick.forEach((tick, i)=> {
          if (tick !== 0.75)
            if (tick*maxValue + maxValue*0.05 < -minValue)
              ret.unshift(-defTick[i+1])
        })
      }
      return ret
    }

    const HTMLLabel = props => {
      //console.log("label; ", props)
      const text = props.text.replaceAll('§', '')
      const co2Text = text.replace("CO2", "CO<sub>2</sub>")
      return (
        <foreignObject x={props.x+3} y={props.y-9} width={290} height={60}>
          <div style={{ fontSize: '12px' }}>{parseHtml(co2Text)}</div>
        </foreignObject>
      );
    };
  let legends = new Set()
  //console.log("accum1: ", accumulatedDataScenario1)
  //console.log("legendNames: ", legendNames)
  Object.keys(accumulatedDataScenario1).forEach((key) => {
    let color = Object.values(legendsForColor).find((legend)=>(legend['name_' + i18next.language] === key)).color
    legends.add({name: key.substring(0,16), color: color})
  })
  let legendColor = {}
  legends.forEach(legend => {
    legendColor[legend.name] = legend.color
  })

  const HTMLYAxisLabel = props => {
    const text = props.text.replaceAll('§', '')
    const co2Text = text.replace("CO2", "CO<sub>2</sub>")
    return (
      <foreignObject x={props.x+3-95} y={props.y-9} width={120} height={120}>
        <div style={{ fontSize: '18px', transform: "rotate(-90deg)" }}>{parseHtml(co2Text)}</div>
      </foreignObject>
    );
  };
  
  return (
    <ChartContainer>
      <ChartTitle>{charts[chartName]["name_" + i18next.language]}</ChartTitle>
      <VictoryChart
        domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        theme={VictoryTheme.material}
        domain={{ y: yDomain }}
        label={unit}
      >
        
        <VictoryAxis key={0} tickValues={periods} tickFormat={periods} />
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<HTMLYAxisLabel dx={100} dy={-50}/>}
          key={2}
          offsetX={80}
          tickFormat={tick => {
            if (isNaN(maxValue)) {
              return 0
            }
            if (props.YPercentage) {
              return (
                Math.round((tick * maxValue * 100) / props.divideValues, 0) +
                '%'
              )
            }
            return ((unitFactor * tick * base) / props.divideValues).toLocaleString()
          }}
          tickValues={getTickValues()}
          label={unit}
        />
        <VictoryLegend
          x={90}
          y={5}
          orientation="horizontal"
          gutter={gutter}
          rowGutter={rowGutter}
          symbolSpacer={4}
          itemsPerRow={4}
          style={{
            title: { fontSize: 14, leftPadding: -10 },
          }}
          colorScale={colorNER}
          data={Object.keys(diffData).map((indicatorName, i) => ({
            name: indicatorName
              .concat('§§§§§§§§§§§§§§§§§§§§§')
              .substr(0, 16),
              symbol: { fill: () => {
                return legendColor[indicatorName.substring(0,16)]
                },
              }
          }))}
          labelComponent={<HTMLLabel />}
        />
        <VictoryGroup offset={15} style={{ data: { width: 15 } }}>
          <VictoryStack>
            {Object.keys(diffData).map((indicatorName, i) => (
              <VictoryBar
                key={indicatorName}
                data={diffData[indicatorName].map(chartGroupValue => ({
                  ...chartGroupValue,
                  label:
                    'Difference: ' +
                    indicatorName +
                    ': ' +
                    (props.YPercentage
                      ? (
                          (chartGroupValue.total * 100) /
                          props.divideValues
                        ).toFixed(0) + '%'
                      : Math.round(unitFactor * chartGroupValue.total / props.divideValues * 100, 2)/100
                        ),
                }))}
                x="year"
                y={datum => maxValue === 0 ? 0 : datum['total'] / base}
                labelComponent={<VictoryTooltip />}
                style={{
                    data: { fill: () => {
                      return legendColor[indicatorName.substring(0,16)]
                      }, 
                    },
                  }}
              />
            ))}
          </VictoryStack>
        </VictoryGroup>
      </VictoryChart>
    </ChartContainer>
  )
}

StackedBarChart.defaultProps = {
  divideValues: 1,
  YPercentage: false,
}

StackedBarChart.propTypes = {
  stackedBar: PropTypes.object,
  line: PropTypes.object,
  selectedScenario: PropTypes.string.isRequired,
  selectedScenario2: PropTypes.string.isRequired,
  chartName: PropTypes.string.isRequired,
  chartTitle: PropTypes.string.isRequired,
  combinedChart: PropTypes.bool.isRequired,
  minY: PropTypes.number.isRequired,
  maxY: PropTypes.number.isRequired,
  minY2: PropTypes.number,
  maxY2: PropTypes.number,
  label: PropTypes.string.isRequired,
  divideValues: PropTypes.number,
  label2: PropTypes.string,
  YPercentage: PropTypes.bool,
  Y2Percentage: PropTypes.bool,
  selectedCountries: PropTypes.array.isRequired,
}

export default StackedBarChart
