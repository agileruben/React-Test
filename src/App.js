import { useState } from 'react';
import Table from './Table';
import Dropzone from './Dropzone';

import './App.css';

function App() {
  const [file, setFile] = useState();

  if (file) {
    return <Table workbook={file} />
  }

  return (
    <Dropzone onFileLoad={setFile} />
  );
}

export default App;
