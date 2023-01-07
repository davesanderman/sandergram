import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { WordList, WordListEntry, WordListResult } from "./WordList"
import Header from "./components/Header"
import Sandergram from "./components/Sandergram"

export default function Main() {
  const [wordList, setWordList] = useState<WordList | null>(null)

  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Navigate to="/s/" replace />}/>
        <Route path="/s/*" element={<Sandergram />} />
      </Routes>
    </div>
  )
}
