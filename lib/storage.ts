import type { Note } from "@/types"

const NOTES_STORAGE_KEY = "docnotes-client-notes"

export const saveNote = (note: Note): void => {
  try {
    const existingNotes = getNotes()
    const updatedNotes = existingNotes.filter((n) => n.id !== note.id)
    updatedNotes.push(note)
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes))
  } catch (error) {
    console.error("Failed to save note:", error)
    throw new Error("Failed to save note to local storage")
  }
}

export const getNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load notes:", error)
    return []
  }
}

export const getNotesForClient = (clientId: string): Note[] => {
  return getNotes().filter((note) => note.clientId === clientId)
}

export const deleteNote = (noteId: string): void => {
  try {
    const existingNotes = getNotes()
    const updatedNotes = existingNotes.filter((n) => n.id !== noteId)
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes))
  } catch (error) {
    console.error("Failed to delete note:", error)
    throw new Error("Failed to delete note from local storage")
  }
}
