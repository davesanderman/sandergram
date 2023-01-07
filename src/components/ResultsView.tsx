import { WordListResult, WordListResultGroup } from "../WordList"
import WordLink from "./WordLink"

export interface ResultsViewProps {
  results: WordListResultGroup[]
}

interface ResultProps {
  result: WordListResult
}
function Result({ result }: ResultProps) {
  const elem = result.displayText
  if (elem) {
    return elem
  }
  return <span><WordLink entry={result}/></span>
}

interface ResultGroupProps {
  group: WordListResultGroup
  groupIndex: number
}
function ResultGroup({ group, groupIndex }: ResultGroupProps) {
  return (
    <div className="result-group">
      <div className="result-group-title">{group.title}</div>
      <div className="result-group-results">
        <>
          {group.results.map((result, i) => (
            <div key={`r-${groupIndex}-${i}`} className="result-group-result">
              <Result result={result} />
            </div>
          ))}
        </>
      </div>
    </div>
  )
}

export default function ResultsView({ results }: ResultsViewProps) {
  return (
    <div className="results-wrapper">
      {results.map((group, i) => (
        <div key={`rg-${i}`}>
          <ResultGroup group={group} groupIndex={i} />
        </div>
      ))}
    </div>
  )
}
