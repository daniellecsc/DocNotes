export interface Client {
  userId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  email: string
}

export interface Note {
  id: string
  clientId: string
  audioBlob?: Blob
  audioUrl?: string
  transcription: string
  editedTranscription?: string
  createdAt: string
  updatedAt: string
}

export type RecordingState = "idle" | "recording" | "processing" | "transcribing" | "editing" | "saving" | "saved"
