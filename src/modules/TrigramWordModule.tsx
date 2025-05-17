import { WordList, WordListEntry, WordModule } from "../WordList"
import {
  DisplayOnlyResult,
  WordListEntryResult,
  WordListResult,
  WordListResultGroup,
} from "../components/WordListResult"

export class TrigramWordModule implements WordModule {
  public getShortName() {
    return "Trigrams"
  }

  public getName() {
    return "Making Words from Trigrams"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"3 ABCDEFGHI 6 AAA BBB CCC DDD ..."}</b> Find 10-letter words which can be made by assembling trigrams,
          with the given set of letters (ABCetc) inserted at column 6.
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("3")) {
      return true
    }
    return false
  }

  buildWord(letter: string, colIndex: number, tg1: string, tg2: string, tg3: string): string {
    switch (colIndex) {
      case 1:
        return letter + tg1 + tg2 + tg3
      case 4:
        return tg1 + letter + tg2 + tg3
      case 7:
        return tg1 + tg2 + letter + tg3
      case 10:
        return tg1 + tg2 + tg3 + letter
      default:
        return "error"
    }
  }

  addWords(wordList: WordList, results: WordListResult[], letters: string, colIndex: number, trigrams: string[]): void {
    let tryCount = 0
    for (let i1 = 0; i1 < trigrams.length; i1++) {
      for (let i2 = 0; i2 < trigrams.length; i2++) {
        for (let i3 = 0; i3 < trigrams.length; i3++) {
          if (i1 !== i2 && i1 !== i3 && i2 !== i3) {
            tryCount++
            if ((tryCount % 100) === 0) {
              console.log(`Tried ${tryCount}`)
            }
            for (let letterIndex = 0; letterIndex < letters.length; letterIndex++) {
              const letter = letters[letterIndex]
              const word = this.buildWord(letter, colIndex, trigrams[i1], trigrams[i2], trigrams[i3])
              const wle = wordList.findWord(word)
              if (wle) {
                results.push(new WordListEntryResult(wle))
              }
            }
          }
        }
      }
    }
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const parts = query.slice(1).split(" ")
    const letters = WordList.normalize(parts[0])
    const colIndex = parseInt(parts[1])
    const trigrams = parts.slice(2).map((x) => WordList.normalize(x))

    if (colIndex !== 1 && colIndex !== 4 && colIndex !== 7 && colIndex !== 10) {
      return [
        {
          title: "Error",
          results: [new DisplayOnlyResult(<span>Invalid column index...</span>)],
        },
      ]
    }

    const results: WordListResult[] = []
    this.addWords(wordList, results, letters, colIndex, trigrams)

    return [
      {
        title: this.getName(),
        results,
      },
    ]
  }
}
