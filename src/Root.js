import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import 'typeface-roboto'
import { createGlobalStyle } from "styled-components"

export default class Root extends Component {
  render() {
    return (
      <Router>
        <App />
        <GlobalStyle />
      </Router>
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