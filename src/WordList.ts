export class WordListEntry {
  constructor(word: string) {
    this.raw = word.replace(/[-, ']/g, "")
    this.upper = WordList.toUpper(this.raw)
    this.lower = WordList.toLower(this.raw)
    this.normalized = WordList.normalize(this.raw)
    this.sorted = WordList.sortWord(this.normalized)
    this.extra = {}
  }

  public raw: string = ""
  public upper: string = ""
  public lower: string = ""
  public normalized: string = ""
  public sorted: string = ""
  public extra: Record<string, any> = {}
}

export class WordListEntryResult extends WordListEntry {
  constructor(wle: WordListEntry) {
    super(wle.raw)
  }

  public displayText?: JSX.Element
}

export class DisplayOnlyResult extends WordListEntry {
  constructor(displayText: JSX.Element) {
    super("n/a")
    this.displayText = displayText
  }

  public displayText?: JSX.Element
}

export type WordListResult = WordListEntryResult | DisplayOnlyResult

export interface WordListResultGroup {
  title: string
  results: WordListResult[]
}

export interface WordModule {
  getShortName: () => string
  getName: () => string
  getHelpDesc: () => JSX.Element
  annotateWord: (wordListEntry: WordListEntry) => void
  claimQuery: (query: string) => boolean
  processQuery: (wordList: WordList, query: string) => WordListResultGroup[]
}

export class WordList {
  private _words: WordListEntry[]
  constructor() {
    this._words = []
  }

  public get count(): number {
    return this._words.length
  }

  public get words(): WordListEntry[] {
    return this._words
  }

  //$ TODO: Error handling
  //$ TODO: Maybe just make this use a callback instead of being awaitable
  async loadWordList(wordListPath: string, modules: WordModule[]) {
    const response = await fetch(wordListPath)

    //$ TODO: Handle other EOLs
    const words = (await response.text()).split("\r\n")
    words.forEach((w) => {
      const wordListEntry = new WordListEntry(w)
      modules.forEach((m) => {
        m.annotateWord(wordListEntry)
      })
      this._words.push(wordListEntry)
    })
  }

  //$ TODO: Make this be a culture-invariant uppercasing?
  public static normalize(word: string): string {
    return word.toUpperCase()
  }

  public static toUpper(word: string): string {
    return word.toUpperCase()
  }

  public static toLower(word: string): string {
    return word.toLowerCase()
  }

  public static sortWord(word: string): string {
    return word.split("").sort().join("")
  }

  // Expects to be called on a normalize()d word
  public static disemvowel(word: string): string {
    return word.replace(/[AEIOU]*/g, "")
  }

  public static prepForAnagram(word: string): string {
    return WordList.sortWord(WordList.normalize(word))
  }

  public static wrongLetters(word: string, target: string): string {
    let ret = ""
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== target[i]) {
        ret += word[i]
      }
    }
    return ret
  }

  public static matchesPattern(pattern: string, candidate: string): boolean {
    if (pattern.length !== candidate.length) {
      return false
    }
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== ".") {
        if (pattern[i] !== candidate[i]) {
          return false
        }
      }
    }
    return true
  }  

  public getAnagrams(word: string): WordListEntry[] {
    const ret: WordListEntry[] = []
    const prepped = WordList.prepForAnagram(word)
    return this._words.filter((wle) => wle.sorted === prepped)
  }

  public getDisemvoweledMatches(word: string): WordListEntry[] {
    const ret: WordListEntry[] = []
    const prepped = WordList.disemvowel(WordList.normalize(word))
    return this.words.filter((wle) => wle.extra.disemvoweled === prepped)
  }

  public runQuery(query: string, modules: WordModule[]): WordListResultGroup[] {
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].claimQuery(query)) {
        return modules[i].processQuery(this, query)
      }
    }
    throw new Error("Error: Need a default query processor")
  }
}
