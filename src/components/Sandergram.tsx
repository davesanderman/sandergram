import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { WORD_LIST_PATH } from "../Constants"
import { WordList, WordListResultGroup } from "../WordList"
import { Modules } from "../WordModules"
import "../style/Sandergram.css"
import QueryForm from "./QueryForm"
import Help from "./Help"
import ResultsView from "./ResultsView"

export default function Sandergram() {
  const params = useParams()
  const navigate = useNavigate()
  const query = useMemo(() => params["*"], [params])
  const [wordList, setWordList] = useState<WordList | null>(null)
  const [curQuery, setCurQuery] = useState<string | null>(null)
  const [curResults, setCurResults] = useState<WordListResultGroup[] | null>(null)

  useEffect(() => {
    const loadWordList = async (): Promise<WordList> => {
      const newWordList = new WordList()
      await newWordList.loadWordList(WORD_LIST_PATH, Modules)
      return newWordList
    }
    if (!wordList) {
      loadWordList()
        .then(setWordList)
        .catch((e: unknown) => {
          //$ TODO: Report/manage this better
          console.error(e)
        })
    }
  }, [wordList])

  const onQuery = useCallback(
    (query: string) => {
      navigate(`/s/${encodeURIComponent(query)}`)
    },
    [navigate],
  )

  useEffect(() => {
    if (wordList && query) {
      console.log(`running queries for ${query}`)
      const results = wordList.runQuery(query, Modules)
      setCurResults(results)
    }
  }, [query, wordList])

  return (
    <div className="main">
      <div className="subhed">
        <>{wordList ? `Loaded ${wordList.count} words` : "Loading..."}</>
      </div>
      <div className="separator" />
      <div className="query-box">
        <QueryForm onQuery={onQuery} initialQuery={query} />
      </div>
      <div className="separator" />
      <div className="results-box">
        {(curResults && curResults.length > 0) ? (
          <ResultsView results={curResults} />
        ) : (
          <div className="empty-results">...</div>
        )}
      </div>
      <div className="separator" />
      <div className="help-box">
        <Help modules={Modules} />
      </div>
    </div>
  )
}
