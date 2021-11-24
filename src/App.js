import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Route, withRouter, Switch } from 'react-router-dom'
import ReactGA from 'react-ga'
import LeftMenu from './leftMenu/LeftMenu'
import LeftMenuMobile from './leftMenu/LeftMenu.mobile'
import Tabs from './tabs/Tabs'
import TabsMobile from './tabs/Tabs.mobile'
import PageRenderer from './pages/PageRenderer'
import scenarioCombinations from './data/scenarioCombinations'
import { withTranslation } from 'react-i18next'
import { useAuth0, withAuth0 } from "@auth0/auth0-react";
import tabsList from "./translations/tabs"
import unitSettings from "./translations/units"

const createRoutes = Object.entries(tabsList)

let dev = false
console.log("proccess.env: ", process.env)
if(process.env.NODE_ENV === 'development'){
  dev = true
  console.log("developement build")
}
if(process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "internal") dev = true
  
else if (process.env.NODE_ENV === 'production')
  console.log("production build")
else
  console.log("something else build")

const ChartsTab1 = React.lazy(() => import('./charts/ChartsTab1')); 

ReactGA.initialize('UA-145591344-2')
ReactGA.pageview(window.location.pathname + window.location.search)

const Page = styled.div`
  height: 100%;
  margin: 0px;
  display: flex;
  box-sizing: border-box;
`
const LeftColumn = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(50,50,50);
`
const RightColumn = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  background-color: #ebebeb;
`
const Content = styled.div`
  flex-grow: 1; /*ensures that the container will take up the full height of the parent container*/
  overflow-y: auto; /*adds scroll to this container*/
  overflow-x: hidden;
`
const MainSwitch = styled(Switch)`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
`

export const changeScenario = (name, value) => ({
  [name]: value,
})
const getDefaultUnits = () => {
  let ret = {}
  Object.entries(unitSettings).forEach((unitType) => {
    ret[unitType[0]] = {displayName: unitType[0], factor: 1}
  })
  return ret
}
const default_scenario = scenarioCombinations.scenarioCombinations.scenarioOptions[0].id;
const default_countries = ["AZ1", "AZ2", "AZ3"];
const options = []
const default_units = getDefaultUnits()
scenarioCombinations.scenarioCombinations.scenarioOptions
  .filter(s => !s.opt0 && !s.op1 && !s.opt2 && !s.opt3 && !s.opt4)
  .forEach(s => {
    options[s.id] = {}
    options[s.id]['opt0'] = false
    options[s.id]['opt1'] = false
    options[s.id]['opt2'] = false
    options[s.id]['opt3'] = false
    options[s.id]['opt4'] = false
  })

export class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      scenarioSelection: default_scenario,
      scenarioSelection2: '',
      showWelcome: true,
      showDifference: false,
      options: options,
      scenarioSelectionNoOptions: default_scenario,
      scenarioSelectionNoOptions2: '',
      selectedCountries: default_countries,
      unitSelection: default_units
  }
    this.scenarioCombinations = scenarioCombinations.scenarioCombinations
  }

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
  }
  selectUnit = (unitType, unit) => {
    this.setState(state => {
      return(
        state.unitSelection[unitType] = unit
      ) 
    })
  }

  UpdateScenarioNames = () => {
    this.setState(state => {
      return {
        scenarioSelection:
          state.scenarioSelectionNoOptions +
          (state.options[state.scenarioSelectionNoOptions].opt0 ? '_opt0' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt1 ? '_opt1' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt2 ? '_opt2' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt3 ? '_opt3' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt4 ? '_opt4' : ''),
      }
    })
    this.setState(state => {
      return {
        scenarioSelection2:
          state.scenarioSelectionNoOptions2 !== ''
            ? state.scenarioSelectionNoOptions2 +
              (state.options[state.scenarioSelectionNoOptions2].opt0 ? '_opt0' : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt1 ? '_opt1' : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt2 ? '_opt2' : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt3 ? '_opt3' : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt4 ? '_opt4' : '')
            : '',
      }
    })
  }
  unselectToggles = (scenario) => {
    let newOptions = this.state.options
    Object.keys(this.state.options[scenario]).forEach(option => {
      newOptions[scenario][option] = false
    })
    this.setState({
      options: newOptions,
    })
  }
  UpdateScenarioSelection = (e, name, value) => {
    e.preventDefault()
    if (this.state.scenarioSelectionNoOptions2 !== '') {
      if (value === this.state.scenarioSelectionNoOptions) {
        this.setState(
          changeScenario(
            'scenarioSelectionNoOptions',
            this.state.scenarioSelectionNoOptions2
          )
        )
        this.setState(changeScenario('scenarioSelectionNoOptions2', ''))
        this.unselectToggles(this.state.scenarioSelectionNoOptions2)
        this.setState({ showDifference: false })
      } else {
        if (value === this.state.scenarioSelectionNoOptions2) {
          this.setState(changeScenario('scenarioSelectionNoOptions2', ''))
          this.unselectToggles(this.state.scenarioSelectionNoOptions2)
          this.setState({ showDifference: false })
        } else {
          this.setState(changeScenario('scenarioSelectionNoOptions2', value))
        }
      }
    } else {
      if (value !== this.state.scenarioSelectionNoOptions) {
        this.setState(changeScenario('scenarioSelectionNoOptions2', value), ()=>{
        })
      }
    }
    this.UpdateScenarioNames()
  }


  CloseWelcomeWidget = (value = false) => {
    this.setState({ showWelcome: value })
  }

  ToggleDifference = e => {
    e.preventDefault()
    this.setState({ showDifference: !this.state.showDifference })
  }

  ToggleOption = (scenario, option) => {
    let newOptions = this.state.options
    newOptions[scenario][option] = !this.state.options[scenario][option]
    this.setState({
      options: newOptions,
    })
    this.UpdateScenarioNames()
  }

  selectCountry = country => {
    let newSelectedCountries = this.state.selectedCountries
    if (newSelectedCountries.includes(country)) {
      newSelectedCountries = newSelectedCountries.filter(c => c !== country)
    } else {
      newSelectedCountries.push(country)
    }
    this.setState({
      selectedCountries: newSelectedCountries,
    })
  }

LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};
  
  render() {
    return (
      <Page>
        <LeftColumn>
          <Content>
            <LeftMenu
              selectedChartgroup={this.state.scenarioSelection}
              selectedPage={this.props.location.pathname}
              scenarioSelection={this.state}
              scenarioCombinations={this.scenarioCombinations}
              updateScenarioSelection={this.UpdateScenarioSelection}
              toggleDifference={this.ToggleDifference}
              options={this.state.options}
              toggleOption={this.ToggleOption}
              selectedCountries={this.state.selectedCountries}
              selectCountry={this.selectCountry}
              selectedUnits={this.state.unitSelection}
              selectUnit={this.selectUnit}
            />
            <LeftMenuMobile
              selectedChartgroup={this.state.scenarioSelection}
              selectedPage={this.props.location.pathname}
              scenarioSelection={this.state}
              scenarioCombinations={this.scenarioCombinations}
              updateScenarioSelection={this.UpdateScenarioSelection}
              toggleDifference={this.ToggleDifference}
              options={this.state.options}
              toggleOption={this.ToggleOption}
              selectedCountries={this.state.selectedCountries}
              selectCountry={this.selectCountry}
            />
          </Content>
        </LeftColumn>
        {(dev || this.props.auth0.isAuthenticated) && <RightColumn>
          <Content>
            <Tabs selectedChartgroup={this.props.location.pathname} />
            <TabsMobile selectedChartgroup={this.props.location.pathname} />
            <MainSwitch>
              {
                createRoutes.map(route => {
                  return(
                    <Route 
                      key={'route' + route[0]}
                      exact={route[0] === 'tab1' ? true : false}
                      path={route[0] === 'tab1' ? '/' : '/' + route[0]}
                      render={() => (
                        <Suspense fallback={<div>Loading...</div>}>
                          <ChartsTab1
                            scenarioSelection={this.state}
                            closeWelcome={this.CloseWelcomeWidget}
                            selectedCountries={this.state.selectedCountries}
                            tab={route[0]}
                            index={1}
                            selectedUnits={this.state.unitSelection}
                          />
                        </Suspense>
                      )}
                  />)
                })
              }
              <Route
                path="/page1"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/page1']} />
                  )
                }}
              />
              <Route
                path="/page2"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/page2']} />
                  )
                }}
              />
              <Route
                path="/page3"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/page3']} />
                  )
                }}
              />
              <Route
                exact
                path="/page4"
                  render={() => {
                    return (
                      <PageRenderer markdownFiles={['descriptions/page4']} />
                    )
                  }}
                />
              <Route
                exact
                path="/page5"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/page5']} />
                  )
                }}
              />
            </MainSwitch>
          </Content>
        </RightColumn>}
      </Page> 
    ) 
  } 
}


export default withAuth0(withRouter(withTranslation("common")(App)))
