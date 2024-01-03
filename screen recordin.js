const videoPreview = document.getElementById("videoPreview")
const startBtn = document.getElementById("startBtn")
const pauseBtn = document.getElementById("pauseBtn")
const continueBtn = document.getElementById("continueBtn")
const stopBtn = document.getElementById("stopBtn")
const downloadBtn = document.getElementById("downloadBtn")

let mediaRecorder
let recordedChunks = []

startBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  })

  mediaRecorder = new MediaRecorder(stream)

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }

  mediaRecorder.onstop = () => {
    videoPreview.src = URL.createObjectURL(
      new Blob(recordedChunks, { type: "video/webm" })
    )
    downloadBtn.disabled = false
  }

  mediaRecorder.start()
  startBtn.disabled = true
  pauseBtn.disabled = false
  stopBtn.disabled = false
})

pauseBtn.addEventListener("click", () => {
  mediaRecorder.pause()
  pauseBtn.disabled = true
  continueBtn.disabled = false
})

continueBtn.addEventListener("click", () => {
  mediaRecorder.resume()
  pauseBtn.disabled = false
  continueBtn.disabled = true
})

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop()
  startBtn.disabled = false
  pauseBtn.disabled = true
  continueBtn.disabled = true
  stopBtn.disabled = true
})

downloadBtn.addEventListener("click", () => {
  const blob = new Blob(recordedChunks, { type: "video/webm" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.style.display = "none"
  a.href = url
  a.download = "screen_recording.webm"
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
})