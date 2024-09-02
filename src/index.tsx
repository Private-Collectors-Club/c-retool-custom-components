import React from 'react'
import { type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer'

export const DiffTool: FC = () => {
  // diff1
  const [diff1, _setDiff1] = Retool.useStateObject({
    name: 'diff1',
  })

  //diff2
  const [diff2, _setDiff2] = Retool.useStateObject({
    name: 'diff2',
  })

  return (
    <div>
      {(!diff1 || !diff2) ? (
        <div>Please enter values for both diffs</div>
      ) : (
        <ReactDiffViewer
          compareMethod={DiffMethod.LINES}
          oldValue={JSON.stringify(diff1, null, 2)}
          newValue={JSON.stringify(diff2, null, 2)}
          hideLineNumbers={false}
          splitView={true} />
      )}
    </div>
  );
}
