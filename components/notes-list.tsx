"use client"

import { useState, useEffect } from "react"
import type { Note, Client } from "@/types"
import { getNotesForClient, deleteNote, saveNote } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Edit, Trash2, Calendar, Clock, Save, X, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface NotesListProps {
  client: Client
  onNotesChange?: () => void
}

export function NotesList({ client, onNotesChange }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const { toast } = useToast()

  const loadNotes = () => {
    const clientNotes = getNotesForClient(client.userId)
    // Sort notes by creation date (newest first)
    const sortedNotes = clientNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setNotes(sortedNotes)
  }

  useEffect(() => {
    loadNotes()
  }, [client.userId])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setEditedContent(note.editedTranscription || note.transcription)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingNote || !editedContent.trim()) return

    try {
      const updatedNote: Note = {
        ...editingNote,
        editedTranscription: editedContent.trim(),
        updatedAt: new Date().toISOString(),
      }

      saveNote(updatedNote)
      loadNotes()
      onNotesChange?.()
      setIsEditDialogOpen(false)
      setEditingNote(null)
      setEditedContent("")

      toast({
        title: "Note updated",
        description: "Your session note has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!noteToDelete) return

    try {
      deleteNote(noteToDelete.id)
      loadNotes()
      onNotesChange?.()
      setIsDeleteDialogOpen(false)
      setNoteToDelete(null)

      toast({
        title: "Note deleted",
        description: "The session note has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getDisplayContent = (note: Note) => {
    const content = note.editedTranscription || note.transcription
    return content.length > 200 ? `${content.substring(0, 200)}...` : content
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 flex-shrink-0" />
            Session Notes
          </CardTitle>
          <CardDescription className="text-sm">
            Previous session notes for {client.firstName} {client.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No session notes yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Record your first audio note using the recorder above to get started with session documentation.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 flex-shrink-0" />
              <span className="text-lg">Session Notes</span>
            </div>
            <Badge variant="secondary" className="self-start sm:self-auto">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">
            Previous session notes for {client.firstName} {client.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.map((note) => {
              const { date, time } = formatDateTime(note.createdAt)
              const isEdited = note.editedTranscription && note.editedTranscription !== note.transcription

              return (
                <Card key={note.id} className="border-l-4 border-l-primary/30 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{time}</span>
                        </div>
                        {isEdited && (
                          <Badge variant="outline" className="text-xs">
                            Edited
                          </Badge>
                        )}
                      </div>

                      <div className="flex sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label="Note actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditNote(note)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteNote(note)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Desktop action buttons */}
                      <div className="hidden sm:flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)} aria-label="Edit note">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note)}
                          aria-label="Delete note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{getDisplayContent(note)}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Session Note</DialogTitle>
            <DialogDescription className="text-sm">
              Make changes to your session note. The original transcription will be preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your session note..."
              className="min-h-48 resize-y"
              aria-label="Edit note content"
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="order-2 sm:order-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editedContent.trim()} className="order-1 sm:order-2">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Session Note</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this session note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="order-2 sm:order-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="order-1 sm:order-2">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
