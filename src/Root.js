import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import 'typeface-roboto'
import { createGlobalStyle } from "styled-components"
import { Auth0Provider } from "@auth0/auth0-react"
import getRedirectURI from './getRedirectURI'

const masterIsOpen = false

export default class Root extends Component {
  
  render() {
    if (masterIsOpen) {
      return (
        <Router>
          <App /> 
          <GlobalStyle />
        </Router>
      )
    } else return (
      <Auth0Provider
        domain="times-az.eu.auth0.com"
        clientId="5RpAOZpRIdNCf8oHfu77DhHvzpKwH8FF"
        redirectUri={getRedirectURI()}
        maxAge={1}
      >
        <Router>
          <App /> 
          <GlobalStyle />
        </Router>
      </Auth0Provider>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%
  }
  body, #root, #root>div {
    font-family: Corbel;
    font-size: 1em;
    margin: 0px;
    width: 100%;
    height: 100%;    
  }
`