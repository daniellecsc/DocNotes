"use client"

import { useState, useRef, useCallback } from "react"
import type { RecordingState } from "@/types"

interface UseAudioRecorderReturn {
  recordingState: RecordingState
  audioBlob: Blob | null
  audioUrl: string | null
  duration: number
  transcription: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  resetRecording: () => void
  transcribeAudio: () => Promise<void>
  error: string | null
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setRecordingState("processing")

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream
      chunksRef.current = []

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "audio/webm",
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType })
        const url = URL.createObjectURL(blob)

        setAudioBlob(blob)
        setAudioUrl(url)
        setRecordingState("idle")

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event)
        setError("Recording failed. Please try again.")
        setRecordingState("idle")
      }

      // Start recording
      mediaRecorder.start(100) // Collect data every 100ms
      startTimeRef.current = Date.now()
      setRecordingState("recording")

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } catch (err) {
      console.error("Failed to start recording:", err)

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Microphone access denied. Please allow microphone access and try again.")
        } else if (err.name === "NotFoundError") {
          setError("No microphone found. Please connect a microphone and try again.")
        } else {
          setError("Failed to access microphone. Please check your device settings.")
        }
      } else {
        setError("An unexpected error occurred while starting recording.")
      }

      setRecordingState("idle")
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      setRecordingState("processing")
      mediaRecorderRef.current.stop()

      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }
  }, [recordingState])

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) {
      setError("No audio recording available to transcribe.")
      return
    }

    try {
      setError(null)
      setRecordingState("transcribing")

      // Prepare form data
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      // Call our API route
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Transcription failed")
      }

      if (data.success && data.transcription) {
        setTranscription(data.transcription)
        setRecordingState("editing")
      } else {
        throw new Error("No transcription received")
      }
    } catch (err) {
      console.error("Transcription error:", err)
      setError(err instanceof Error ? err.message : "Failed to transcribe audio. Please try again.")
      setRecordingState("idle")
    }
  }, [audioBlob])

  const resetRecording = useCallback(() => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop()
    }

    // Clear duration timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    // Clean up stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    // Reset state
    setRecordingState("idle")
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setTranscription(null)
    setError(null)
    chunksRef.current = []
  }, [audioUrl, recordingState])

  return {
    recordingState,
    audioBlob,
    audioUrl,
    duration,
    transcription,
    startRecording,
    stopRecording,
    resetRecording,
    transcribeAudio,
    error,
  }
}
