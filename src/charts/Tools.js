import years from "./../data/years"
import mapRegionToDataRegions from "./../data/mapRegionToDataRegions"
import legendNames from '../translations/legends'
import i18next from "i18next"

function createAccumulatedData(data, scenario, percentage, chartName, selectedCountries, unitFactor) { 
  let selectedDataRegions = [] 
  mapRegionToDataRegions.forEach((mapRegion) => {
      if(selectedCountries.includes(mapRegion.country)) {
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
    let scen = data[scenario]
    let ind = scen.charts[chartName]
    if (!ind) return [accumulatedData, totalYearValuesPositive, totalYearValuesNegative , unit]
        unit = ind.unit
        Object.entries(ind).forEach(region => {
            Object.entries(region[1]).forEach(legend => {
              if (!legendNames[legend[0]] ) {
                return [null, null, null, null]
              }
              if (!accumulatedData[legendNames[legend[0]]['name_' + i18next.language]]) {
                accumulatedData[legendNames[legend[0]]['name_' + i18next.language]]=[]
                years.forEach(y => {
                  accumulatedData[legendNames[legend[0]]['name_' + i18next.language]].push({"year": y, "total": 0})
                })
              }
              if (selectedDataRegions.includes(region[0])) {//Only include selected countries
                legend[1].forEach((value, index) => {
                  if (accumulatedData[legendNames[legend[0]]['name_' + i18next.language]][index].year !== value.year ) {
                     //Extra check we rely on the two arrays being indexed the same way
                    console.log("Error in array indexing")
                  }
                  accumulatedData[legendNames[legend[0]]['name_' + i18next.language]][index].total += percentage ? value.total/selectedCountries.length : value.total * unitFactor
                  if (value.total > 0)
                    totalYearValuesPositive[value.year] += percentage ? value.total/selectedCountries.length : value.total * unitFactor
                  else
                    totalYearValuesNegative[value.year] += percentage ? value.total/selectedCountries.length : value.total * unitFactor
                })
              }
            })
        })
        return [accumulatedData, totalYearValuesPositive, totalYearValuesNegative , unit]
}

export { 
  createAccumulatedData
}