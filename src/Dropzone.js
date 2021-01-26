import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { readFileAsync } from './util';
import { Workbook } from 'exceljs';

export default function Dropzone({onFileLoad}) {
  const loadFile = async (acceptedFiles) => {
    const buf = await readFileAsync(acceptedFiles[0]);
    const workbook = new Workbook();
    await workbook.xlsx.load(buf);
    onFileLoad(workbook);
  }

  const onDrop = useCallback(loadFile, [onFileLoad])

  const accept = 'text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({accept, onDrop});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <div className="DropZone">
      <div className="container">
        <div {...getRootProps({style})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </div>
    </div>
  )
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};
