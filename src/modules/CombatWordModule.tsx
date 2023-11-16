import { WordList, WordListEntry, WordModule } from "../WordList"
import { DisplayOnlyResult, WordListResultGroup } from "../components/WordListResult"

export class CombatWordModule implements WordModule {
  public getShortName() {
    return "combat"
  }

  public getName() {
    return "Combat Roller"
  }

  public getHelpDesc() {
    return (
      <>
        <div className="help-entry">
          <b>combat:word:win:loss:draw</b> Combat Roller: Find a word
        </div>
        <div className="help-entry">
          <b>combat:word1:word2</b> Combat Roller: Fight!
        </div>
      </>
    )
  }

  public annotateWord(wordListEntry: WordListEntry): void {
    // Do nothing -- the default processing does everything we need here.
  }

  public claimQuery(query: string): boolean {
    if (query.startsWith("combat:")) {
      return true
    }
    return false
  }

  public findCombatWld(word1: string, word2: string): number[] {
    const letters1 = word1.toUpperCase().split("")
    const letters2 = word2.toUpperCase().split("")
    const fighters1 = [
      letters1[0],
      letters1[1],
      letters1[1],
      letters1[2],
      letters1[2],
      letters1[2],
      letters1[3],
      letters1[3],
      letters1[3],
      letters1[3],
      letters1[4],
      letters1[4],
      letters1[4],
      letters1[4],
      letters1[4],
      letters1[5],
      letters1[5],
      letters1[5],
      letters1[5],
      letters1[5],
      letters1[5],
    ]
    const fighters2 = [
      letters2[0],
      letters2[1],
      letters2[1],
      letters2[2],
      letters2[2],
      letters2[2],
      letters2[3],
      letters2[3],
      letters2[3],
      letters2[3],
      letters2[4],
      letters2[4],
      letters2[4],
      letters2[4],
      letters2[4],
      letters2[5],
      letters2[5],
      letters2[5],
      letters2[5],
      letters2[5],
      letters2[5],
    ]
    let win = 0
    let loss = 0
    let draw = 0
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        if (fighters1[i] > fighters2[j]) {
          win++
        } else if (fighters1[i] < fighters2[j]) {
          loss++
        } else {
          draw++
        }
      }
    }
    return [win / 441, loss / 441, draw / 441]
  }

  public findMatchingCombatWords(
    wordList: WordList,
    word: string,
    win: number,
    lose: number,
    draw: number,
  ): WordListEntry[] {
    const sixes = wordList.words.filter((wle) => wle.upper.length === 6)
    const answers = sixes.filter((wle) => {
      const wld = this.findCombatWld(word, wle.upper)
      if (Math.abs(wld[0] - win) >= 0.0001) {
        return false
      }
      if (Math.abs(wld[1] - lose) >= 0.0001) {
        return false
      }
      if (Math.abs(wld[2] - draw) >= 0.0001) {
        return false
      }
      return true
    })
    return answers
  }

  public processQuery(wordList: WordList, query: string): WordListResultGroup[] {
    const words = query.split(":")
    if (words.length === 3) {
      const rg: WordListResultGroup = {
        title: `Fight! ${words[1]} vs ${words[2]}`,
        results: [],
      }

      const wld = this.findCombatWld(words[1], words[2])
      const fmt = new Intl.NumberFormat("default", {
        style: "percent",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
      const pretty = wld.map((n) => fmt.format(n))
      rg.results.push(
        new DisplayOnlyResult(
          (
            <span>
              <b>Wins:</b> {pretty[0]}
            </span>
          ),
        ),
      )
      rg.results.push(
        new DisplayOnlyResult(
          (
            <span>
              <b>Losses:</b> {pretty[1]}
            </span>
          ),
        ),
      )
      rg.results.push(
        new DisplayOnlyResult(
          (
            <span>
              <b>Draws:</b> {pretty[2]}
            </span>
          ),
        ),
      )
      return [rg]
    } else {
      if (words.length !== 5) {
        return []
        //$ TODO: <ErrorResult>
      } else {
        const rg: WordListResultGroup = {
          title: `Combat Roller: ${words[1]}`,
          results: [],
        }

        const answers = this.findMatchingCombatWords(
          wordList,
          words[1],
          parseFloat(words[2]) / 100,
          parseFloat(words[3]) / 100,
          parseFloat(words[4]) / 100,
        )
        rg.results = answers
        return [rg]
      }
    }
  }
}
