import { Link } from "react-router-dom"
import { WordListEntry } from "../WordList"

export interface WordLinkProps {
  word?: string
  entry?: WordListEntry
}

export default function WordLink({
  word,
  entry,
}: WordLinkProps) {

  if (entry) {
    return <Link to={`/s/${encodeURIComponent(entry.raw)}`}>{entry.raw}</Link>
  }
  if (word) {
    return <Link to={`/s/${encodeURIComponent(word)}`}>{word}</Link>
  }
  return <span>Error!</span>
}