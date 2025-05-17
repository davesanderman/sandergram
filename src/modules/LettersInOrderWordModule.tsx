import { WordList, WordListEntry, WordModule } from "../WordList"
import {
  DisplayOnlyResult,
  WordListListResult,
  WordListResult,
  WordListResultGroup,
} from "../components/WordListResult"

export class LettersInOrderWordModule implements WordModule {
  public getShortName() {
    return "LettersInOrder"
  }

  public getName() {
    return "Words Within Words"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"@word"}</b> Find words that can be formed by extracting letters in order
        </div>
        <div className="help-entry">
          <b>{"@word@n"}</b> Limit to words length n or greater (default 5)
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("@")) {
      return true
    }
    return false
  }

  //$ TODO: unify this loop and wordMatches()

  beginChain(
    wle: WordListEntry,
    startPattern: string,
    letterMap: Map<string, string>,
    alreadyMapped: string[],
    taboos: string[],
  ): boolean {
    if (wle.normalized.length !== startPattern.length) {
      return false
    }
    for (let i = 0; i < startPattern.length; i++) {
      const char = startPattern[i]
      const match = wle.normalized[i]
      if (char === ".") {
        if (!taboos.includes(match)) {
          taboos.push(match)
        }
      } else if (char.toLowerCase() === char) {
        if (match !== char.toUpperCase()) {
          return false
        }
      } else if (char.toUpperCase() === char) {
        if (letterMap.has(char)) {
          if (letterMap.get(char) !== match) {
            return false
          }
        } else {
          if (alreadyMapped.includes(match)) {
            return false
          }
          alreadyMapped.push(match)
          letterMap.set(char, match)
        }
      }
    }

    return true
  }

  wordMatches(
    wle: WordListEntry,
    target: string,
    letterMap: Map<string, string>,
    alreadyMapped: string[],
    curTaboos: string[],
    avoidTaboos: boolean,
    nextTaboos: string[],
  ): boolean {
    if (wle.normalized.length !== target.length) {
      return false
    }

    for (let i = 0; i < target.length; i++) {
      const char = target[i]
      const match = wle.normalized[i]
      if (char === ".") {
        if (curTaboos.includes(match)) {
          return false
        }
        if (!nextTaboos.includes(match)) {
          nextTaboos.push(match)
        }
      } else if (char.toLowerCase() === char) {
        if (match !== char.toUpperCase()) {
          return false
        }
      } else if (char.toUpperCase() === char) {
        if (letterMap.has(char)) {
          if (letterMap.get(char) !== match) {
            return false
          }
        } else {
          if (alreadyMapped.includes(match)) {
            return false
          }
          alreadyMapped.push(match)
          letterMap.set(char, match)
        }
      }
    }
    return true
  }

  continueChain(
    wordList: WordList,
    chainSoFar: WordListEntry[],
    remainingWords: string[],
    letterMap: Map<string, string>,

    alreadyMapped: string[],
    taboos: string[],
    avoidTaboos: boolean,
  ): WordListEntry[][] | undefined {
    if (remainingWords.length === 0) {
      return [chainSoFar]
    }

    const ret: WordListEntry[][] = []
    wordList.words.forEach((wle) => {
      const nextTaboos: string[] = []
      if (this.wordMatches(wle, remainingWords[0], letterMap, alreadyMapped, taboos, avoidTaboos, nextTaboos)) {
        const recurse = this.continueChain(
          wordList,
          [...chainSoFar, wle],
          remainingWords.slice(1),
          letterMap,
          alreadyMapped,
          nextTaboos,
          avoidTaboos,
        )
        if (recurse) {
          ret.push(...recurse)
        }
      }
    })
    return ret
  }

  getExtractedMatches(wordList: WordList, entry: string, len: number): WordListEntry[] {
    const src = WordList.normalize(entry)
    const srcLen = src.length
    const ret: WordListEntry[] = []
    wordList.words.forEach((w) => {
      if (w.normalized.length >= len) {
        let wPos = 0
        for (let i = 0; i < srcLen; i++) {
          if (src[i] === w.normalized[wPos]) {
            wPos++
            if (wPos === w.normalized.length) {
              ret.push(w)
              break
            }
          }
        }
      }
    })
    return ret
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const parts = query.split("@")
    parts.splice(0, 1) // remove leading empty word
    const word = parts[0]
    let len = 5
    if (parts.length > 1) {
      len = parseInt(parts[1])
    }
    return [
      {
        title: "Extracted Words",
        results: this.getExtractedMatches(wordList, word, len),
      },
    ]
  }
}
