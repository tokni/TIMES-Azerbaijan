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
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import charts from '../translations/charts'
import legendsForColor from '../translations/legends'
import scenarioCombinations from '../data/scenarioCombinations'

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
  const [t] = useTranslation()
  const stackedBar = props.stackedBar
  const scenario = props.selectedScenario.includes("_copy") ? props.selectedScenario.replace("_copy", "") : props.selectedScenario
  const scenario2 = props.selectedScenario2
  const selectedCountries = props.selectedCountries
  const chartName = props.chartName
  const combinedChart = false //props.combinedChart
  const unit = props.label
  const unitFactor = props.unitFactor
  let maxY2 = 1
  
  const dataScenario1 = createAccumulatedData(stackedBar, scenario, false, chartName, selectedCountries, unitFactor)
  const dataScenario2 = createAccumulatedData(stackedBar, scenario2, false, chartName, selectedCountries, unitFactor)

  const accumulatedDataScenario1 = dataScenario1[0]
  const accumulatedDataScenario2 = scenario2 ? dataScenario2[0] : undefined
  const totalYearValuesPositiveScenario1 = dataScenario1[1]
  const totalYearValuesNegativeScenario1 = dataScenario1[2]
  const totalYearValuesPositiveScenario2 = scenario2 ? dataScenario2[1] : undefined
  const totalYearValuesNegativeScenario2 = scenario2 ? dataScenario2[2] : undefined
  let maxY = -Infinity
  let minY = Infinity
  let base = 0
  Object.keys(totalYearValuesPositiveScenario1).forEach(year => {
    maxY = Math.max(maxY, totalYearValuesPositiveScenario1[year],
      scenario2 ? totalYearValuesPositiveScenario2[year] : -Infinity)
    minY = Math.min(minY, totalYearValuesNegativeScenario1[year],
      scenario2 ? totalYearValuesNegativeScenario2[year] : Infinity)
  })
  let ttt = -1000
  let i = -50
  let range = [2,4,6,8,10]
  while(ttt < maxY) {
    if (i < 0 ) {
      ttt = range[Math.abs((i+50)%5)]*Math.pow(range[4], Math.floor(i/5))
      
    } else {
      ttt = range[Math.abs(i%5)]*Math.pow(range[4], Math.floor(i/5))
    }
    i++
  }
  maxY = ttt
  let u=0
  let j=-30
  while(u > minY && j < 40) {
    if (j < 0) {
      u = -range[(j+30)%5]*Math.pow(range[4], Math.floor(j/5))
    } else {
      u = -range[Math.abs(j%5)]*Math.pow(range[4], Math.floor(j/5))
    }
    
    j++
  }
  minY = u

  //base is used in tickFormat
  if (maxY < -minY) 
    base = -minY
  else 
    base = maxY
