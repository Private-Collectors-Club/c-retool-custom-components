import { useMemo, type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import { Diff, Hunk, parseDiff } from 'react-diff-view'
import 'react-diff-view/style/index.css'
import { createTwoFilesPatch } from 'diff'

export const DiffTool: FC = () => {
  // diff1
  const [diff1, _setDiff1] = Retool.useStateObject({
    name: 'diff1',
  })

  // diff2
  const [diff2, _setDiff2] = Retool.useStateObject({
    name: 'diff2',
  })

  // Memoize diff calculation and error handling
  const { diffText, files, error } = useMemo(() => {
    try {
      const oldValue = JSON.stringify(diff1 ?? {}, null, 2)
      const newValue = JSON.stringify(diff2 ?? {}, null, 2)
      const diffText = createTwoFilesPatch('Old', 'New', oldValue, newValue)
      const files = parseDiff(diffText)
      return { diffText, files, error: null }
    } catch (e: any) {
      return { diffText: '', files: [], error: e?.message || String(e) }
    }
  }, [diff1, diff2])

  return (
    <div>
      <h2>Retool JSON Diff Viewer</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {(!diff1 || !diff2) ? (
        <div>
          <h3>Input Status</h3>
          <div>Please enter values for both diffs</div>
        </div>
      ) : !files[0] || !Array.isArray(files[0].hunks) ? (
        <div>
          <h3>Diff Output</h3>
          <div>No diff to display</div>
          <h3 style={{ marginTop: 16 }}>Raw diffText</h3>
          <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8f8f8', color: '#333', fontSize: 12 }}>
            {diffText}
          </pre>
        </div>
      ) : (
        <>
          <h3>Visual Diff</h3>
          <Diff viewType="split" diffType="modify" hunks={files[0].hunks}>
            {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
          </Diff>
          <div style={{ marginTop: 24 }}>
            <h3>Raw diffText</h3>
            <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8f8f8', color: '#333', fontSize: 12 }}>
              {diffText}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}
