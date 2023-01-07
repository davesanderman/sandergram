import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

import logo from "./logo.svg"
import "./App.css"
import Main from "./Main"

function App() {
  return (
    <div className="App">
      <Router>
        <Main />
      </Router>
    </div>
  )
}

export default App
