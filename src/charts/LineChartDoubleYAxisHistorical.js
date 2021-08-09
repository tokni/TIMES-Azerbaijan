import React from 'react'
import styled from 'styled-components'
import mapRegionToDataRegions from "./../data/mapRegionToDataRegions"
import { colorNER } from "./chartColors"
import historicalYears from "./../data/historicalyears"
import parseHtml from 'html-react-parser'
import {
  VictoryChart,
  VictoryLegend,
  VictoryGroup,
  VictoryTheme,
  VictoryAxis,
  VictoryLine
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

const LineChartDoubleYAxisHistorical = ({
  chartName = "chart name",
  data = [],
  YPercentage = false,
  Y2Percentage = false,
  divideValues = 1,
  label="PJ",
  label2="c",
  selectedCountries = [],
  combinedChart = false,
  maxY2 = 100,
  xRange = historicalYears
}) => {

let selectedDataRegions = [] 
mapRegionToDataRegions.forEach((mapRegion) => {
  if(selectedCountries.includes(mapRegion.path_id)) {
  mapRegion.historical_data_regions.forEach((dataRegion) => {
    selectedDataRegions.push(dataRegion)
  })
}
})
const legendColors = () => {
  let ret = colorNER.slice(0, 3)
  Object.keys(data).forEach((key, i) => {
    ret[key] = colorNER[i] 
  })
  return ret
}
const getCSVData = (lineData) => {
  let ret = []
  Object.entries(lineData).forEach((indicatorGroup) => {
    indicatorGroup[1].forEach((item)=>{
      ret.push({indicatorGroup: indicatorGroup[0], year: item.x, value: item.y, unit: label})
    })
  })
  ret.push({citation: CSV_citation})
  return ret
}
const renderLines = (lineData) => {
  let ret = []
  for (let line in lineData) {
    ret.push(<VictoryLine 
      key={"lini2"} 
      data={lineData[line]}
      style={{
        data: { stroke: legendColors()[line] },
      }}>
    </VictoryLine>)
  }
  ret.push(CSV_citation)
  return ret
}
const legends = Object.keys(data)

const HTMLYAxisLabel = props => {
  const text = props.text.replaceAll('§', '')
  const co2Text = text.replaceAll("CO2", "CO<sub>2</sub>")
  const m2Text = co2Text.replaceAll("m2", "m<sup>2</sup>")
  return (
    <foreignObject x={props.x+3-275} y={props.y-189} width={450} height={450}>
      <div style={{ fontSize: '12px', transform: "rotate(-90deg)" }}>{parseHtml(m2Text)}</div>
    </foreignObject>
    );
  };
  const HTMLLabel = props => {
  const text = props.text.replaceAll('§', '')
  const co2Text = text.replaceAll("CO2", "CO<sub>2</sub>")
  return (
    <foreignObject x={props.x+3} y={props.y-9} width={290} height={260}>
      <div style={{ fontSize: '12px' }}>{parseHtml(co2Text)}</div>
    </foreignObject>
  );
};
return (
  <>
  <ChartContainer>
  <ChartHeader>
      <ChartTitle>{parseHtml(chartName.replaceAll("CO2", "CO<sub>2</sub>"))}</ChartTitle>
      <CSVLink 
        data={getCSVData(data)}
        filename={chartName + " " + selectedCountries + ".csv"}
      >
        Download as CSV</CSVLink>
    </ChartHeader>
  <div>
    {selectedCountries.length !== 0 && <VictoryChart domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        style={{parent: { height: "550px" }}}
        theme={VictoryTheme.material}>
        <VictoryAxis 
          key={'lineAxis'} tickValues={xRange} />
          <VictoryAxis
            dependentAxis
            axisLabelComponent={<HTMLYAxisLabel dx={10} dy={-50}/>}
            key={2}
            offsetX={80}
            label={label}
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
        data={Array.from(legends).map((legend, i) => ({
            name: legend,
            symbol: {fill: legendColors()[i]},
          }))}
        labelComponent={<HTMLLabel style={{ fontSize: '12px' }} />}
      />
          <VictoryGroup>
            {renderLines(data)}
          </VictoryGroup>
    </VictoryChart>}
    </div>
  </ChartContainer>
  </>
)
}
export default LineChartDoubleYAxisHistorical