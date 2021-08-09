import React from 'react'
import Welcome from '../alert/Welcome'
import { MainArea, Flex } from './Charts.style'
import StackedBarChartHistorical from './StackedBarChartHistorical'
import LineChartHistorical from './LineChartHistorical'
import HistoricalData1 from "./../data/stackedBarTab81" //nces_eleproduction
import HistoricalData2 from "./../data/stackedBarTab82" //nces_ghgemission
import HistoricalData3 from "./../data/stackedBarTab83" //nces_vehiclenumber
import HistoricalData4 from "./../data/stackedBarTab84" //nces_building_area
import HistoricalData5 from "./../data/stackedBarTab85" //nces_enercons_res
import HistoricalData6 from "./../data/stackedBarTab86" //nces_enercons_ser
import HistoricalData7 from "./../data/stackedBarTab87" //nces_enercons_ind
//import HistoricalData8 from "./../data/stackedBarTab88" //nces_dh_gen
import HistoricalData8 from "./../data/stackedBarTab101" //nces_eleccons
import HistoricalData9 from "./../data/stackedBarTab102" //nces_elecexchange-3rd-country
//import HistoricalData10 from "./../data/stackedBarTab103" //nces_elecprod
import HistoricalData11 from "./../data/stackedBarTab104" //nces_enercons_trans
import HistoricalData12 from "./../data/stackedBarTab106" //nces_vehiclenumber_stock
//import HistoricalData13 from "./../data/stackedBarTab87" //nces_enercons_ind
import HistoricalData14 from "./../data/lineChart01" //nces_primencon
import HistoricalData15 from "./../data/stackedBarTab108" //nces_biofuels_prod

import {createAccumulatedHistoricalData1} from "./Tools"
import {createAccumulatedRawHistoricalData2} from "./Tools"
import {createAccumulatedRawHistoricalData3} from "./Tools"
import {createAccumulatedRawHistoricalData4} from "./Tools"
import {createAccumulatedRawHistoricalData5} from "./Tools"
import {createAccumulatedRawHistoricalData6} from "./Tools"
//import {createAccumulatedRawHistoricalData7} from "./Tools"
import {createAccumulatedRawHistoricalData8} from "./Tools"
import {createAccumulatedRawHistoricalData9} from "./Tools"
import {createAccumulatedRawHistoricalData10} from "./Tools"
import {createLineChartData1} from "./Tools"
import {createLineChartData2} from "./Tools"
import {createAccumulatedRawHistoricalData11} from "./Tools"
import {createAccumulatedRawHistoricalData12} from "./Tools"

