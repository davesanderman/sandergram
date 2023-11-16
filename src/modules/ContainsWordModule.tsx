import { WordList, WordListEntry, WordModule } from "./WordList"
import { WordListResultGroup } from "./components/WordListResult"

export class ContainsWordModule implements WordModule {
  public getShortName() {
    return "contains"
  }

  public getName() {
    return "Contains"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>&number&letters</b> Find 'number'-letter-long words that contain all of 'letters'
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // Do nothing -- the default processing does everything we need here.
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("&")) {
      return true
    }
    return false
  }

  getContainsMatches(wordList: WordList, query: string): WordListEntry[] {
    const parts = query.split("&")
    if (parts.length !== 3) {
      //$ TODO: <ErrorResult>
      return []
    }
    const count = parseInt(parts[1])
    const target = WordList.sortWord(WordList.normalize(parts[2])).split("")
    const result: WordListEntry[] = []
    wordList.words.forEach((wle) => {
      if (wle.sorted.length === count) {
        const match = wle.sorted.split("")
        let i = 0
        let j = 0
        let found = true
        while (i < target.length && j < match.length) {
          if (match[j] > target[i]) {
            found = false
            break
          }
          if (match[j] === target[i]) {
            i++
          }
          j++
        }
        if (i < target.length) {
          found = false
        }
        if (found) {
          result.push(wle)
        }
      }
    })
    return result
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    return [
      {
        title: "Contains",
        results: this.getContainsMatches(wordList, query),
      },
    ]
  }
}
