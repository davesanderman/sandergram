import {
  WordList,
  WordListEntry,
  WordModule,
} from "./WordList"
import { WordListResult, WordListResultGroup } from "./components/WordListResult"

export class AnagraphWordModule implements WordModule {
  public getShortName() {
    return "anagraph"
  }

  public getName() {
    return "Anagraphs"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>#word</b> Find{" "}
          <a target="_blank" rel="noreferrer" href="https://www.youtube.com/watch?v=qTBAW-Eh0tM">
            anagraphs
          </a>{" "}
          of a word
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    wordListEntry.extra.anagraphed = AnagraphWordModule.computeAnagraphed(wordListEntry.normalized)
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("#")) {
      return true
    }
    return false
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const results = this.getAnagraphs(wordList, query)

    return [
      {
        title: this.getName(),
        results,
      },
    ]
  }

  getAnagraphs(wordList: WordList, query: string): WordListResult[] {
    const ag = AnagraphWordModule.computeAnagraphed(WordList.normalize(query))
    return wordList.words.filter((wle) => AnagraphWordModule.isMatch(wle.extra?.anagraphed, ag))
  }

  // call this with a word that's normalized to all uppercase
  public static computeAnagraphed(candidate: string): number[] | null {
    const ret: number[] = [0, 0, 0, 0, 0, 0, 0, 0]
    candidate.split("").forEach((c) => {
      const diff = c.charCodeAt(0) - 65
      if (diff < 0 || diff > 25) {
        return null
      }
      for (let i = 0; i < 8; i++) {
        ret[i] += AnagraphWordModule.c_counts[diff][i]
      }
    })

    return ret
  }

  public static getString(anagraphed: number[]): string {
    let ret = ""
    for (let i = 0; i < 8; i++) {
      ret += `${anagraphed[i]}${AnagraphWordModule.c_chars[i]} `
    }
    return ret
  }

  public static isMatch(a1: number[] | null, a2: number[] | null): boolean {
    if (!a1 || !a2) {
      return false
    }
    return (
      a1[0] === a2[0] &&
      a1[1] === a2[1] &&
      a1[2] === a2[2] &&
      a1[3] === a2[3] &&
      a1[4] === a2[4] &&
      a1[5] === a2[5] &&
      a1[6] === a2[6] &&
      a1[7] === a2[7]
    )
  }

  private static c_chars: string[] = ["c", "e", "o", "r", "s", ".", "-", ")"]
  private static c_counts: number[][] = [
    //    c  e  o  r  s  .  -  )
    [1, 0, 0, 0, 0, 0, 1, 0], // a
    [1, 0, 0, 0, 0, 0, 2, 0], // b
    [1, 0, 0, 0, 0, 0, 0, 0], // c
    [1, 0, 0, 0, 0, 0, 2, 0], // d
    [0, 1, 0, 0, 0, 0, 0, 0], // e
    [0, 0, 0, 0, 0, 0, 2, 1], // f
    [1, 0, 0, 0, 0, 0, 1, 1], // g
    [0, 0, 0, 1, 0, 0, 2, 0], // h
    [0, 0, 0, 0, 0, 1, 1, 0], // i
    [0, 0, 0, 0, 0, 1, 1, 1], // j
    [0, 0, 0, 0, 0, 0, 4, 0], // k
    [0, 0, 0, 0, 0, 0, 2, 0], // l
    [0, 0, 0, 2, 0, 0, 1, 0], // m
    [0, 0, 0, 1, 0, 0, 1, 0], // n
    [0, 0, 1, 0, 0, 0, 0, 0], // o
    [1, 0, 0, 0, 0, 0, 2, 0], // p
    [1, 0, 0, 0, 0, 0, 2, 0], // q
    [0, 0, 0, 1, 0, 0, 0, 0], // r
    [0, 0, 0, 0, 1, 0, 0, 0], // s
    [0, 0, 0, 0, 0, 0, 3, 0], // t
    [0, 0, 0, 1, 0, 0, 1, 0], // u
    [0, 0, 0, 0, 0, 0, 2, 0], // v
    [0, 0, 0, 0, 0, 0, 4, 0], // w
    [0, 0, 0, 0, 0, 0, 4, 0], // x
    [0, 0, 0, 1, 0, 0, 1, 1], // y
    [0, 0, 0, 0, 0, 0, 3, 0], // z
  ]
}
