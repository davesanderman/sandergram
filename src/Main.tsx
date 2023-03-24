import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import Header from "./components/Header"
import Sandergram from "./components/Sandergram"

export default function Main() {
  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Navigate to="/s/" replace />} />
        <Route path="/s/*" element={<Sandergram />} />
      </Routes>
    </div>
  )
}
