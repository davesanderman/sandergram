import WordLink from "./components/WordLink"
import { DisplayOnlyResult, WordListEntryResult, WordListResult, WordListResultGroup } from "./components/WordListResult"
import {
    WordList,
  WordListEntry,
  WordModule,
} from "./WordList"

export class AlternateDeletionWordModule implements WordModule {
  public getShortName() {
    return "alternate"
  }

  public getName() {
    return "Alternate Deletions"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"$word"}</b> Find words where every other letter is deleted
        </div>
        <div className="help-entry">
          <b>{"$$word"}</b> Only accept words of the form F.O.O[.]
        </div>
        <div className="help-entry">
          <b>{"$$$word"}</b> Only accept words of the form .F.O.O[.]
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("$")) {
      return true
    }
    return false
  }

  // startPos should be 0 or 1
  deleteLetters(wle: WordListEntry, startPos: number): string[] {
    let deleted = ""
    let replaced = ""
    const candidate = wle.normalized
    for (var i = 0; i < candidate.length; i++) {
      if ((i & 1) === (startPos & 1)) {
        deleted += candidate[i]
        replaced += candidate[i]
      } else {
        replaced += "."
      }
    }
    return [deleted, replaced]
  }

  findAlternateDeletion(wordList: WordList, target: string, allow0: boolean, allow1: boolean): WordListResult[] {
    const normTarget = WordList.normalize(target)

    return wordList.words.reduce((filtered: WordListResult[], wle: WordListEntry) => {
      // each candidate has two possible matches -- starting with the first char or starting with the second char.
      const [candidate1, replaced1] = this.deleteLetters(wle, 0)
      const [candidate2, replaced2] = this.deleteLetters(wle, 1)
      if (allow0 && normTarget === candidate1) {
        const wlr = new WordListEntryResult(wle)
        wlr.extra = {
          matchPattern: replaced1,
        }
        filtered.push(wlr)
      } else if (allow1 && normTarget === candidate2) {
        const wlr = new WordListEntryResult(wle)
        wlr.extra = {
          matchPattern: replaced2,
        }
        filtered.push(wlr)
      }
      return filtered
    }, [])
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    let target = query.substring(1)
    let allow0 = true
    let allow1 = true
    if (target.startsWith("$$")) {
      allow0 = false
      target = target.substring(2)
    } else if (target.startsWith("$")) {
      allow1 = false
      target = target.substring(1)
    }
    const results = this.findAlternateDeletion(wordList, target, allow0, allow1)

    return [
      {
        title: this.getName(),
        results: results.map(
          (r) =>
            new DisplayOnlyResult(
              (
                <span>
                  <b>
                    {r.extra?.matchPattern}
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
