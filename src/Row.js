import React from 'react';
import some from 'lodash/some';
import filter from 'lodash/filter';
import first from 'lodash/first';

function Row({rowNum, row, ratio, merges}) {
  return (
    <tr>
      {row.map((cell, c) => {
        const isOmit = some(merges, item => {
          return c >= (item.left - 1) && rowNum >= (item.top - 1) && c <= (item.right - 1) && rowNum <= (item.bottom - 1);
        });

        const mc = first(filter(merges, item => {
          return c === (item.top - 1) && rowNum === (item.left - 1);
        }));

        if(isOmit && !mc) {
          return null;
        }

        return (
          <td
            rowSpan={mc ? (mc.bottom - mc.top + 1) : undefined}
            colSpan={mc ? (mc.right - mc.left + 1) : undefined}
            className="table-cell"
            style={{
              fontSize: cell?.s?.font?.size * ratio * 0.75,
              fontWeight: cell?.s?.font?.bold ? 'bold' : 'inherit',
            }}>
            {cell?.v || null}
          </td>
        );
        
      })}
    </tr>
  );
}

export default Row;
