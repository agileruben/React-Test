import React, { useState } from 'react';
import { DraggableCore } from 'react-draggable';

const Draggable = ({ onStop, className, axis, ...props}) => {
  const [ip, setInitPosition] = useState();
  const [position, setPosition] = useState();

  return (
    <DraggableCore
      {...props}
      onStart={(e, data) => {
        setInitPosition(data);
      }}
      onDrag={(e, data) => {
        setPosition({ deltaX: axis === 'y' ? 0 : data.x - ip.x, deltaY: axis === 'x' ? 0 : data.y - ip.y });
      }}
      onStop={(e, data) => {
        onStop(e, data);
        setPosition();
      }}
      >
      <div style={{ transform: position && `translate(${position.deltaX}px, ${position.deltaY}px)` }} className={className} {...props} />
    </DraggableCore>
  );
}

export default Draggable;
