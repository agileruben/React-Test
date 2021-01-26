import React, { useState } from 'react';
import { difference, omit } from 'lodash';
import { v4 as uuid } from 'uuid';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faCropAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Sketch from './Sketch';
import './TextboxButton.css';


export default function TextboxButton() {
  const [ids, setIds] = useState([]);
  const [idToText, setIdToText] = useState({});

  const addText = () => {
    const x = window.innerWidth / 3;
    const y = window.innerHeight / 3;
    const width = 150;
    const height = 50;

    const id = uuid();

    setIds([...ids, id]);
    setIdToText({
      ...idToText,
      [id]: { text: "Hello", x, y, width, height, backgroundColor: { r: 255, g: 255, b: 255, a: 255  } }
    });
  }

  const handleDragStop = (id, _, {x, y}) => {
    setIdToText({ ...idToText, [id]: {...idToText[id], x, y }});
  }

  const handleResizeStop = (id, _, {width, height}) => {
    setIdToText({ ...idToText, [id]: {...idToText[id], width, height }});
  }

  const removeText = (id) => {
    setIds(difference(ids, [id]));
    setIdToText(omit(idToText, id));
  }

  const handleColor = (id, color) => {
    setIdToText({ ...idToText, [id]: {...idToText[id], backgroundColor: color }});
  }

  const handleTextColor = (id, color) => {
    setIdToText({ ...idToText, [id]: {...idToText[id], color }});
  }

  return (
    <>
      <div>
        <button onClick={addText}>Add text</button>      
      </div>
      {ids.map((id) => {
        const text = idToText[id] || { x: -1000, y: -1000, height: 0, width: 0 };
        const { r, g, b, a } = text.backgroundColor || {};
        const { r: ra, g: ga, b: ba, a: aa } = text.color || {};
        const backgroundColor = text.backgroundColor ? `rgba(${r}, ${g}, ${b}, ${a})` : undefined;
        const color = text.color ? `rgba(${ra}, ${ga}, ${ba}, ${aa})` : undefined;
        return (
          <Draggable
            key={id}
            handle=".handle"
            style={{
              zIndex: 100
            }}
            position={{ x: text.x, y: text.y }}
            onStop={handleDragStop.bind(null, id)}>
            <div style={{ position: 'absolute' }}>
              <div style={{ position: 'relative'}}>
                <div className="handle">
                  <FontAwesomeIcon icon={faArrowsAlt} />
                </div>
                <div className="handle-color">
                  <Sketch onChange={handleColor.bind(null, id)} value={text.backgroundColor} />
                </div>
                <div className="handle-text-color">
                  <Sketch onChange={handleTextColor.bind(null, id)} value={text.color} label="A" />
                </div>
                <div className="handle-close" onClick={removeText.bind(null, id)}>
                  <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <div>
                  <ResizableBox
                    width={text.width}
                    height={text.height}
                    handle={<span className="custom-handle custom-handle-se">
                      <FontAwesomeIcon icon={faCropAlt} />
                    </span>}
                    onResizeStop={handleResizeStop.bind(null, id)}
                    handleSize={[8, 8]}
                    style={{
                      position: 'relative',
                      border: 'solid 1px grey',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor,
                      textAlign: 'center'
                    }}>
                    <div
                      contentEditable
                      style={{ color, }}
                      >{text.text}</div>
                    </ResizableBox>
                </div>
              </div>
            </div>
          </Draggable>
        )
      })}
    </>
  )
}
