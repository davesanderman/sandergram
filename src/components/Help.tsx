import { WordModule } from "../WordList"

export interface HelpProps {
  modules: WordModule[]
}

export default function Help({ modules }: HelpProps) {
  return (
    <div className="help-wrapper">
      <div className="help-header">Help:</div>

      <>
        {modules.map((m) => (
          <div key={`help-${m.getShortName()}`}>{m.getHelpDesc()}</div>
        ))}
      </>
    </div>
  )
}
