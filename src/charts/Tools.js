import years from "./../data/years"
import historicalYears from "./../data/historicalyears"
import mapRegionToDataRegions from "./../data/mapRegionToDataRegions"
import { colorNER } from "./chartColors"

const kiloToMega = 1000;

function createAccumulatedData(data, scenario, percentage, chartName, selectedCountries) { 
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })

    //Useful when finding axis range
    let totalYearValuesPositive = {}
    let totalYearValuesNegative = {}
    let unit = "";
    years.forEach(year => {
        totalYearValuesPositive[year] = 0
        totalYearValuesNegative[year] = 0
    })
    if (!scenario) return undefined //this will be the case for sceanrio2 if only one scenario is selected
    let accumulatedData = {}
    if (scenario.includes("_copy"))
      scenario = scenario.replace("_copy", "")
    let scen = data.scenarios
    .find(o => o.scenario.toLowerCase() === scenario.toLowerCase())
    let ind = scen.indicators.find(o => o.indicator === chartName)
        unit = ind.unit
        ind.regions.forEach(r => {
            r.indicatorGroups.forEach(indicatorGroup => {
              if (!accumulatedData[indicatorGroup.indicatorGroup]) {
                accumulatedData[indicatorGroup.indicatorGroup]=[]
                years.forEach(y => {
                  accumulatedData[indicatorGroup.indicatorGroup].push({"year": y, "total": 0})
                })
              }
              if (selectedDataRegions.includes(r.region)) {//Only include selected countries
                indicatorGroup.indicatorGroupValues.forEach((value, index) => {
                  if (accumulatedData[indicatorGroup.indicatorGroup][index].year !== value.year ) {
                     //Extra check we rely on the two arrays being indexed the same way
                    console.log("Error in array indexing")
                  }
                  accumulatedData[indicatorGroup.indicatorGroup][index].total += percentage ? value.total/selectedCountries.length : value.total
                  if (value.total > 0)
                    totalYearValuesPositive[value.year] += percentage ? value.total/selectedCountries.length : value.total
                  else
                    totalYearValuesNegative[value.year] += percentage ? value.total/selectedCountries.length : value.total
                })
              }
            })
        })
        return [accumulatedData, totalYearValuesPositive, totalYearValuesNegative , unit]
}

function createAccumulatedHistoricalData1(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_eleproduction.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.nces_fuel_type.fuel_type)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.nces_fuel_type.fuel_type][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.nces_fuel_type.fuel_type][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.nces_fuel_type.fuel_type].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.nces_fuel_type.fuel_type] = []
        accumulatedHistoricalData[item.nces_fuel_type.fuel_type].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

  let fuelTypes = []
  data.data.nces_eleproduction.forEach((item)=>{
    if (fuelTypes.indexOf(item.nces_fuel_type.fuel_type) === -1)
      fuelTypes.push(item.nces_fuel_type.fuel_type)
  })
  return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}

function createAccumulatedRawHistoricalData2(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
})
let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })

  data.data.nces_ghgemission.forEach((item, i)=>{ 
    if(item.air_pol === "Greenhouse gases (CO2, N2O in CO2 equivalent, CH4 in CO2 equivalent, HFC in CO2 equivalent, PFC in CO2 equivalent, SF6 in CO2 equivalent, NF3 in CO2 equivalent)" && historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.src_crf)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.src_crf][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.src_crf][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.src_crf].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.src_crf] = []
        accumulatedHistoricalData[item.src_crf].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    } 
  })




  let sectors = []
  data.data.nces_ghgemission.forEach((item)=>{
    if (sectors.indexOf(item.src_crf) === -1)
      sectors.push(item.src_crf)
  })
  return [accumulatedHistoricalData,totalHistoricalYearValues, sectors, csv]
}

function createAccumulatedRawHistoricalData3(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_enercons_ind.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.fuel)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.fuel] = []
        accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

  let fuelTypes = []
  data.data.nces_enercons_ind.forEach((item)=>{
    if (fuelTypes.indexOf(item.fuel) === -1)
      fuelTypes.push(item.fuel)
  })
  return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}
function createAccumulatedRawHistoricalData4(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_enercons_ser.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.fuel)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.fuel] = []
        accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

  let fuelTypes = []
  data.data.nces_enercons_ser.forEach((item)=>{
    if (fuelTypes.indexOf(item.fuel) === -1)
      fuelTypes.push(item.fuel)
  })
  return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}
function createAccumulatedRawHistoricalData5(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_enercons_res.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.fuel)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.fuel] = []
        accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })
  

  let fuelTypes = []
  data.data.nces_enercons_res.forEach((item)=>{
    if (fuelTypes.indexOf(item.fuel) === -1)
      if (item.value !== 0) 
        fuelTypes.push(item.fuel)
  })
  return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}

