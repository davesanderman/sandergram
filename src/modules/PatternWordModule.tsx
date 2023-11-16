import { UPPERCASE_ALPHABET } from "../Constants"
import { WordList, WordListEntry, WordModule } from "../WordList"
import {
  DisplayOnlyResult,
  WordListEntryResult,
  WordListResult,
  WordListResultGroup,
} from "../components/WordListResult"

export class PatternWordModule implements WordModule {
  public getShortName() {
    return "Pattern"
  }

  public getName() {
    return "Pattern Matching"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"/pattern"}</b> Find words which match Qat-style patterns
        </div>
        <div className="help-entry">
          <b>{"/pattern/taboo"}</b> Find words which match Qat-style patterns, but dot and star can't match any
          characters in "taboo"
        </div>
        <div className="help-entry">
          . matches any letter. [abc] matches a, b, or c. [a-g] matches a,b,c,d,e,f or g. * matches any sequence of
          letters.
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("/")) {
      return true
    }
    return false
  }

  matchPattern(wordList: WordList, pattern: string, taboo: string | undefined): WordListResult[] {
    const parsed = this.parsePattern(pattern, taboo)
    if (!parsed) {
      return [new DisplayOnlyResult(<span>Invalid expression</span>)]
    }
    const ret: WordListResult[] = []
    wordList.words.forEach((wle) => {
      if (this.wordMatches(wle, parsed)) {
        const wlr = new WordListEntryResult(wle)
        ret.push(wlr)
      }
      //$
    })
    return ret
  }

  wordMatches(wle: WordListEntry, parsed: RegExp): boolean {
    if (parsed.exec(wle.normalized)) {
      //$ TODO: Maybe add a way to show the details of the match?
      return true
    }
    return false
  }

  getAllChars(taboo: string | undefined): string {
    if (!taboo) {
      return "."
    }
    let ret = "["
    UPPERCASE_ALPHABET.forEach((c) => {
      if (!taboo || !taboo.includes(c)) {
        ret += c
      }
    })
    ret += "]"
    return ret
  }

  // This is primitive and I should just use regexes, but who cares.
  parsePattern(pattern: string, taboo: string | undefined): RegExp | undefined {
    const allChars = this.getAllChars(taboo)
    let expString = "^"
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i]
      if (char === "*") {
        expString += ".*"
      } else if (char === ".") {
        expString += allChars
      } else if (char === "[") {
        const iStart = i
        while (i < pattern.length && pattern[i] !== "]") {
          i++
        }
        if (i >= pattern.length) {
          return undefined
        }
        expString += pattern.substring(iStart, i + 1)
      } else {
        expString += char
      }
    }
    expString += "$"
    return new RegExp(expString)
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const parts = query.split("/")
    const pattern = WordList.normalize(parts[1])
    const taboo = parts[2] ? WordList.normalize(parts[2]) : undefined

    const results = this.matchPattern(wordList, pattern, taboo)

    return [
      {
        title: this.getName(),
        results,
      },
    ]
  }
}
