import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Octicon from "react-octicon";
import {createBreakpoint} from 'styled-components-breakpoint';

export const breakpoint = createBreakpoint({
  xs: 0,
  sm: 550,
  md: 1394,
  lg: 1953,
  xl: 2512,
});

const AlertContainer = styled.div`
  position: ${props => props.isOpen ? 'relative' : 'absolute'};
  right: ${props => props.isOpen ? null : '35px'};
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 15px;
  ${'' /* border-width: 1px;
  border-color: blue;
  border-style: solid; */}
  ${'' /* background-color: #eff0f9; */}
  background-color: #385988;
  color: white;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
  flex-direction: column;
  min-height: 20px;
  width: ${props => props.isOpen ? null : '20px'};
  box-shadow: 0 0 0.5333333333rem rgb(26 26 26 / 12%);
  border-radius: .35em;
  z-index: 20;
`;
AlertContainer.displayName = "AlertContainer";
const AlertBody = styled.div`
  font-size: 1em;
  margin: 0px;
  align-self: center;
  max-width: 1090px;
  
`;
AlertBody.displayName = "AlertBody";
const AlertTitle = styled.div`
  font-size: 1.7em;
  font-weight: 600;
  ${'' /* color: #454547; */}
  color: white;
  max-width: 1090px
`;
const AlertBodyParagraph = styled.div`
  ${'' /* color: #6F7173; */}
  color: white;
`;
AlertBodyParagraph.displayName = "AlertBodyParagraph";
const CloseWindowIcon = styled.div`
  position: absolute;
  right: ${props => props.isOpen ? '32px' : '10px'};
  top: ${props => props.isOpen ? '30px' : '12px'};
  margin: 0px;
  border: 0;
  flex-shrink: 0;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  
  
  :hover {
    cursor: pointer;
    transform: scale(1.15)
  }
`;
CloseWindowIcon.displayName = "CloseWindowIcon";
const welcomeText = {
  "tab1": {
    "welcome1": <p>Welcome to the Nordic Clean Energy Scenarios results viewer</p>,
	"welcome2": <p>On this webpage you can explore the full modelling results from the Nordic Clean Energy Scenarios project, funded by Nordic Energy Research.</p>,
	"welcome3": <p>This web tool allows you to compare the results from three different scenarios developed by the project, view the effects on the energy system when applying additional assumptions to the model, and delve deeper into the full downloadable data provided in the statistics database and model results. For further instructions on how to use the web tool and get the most out of the presented results please see, <a href="./about" style={{color: "white"}}>How to use the results viewer tool</a>. To learn more about the project and access the full report please see <a href="./how-to-use" style={{color: "white"}}>About Nordic Clean Energy Scenarios.</a></p>,
	"welcome4": <p>All NCES scenarios reach carbon neutrality by 2050, but technology choice, fuel consumption, and cost will adapt to the options available to change assumptions on the technological readiness of CCS technologies and limitations on bioenergy availability. </p>,
	"welcome5": <p>The results presented here are highly dependent on assumptions for technology developments and their potential availability, efficiency, and cost to just mention a few factors influencing future pathway developments. The many combinations of scenarios represented in this tool demonstrates the inherent uncertainty of using scenario modelling to predict the future Nordic energy system. What these results tell us is rather which solutions are competing, what synergies exists between low carbon energy technologies, and what factors their development is contingent on.</p>,
  },
  "tab2": {
    "welcome1": <p>The upstream sector includes oil and gas production, fossil refineries, biorefineries and PtX plants.</p>,
    "welcome2": <p>The total used biomass in the Nordic countries is tracked and also import of biomass and biofuels. Feedstock and produced fuel from both fossil based refineries and renewable based refineries are also shown.</p>,
    "welcome3": <p>Try to choose the same scenario twice and then activate the bioenergy constraint, the “leaf”, on one of the scenarios – then you can see a big difference in imported bioenergy and input to the RE-refineries.</p>,
  },
  "tab3": {
    "welcome1": <p>Power and district heat production.</p>,
    "welcome2": <p>Here you can see the fuel use for power and district heat production, power plant capacities and the electricity and district heating production divided on fuels.</p>,
    "welcome3": <p>The marginal electricity price and district heating price is the weighted average price of the time slices in the model over a year. These prices are endogenous calculated by the model and it is the prices which the model “trade” power and heat between sectors.</p>,
    "welcome4": <p>Try to select the CNN scenario and the NPH scenario and compare electricity demand and the difference in needed power capacity.</p>,
  },
  "tab4": {
	  "welcome1": <p>Heavy industry energy consumption.</p>,
	  "welcome2": <p>Here you can investigate energy consumption and CO<sub>2</sub>-emissions from heavy industry.</p>,
	  "welcome3": <p>In heavy industry we include: Pulp and paper, Mining, Iron and steel, Aluminium and Cement.</p>,
	  "welcome4": <p>Try to select the CNN scenario and the NPH scenario and you will see the assumed increase in activity in NPH – if you choose to compare with CNB instead you can see the impact of the assumed decrease in activity.</p>,
	  "welcome5": <p>Try also to select CNN twice and then activate increased cost of CO<sub>2</sub> storage and compare CO<sub>2</sub>-reductions.</p>,
  },
  "tab5": {
	  "welcome1": <p>Other sectors energy consumption.</p>,
	  "welcome2": <p>Here you can investigate energy consumption and CO<sub>2</sub>-emissions from other sectors.</p>,
	  "welcome3": <p>In Other sectors we include: Manufacturing industries, Service sector, Agriculture and Fishery.</p>,
	  "welcome4": <p>Try to select CNN twice and then activate increased cost of CO<sub>2</sub> storage and compare CO<sub>2</sub>-reductions and fuel use in agriculture and fishery.</p>,
  },
  "tab6": {
	  "welcome1": <p>Residential sector.</p>,
	  "welcome2": <p>Here you can investigate development in heat demand, electricity demand and fuel use for residential sector.</p>,
	  "welcome3": <p>The results are split in room heat and electricity for appliances. The solutions for the residential sector are very robust towards the variation in assumptions are therefore all scenarios look very similar.</p>,
	  "welcome4": <p>So instead of comparing two scenarios try to look at the difference in heating solutions between the countries. Turn on one country at the time on the map to the left to go through country results.</p>,
  },
  "tab7": {
	  "welcome1": <p>Transport sector energy consumption.</p>,
	  "welcome2": <p>Here you can investigate energy consumption, transport service level and CO<sub>2</sub>-emissions from passenger and freight transport.</p>,
	  "welcome3": <p>The model includes international shipping and aviation which also can be shown on country level. For cars and trucks the stock are shown divided on vehicle types.</p>,
	  "welcome4": <p>The results in the transport sector is very robust to the different scenario assumptions, which leads to only minor differences between the scenarios.</p>,
	  "welcome5": <p>But the CNB scenarios differs as demand for transport are not assumed to increase in future. Therefore, try to select CNN and CNB and compare the need for cars.</p>,
  },
  "tab8": {
	  "welcome1": <p>Key Performance Indicators.</p>,
	  "welcome2": <p>Here we have chosen some indicators that can say something about the development of the Nordic energy system.</p>,
	  "welcome3": <p>The indicators show development in renewable energy shares, electrification of end-use energy consumption and energy intensity of industries.</p>,
	  "welcome4": <p>The indicators illustrate differences in the structure of the energy system across the Nordic countries.</p>,
	  "welcome5": <p>Try to select the same scenario twice and see how increase price of CO<sub>2</sub> storage or limit on import of biomass influence the indicators.</p>,
  },
  "tabHistory": {
    "welcome1": <p>Welcome to Nordic Energy Statistics Database visualisations.</p>,
    "welcome2": <p>The database aims for harmonising energy sector and related data across all the five Nordic countries. It will serve as a reference for research work as well as for the general public to see energy related data and selected progress indicators. </p>,
    "welcome3": <p>The database will be published and maintained by Nordic Energy Research. Original sources of the data are mentioned in the metadata part for each data item. </p>,
    "welcome4": <p>Sources: Eurostat, IEA, national statistics</p>
  },
  "tabRawHistory": {
    "welcome1": <p>Welcome to Nordic Energy Statistics Database Raw Historical Data</p>
  }
}
function Welcome(props) {
  return (
    <AlertContainer  isOpen={props.isOpen}>
    {props.isOpen && <AlertTitle>{welcomeText[props.tab].welcome1}</AlertTitle>}
      {props.isOpen && props.tab === "tab1" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome5}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome6}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome7}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome8}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome9}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab2" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab3" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab4" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome5}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab5" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab6" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab7" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome5}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab8" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome5}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab-history" && <AlertBody>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome2}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome3}</AlertBodyParagraph>
        <AlertBodyParagraph>{welcomeText[props.tab].welcome4}</AlertBodyParagraph>
      </AlertBody>}
      {props.isOpen && props.tab === "tab-raw-history" && <AlertBody>
      </AlertBody>}
      <CloseWindowIcon
        onClick={() => props.closeWelcome(!props.isOpen)}
      >
        {props.isOpen ? <Octicon name="x" /> : <Octicon name="chevron-left" />}
      </CloseWindowIcon>
    </AlertContainer>
  )
}
Welcome.defaultProps = {
  tab: "tab1"
}

Welcome.propTypes = {
  closeWelcome: PropTypes.func.isRequired,
  tab: PropTypes.string,
};

export default Welcome;