function createAccumulatedRawHistoricalData6(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_eleccons.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.sector)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.sector][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.sector][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.sector].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.sector] = []
        accumulatedHistoricalData[item.sector].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

let sectors = []
data.data.nces_eleccons.forEach((item)=>{
  if (sectors.indexOf(item.sector) === -1)
    sectors.push(item.sector)
})
return [accumulatedHistoricalData,totalHistoricalYearValues, sectors, csv]
}

function createAccumulatedRawHistoricalData7(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_elecprod.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.fuel)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.fuel] = []
        accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

let fuelTypes = []
data.data.nces_elecprod.forEach((item)=>{
  if (fuelTypes.indexOf(item.fuel) === -1)
  fuelTypes.push(item.fuel)
})
console.log("accumulatedHistoricalData", accumulatedHistoricalData)
return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}

function createAccumulatedRawHistoricalData8(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_enercons_trans.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.fuel)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.fuel] = []
        accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

let fuelTypes = []
data.data.nces_enercons_trans.forEach((item)=>{
  if (fuelTypes.indexOf(item.fuel) === -1)
  fuelTypes.push(item.fuel)
})
console.log("accumulatedHistoricalData", accumulatedHistoricalData)
return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}

function createAccumulatedRawHistoricalData9(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  const histYears = [2013, 2014, 2015, 2016, 2017, 2018]
  histYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })
    console.log("data.data: ", data.data)
  data.data.nces_vehiclenumber.forEach((item, i)=>{ 
    if(histYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.car_type)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.car_type][histYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.car_type][histYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.car_type].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.car_type] = []
        accumulatedHistoricalData[item.car_type].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

let carTypes = []
data.data.nces_vehiclenumber.forEach((item)=>{
  if (carTypes.indexOf(item.car_type) === -1)
  carTypes.push(item.car_type)
})
console.log("accumulatedHistoricalData", accumulatedHistoricalData)
console.log("fueltypes: ", carTypes)
return [accumulatedHistoricalData,totalHistoricalYearValues, carTypes, csv]
}

