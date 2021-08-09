import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TabLayout = styled.div`
  display: none;
  ${breakpoint("desktop")`
    display: flex;  
    height: 50px;
    flex-direction: row;
    flex-shrink: 0;
    justify-content: flex-start;
    width: 100%;
    padding-left: 20px;
    color: white;
    background: #efefef;
    visibility: visible;
    box-shadow: 0 0 0.5333333333rem rgb(26 26 26 / 12%);
  `}
`;

const TabItem = styled(Link)`
  font-weight: normal;
  font-size: 1em;
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

function Tabs(props) {
  const { t } = useTranslation();
  return (
    <TabLayout>
      <TabItem to="/" selected={props.selectedChartgroup === "/"}>
        {t("tabs.tab1")}
      </TabItem>
      <TabItem to="/tab2" selected={props.selectedChartgroup === "/tab2"}>
        {t("tabs.tab2")}
      </TabItem>
      <TabItem to="/tab3" selected={props.selectedChartgroup === "/tab3"}>
        {t("tabs.tab3")}
      </TabItem>
      <TabItem to="/tab4" selected={props.selectedChartgroup === "/tab4"}>
        {t("tabs.tab4")}
      </TabItem>
      <TabItem to="/tab5" selected={props.selectedChartgroup === "/tab5"}>
        {t("tabs.tab5")}
      </TabItem>
      <TabItem to="/tab6" selected={props.selectedChartgroup === "/tab6"}>
        {t("tabs.tab6")}
      </TabItem>
      <TabItem to="/tab7" selected={props.selectedChartgroup === "/tab7"}>
        {t("tabs.tab7")}
      </TabItem>
      <TabItem to="/tab8" selected={props.selectedChartgroup === "/tab8"}>
        {t("tabs.tab8")}
      </TabItem>
      <TabItem historical="true" to="/tab9" selected={props.selectedChartgroup === "/tab9"}>
        {t("tabs.tab9")}
      </TabItem>
      <TabItem historical="true" to="/tab10" selected={props.selectedChartgroup === "/tab10"}>
        {t("tabs.tab10")}
      </TabItem>
    </TabLayout>
  );
}

Tabs.propTypes = {
  selectedChartgroup: PropTypes.string.isRequired
};

export default Tabs;
