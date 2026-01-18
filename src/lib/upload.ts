export async function uploadFileWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file) // backend expects 'file' field? adjust if needed

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/upload") // or your direct Cloudinary proxy if you have one
    // Note: Since Cloudinary is handled backend-side, send to your endpoint

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        resolve(response.url) // assume backend returns { url: "..." }
      } else {
        reject(new Error("Upload failed"))
      }
    }

    xhr.onerror = () => reject(new Error("Network error"))
    xhr.send(formData)
  })
}