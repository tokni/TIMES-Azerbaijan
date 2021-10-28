import React, {useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ReactComponent as Regions } from './map_az.svg'
import mapRegionToDataRegions from "../data/mapRegionToDataRegions"

const activeCountries = ['AZ1', 'AZ2', 'AZ3']

const countryColorsCSS = props =>
  {
    console.log("css props: ", props)

    let ret = []
    props.countries.forEach(
      country => {
        let foundRegion = mapRegionToDataRegions.find(region => region.country === country)
        foundRegion.path_ids.forEach(district =>
          {
            console.log("ccs country: ", country)
            console.log("ccs district: ", district)
            console.log("ccs props.selectedCountries: ", props.selectedCountries)
            console.log("props.selectedCountries.includes(country): ", props.selectedCountries.includes(country))
            props.selectedCountries.includes(country)
            ret.push(`
            #${district} {
              fill:  ${props.selectedCountries.includes(country) ? foundRegion.color : '#aaa'};
              :hover {fill: #adcff1;}
          
            }
          `)}
        )
      }

    )
    console.log("----- ccs ret -----  ", ret)
    return(ret)
  }

 const StyledRegions = styled.div`
  ${props => countryColorsCSS(props)}
  fill: #616161;
  stroke: gray;
  stroke-width: 10;
  stroke-miterlimit: 22.9256;
  position: relative;
`
const CountryName = styled.div`
  display: none;
  ${StyledRegions}:hover & {
    display: contents;
  }
  font-size: ${props => props.narrowVersion ? '10px' :'20px'};
  color: #666666;
`
const CountryNameContainer = styled.div`
  position: absolute;
  bottom: ${props => props.narrowVersion ? '5px' :'20px'};
  left: ${props => props.narrowVersion ? '5px' :'20px'};
`
const MapContainer = (props) => {
  const [hoverCountry, setHoverCountry] = useState(null) 
  console.log("--selected countries: ", props.selectedCountries)
  console.log("hoverCountry: ", hoverCountry)
  return(
  <StyledRegions selectedCountries={props.selectedCountries} countries={activeCountries}>
    <Regions
      onClick={event => {
        const id = event.target.id
        console.log("clicked id: ", id)
        let country
        
        if (id) {
          country = mapRegionToDataRegions.find((region)=>region.path_ids.includes(event.target.id))?.country
          if (activeCountries.includes(country)) {
            event.preventDefault()
            console.log("clicked id in active: ", id)
          
            console.log("clicked country: ", country)
            props.selectCountry(country)
          }
          
        }
      }}
      onMouseOver={(e) => {
        let country
        if (e.target.id) {
          console.log("target.id: ", e.target.id)
          country = mapRegionToDataRegions.find((region)=>region.path_ids.includes(e.target.id))?.country
        }
        
          
        setHoverCountry(country)
      }}
    />
    <CountryNameContainer narrowVersion={props.narrowVersion}>
      
      <CountryName narrowVersion={props.narrowVersion}>{hoverCountry}</CountryName>
    </CountryNameContainer>
  </StyledRegions>
)}

MapContainer.propTypes = {
    selectedCountries: PropTypes.array.isRequired,
    selectCountry: PropTypes.func.isRequired
};
  
export default MapContainer;