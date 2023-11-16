import {
  WordList,
  WordListEntry,
  WordModule,
} from "./WordList"
import { CombatWordModule } from "./modules/CombatWordModule"
import { DisemvoweledWordModule } from "./modules/DisemvoweledWordModule"
import { OffByWordModule } from "./modules/OffByWordModule"
import { ContainsWordModule } from "./modules/ContainsWordModule"
import { AnagraphWordModule } from "./modules/AnagraphWordModule"
import { CharRemovalWordModule } from "./modules/CharRemovalWordModule"
import { AlternateDeletionWordModule } from "./modules/AlternateDeletionWordModule"
import WordLink from "./components/WordLink"
import { PatternWordModule } from "./modules/PatternWordModule"
import { LetterMoveWordModule } from "./modules/LetterMoveWordModule"
import { DisplayOnlyResult, WordListResult, WordListResultGroup } from "./components/WordListResult"

class DefaultWordModule implements WordModule {
  public getShortName() {
    return "default"
  }

  public getName() {
    return "Default"
  }

  public getHelpDesc() {
    return (
      <div className="help-entry">
        <i>Anything else:</i> Find anagrams and +1/-1 anagrams (aka transadditions/transdeletions)
      </div>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // Do nothing -- the default processing does everything we need here.
  }

  public claimQuery(query: string): boolean {
    // If we get to here, just do the default processing.
    return true
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
      const plusones: WordListResult[] = []
      const minusones: WordListResult[] = []

      ;("abcdefghijklmnopqrstuvwxyz".split("")).forEach((ch: string) => {
        const p1 = wordList.getAnagrams(query + ch)
        p1.forEach((wle) => {
          const dor = new DisplayOnlyResult(<span><b>{query} + {ch}</b>: <WordLink entry={wle} /></span>)
          plusones.push(dor)
        })
        const i = WordList.toLower(query).indexOf(ch)
        if (i !== -1) {
          const without = query.slice(0, i) + query.slice(i + 1)
          const m1 = wordList.getAnagrams(without)
          m1.forEach((wle) => {
            const dor = new DisplayOnlyResult(<span><b>{query} - {ch.toLowerCase()}</b>: <WordLink entry={wle} /></span>)
            minusones.push(dor)
          })
        }
      })

    return [
      {
        title: "Anagrams for " + query,
        results: wordList.getAnagrams(query),
      },
      {
        title: "Plus 1 Anagrams",
        results: plusones,
      },
      {
        title: "Minus 1 Anagrams",
        results: minusones,
      },
    ]
  }
}

// DefaultWordModule should be last...
export const Modules = [
  new CombatWordModule(),
  new OffByWordModule(),
  new PatternWordModule(),
  new LetterMoveWordModule(),
  new AlternateDeletionWordModule(),
  new AnagraphWordModule(),
  new CharRemovalWordModule(),
  new ContainsWordModule(),
  new DisemvoweledWordModule(),
  new DefaultWordModule(),
]
