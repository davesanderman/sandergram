import { WordList, WordListEntry, WordModule } from "../WordList"
import { WordListResultGroup } from "../components/WordListResult"

export class AddTwoLettersWordModule implements WordModule {
  public getShortName() {
    return "addtwo"
  }

  public getName() {
    return "Add Two Letters"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>2word</b> Find words that can be made from 'word' by adding two letters
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // Do nothing -- the default processing does everything we need here.
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("2")) {
      return true
    }
    return false
  }

  getAddTwoMatches(wordList: WordList, query: string): WordListEntry[] {
    const parts = query.split("2")
    if (parts.length !== 2) {
      //$ TODO: <ErrorResult>
      return []
    }
    const word = WordList.normalize(parts[1]);
    const count = word.length;
    const result: WordListEntry[] = []
    wordList.words.forEach((wle) => {
      if (wle.normalized.length === count + 2) {
        const match = wle.normalized.split("")
        let missCount = 0
        let i = 0
        let j = 0
        let found = true
        while (i < word.length && j < match.length) {
          if (word[i] === match[j]) {
            i++;
            j++;
            continue;
          }
          missCount++;
          if (missCount > 2) {
            found = false;
            break;
          }
          j++;
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
        title: "Add Two Letters",
        results: this.getAddTwoMatches(wordList, query),
      },
    ]
  }
}
