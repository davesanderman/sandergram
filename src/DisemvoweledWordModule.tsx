import { WordList, WordListEntry, WordListResultGroup, WordModule } from "./WordList"

export class DisemvoweledWordModule implements WordModule {
  public getShortName() {
    return "disemvoweled"
  }

  public getName() {
    return "Disemvoweled"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>Word without vowels</b> Find disemvoweled matches
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    wordListEntry.extra.disemvoweled = WordList.disemvowel(wordListEntry.normalized)
  }

  public claimQuery(query: string): boolean {
    const lower = query.toLowerCase()
    if (lower.search(/[aeiou0-9]/i) === -1) {
      return true
    }
    return false
  }

  getDisemvoweledMatches(wordList: WordList, query: string): WordListEntry[] {
    const prepped = WordList.disemvowel(WordList.normalize(query))
    return wordList.words.filter((wle) => wle.extra.disemvoweled === prepped)
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    return [
      {
        title: "Disemvoweled",
        results: this.getDisemvoweledMatches(wordList, query),
      },
    ]
  }
}
