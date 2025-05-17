import { WordList, WordListEntry, WordModule } from "../WordList"
import { WordListResultGroup } from "../components/WordListResult"

export class PlusNAnagramWordModule implements WordModule {
  public getShortName() {
    return "plusn"
  }

  public getName() {
    return "Add N Letters And Anagram"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>+n+word</b> Find words that can be made from 'word' by adding n letters and anagramming
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // Do nothing -- the default processing does everything we need here.
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("+")) {
      return true
    }
    return false
  }

  getAddTwoMatches(wordList: WordList, query: string): WordListEntry[] {
    const parts = query.split("+")
    if (parts.length !== 3) {
      //$ TODO: <ErrorResult>
      return []
    }
    const word = WordList.normalize(parts[2])
    const count = word.length
    const extra = parseInt(parts[1])
    const result: WordListEntry[] = []
    const sorted = WordList.sortWord(word).split("")
    wordList.words.forEach((wle) => {
      if (wle.normalized.length === count + extra) {
        const match = wle.normalized.split("")
        let foundAll = true;
        for (let i = 0; i < sorted.length; i++) {
          let foundIndex = match.findIndex((x) => x === sorted[i])
          if (foundIndex == -1) {
            foundAll = false;
            break;
          }
          match.splice(foundIndex, 1);
        }
        if (foundAll) {
          result.push(wle)
        }
      }
    })
    return result
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    return [
      {
        title: "Add Two Letters",
        results: this.getAddTwoMatches(wordList, query),
      },
    ]
  }
}
