import { defineStore } from 'pinia'
import { defaultRecording } from '../scripts/recording'
import { debounce, inRange, colors, percent, formatTime } from '../scripts/utils'

export const useStore = defineStore('main', {
  state: () => {
    return {
      // Information about recording
      recording: defaultRecording,

      mediaRecorder: null,
      // Stores audio pieces while recording
      audioChunks: [],
      // Array containing all loudness data
      volumeData: [],

      graphs: {
        donut: null,
        bar: null,
      },

      // State
      loading: false,
      canRecord: true,
    }
  },
  actions: {
    async startRecording() {
      this.recording.isRecording = true
      this.recording.timestamp.start = Date.now()
      this.audioChunks = []

      await navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream)
        // For loudness measuring
        const audioContext = new AudioContext()
        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream)
        const analyserNode = audioContext.createAnalyser()
        mediaStreamAudioSourceNode.connect(analyserNode)
        const pcmData = new Float32Array(analyserNode.fftSize)
        let time = Date.now()
        const timeout = 1000

        // On each frame, calculate loudness of audio signal
        // TODO: This keeps getting called for some reason, make sure it doesn't if
        // recording stopped
        const onFrame = debounce(() => {
          analyserNode.getFloatTimeDomainData(pcmData)
          let sumSquares = 0.0
          for (const amplitude of pcmData) {
            sumSquares += amplitude * amplitude
          }

          // Save data to the loudness object
          this.volumeData.push({
            timestamp: time,
            value: Math.sqrt(sumSquares / pcmData.length),
          })

          time += timeout

          if (this.recording.isRecording) window.requestAnimationFrame(onFrame)
        }, timeout)

        if (this.recording.isRecording) window.requestAnimationFrame(onFrame)

        // Save audio to audioChunks array until recording is done
        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          this.audioChunks.push(event.data)
        })
      })

      this.mediaRecorder.start()
    },
    async endRecording() {
      this.loading = true

      new Promise((resolve) => {
        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks)
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          resolve({ audioBlob, audioUrl, audio })
        })
        this.mediaRecorder.stop()
      }).then(({ audioBLob, audioUrl, audio }) => {
        this.recording.timestamp.end = Date.now()
        this.recording.timestamp.duration = Math.round(
          (this.recording.timestamp.start - this.recording.timestamp.end) / 1000
        )
        this.recording.audioBlob = audioBLob
        this.recording.audioUrl = audioUrl
        this.recording.audio = audio
        this.canRecord = false

        this.mediaRecorder = null

        this.formatRecordingData()
      })
    },
    async formatRecordingData() {
      // First format the 3 main data points
      // Index 0 is loud
      // Index 1 is noise
      // index 2 is ambient
      const rawDatasets = [0, 0, 0]
      const formatDatasets = [0, 0, 0]

      for (const item of this.volumeData) {
        if (inRange(item.value, 0.01, 1)) rawDatasets[0]++
        else if (inRange(item.value, 0.005, 0.009)) rawDatasets[1]++
        else rawDatasets[2]++
      }

      // Then we should calculate percentage of each item against all, to make it
      // easier to consume
      const total = rawDatasets.reduce((a, b) => a + b, 0)

      rawDatasets.map((item, index) => (formatDatasets[index] = percent(rawDatasets[index], total)))

      this.graphs.donut = {
        labels: ['Loud', 'Noise', 'Quiet'],
        datasets: [
          {
            label: 'Loudness Chart',
            data: formatDatasets,
            borderWidth: 0,
            backgroundColor: [colors('color-red'), colors('color-highlight'), colors('color-blue')],
          },
        ],
      }

      // Format bar chart
      this.graphs.bar = {
        labels: this.volumeData.map((item) => formatTime(item.timestamp, true)),
        datasets: [
          {
            data: this.volumeData.map((item) => item.value),
            backgroundColor: this.volumeData.map((item) => {
              const v = item.value
              if (inRange(v, 0.01, 1)) return colors('color-red')
              else if (inRange(v, 0.005, 0.01)) return colors('color-highlight')
              else return colors('color-blue')
            }),
            minBarLength: 1,
          },
        ],
      }

      this.loading = false
    },
    play() {
      this.recording.audio.play()
    },
  },
})
