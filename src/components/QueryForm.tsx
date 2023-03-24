import React, { useState } from "react"

export interface QueryFormProps {
  initialQuery?: string
  onQuery?: (query: string) => void
}

export default function QueryForm({ initialQuery, onQuery }: QueryFormProps) {
  const [query, setQuery] = useState<string>(initialQuery || "")

  const handleSubmit = (evt: any) => {
    evt.preventDefault()
    if (onQuery) {
      onQuery(query)
    }
  }

  return (
    <div className="query-form">
      <form onSubmit={handleSubmit}>
        <label>
          Word: <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <input type="submit" value="  Go  " />
      </form>
    </div>
  )
}
