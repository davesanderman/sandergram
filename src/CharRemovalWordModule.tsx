import {
  WordList,
  WordListEntry,
  WordListResult,
  WordListResultGroup,
  WordModule,
} from "./WordList"

export class CharRemovalWordModule implements WordModule {
  public getShortName() {
    return "charremoval"
  }

  public getName() {
    return "Letter Removals"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"-X-word"}</b> Find words which match when all Xs are deleted
        </div>
        <div className="help-entry">
          <b>{"-XYZ-word"}</b> Find words which match when all Xs, Ys, and Zs are deleted
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("-")) {
      return true
    }
    return false
  }

  findCharRemoval(wordList: WordList, target: string, remove: string): WordListResult[] {
    const normTarget = WordList.normalize(target)
    const removeRegex = new RegExp("[" + remove + "]", "g")

    return wordList.words.reduce((filtered: WordListResult[], wle: WordListEntry) => {
      if (wle.normalized !== normTarget) {
        const deleted = wle.normalized.replace(removeRegex, "")
        if (deleted === normTarget) {
          filtered.push(wle)
        }
      }
      return filtered
    }, [])
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const parts = query.split("-")
    const remove = WordList.normalize(parts[1])
    const target = parts[2]
    const results = this.findCharRemoval(wordList, target, remove)

    return [
      {
        title: this.getName(),
        results
      },
    ]
  }
}
