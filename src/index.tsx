import { type FC } from 'react'

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

  // Convert objects to pretty-printed JSON strings
  const oldValue = JSON.stringify(diff1 ?? {}, null, 2)
  const newValue = JSON.stringify(diff2 ?? {}, null, 2)

  // Create a unified diff string
  const diffText = createTwoFilesPatch('Old', 'New', oldValue, newValue)
  const files = parseDiff(diffText)

  // Debug output
  console.log('diffText:', diffText)
  console.log('files:', files)
  console.log('files[0]:', files[0])

  return (
    <div>
      {(!diff1 || !diff2) ? (
        <div>Please enter values for both diffs</div>
      ) : !files[0] || !Array.isArray(files[0].hunks) ? (
        <div>
          <div>No diff to display</div>
          <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8f8f8', color: '#333', fontSize: 12, marginTop: 16 }}>
            {diffText}
          </pre>
        </div>
      ) : (
        <>
          <Diff viewType="split" diffType="modify" hunks={files[0].hunks}>
            {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
          </Diff>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Raw diffText:</div>
            <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8f8f8', color: '#333', fontSize: 12 }}>
              {diffText}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}
