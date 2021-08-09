import React from 'react'
import styled from 'styled-components'
import parseHtml from 'html-react-parser'
import mapRegionToDataRegions from "./../data/mapRegionToDataRegions"
import { colorNER } from "./chartColors"
import historicalYears from "./../data/historicalyears"
import { CSVLink } from 'react-csv'
import {
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryGroup,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryVoronoiContainer,
  VictoryTooltip
} from 'victory'
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

const LineChartHistorical = ({
  chartName = "chart name",
  data = [],
  selectedCountries = [],
  xRange = historicalYears,
  addTotal = true,
  label= "share"
}) => {
  const getCSVData = (lineData) => {
    let ret = []
    Object.entries(lineData).forEach((indicatorGroup) => {
      indicatorGroup[1].forEach((item)=>{
        //console.log("in gr: ", indicatorGroup)
        ret.push({indicatorGroup: indicatorGroup[0], year: item.x, value: item.y, country: indicatorGroup[0], unit: label})
      })
    })
    ret.push({citation: CSV_citation})
    return ret
  }
let selectedDataRegions = [] 
mapRegionToDataRegions.forEach((mapRegion) => {
  if(selectedCountries.includes(mapRegion.path_id)) {
  mapRegion.historical_data_regions.forEach((dataRegion) => {
    selectedDataRegions.push(dataRegion)
  })
}
})

const HTMLYAxisLabel = props => {
  const text = props.text.replaceAll('§', '')
  const co2Text = text.replace("CO2", "CO<sub>2</sub>")
  return (
    <foreignObject x={props.x+3-95} y={props.y-9} width={120} height={120}>
      <div style={{ fontSize: '12px', transform: "rotate(-90deg)" }}>{parseHtml(co2Text)}</div>
    </foreignObject>
  );
};

const fixedcolorCountries = ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland']
const countryColors = () => {
  let ret = colorNER.slice(0, 4)
  fixedcolorCountries.forEach((country, index)=>{
    ret[country] = colorNER[index]
  })
  if (addTotal)
    ret['total'] = 'black'
  return ret
}
const renderLines = (lineData) => {
  let ret = []
  for (let line in lineData) {
    ret.push(<VictoryLine 
      key={"lini2"} 
      data={lineData[line]}
      style={{
        data: { stroke: countryColors(selectedDataRegions)[line] },
      }}
      labelComponent={<VictoryTooltip />}
      >
      
    </VictoryLine>)
  }
  return ret
}
const legends = selectedDataRegions
if (addTotal)
  legends.push("total")

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
    {selectedCountries.length !== 0 && 
      <VictoryChart 
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => {
              return (`${datum.country}, ${Math.round(100*datum.y, 2)/100}`)
            }}
            labelComponent={<VictoryTooltip />}
          />
        }
        domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        style={{parent: { height: "550px" }}}
        theme={VictoryTheme.material}>
        <VictoryAxis 
          key={'lineAxis'} tickValues={xRange} />
          <VictoryAxis
            dependentAxis
            axisLabelComponent={<HTMLYAxisLabel dx={100} dy={50}/>}
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
            symbol: {fill: countryColors(selectedDataRegions)[legend]},
          }))}
        labelComponent={<VictoryLabel style={{ fontSize: '12px' }} />}
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
export default LineChartHistorical