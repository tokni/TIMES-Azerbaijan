import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import 'typeface-roboto'
import { createGlobalStyle } from "styled-components"
import { Auth0Provider } from "@auth0/auth0-react"

export default class Root extends Component {
  render() {
    return (
      <Auth0Provider
        domain="times-az.eu.auth0.com"
        clientId="5RpAOZpRIdNCf8oHfu77DhHvzpKwH8FF"
        redirectUri={
          process.env.NODE_ENV === 'development' ? 
          "http://localhost:3000" : process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "internal" ? "https://internal--times-azerbaijan.vercel.app/"
          : "https://develop--times-azerbaijan.vercel.app/"
          }
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