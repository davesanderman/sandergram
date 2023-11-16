import WordLink from "../components/WordLink"
import { DisplayOnlyResult, WordListEntryResult, WordListResult, WordListResultGroup } from "../components/WordListResult"
import {
  WordList,
  WordListEntry,
  WordModule,
} from "../WordList"

export class OffByWordModule implements WordModule {
  public getShortName() {
    return "offby"
  }

  public getName() {
    return "Off By"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"`word"}</b> Find words that are off by one letter
        </div>
        <div className="help-entry">
          <b>{"`R.`puzzle"}</b> Find words that are off by R and any letter (in that order) from "puzzle"
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("`")) {
      return true
    }
    return false
  }

  findOffBy(wordList: WordList, pattern: string, target: string): WordListResult[] {
    const normTarget = WordList.normalize(target)
    const normPattern = WordList.normalize(pattern)
    const targetLen = normTarget.length
    return wordList.words.reduce((filtered: WordListResult[], wle: WordListEntry) => {
      if (wle.normalized.length === targetLen) {
        const wrongLetters = WordList.wrongLetters(wle.normalized, normTarget)
        if (wrongLetters.length > 0) {
          if (WordList.matchesPattern(normPattern, wrongLetters)) {
            const wlr = new WordListEntryResult(wle)
            wlr.extra = {
              actualDiff: wrongLetters,
            }
            filtered.push(wlr)
          }
        }
      }
      return filtered
    }, [])
  }
  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const parts = query.split("`")
    let ptn = "."
    let target = ""
    if (parts.length === 2) {
      target = parts[1]
    } else {
      ptn = parts[1]
      target = parts[2]
    }
    const results = this.findOffBy(wordList, ptn, target)

    return [
      {
        title: this.getName(),
        results: results.map(
          (r) =>
            new DisplayOnlyResult(
              (
                <span>
                  <b>
                    {target} + {r.extra?.actualDiff}
                  </b>
                  : <WordLink word={r.raw} />
                </span>
              ),
            ),
        ),
      },
    ]
  }
}