function createAccumulatedRawHistoricalData10(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  const histYears = [2013, 2014, 2015, 2016, 2017, 2018]
  histYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })
    console.log("data.data10: ", data.data)
  data.data.nces_vehiclenumber_stock.forEach((item, i)=>{ 
    if(histYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      
      if(Object.keys(accumulatedHistoricalData).includes(item.car_model)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.car_model][histYears.indexOf(item.year)]) {
          //console.log("new year: ", item)
          accumulatedHistoricalData[item.car_model][histYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value

        } else {
          //console.log("accum: ", item)
          accumulatedHistoricalData[item.car_model].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        //console.log("new car_type: ", item)
        //console.log("accum: ", accumulatedHistoricalData)
        accumulatedHistoricalData[item.car_model] = []
        accumulatedHistoricalData[item.car_model].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

let carTypes = []
data.data.nces_vehiclenumber_stock.forEach((item)=>{
  if (carTypes.indexOf(item.car_model) === -1)
  carTypes.push(item.car_model)
})
console.log("accumulatedHistoricalData", accumulatedHistoricalData)
console.log("fueltypes: ", carTypes)
return [accumulatedHistoricalData,totalHistoricalYearValues, carTypes, csv]
}
function createAccumulatedRawHistoricalData11(data, selectedCountries) {
  let accumulatedHistoricalDataPositive = {}
  let accumulatedHistoricalDataNegative = {}
  let totalHistoricalYearValuesPositive = {}
  let totalHistoricalYearValuesNegative = {}
  let csv =[]
  const histYears = [2015, 2016, 2017, 2018, 2019, 2020]
  histYears.forEach(year => {
    totalHistoricalYearValuesPositive[year] = 0
    totalHistoricalYearValuesNegative[year + 'n'] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })
    console.log("data.data11: ", data.data)
  data.data.nces_elecexchange_3rd_country.forEach((item, i)=>{ 
    if(histYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(item.exchange_type ==="import") {
        if(Object.keys(accumulatedHistoricalDataPositive).includes(item.country_3rd + " import")) {
          //checks if a value is already there, and then accumulate
          if (accumulatedHistoricalDataPositive[item.country_3rd + " import"][histYears.indexOf(item.year)]) {
            //console.log("new year: ", item)
            accumulatedHistoricalDataPositive[item.country_3rd + " import"][histYears.indexOf(item.year)].total += item.value
            totalHistoricalYearValuesPositive[item.year] += item.value
  
          } else {
            //console.log("accum: ", item)
            accumulatedHistoricalDataPositive[item.country_3rd + " import"].push({"year": item.year, "total": item.value})
            totalHistoricalYearValuesPositive[item.year] += item.value
          }
        } else {
          //console.log("new car_type: ", item)
          //console.log("accum: ", accumulatedHistoricalData)
          accumulatedHistoricalDataPositive[item.country_3rd + " import"] = []
          accumulatedHistoricalDataPositive[item.country_3rd + " import"].push({"year": item.year, "total": item.value})
          totalHistoricalYearValuesPositive[item.year] += item.value
        }
      }
      else {
        if(Object.keys(accumulatedHistoricalDataNegative).includes(item.country_3rd + " export")) {
          //checks if a value is already there, and then accumulate
          if (accumulatedHistoricalDataNegative[item.country_3rd + " export"][histYears.indexOf(item.year)]) {
            //console.log("new year: ", item)
            accumulatedHistoricalDataNegative[item.country_3rd + " export"][histYears.indexOf(item.year)].total -= item.value
            totalHistoricalYearValuesNegative[item.year + 'n'] -= item.value
  
          } else {
            //console.log("accum: ", item)
            accumulatedHistoricalDataNegative[item.country_3rd + " export"].push({"year": item.year, "total": -item.value})
            totalHistoricalYearValuesNegative[item.year + 'n'] -= item.value
          }
        } else {
          //console.log("new car_type: ", item)
          //console.log("accum: ", accumulatedHistoricalData)
          accumulatedHistoricalDataNegative[item.country_3rd + " export"] = []
          accumulatedHistoricalDataNegative[item.country_3rd + " export"].push({"year": item.year, "total": -item.value})
          totalHistoricalYearValuesNegative[item.year + 'n'] -= item.value
        }
      }
      
    }
  })

let carTypes = []
console.log("keys: ", Object.keys(accumulatedHistoricalDataPositive).concat(Object.keys(accumulatedHistoricalDataNegative)) )
/* Object.keys(accumulatedHistoricalDataPositive).forEach((key) => {
  carTypes.push()
}) */

/* data.data.nces_elecexchange_3rd_country.forEach((item)=>{
  if (carTypes.indexOf(item.country_3rd + " import") === -1) {
    carTypes.push(item.country_3rd + " import")
    carTypes.push(item.country_3rd + " export")
  }
}) */

console.log("accumulatedHistoricalData", accumulatedHistoricalDataPositive)
console.log("accumulatedHistoricalData", accumulatedHistoricalDataNegative)
console.log("fueltypes: ", carTypes)
return [
  {...accumulatedHistoricalDataPositive, ...accumulatedHistoricalDataNegative},
  {...totalHistoricalYearValuesPositive, ...totalHistoricalYearValuesNegative}, 
  Object.keys(accumulatedHistoricalDataPositive).concat(Object.keys(accumulatedHistoricalDataNegative)), 
  csv]
}

function createAccumulatedRawHistoricalData12(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  let csv =[]
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
    mapRegionToDataRegions.forEach((mapRegion) => {
        if(selectedCountries.includes(mapRegion.path_id)) {
        mapRegion.historical_data_regions.forEach((dataRegion) => {
          selectedDataRegions.push(dataRegion)
        })
      }
    })

  data.data.nces_biofuels_prod.forEach((item, i)=>{ 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      if(Object.keys(accumulatedHistoricalData).includes(item.fuel)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[item.fuel][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[item.fuel] = []
        accumulatedHistoricalData[item.fuel].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })

let fuelTypes = []
data.data.nces_biofuels_prod.forEach((item)=>{
  if (fuelTypes.indexOf(item.fuel) === -1)
  fuelTypes.push(item.fuel)
})
console.log("accumulatedHistoricalData", accumulatedHistoricalData)
return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes, csv]
}

function createAccumulatedHistoricalData2(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  historicalYears.forEach(year => {
    totalHistoricalYearValues[year] = 0
  })
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
    if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const fuel_source_filter = [
    {"Fossil fuels" : ["Coal", "Natural gas", "Oil", "Oil shale/oil sand", "Peat and peat products"]},
    {"Renewables": ["Biofuels", "Geothermal", "Solar thermal", "Tide, wave, ocean"]},
    {"Derived heat": ["Ambient heat (heat pumps)", "Heat" ]},
    {"Power": ["Electricity", "Hydroelectricity", "Solar photovoltaic", "Wind electricity", "Nuclear fuels" ]},
    {"Waste": ["Non-renewable waste", "Renewable waste" ]}
  ]

  let fuelTypes = []
  fuel_source_filter.forEach((source)=>{
    fuelTypes.push(Object.keys(source)[0])
  }) 

  data.data.nces_enercons_ind.forEach((item, i)=>{ 
    let source 
    if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
      source = fuel_source_filter.filter((source) => {
        return Object.entries(source)[0][1].includes(item.fuel)
      })
      source = Object.keys(source[0])[0]
      if(Object.keys(accumulatedHistoricalData).includes(source)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[source][historicalYears.indexOf(item.year)]) {
          accumulatedHistoricalData[source][historicalYears.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[source].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[source] = []
        accumulatedHistoricalData[source].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })
return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes]
}

function createAccumulatedHistoricalData3(data, selectedCountries) {
  let accumulatedHistoricalData = {}
  let totalHistoricalYearValues = {}
  const used_years = [2019]
  totalHistoricalYearValues[2019] = 0
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
    if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const fuel_source_filter = [
    {"Fossil fuels" : ["Coal", "Natural gas", "Oil", "Oil shale/oil sand", "Peat and peat products"]},
    {"Renewables": ["Biofuels", "Geothermal", "Solar thermal", "Tide, wave, ocean"]},
    {"Derived heat": ["Ambient heat", "Heat" ]},
    {"Power": ["Electricity", "Hydroelectricity", "Solar photovoltaic", "Wind electricity", "Nuclear fuels" ]},
    {"Waste": ["Non-renewable waste", "Renewable waste" ]},
    {"Other": ["Other"]}
  ]

  let fuelTypes = []
  fuel_source_filter.forEach((source)=>{
    fuelTypes.push(Object.keys(source)[0])
  }) 

  data.data.nces_dh_gen.forEach((item, i)=>{ 
    let source 
    if(selectedDataRegions.includes(item.nces_country.name)) {
      source = fuel_source_filter.filter((source) => {
        return Object.entries(source)[0][1].includes(item.fuel)
      })
      source = Object.keys(source[0])[0]
      if(Object.keys(accumulatedHistoricalData).includes(source)) {
        //checks if a value is already there, and then accumulate
        if (accumulatedHistoricalData[source][used_years.indexOf(item.year)]) {
          accumulatedHistoricalData[source][used_years.indexOf(item.year)].total += item.value
          totalHistoricalYearValues[item.year] += item.value
        } else {
          accumulatedHistoricalData[source].push({"year": item.year, "total": item.value})
          totalHistoricalYearValues[item.year] += item.value
        }
      } else {
        accumulatedHistoricalData[source] = []
        accumulatedHistoricalData[source].push({"year": item.year, "total": item.value})
        totalHistoricalYearValues[item.year] += item.value
      }
    }
  })
return [accumulatedHistoricalData,totalHistoricalYearValues, fuelTypes]
}



const fixedcolorCountries = [ 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland']
const countryColors = () => {
  let ret = colorNER.slice(0, 4)
  fixedcolorCountries.forEach((country, index)=>{
    ret[country] = colorNER[index]
  })
  return ret
}
//Share of RE in electricity consumption (theme: Transforming the power sector) 
const createIndicator1Data = (rawData, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland','Iceland']
  let re = []
  let totalPerCountry = []
  let reAll = []
  let totalAll = []
  countries.forEach((country)=>{
    re[country] = []
    totalPerCountry[country] = []
    historicalYears.forEach((year) =>{
      re[country][year-historicalYears[0]]=0
      totalPerCountry[country][year-historicalYears[0]]=0
      reAll[year-historicalYears[0]] = 0
      totalAll[year-historicalYears[0]] = 0
    })
  })
  
  
  const filter_fuel = [
    "Biofuels",
    "Geothermal",
    "Hydroelectricity", 
    "Solar photovoltaic", 
    "Solar thermal", 
    "Tide, wave, ocean", 
    "Wind electricity"]
  rawData.data.nces_eleproduction.forEach((item) => {
    if (selectedDataRegions.includes(item.nces_country.name)) {
      if (filter_fuel.includes(item.nces_fuel_type.fuel_type)) {
        re[item.nces_country.name][item.year-historicalYears[0]] += item.value
        reAll[item.year-historicalYears[0]] += item.value
      }
      totalPerCountry[item.nces_country.name][item.year-historicalYears[0]] += item.value
      totalAll[item.year-historicalYears[0]] += item.value
    }
  })
  
  let ret = []
  ret['total'] = []
  for(let country in selectedDataRegions) {
    ret[selectedDataRegions[country]] = []
    re[selectedDataRegions[country]].forEach((value, index)=>{
      ret[selectedDataRegions[country]][index] = { "x": index + 1990, "y": value/totalPerCountry[selectedDataRegions[country]][index] }
    })
  }
  reAll.forEach((value,index)=>{
    ret["total"][index] = {"x": index + 1990, "y": value/totalAll[index]}
  })
  return ret
}

//CO2 emissions (Mt CO2) from power and district heating  
const createIndicator2Data = (rawData, selectedCountries) => {
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland', 'Iceland']
  let selectedDataRegions = []
  
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    } 
  })
  let re = []
  let total = []
  
  countries.forEach((country)=>{
    if (selectedDataRegions.includes(country)) {
      re[country] = []
      total[country] = []
      historicalYears.forEach((year) =>{
        re[country][year-historicalYears[0]]=0
        total[year-historicalYears[0]]=0
      })
    }
  })
  const filter_src_crf = [
    "Fuel combustion in public electricity and heat production"
  ]
  const filter_airpol = [
    "Greenhouse gases (CO2, N2O in CO2 equivalent, CH4 in CO2 equivalent, HFC in CO2 equivalent, PFC in CO2 equivalent, SF6 in CO2 equivalent, NF3 in CO2 equivalent)",
    "Carbon dioxide"
  ]
  let ret = {}
  let countryLegends = []
  rawData.data.nces_ghgemission.forEach((item) => {
    if (filter_src_crf.includes(item.src_crf) && filter_airpol.includes(item.air_pol)) {
      if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
        if(Object.keys(ret).includes(item.nces_country.name)) {
          if(ret[item.nces_country.name][historicalYears.indexOf(item.year)]) {
            ret[item.nces_country.name][historicalYears.indexOf(item.year)].total += isNaN(item.value) ? 0 : item.value/kiloToMega
          } else {
            ret[item.nces_country.name].push({"year": item.year, "total": isNaN(item.value) ? 0 : item.value/kiloToMega})
          }
        } else {
          ret[item.nces_country.name] = []
          ret[item.nces_country.name].push({"year": item.year, total: isNaN(item.value) ? 0 : item.value/kiloToMega})
        }
        
      total[item.year-historicalYears[0]] += isNaN(item.value) ? 0 : item.value/kiloToMega
      if (countryLegends.indexOf(item.nces_country.name) === -1) {
        countryLegends.push(item.nces_country.name)
      }
        
      }
    }
  })
  return [ret, total, selectedDataRegions, countryColors(selectedDataRegions)]
} 

//6. CO2 emissions (Mt CO2) from the industrial sector (Decarbonisation of industry)  
const createIndicator6Data = (rawData, selectedCountries) => {
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland', 'Iceland']
  let selectedDataRegions = []
  
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    } 
  })
  let re = []
  let total = []
  
  countries.forEach((country)=>{
    if (selectedDataRegions.includes(country)) {
      re[country] = []
      total[country] = []
      historicalYears.forEach((year) =>{
        re[country][year-historicalYears[0]]=0
        total[year-historicalYears[0]]=0
      })
    }
  })
  const filter_src_crf = [
    "Industrial processes and product use",
    "Other product manufacture and use",
    "Other industrial process and product use",
  ]
  const filter_airpol = [
    "Greenhouse gases (CO2, N2O in CO2 equivalent, CH4 in CO2 equivalent, HFC in CO2 equivalent, PFC in CO2 equivalent, SF6 in CO2 equivalent, NF3 in CO2 equivalent)",
    "Carbon dioxide"
  ]
  let ret = {}
  let countryLegends = []
  rawData.data.nces_ghgemission.forEach((item, i) => {
    if (filter_src_crf.includes(item.src_crf) && filter_airpol.includes(item.air_pol)) {
      if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
        if(Object.keys(ret).includes(item.nces_country.name)) {
          if(ret[item.nces_country.name][historicalYears.indexOf(item.year)]) {
            ret[item.nces_country.name][historicalYears.indexOf(item.year)].total += isNaN(item.value) ? 0 : item.value/kiloToMega
          } else {
            ret[item.nces_country.name].push({"year": item.year, "total": isNaN(item.value) ? 0 : item.value/kiloToMega})
          }
        } else {
          ret[item.nces_country.name] = []
          ret[item.nces_country.name].push({"year": item.year, total: isNaN(item.value) ? 0 : item.value/kiloToMega})
        }
      
      total[item.year-historicalYears[0]] += isNaN(item.value) ? 0 : item.value/kiloToMega
      if (countryLegends.indexOf(item.nces_country.name) === -1) {
        countryLegends.push(item.nces_country.name)
      }
        
      }
    }
  })
  return [ret, total, selectedDataRegions, countryColors(selectedDataRegions)]
} 