const RawHistoricalCharts = props => {  
  const HistoricalTableData1 = createAccumulatedHistoricalData1(HistoricalData1, props.selectedCountries)
  const HistoricalTableData2 = createAccumulatedRawHistoricalData2(HistoricalData2, props.selectedCountries)
  const HistoricalTableData3 = createAccumulatedRawHistoricalData3(HistoricalData7, props.selectedCountries)
  const HistoricalTableData4 = createAccumulatedRawHistoricalData4(HistoricalData6, props.selectedCountries)
  const HistoricalTableData5 = createAccumulatedRawHistoricalData5(HistoricalData5, props.selectedCountries)
  const HistoricalTableData6 = createAccumulatedRawHistoricalData6(HistoricalData8, props.selectedCountries)
  //const HistoricalTableData7 = createAccumulatedRawHistoricalData7(HistoricalData10, props.selectedCountries)
  const HistoricalTableData8 = createAccumulatedRawHistoricalData8(HistoricalData11, props.selectedCountries)
  const HistoricalTableData9 = createAccumulatedRawHistoricalData9(HistoricalData3, props.selectedCountries)
  const HistoricalTableData10 = createAccumulatedRawHistoricalData10(HistoricalData12, props.selectedCountries)
  const HistoricalLinechartData01 = createLineChartData1(HistoricalData14, props.selectedCountries)
  const HistoricalLinechartData02 = createLineChartData2(HistoricalData4, props.selectedCountries)
  const HistoricalTableData11 = createAccumulatedRawHistoricalData11(HistoricalData9, props.selectedCountries)
  const HistoricalTableData12 = createAccumulatedRawHistoricalData12(HistoricalData15, props.selectedCountries)
  return (
    <MainArea>
        <Welcome 
          isOpen={props.scenarioSelection.showWelcome}
          closeWelcome={props.closeWelcome} 
          tab="tabRawHistory"/>
      <Flex>
      <StackedBarChartHistorical
        chartName="Production of biomass fuels"
        stackedBar={HistoricalTableData12}
        selectedCountries={props.selectedCountries}
        label="PJ"
        >
      </StackedBarChartHistorical>
      <LineChartHistorical 
        chartName="Building area "
        data={HistoricalLinechartData02}
        selectedCountries={props.selectedCountries}
        xRange={[2013, 2014, 2015, 2016, 2017, 2018, 2019]}
        addTotal={false}
        label="m<sup>2</sup>"
        >
      </LineChartHistorical>
      {/*dh_cap sb */}
      {/*dh_gen sb */}
      {/*eleccap sb */}
      <StackedBarChartHistorical
          chartName="Electricity consumption"
          stackedBar={HistoricalTableData6}
          selectedCountries={props.selectedCountries}
      ></StackedBarChartHistorical>
      <StackedBarChartHistorical
          chartName="Exchanged power with 3rd countries"
          stackedBar={HistoricalTableData11}
          selectedCountries={props.selectedCountries}
          label="GWh"
          xRange={[2015,2016,2017,2018,2019,2020]}
      ></StackedBarChartHistorical>
      <StackedBarChartHistorical
          chartName="Electricity production"
          stackedBar={HistoricalTableData1}
          selectedCountries={props.selectedCountries}
          label="GWh"
      ></StackedBarChartHistorical>
      {/*enercons-gross */}
      <StackedBarChartHistorical
          chartName="Final energy consumption in industry"
          stackedBar={HistoricalTableData3}
          selectedCountries={props.selectedCountries}
      ></StackedBarChartHistorical> 
      <StackedBarChartHistorical
          chartName="Final energy consumption in residential sector "
          stackedBar={HistoricalTableData5}
          selectedCountries={props.selectedCountries}
      ></StackedBarChartHistorical>
      <StackedBarChartHistorical
          chartName="Final energy consumption in services sector"
          stackedBar={HistoricalTableData4}
          selectedCountries={props.selectedCountries}
      ></StackedBarChartHistorical> 
      <StackedBarChartHistorical
          chartName="Final energy consumption in transport "
          stackedBar={HistoricalTableData8}
          selectedCountries={props.selectedCountries}
      ></StackedBarChartHistorical>
      <StackedBarChartHistorical
          chartName="CO<sub>2</sub> emissions"
          stackedBar={HistoricalTableData2}
          selectedCountries={props.selectedCountries}
          label="kt CO2"
      ></StackedBarChartHistorical>
      <LineChartHistorical 
        chartName="Total primary energy demand "
        data={HistoricalLinechartData01}
        selectedCountries={props.selectedCountries}
        xRange={[2013, 2014, 2015, 2016, 2017, 2018, 2019]}
        addTotal={false}
        label="PJ"
        >
      </LineChartHistorical>
      <StackedBarChartHistorical
          chartName="Number of new passenger car registrations"
          stackedBar={HistoricalTableData9}
          selectedCountries={props.selectedCountries}
          xRange={[2013, 2014, 2015, 2016, 2017, 2018, 2019]}
      ></StackedBarChartHistorical>
      <StackedBarChartHistorical
          chartName="Number of passenger cars "
          stackedBar={HistoricalTableData10}
          selectedCountries={props.selectedCountries}
          xRange={[2013, 2014, 2015, 2016, 2017, 2018, 2019]}
      ></StackedBarChartHistorical>
      </Flex>
      
    </MainArea>
  )
}
export default RawHistoricalCharts