if (base < 0.004) base = 0.004
let sig_digits = Math.floor(Math.log10(base))
if (sig_digits > -1) sig_digits = -1
Math.pow(-sig_digits, 10)
  let legends = new Set()
  Object.keys(accumulatedDataScenario1).forEach((key) => {
    let color = Object.values(legendsForColor).find((legend)=>(legend['name_' + i18next.language] === key)).color
    legends.add({name: key.substring(0,16), color: color})
  })
  let legendColor = {}
  legends.forEach(legend => {
    legendColor[legend.name] = legend.color
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
  let scenarioTrans = scenarioCombinations.scenarioCombinations.scenarioOptions.find(
    (option)=>{
      return((option.id.toLowerCase() === scenarioName1.toLowerCase()))
      }
    )['short_description_' + i18next.language]
  Object.entries(accumulatedData1).forEach((indicatorGroup) => {

    indicatorGroup[1].forEach((item)=>{
      ret.push({scenario: scenarioTrans, indicatorGroup: indicatorGroup[0], year: item.year, value: item.total, unit: unit})
    })
  })
  Object.entries(accumulatedData2).forEach((indicatorGroup) => {
    indicatorGroup[1].forEach((item)=>{
      ret.push({scenario: scenarioName2, indicatorGroup: indicatorGroup[0], year: item.year, value: item.total, unit: unit})
    })
  })
  return ret
}
const HTMLYAxisLabel = props => {
  const text = props.text.replaceAll('??', '')
  const co2Text = text.replace("CO2", "CO<sub>2</sub>")
  return (
    <foreignObject x={props.x+3-140} y={props.y-9} width={180} height={120}>
      <div style={{ fontSize: '18px', transform: "rotate(-90deg)" }}>{parseHtml(co2Text)}</div>
    </foreignObject>
  );
};
const HTMLLabel = props => {
  const text = props.text.replaceAll('??', '')
  const co2Text = text.replace("CO2", "CO<sub>2</sub>")
  return (
    <foreignObject x={props.x+3} y={props.y-9} width={290} height={60}>
      <div style={{ fontSize: '12px' }}>{parseHtml(co2Text)}</div>
    </foreignObject>
  );
};
const tickValueLength = getTickValues().length
let tickValueNumberOfNegativeElements = 0
const topPadding = Math.ceil(legends.size / 4) * 21
getTickValues().forEach((val) => {
  if (val < 0) tickValueNumberOfNegativeElements++
})
let t1 = tickValueNumberOfNegativeElements === 0 ? 0 : tickValueNumberOfNegativeElements/tickValueLength*550 - topPadding/2
if (Object.keys(accumulatedDataScenario1).length === 0) 
return(<div>No DAta yet</div>)
  return (
    <ChartContainer>
    <ChartHeader>
      <ChartTitle>{charts[chartName]["name_" + i18next.language]}</ChartTitle>
      <CSVLink 
        data={getCSVData(dataScenario1[0], scenario, dataScenario2 ? dataScenario2[0] : [], scenario2, unit )}
        filename={charts[chartName]["name_" + i18next.language] + " " + selectedCountries + ".csv"}
      >
        {t("general.download-as-csv")}</CSVLink>
    </ChartHeader>
      <VictoryChart
        domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: topPadding, bottom: 50 }}
        theme={VictoryTheme.material}
        style={{parent: { height: "550px" }}}
      >
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<HTMLYAxisLabel dx={100} dy={-50}/>}
          key={2}
          offsetX={80}
          tickFormat={tick =>
            {
              return(
                ((tick * base) / props.divideValues).toLocaleString()
              )}
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
            {Object.keys(accumulatedDataScenario1).map((chartGroupName, i) => {
            return(
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
                              Math.round(chartGroupValue.total / props.divideValues * Math.pow(10, -sig_digits + 1), 2)/Math.pow(10, -sig_digits + 1)
                            ),
                    })}
                  )}
                  x="year"
                  y={datum => datum['total'] / (base === 0 ? 100 : base)}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { fill: () => {
                        return legendColor[chartGroupName.substring(0,16)]
                      }, 
                    },
                  }}
                />
              )}
            )}
          </VictoryStack>
          {scenario2 !== '' && (
            <VictoryStack>
              {Object.keys(accumulatedDataScenario2).map((chartGroupName, i) => {
                return(
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
                              Math.round(unitFactor * chartGroupValue.total / props.divideValues * Math.pow(10, -sig_digits + 1), 2)/Math.pow(10, -sig_digits + 1)
                              )),
                      })
                    )}
                    x="year"
                    y={datum => datum['total'] / (base === 0 ? 100 : base)}
                    labelComponent={<VictoryTooltip />}
                    style={{
                    data: { fill: () => {
                      return legendColor[chartGroupName.substring(0,16)] + '88'
                      }, 
                    },
                  }}
                  />
                )}
              )}
            </VictoryStack>
          )}
        </VictoryGroup>
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
          data={Array.from(legends).map((legend, i) => {
            return({
              name: legend.name,
              symbol: { fill: () => {
                return legend.color
                },
              }}
          )}
          )}
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