//9. CO2 emissions (Mt CO2) from road transport (Green mobility)
const createIndicator9Data = (rawData, selectedCountries) => {
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland', 'Iceland']
  let selectedDataRegions = []
  
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    } 
  })
  let re = []
  let total = []
  
  countries.forEach((country)=>{
    if (selectedDataRegions.includes(country)) {
      re[country] = []
      total[country] = []
      historicalYears.forEach((year) =>{
        re[country][year-historicalYears[0]]=0
        total[year-historicalYears[0]]=0
      })
    }
  })
  const filter_src_crf = [
    "Fuel combustion in road transport",
  ]
  const filter_airpol = [
    "Greenhouse gases (CO2, N2O in CO2 equivalent, CH4 in CO2 equivalent, HFC in CO2 equivalent, PFC in CO2 equivalent, SF6 in CO2 equivalent, NF3 in CO2 equivalent)",
    "Carbon dioxide"
  ]
  
  let ret = {}
  let countryLegends = []
  rawData.data.nces_ghgemission.forEach((item, i) => {
    if (filter_src_crf.includes(item.src_crf) && filter_airpol.includes(item.air_pol)) {
      if(historicalYears.includes(item.year) && selectedDataRegions.includes(item.nces_country.name)) {
        if(Object.keys(ret).includes(item.nces_country.name)) {
          if(ret[item.nces_country.name][historicalYears.indexOf(item.year)]) {
            ret[item.nces_country.name][historicalYears.indexOf(item.year)].total += isNaN(item.value) ? 0 : item.value/kiloToMega
          } else {
            ret[item.nces_country.name].push({"year": item.year, "total": isNaN(item.value) ? 0 : item.value/kiloToMega})
          }
        } else {
          ret[item.nces_country.name] = []
          ret[item.nces_country.name].push({"year": item.year, total: isNaN(item.value) ? 0 : item.value/kiloToMega})
        }
        
      total[item.year-historicalYears[0]] += isNaN(item.value) ? 0 : item.value/kiloToMega
      if (countryLegends.indexOf(item.nces_country.name) === -1) {
        countryLegends.push(item.nces_country.name)
      }
        
      }
    }
  })
  return [ret, total, selectedDataRegions, countryColors(selectedDataRegions)]
} 
const createIndicator3Data = (enercons_res, enercons_ser, enercons_ind, elecprod, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland','Iceland']
  const used_years = [2013, 2014, 2015, 2016, 2017, 2018]
  
  let cumulativeElecprodBiofuel = []
  let cumulativeElecprodRenewable = []
  let cumulativeEnerconsBiofuel = []
  let cumulativeEnerconsRenewable = []
  let cumulativeEnerconsIndBiofuel = []
  let cumulativeEnerconsIndRenewable = []
  used_years.forEach((year)=>{
    cumulativeElecprodBiofuel[year-used_years[0]] = 0
    cumulativeElecprodRenewable[year-used_years[0]] = 0
    cumulativeEnerconsBiofuel[year-used_years[0]] = 0
    cumulativeEnerconsRenewable[year-used_years[0]] = 0
    cumulativeEnerconsIndBiofuel[year-used_years[0]] = 0
    cumulativeEnerconsIndRenewable[year-used_years[0]] = 0
  })
  const filter_biofuels = ["Biofuels"]
  const filter_renewable_electricity = [
    "Biofuels", 
    "Geothermal", 
    "Hydroelectricity", 
    "Solar photovoltaic", 
    "Solar thermal", 
    "Tide, wave, ocean",
    "Wind electricity",
    "Renewable waste",
  ]
  const filter_renewable_industry = [
    "Biofuels", 
    "Geothermal", 
    "Solar thermal", 
    "Renewable waste",
    "Ambient heat (heat pumps)"
  ]
  
  elecprod.data.nces_eleproduction.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
        if(filter_biofuels.includes(item.nces_fuel_type.fuel_type)){
          cumulativeElecprodBiofuel[item.year-used_years[0]] += item.value
        }
        if(filter_renewable_electricity.includes(item.nces_fuel_type.fuel_type)) {
          cumulativeElecprodRenewable[item.year-used_years[0]] += item.value  
        }
      }
    }
  })
  enercons_res.data.nces_enercons_res.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
        if(filter_biofuels.includes(item.fuel)){
          cumulativeEnerconsBiofuel[item.year-used_years[0]] += item.value
        }
        if(filter_renewable_industry.includes(item.fuel)) {
          cumulativeEnerconsRenewable[item.year-used_years[0]] += item.value  
        }
      }
    }
  })
  enercons_ser.data.nces_enercons_ser.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
        if(filter_biofuels.includes(item.fuel)){
          cumulativeEnerconsBiofuel[item.year-used_years[0]] += item.value
        }
        if(filter_renewable_industry.includes(item.fuel)) {
          cumulativeEnerconsRenewable[item.year-used_years[0]] += item.value  
        }
      }
    }
  })
  enercons_ind.data.nces_enercons_ind.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
        if(filter_biofuels.includes(item.fuel)){
          cumulativeEnerconsBiofuel[item.year-used_years[0]] += item.value
          cumulativeEnerconsIndBiofuel[item.year-used_years[0]] += item.value
        }
        if(filter_renewable_industry.includes(item.fuel)) {
          cumulativeEnerconsRenewable[item.year-used_years[0]] += item.value  
          cumulativeEnerconsIndRenewable[item.year-used_years[0]] += item.value
        }
      }
    }
  })

  let ret = []
  ret['Electricity'] = []
  used_years.forEach((year)=>{
    ret['Electricity'][year - used_years[0]] = { 
      "x": year, 
      "y": cumulativeElecprodBiofuel[year - used_years[0]]/cumulativeElecprodRenewable[year-used_years[0]]
    }
  })
  ret['Heating and industry'] = []
  used_years.forEach((year)=>{
    ret['Heating and industry'][year - used_years[0]] = { 
      "x": year, 
      "y": cumulativeEnerconsBiofuel[year - used_years[0]]/cumulativeEnerconsRenewable[year-used_years[0]]
    }
  })
  ret['Transport'] = []
  used_years.forEach((year)=>{
    ret['Transport'][year - used_years[0]] = { 
      "x": year, 
      "y": cumulativeEnerconsIndBiofuel[year - used_years[0]]/cumulativeEnerconsIndRenewable[year-used_years[0]]
    }
  })
  return ret
}
//Battery and plug-in hybrid electric vehicles share of new passenger vehicle sales (Electrification of transport)
const createIndicator4Data = (rawData, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland','Iceland']
  const car_years = [2013, 2014, 2015, 2016, 2017, 2018, 2019]
  let re = []
  let totalPerCountry = []
  let reAll = []
  let totalAll = []
  countries.forEach((country)=>{
    re[country] = []
    totalPerCountry[country] = []
    car_years.forEach((year) =>{
      re[country][year-car_years[0]]=0
      totalPerCountry[country][year-car_years[0]]=0
      reAll[year-car_years[0]] = 0
      totalAll[year-car_years[0]] = 0
    })
  })
  
  const filter_cartype = [
    "BEV",
    "PHEV",
    ]
  rawData.data.nces_vehiclenumber.forEach((item) => {
    if (selectedDataRegions.includes(item.nces_country.name)) {
      if (filter_cartype.includes(item.car_type)) {
        re[item.nces_country.name][item.year-car_years[0]] += item.value
        reAll[item.year-car_years[0]] += item.value
      } else {
        totalPerCountry[item.nces_country.name][item.year-car_years[0]] += item.value
        totalAll[item.year-car_years[0]] += item.value
      }
    }
  })
  
  let ret = []
  ret['total'] = []
  
  for(let country in selectedDataRegions) {
    ret[selectedDataRegions[country]] = []
    re[selectedDataRegions[country]].forEach((value, index)=>{
      ret[selectedDataRegions[country]][index] = { "x": index + 2013, "y": value/totalPerCountry[selectedDataRegions[country]][index] }
    })
  }
  reAll.forEach((value,index)=>{
    ret["total"][index] = {"x": index + 2013, "y": value/totalAll[index]}
  })
  return ret
}
const createIndicator8Data = (buildingData, enerconResData, enerconSerData, ghgData, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland']
  const used_years = [2013, 2014, 2015, 2016, 2017, 2018]

  
  let cumulativeEnergy = []
  let cumulativeEmission = []
  let totalBuildingArea = []
  used_years.forEach((year)=>{
    cumulativeEnergy[year-used_years[0]] = 0
    cumulativeEmission[year-used_years[0]] = 0
    totalBuildingArea[year-used_years[0]] = 0
  })
  

  enerconResData.data.nces_enercons_res.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
          cumulativeEnergy[item.year - used_years[0]] += item.value 
      }
    }
  })
  enerconSerData.data.nces_enercons_ser.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
          cumulativeEnergy[item.year - used_years[0]] += item.value 
      }
    }
  })
  buildingData.data.nces_building_area.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
        totalBuildingArea[item.year - used_years[0]] += item.value 
      }
    }
  })

  ghgData.data.nces_ghgemission.forEach((item)=>{
    if (selectedDataRegions.includes(item.nces_country.name) && countries.includes(item.nces_country.name)) {
      if (used_years.includes(item.year)) {
        
        const SRC_CRF_FILTER = ["Fuel combustion in public electricity and heat production"]
        if (SRC_CRF_FILTER.includes(item.src_crf))
          cumulativeEmission[item.year - used_years[0]] += item.value
      }
    }
  })
  let ret = [] 
  const PJ_to_kWh = 277777777.7777778
  const kTons_to_kg = 1000*1000//thousand tonnes
  
  ret['energy'] = []
  used_years.forEach((year)=>{
    ret['energy'][year - used_years[0]] = { 
      "x": year, 
      "y": cumulativeEnergy[year - used_years[0]]*PJ_to_kWh/totalBuildingArea[year - used_years[0]]
    }
  })
  ret['emission'] = []
  used_years.forEach((year)=>{
    ret['emission'][year - used_years[0]] = { 
      "x": year, 
      "y": cumulativeEmission[year - used_years[0]]*kTons_to_kg/totalBuildingArea[year - used_years[0]]
    }
  })
  return ret
}

