import React, { useState } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

const Sketch = ({ onChange, value, label }) => {
  const [state, setState] = useState({
    displayColorPicker: false,
  });
  
  const { displayColorPicker} = state;
  const { r, g, b, a } = value || { r: 0, g: 0, b: 0, a: 0 };

  const handleClick = () => {
    setState({ displayColorPicker: !displayColorPicker })
  };

  const handleClose = () => {
    setState({ displayColorPicker: false })
  };

  const handleChange = (color) => {
    onChange(color.rgb);
  };

  const styles = reactCSS({
    'default': {
      color: {
        width: '10px',
        height: '10px',
        borderRadius: '2px',
        background: `rgba(${r}, ${g}, ${b}, ${a})`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
        {label ? <span style={{ position: 'absolute', zIndex: 10, top: 5, left: 10, color: 'lightgray' }}>{label}</span> : null}
      </div>
      {displayColorPicker ? <div style={ styles.popover }>
        <div style={styles.cover} onClick={handleClose }/>
        <SketchPicker color={value} onChange={handleChange} />
      </div> : null }

    </div>
  )
}

export default Sketch;