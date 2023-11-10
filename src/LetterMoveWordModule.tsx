import { WordList, WordListEntry, WordModule } from "./WordList"
import { DisplayOnlyResult, WordListListResult, WordListResult, WordListResultGroup } from "./components/WordListResult"

//$ TODO: Extend to chains instead of just pairs

export class LetterMoveWordModule implements WordModule {
  public getShortName() {
    return "LetterMove"
  }

  public getName() {
    return "Moving Letters Around"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"~pattern1~pattern2"}</b> Find word sets with the same letters but rearranged
        </div>
        <div className="help-entry">Example (example TKTKTK)</div>
        <div className="help-entry">
          Note: Assumes all existing letter matches are listed. End with ~! to turn off that assumption.
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("~")) {
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

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const words = query.split("~")
    words.splice(0, 1) // remove leading empty word
    const firstWord = words.splice(0, 1)[0]
    let avoidTaboos = true
    if (words[words.length - 1] === "!") {
      words.splice(-1, 1)
      avoidTaboos = false
    }
    if (words.length < 1) {
      return [
        {
          title: "Error",
          results: [new DisplayOnlyResult(<span>Must supply at least two entries...</span>)],
        },
      ]
    }

    const resultList: WordListResult[][] = []

    wordList.words.forEach((wle) => {
      const letterMap: Map<string, string> = new Map<string, string>()
      const alreadyMapped: string[] = []
      const taboos: string[] = []
      if (this.beginChain(wle, firstWord, letterMap, alreadyMapped, taboos)) {
        const restOfWords = this.continueChain(wordList, [wle], words, letterMap, alreadyMapped, taboos, avoidTaboos)
        if (restOfWords) {
          resultList.push(...restOfWords)
        }
      }
    })

    const results = resultList.map((chain) => {
      return new WordListListResult(chain)
    })

    return [
      {
        title: "Chains",
        results,
      },
    ]
  }
}
