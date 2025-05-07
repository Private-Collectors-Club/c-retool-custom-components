import { useMemo, type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import * as jsondiffpatch from 'jsondiffpatch'
import * as htmlFormatter from 'jsondiffpatch/formatters/html'
import './styles/jsondiffpatch-html.css'

export const DiffTool: FC = () => {
  // diff1
  const [diff1] = Retool.useStateObject({
    name: 'diff1',
  })

  // diff2
  const [diff2] = Retool.useStateObject({
    name: 'diff2',
  })

  // Safe parse function to handle stringified JSON
  function safeParse(obj: any) {
    if (typeof obj === 'string') {
      try {
        return JSON.parse(obj)
      } catch {
        return obj
      }
    }
    return obj
  }

  const parsed1 = safeParse(diff1)
  const parsed2 = safeParse(diff2)
  //const parsed1 = { "hello": 123 };
  //const parsed2 = { "hello": 456 };

  // Add Retool state for toggling unchanged output
  const [showUnchanged] = Retool.useStateObject({
    name: 'showUnchanged',
  })

  // Memoize delta calculation and HTML formatting
  const { delta, html, error } = useMemo(() => {
    try {
      const delta = jsondiffpatch.diff(parsed1 ?? {}, parsed2 ?? {})
      const html = delta
        ? htmlFormatter.format(delta, parsed1 ?? {}, {
          showUnchanged: !!showUnchanged,
          unchangedContext: 0,
        })
        : ''
      return { delta, html, error: null }
    } catch (e: any) {
      return { delta: null, html: '', error: e?.message || String(e) }
    }
  }, [diff1, diff2, showUnchanged])

  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div
        className="jsondiffpatch-delta"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
