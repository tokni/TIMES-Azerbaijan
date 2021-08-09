import React from 'react'
import styled from 'styled-components'
import parseHtml from 'html-react-parser'
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
import { CSVLink } from 'react-csv'
import CSV_citation from "../data/citation"

const ChartContainer = styled.div`
  width: 550px;
  height: 650px;
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
  margin-right: 10px;
`

const StackedBarChartHistoricalPerCountry = ({
  chartName = "chart name",
  stackedBar = [],
  YPercentage = false,
  Y2Percentage = false,
  divideValues = 1,
  label="PJ",
  label2="c",
  selectedCountries = [],
  combinedChart = false,
  maxY2 = 100,
}) => {
  const accumulatedData = stackedBar[0]
  const totalYearValuesScenario1 = stackedBar[1]
  const legends = stackedBar[2]
  const colors2 = stackedBar[3]
  let gutter, rowGutter
  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    gutter = 0
    rowGutter = 0
  } else {
    gutter = 0
    rowGutter = 0
  }

  let maxY = -Infinity
  let minY = Infinity
  let base = 0
  
  Object.keys(totalYearValuesScenario1).forEach(year => {
    maxY = Math.round(Math.max(maxY, totalYearValuesScenario1[year]))
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
  while(u > minY && j < 20) {
    u = -range[j%5]*Math.pow(range[4], Math.floor(j/5))
    j++
  }
  minY = u

  //base is used in tickFormat
  console.log("chartNAme: ", chartName)
  if (maxY < -minY) 
    base = -minY
  else 
    base = maxY

  const getCSVData = (lineData) => {
    let ret = []
    Object.entries(lineData).forEach((indicatorGroup) => {
      indicatorGroup[1].forEach((item)=>{
        ret.push({indicatorGroup: indicatorGroup[0], year: item.year, value: item.total, unit: label})
      })
    })
    ret.push({citation: CSV_citation})
    return ret
  }
  const HTMLYAxisLabel = props => {
    const text = props.text.replaceAll('§', '')
    const co2Text = text.replace("CO2", "CO<sub>2</sub>")
    return (
      <foreignObject x={props.x+3-95} y={props.y-9} width={90} height={60}>
        <div style={{ fontSize: '12px', transform: "rotate(-90deg)" }}>{parseHtml(co2Text)}</div>
      </foreignObject>
    );
  };
return (
  <ChartContainer>
  <ChartHeader>
      <ChartTitle>{parseHtml(chartName.replaceAll("CO2", "CO<sub>2</sub>"))}</ChartTitle>
      <CSVLink 
        data={getCSVData(accumulatedData)}
        filename={chartName + " " + selectedCountries + ".csv"}
      >
        Download as CSV</CSVLink>
    </ChartHeader>
    {selectedCountries.length !== 0 && <VictoryChart
      domainPadding={20}
      width={550}
      height={550}
      padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
      style={{parent: { height: "550px" }}}
      theme={VictoryTheme.material}
      // domain={{ y: yDomain }} //removed to fix issue with axis labels not being updated
    >
      <VictoryAxis key={0} tickValues={[1990, 1995, 2000, 2005, 2010, 2015]} tickFormat={[1990, 1995, 2000, 2005, 2010, 2015]} />
      <VictoryAxis
        dependentAxis
        axisLabelComponent={<HTMLYAxisLabel dx={10} dy={-50} />}
        key={2}
        offsetX={80}
        tickFormat={tick =>
          `${
            YPercentage === false
              ? ((tick * base) / divideValues).toFixed(0).toLocaleString()
              : (tick * 100) / divideValues + '%'
          }`
        }
        tickValues={[0, 0.25, 0.5, 0.75]}
        label={label}
      />
      {combinedChart === true && (
        <VictoryAxis
          dependentAxis
          key={3}
          offsetX={330}
          label={label2}
          style={{
            axis: { stroke: 'gray' },
            axisLabel: { fill: 'gray', padding: -50 },
            ticks: { padding: -25 },
            tickLabels: { fill: 'gray', textAnchor: 'start' },
          }}
          tickFormat={tick =>
            `${
              Y2Percentage === false
                ? tick * maxY2
                : tick * maxY2 * 100 + '%'
            }`
          }
          tickValues={[0, 0.25, 0.5, 0.75, 1.0]}
        />
      )}
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
        data={Array.from(legends).map((legend, i) => ({
            name: legend
              .concat('        ')
              .substr(0, 16),
            symbol: {fill: colors2[legend]},
          }))}
        labelComponent={<VictoryLabel style={{ fontSize: '12px' }} />}
      />
      <VictoryGroup offset={10} style={{ data: { width: 10 } }}>
        <VictoryStack>
          {Object.keys(accumulatedData).map((chartGroupName, i) => (
              <VictoryBar
                key={chartGroupName}
                data={accumulatedData[chartGroupName].map(
                  chartGroupValue => {
                    return({
                    ...chartGroupValue,
                    label:
                     chartGroupValue.year + ' - ' +
                      chartGroupName +
                      ': ' +
                      (YPercentage
                        ? (
                            (chartGroupValue.total * 100) /
                            divideValues
                          ).toFixed(0) + '%'
                        : (
                            chartGroupValue.total / divideValues
                          ).toFixed(0)),
                  })}
                )}
                x="year"
                y={datum => datum['total'] / (maxY === 0 ? 100 : maxY)}
                labelComponent={<VictoryTooltip />}
                style={{
                  data: { fill: colors2[chartGroupName] },
                }}
              />
            ))}
        </VictoryStack>
      </VictoryGroup>
    </VictoryChart>}
  </ChartContainer>
)
}
export default StackedBarChartHistoricalPerCountry