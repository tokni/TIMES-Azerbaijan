import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Route, withRouter, Switch } from 'react-router-dom'
import ReactGA from 'react-ga'
import LeftMenu from './leftMenu/LeftMenu'
import LeftMenuMobile from './leftMenu/LeftMenu.mobile'
import Tabs from './tabs/Tabs'
import TabsMobile from './tabs/Tabs.mobile'
import ChartsTab1 from './charts/ChartsTab1'
import ChartsTab2 from './charts/ChartsTab2'
import ChartsTab3 from './charts/ChartsTab3'
import ChartsTab4 from './charts/ChartsTab4'
import ChartsTab5 from './charts/ChartsTab5'
import ChartsTab6 from './charts/ChartsTab6'
import ChartsTab7 from './charts/ChartsTab7'
import ChartsTab8 from './charts/ChartsTab8'
import ChartsTab9 from './charts/ChartsTab9'
import ChartsTab10 from './charts/ChartsTab10'
import PageRenderer from './pages/PageRenderer'
import scenarioCombinations from './data/scenarioCombinations'

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
const default_scenario = scenarioCombinations.scenarioCombinations.scenarioOptions[0].name;
const default_countries = ['no','se','dk', "fi", "is"];
const options = []
scenarioCombinations.scenarioCombinations.scenarioOptions
  .filter(s => !s.opt0 && !s.op1 && !s.opt2 && !s.opt3)
  .forEach(s => {
    options[s.nameNoOptions] = {}
    options[s.nameNoOptions]['opt0'] = false
    options[s.nameNoOptions]['opt1'] = false
    options[s.nameNoOptions]['opt2'] = false
    options[s.nameNoOptions]['opt3'] = false
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
  }
    this.scenarioCombinations = scenarioCombinations.scenarioCombinations
  }

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
  }
  UpdateScenarioNames = () => {
    this.setState(state => {
      return {
        scenarioSelection:
          state.scenarioSelectionNoOptions +
          (state.options[state.scenarioSelectionNoOptions].opt0 ? '_ccs' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt1 ? '_bio' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt2 ? '_ELC' : '') +
          (state.options[state.scenarioSelectionNoOptions].opt3 ? '_SAC' : ''),
      }
    })
    this.setState(state => {
      return {
        scenarioSelection2:
          state.scenarioSelectionNoOptions2 !== ''
            ? state.scenarioSelectionNoOptions2 +
              (state.options[state.scenarioSelectionNoOptions2].opt0
                ? '_ccs'
                : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt1 ? '_bio' : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt2 ? '_ELC' : '') +
              (state.options[state.scenarioSelectionNoOptions2].opt3 ? '_SAC' : '')
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
        <RightColumn>
          <Content>
            <Tabs selectedChartgroup={this.props.location.pathname} />
            <TabsMobile selectedChartgroup={this.props.location.pathname} />
            <MainSwitch>
              <Route
                exact
                path="/"
                render={() => (
                  <ChartsTab1
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab2"
                render={() => (
                  <ChartsTab2
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab3"
                render={() => (
                  <ChartsTab3
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab4"
                render={() => (
                  <ChartsTab4
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab5"
                render={() => (
                  <ChartsTab5
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab6"
                render={() => (
                  <ChartsTab6
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab7"
                render={() => (
                  <ChartsTab7
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab8"
                render={() => (
                  <ChartsTab8
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab9"
                render={() => (
                  <ChartsTab9
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab10"
                render={() => (
                  <ChartsTab10
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/about"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/about.md']} />
                  )
                }}
              />
              <Route
                path="/model"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/model.md']} />
                  )
                }}
              />
              <Route
                path="/scenarios"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/scenarios.md']} />
                  )
                }}
              />
              <Route
                exact
                path="/findings"
                  render={() => {
                    return (
                      <PageRenderer markdownFiles={['descriptions/findings.md']} />
                    )
                  }}
                />
              <Route
                exact
                path="/historical"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/historical.md']} />
                  )
                }}
              />
              <Route
                exact
                path="/how-to-use"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/howto.md']} />
                  )
                }}
              />
            </MainSwitch>
          </Content>
        </RightColumn>
      </Page>
    )
  }
}

export default withRouter(App)
