
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import tabList from "../translations/tabs"
import i18next from 'i18next';

const TabLayout = styled.div`
  display: none;
  ${breakpoint('mobile','desktop')`
    display: flex;  
    height: 40px;
    flex-direction: row;
    flex-shrink: 0;
    justify-content: flex-start;
    width: 100%;
    padding-left: 10px;
    color: white;
    background: #efefef;
    visibility: visible;
  `}
  `;
  TabLayout.displayName = 'TabLayout';

const TabItem  = styled(Link)`
  font-weight: normal;
  font-size: 0.7em;
  margin: 3px 0px 0px 0px;
  padding: 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: ${props => (props.selected ? "3px solid #006eb3": "none")};
  display: flex;
  align-items: center;
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 1;
    border-bottom: 3px solid #006eb3;
  }
  color: ${props => props.historical ? '#212121' : '#212121'};
  opacity: ${props => (props.selected ? "1" : "0.6")};
  background: ${props => (props.historical ? "#bbb" : "inherit")};
  `;
  TabItem.displayName = 'TabItem';

const createTabs = Object.entries(tabList)
function Tabs(props) {
  const { t } = useTranslation();
  
  return (
    <TabLayout>
    {
      createTabs.map((tab)=>{
        return(
          <TabItem
            key={tab[0]} 
            to={tab[0] === 'tab1' ? '/' : '/' + tab[0]} 
            selected={props.selectedChartgroup === '/' + (tab[0]==='tab1' ? '' : tab[0])}
          >
            {tab[1]["name_" + i18next.language]}  
          </TabItem>)
      })
    }
  </TabLayout>
    );
  }

Tabs.propTypes = {
  selectedChartgroup: PropTypes.string.isRequired
}

export default Tabs;