//Share of RE in electricity consumption (theme: Transforming the power sector) 
const createIndicator7Data = (rawData, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland','Iceland']
  let re = []
  let totalPerCountry = []
  let reAll = []
  let totalAll = []
  countries.forEach((country)=>{
    re[country] = []
    totalPerCountry[country] = []
    historicalYears.forEach((year) =>{
      re[country][year-historicalYears[0]]=0
      totalPerCountry[country][year-historicalYears[0]]=0
      reAll[year-historicalYears[0]] = 0
      totalAll[year-historicalYears[0]] = 0
    })
  })
  
  
  const filter_fuel = [
    "Biofuels",
    "Geothermal",
    "Hydroelectricity", 
    "Solar photovoltaic", 
    "Solar thermal", 
    "Tide, wave, ocean", 
    "Wind electricity"]
  rawData.data.nces_enercons_ind.forEach((item) => {
    if (selectedDataRegions.includes(item.nces_country.name)) {
      if (filter_fuel.includes(item.fuel)) {
        re[item.nces_country.name][item.year-historicalYears[0]] += item.value
        reAll[item.year-historicalYears[0]] += item.value
      }
      totalPerCountry[item.nces_country.name][item.year-historicalYears[0]] += item.value
      totalAll[item.year-historicalYears[0]] += item.value
    }
  })
  
  let ret = []
  ret['total'] = []
  for(let country in selectedDataRegions) {
    ret[selectedDataRegions[country]] = []
    re[selectedDataRegions[country]].forEach((value, index)=>{
      ret[selectedDataRegions[country]][index] = { "x": index + 1990, "y": value/totalPerCountry[selectedDataRegions[country]][index] }
    })
  }
  reAll.forEach((value,index)=>{
    ret["total"][index] = {"x": index + 1990, "y": value/totalAll[index]}
  })
  return ret
}

