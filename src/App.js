import React from 'react';
import './App.css';
import { Alert } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import 'bootstrap/dist/css/bootstrap.min.css';



function useImageDropzone() {
  const [imgSrc, setImgSrc] = useState();
  const onDrop = useCallback(function (acceptedFiles) {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = e => setImgSrc(e.target.result);
    reader.readAsDataURL(acceptedFiles[0]);

  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true })

  return { imgSrc, getRootProps, getInputProps };
}

function eventToPointerCoordinates(e) {
  const rect = e.target.getBoundingClientRect();
  return [e.clientX - rect.left, e.clientY - rect.top];
}


function SelectionBox({ visible, coords }) {
  return visible && <div className="box" style={coords} />
}

function App() {
  const { imgSrc, getRootProps, getInputProps } = useImageDropzone();
  const [list, setList] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [[x1, y1], setStartingPoint] = useState([0, 0]);
  const [[x2, y2], setCurrentPoint] = useState([0, 0]);
  const handleMouseDown = useCallback(e => {
    setStartingPoint(eventToPointerCoordinates(e))
    setCurrentPoint(eventToPointerCoordinates(e))
    setMouseDown(true);
  }, []);
  const handleMouseUp = useCallback(e => {
    setList(list.concat([[x1, y1, ...eventToPointerCoordinates(e)]]))
    setMouseDown(false);
  }, [list, x1, y1]);
  const handleMouseMove = useCallback(e => {
    if (mouseDown)
      setCurrentPoint(eventToPointerCoordinates(e))
  }, [mouseDown]);

  const boxCoords = { left: Math.min(x1, x2), top: Math.min(y1, y2), width: Math.abs(x1 - x2), height: Math.abs(y1 - y2) };

  return (
    <div className="App">
      <div className="grid-container">
        <div className="sidebar">
          <h4>Coordinates</h4>
          <small>(x1, y1, x2, y2)</small>
          {list.map((coord, i) => <Alert key={i} variant="info">
            {coord.join(', ')}
          </Alert>)}
          {mouseDown && <Alert variant="light">{boxCoords.left}, {boxCoords.top}, {boxCoords.left + boxCoords.width}, {boxCoords.top + boxCoords.height}</Alert>}
        </div>
        <div className="editor">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {imgSrc ? <img src={imgSrc} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} draggable="false" alt="template" /> : <div className="centered">Drop an image here</div>}
            <SelectionBox visible={mouseDown} coords={boxCoords} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
