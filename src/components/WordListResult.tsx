import { WordListEntry } from "../WordList"
import { Result } from "./ResultsView"

export class WordListEntryResult extends WordListEntry {
  constructor(wle: WordListEntry) {
    super(wle.raw)
  }

  public displayText?: JSX.Element
}

export class DisplayOnlyResult extends WordListEntry {
  constructor(displayText: JSX.Element) {
    super("n/a")
    this.displayText = displayText
  }

  public displayText?: JSX.Element
}

export class WordListListResult extends WordListEntry {
  constructor(wleList: WordListEntry[]) {
    super("n/a")
    this.displayText = (
      <>
        {wleList.map((wle, index) => {
          return (
            <>
              <span>{index !== 0 ? "  |  " : ""}</span>
              <span>
                <Result result={wle} />
              </span>
            </>
          )
        })}
      </>
    )
  }

  public displayText?: JSX.Element
}

export type WordListResult = WordListEntryResult | DisplayOnlyResult | WordListListResult

export interface WordListResultGroup {
  title: string
  results: WordListResult[]
}
