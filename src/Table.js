import React, { useEffect, useRef, useState } from 'react'
import { SSF } from 'xlsx';
import map from 'lodash/map';
import compact from 'lodash/compact';
import values from 'lodash/values';
import TextboxButton from './TextboxButton';
import './Table.css';
import Draggable from './Draggable';
import Row from './Row';
import { sortBy } from 'lodash';
import { closest } from './util';



const Table = ({ workbook }) => {
  const [data, setData] = useState({ json: [], merges: {}});
  const [size, setSize] = useState({ ratio: 1 });
  const [initialSize, setInitialSize] = useState({ ratio: 1 });

  const tableRef = useRef();
  useEffect(() => {
    if(tableRef?.current?.getClientRects) {
      const rect = tableRef.current.getClientRects()[0];
      setSize({ ...size, height: rect.height, width: rect.width });
      setInitialSize({ ...size, height: rect.height, width: rect.width });
    }
  }, [tableRef, data]);


  const [grid, setGrid] = useState({ rows: [], cols: [] }); 
  useEffect(() => {
    const rows = tableRef?.current?.children;
    const tableRect = tableRef?.current.getClientRects()[0];
    if(rows.length) {
      const g = {rows: [], cols: []};
      for(let i = 0; i<rows.length; i++) {
        g.rows.push(rows[i].getClientRects()[0].y - tableRect.top);
      }
      const cols = rows[0].children;
      for(let i = 0; i<cols.length; i++) {
        g.cols.push(cols[i].getClientRects()[0].x);
      }
      setGrid(g); 
    }
  }, [tableRef, size]);

  useEffect(() => {
    const worksheet = workbook.worksheets[0];
    const merges = values(worksheet?._merges).map(i => i.model);
    const json = map(worksheet?._rows, (row) => {
      return map(row?._cells, cell => {
        return {
          v: SSF.format(cell?.style?.numFmt, cell?.value),
          s: cell?.style,
        };
      });
    });

    setData({
      json,
      merges,
    });
  }, []);

  const [gripMode, setGripMode] = useState(false);
  const [vBounds, setVBound] = useState([0, 0]);
  const [hBounds, setHBound] = useState([0, 0]);

  const set2Bounds = (arr, modifier, index, item) => {
    const newarr = [...arr];
    newarr[index] = item;
    modifier(sortBy(newarr, a => a));
  }

  const tableRect = tableRef?.current?.getClientRects()[0];

  const doCrop = () => {
    const colsIdx = [grid.cols.indexOf(vBounds[0]) || 0, grid.cols.indexOf(vBounds[1]) || 0];
    const rowsIdx = [grid.rows.indexOf(hBounds[0]) || 0, grid.rows.indexOf(hBounds[1]) || 0];
    const newJson = compact(data.json.map((row, r) => {
      if(r >= rowsIdx[0] && r < rowsIdx[1]) {
        return null;
      }
      return compact(map(row, (cell, c) => {
        if(c >= colsIdx[0] && c < colsIdx[1]) {
          return null;
        }
        return cell;
      }));
    }))
    setData({
      ...data,
      json: newJson
    });
    setVBound([0, 0])
    setHBound([0, 0])
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
        &nbsp;
        <TextboxButton />
        &nbsp;
        <button onClick={() => { setGripMode(!gripMode) }}>{gripMode ? 'Disable' : 'Enable'} crop table mode</button>
        &nbsp;
        { gripMode ? <button onClick={doCrop}>Crop</button> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginRight: 30, marginBottom: 30 }}>
        <div
          style={{ position: 'relative' }}>
            { gripMode && <>
              <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                <div
                  className="breakbox v"
                  style={{ left: vBounds[0], right: vBounds[1], width: vBounds[1] - vBounds[0] }}>
                  <Draggable
                    axis='x'
                    className="breakline v left"
                    onStop={({x}) => set2Bounds(vBounds, setVBound, 0, closest(grid.cols, Math.floor(x)))} />
                  <Draggable
                    axis='x'
                    className="breakline v right"
                    onStop={({x}) => set2Bounds(vBounds, setVBound, 1, closest(grid.cols, Math.floor(x)))} />
                </div>
              </div>
              <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                <div
                  className="breakbox h"
                  style={{ top: hBounds[0], bottom: hBounds[1], height: hBounds[1] - hBounds[0] }}>
                  <Draggable
                    axis='y'
                    className="breakline h top"
                    onStop={({y}) => set2Bounds(hBounds, setHBound, 0, closest(grid.rows, Math.floor(y) - tableRect.y))} />
                  <Draggable
                    axis='y'
                    className="breakline h bottom"
                    onStop={({y}) => set2Bounds(hBounds, setHBound, 1, closest(grid.rows, Math.floor(y) - tableRect.y))} />
                </div>
              </div>
              </>
            }
            <Draggable
              axis='y'
              className="resize h"
              onStop={(_, {y}) => {
                const deltaY = y - initialSize.height;
                const ratio = (initialSize.height + deltaY) / initialSize.height;
                setSize({ ...size, height: initialSize.height * ratio, width: initialSize.width * ratio, ratio })
              }} />
            <Draggable
              axis='x'
              className="resize v"
              onStop={(_, {x}) => {
                const deltaX = x - initialSize.width;
                const ratio = (initialSize.width + deltaX) / initialSize.width;
                setSize({ ...size, height: initialSize.width * ratio, width: initialSize.width * ratio, ratio })
              }} />
            <table ref={tableRef} className="table" style={{width: size?.width, height: size?.height}}>
              {data.json.map((row, i) => (
                <Row row={row} rowNum={i} merges={data.merges} ratio={size.ratio} />
              ))}
            </table>
          </div>
      </div>
    </div>
  );
}

export default Table;
