import React, {useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ReactComponent as Regions } from './regions.svg'
import mapRegionToDataRegions from "../data/mapRegionToDataRegions"

const activeCountries = ['dk', 'no', 'se', 'fi', 'is']

const countryColorsCSS = props =>
  props.countries.map(
    country => `
    #${country} {
      fill:  ${props.selectedCountries.includes(country) ? '#006eb6' : '#aaa'};
      :hover {fill: #adcff1;}
      
    }
    `
)

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

  return(
  <StyledRegions selectedCountries={props.selectedCountries} countries={activeCountries}> 
    <Regions
      onClick={event => {
        const id = event.target.id
        if (id && activeCountries.includes(id)) {
          event.preventDefault()
          props.selectCountry(id)
        }
      }}
      onMouseOver={(e) => {
        let country
        if (e.target.id)
        country = mapRegionToDataRegions.find((region)=>region.path_id === e.target.id).country
          
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