const createLineChartData1 = (rawData, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland','Iceland']
  const car_years = [2013, 2014, 2015, 2016, 2017, 2018, 2019]
  let re = []
  countries.forEach((country)=>{
    re[country] = []
    car_years.forEach((year) =>{
      re[country][year-car_years[0]]=0
    })
  })
  rawData.data.nces_primencons.forEach((item) => {
    if (selectedDataRegions.includes(item.nces_country.name)) {
      re[item.nces_country.name][item.year-car_years[0]] += item.value
    }
  })
  
  let ret = []
  
  for(let country in selectedDataRegions) {
    ret[selectedDataRegions[country]] = []
    re[selectedDataRegions[country]].forEach((value, index)=>{
      ret[selectedDataRegions[country]][index] = { "x": index + 2013, "y": value, country: selectedDataRegions[country] }
    })
  }
  return ret
}
const createLineChartData2 = (rawData, selectedCountries) => {
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.path_id)) {
      mapRegion.historical_data_regions.forEach((dataRegion) => {
        selectedDataRegions.push(dataRegion)
      })
    }
  })
  const countries = ['Denmark', 'Sweden', 'Norway', 'Finland','Iceland']
  const car_years = [2013, 2014, 2015, 2016, 2017, 2018, 2019]
  let re = []
  countries.forEach((country)=>{
    re[country] = []
    car_years.forEach((year) =>{
      re[country][year-car_years[0]]=0
    })
  })
  rawData.data.nces_building_area.forEach((item) => {
    if (selectedDataRegions.includes(item.nces_country.name)) {
      re[item.nces_country.name][item.year-car_years[0]] += item.value
    }
  })
  
  let ret = []
  
  for(let country in selectedDataRegions) {
    ret[selectedDataRegions[country]] = []
    re[selectedDataRegions[country]].forEach((value, index)=>{
      ret[selectedDataRegions[country]][index] = { "x": index + 2013, "y": value, country: selectedDataRegions[country] }
    })
  }
  return ret
}

export { 
  createAccumulatedData, 
  createAccumulatedHistoricalData1,
  createAccumulatedHistoricalData2, 
  createAccumulatedHistoricalData3,
  createIndicator1Data, 
  createIndicator2Data,
  createIndicator3Data,
  createIndicator4Data, 
  createIndicator6Data,
  createIndicator7Data,
  createIndicator8Data,
  createIndicator9Data,
  createAccumulatedRawHistoricalData2,
  createAccumulatedRawHistoricalData3,
  createAccumulatedRawHistoricalData4,
  createAccumulatedRawHistoricalData5,
  createAccumulatedRawHistoricalData6,
  createAccumulatedRawHistoricalData7,
  createAccumulatedRawHistoricalData8,
  createAccumulatedRawHistoricalData9,
  createAccumulatedRawHistoricalData10,
  createLineChartData1,
  createLineChartData2,
  createAccumulatedRawHistoricalData11,
  createAccumulatedRawHistoricalData12,
}