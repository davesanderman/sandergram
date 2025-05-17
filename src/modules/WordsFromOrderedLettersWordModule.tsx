import { WordList, WordListEntry, WordModule } from "../WordList"
import {
  WordListResultGroup,
} from "../components/WordListResult"

export class WordsFromOrderedLettersWordModule implements WordModule {
  public getShortName() {
    return "WordsFromOrderedLetters"
  }

  public getName() {
    return "Words From Ordered Letters"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>{"#word#word#word"}</b> Find words that have each subword in order within them
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // nothing here
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("#")) {
      return true
    }
    return false
  }

  wordContainsWord(word: WordListEntry, part: string): boolean {
    let wordIndex =0;
    let partIndex = 0;
    while (wordIndex < word.normalized.length) {
      if (word.normalized[wordIndex] === part[partIndex]) {
        partIndex++;
        if (partIndex >= part.length) {
          return true;
        }
      }
      wordIndex++;
    }
    return false;
  }

  getExtractedMatches(wordList: WordList, words: string[]): WordListEntry[] {
    let minLen = 0;
    words.forEach((w) => {
      if (w.length > minLen) {
        minLen = w.length;
      }
    });

    const ret: WordListEntry[] = []
    wordList.words.forEach((wle) => {
      if (wle.normalized.length > minLen) {
        let matchesAll = true;
        for (let i = 0; i < words.length; i++) {
          if (!this.wordContainsWord(wle, words[i])) {
            matchesAll = false;
            break;
          }
        }
        if (matchesAll) {
          ret.push(wle);
        }
      }
    });
    return ret;
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const parts = query.split("#")
    parts.splice(0, 1) // remove leading empty word
    return [
      {
        title: "Extracted Words",
        results: this.getExtractedMatches(wordList, parts.map((w) => WordList.normalize(w))),
      },
    ]
  }
}
