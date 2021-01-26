export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
              resolve(new Uint8Array(reader.result))
          } else {
              reject(new Error('Result is not an ArrayBuffer'))
          }
      }
      reader.onerror = reject
      reader.onabort = reject
      reader.readAsArrayBuffer(file)
  })
}

export function closest(counts, goal) {
    return counts.reduce(function(prev, curr) {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
  }