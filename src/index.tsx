import { useMemo, type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import * as jsondiffpatch from 'jsondiffpatch'
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

  // Memoize delta calculation and HTML formatting
  const { delta, html, error } = useMemo(() => {
    console.log('parsed1:', parsed1)
    console.log('parsed2:', parsed2)
    try {
      const delta = jsondiffpatch.diff(parsed1 ?? {}, parsed2 ?? {})
      const html = delta
        ? (jsondiffpatch as any).formatters.html.format(delta, parsed1 ?? {})
        : ''
      return { delta, html, error: null }
    } catch (e: any) {
      return { delta: null, html: '', error: e?.message || String(e) }
    }
  }, [diff1, diff2])

  return (
    <div>
      <h2>Retool JSON Diff Viewer (jsondiffpatch)</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <h3>Old Value (diff1)</h3>
      <pre style={{ maxHeight: 150, overflow: 'auto', background: '#f0f0f0', color: '#333', fontSize: 12 }}>
        {JSON.stringify(diff1 ?? {}, null, 2)}
      </pre>
      <h3>New Value (diff2)</h3>
      <pre style={{ maxHeight: 150, overflow: 'auto', background: '#f0f0f0', color: '#333', fontSize: 12 }}>
        {JSON.stringify(diff2 ?? {}, null, 2)}
      </pre>
      <h4>Debug: Parsed diff1 and diff2</h4>
      <pre style={{ maxHeight: 100, overflow: 'auto', background: '#ffe', color: '#a33', fontSize: 11 }}>
        parsed1: {JSON.stringify(parsed1)}
        parsed2: {JSON.stringify(parsed2)}
      </pre>
      <h3>Delta (JSON)</h3>
      <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8f8f8', color: '#333', fontSize: 12 }}>
        {delta ? JSON.stringify(delta, null, 2) : '(No delta)'}
      </pre>
      <h3>Visual Diff</h3>
      <div
        style={{
          maxHeight: 400,
          overflow: 'auto',
          background: '#fff',
          color: '#333',
          fontSize: 14,
          border: '1px solid #eee',
          padding: 8,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
