'use client';

import { useState } from 'react';
import type { Client, Note } from '@/types';
import { mockClients } from '@/lib/mock-data';
import { saveNote } from '@/lib/storage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioRecorder } from '@/components/audio-recorder';
import { NotesList } from '@/components/notes-list';
import { User, Phone, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [notesKey, setNotesKey] = useState(0); // Force re-render of notes list
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleTranscriptionComplete = async (transcription: string) => {
    if (!selectedClient) return;

    try {
      const now = new Date().toISOString();
      const note: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        clientId: selectedClient.userId,
        transcription,
        editedTranscription: transcription,
        createdAt: now,
        updatedAt: now,
      };

      saveNote(note);
      setNotesKey((prev) => prev + 1); // Force notes list to refresh

      toast({
        title: 'Note saved successfully',
        description: `Session note for ${selectedClient.firstName} ${selectedClient.lastName} has been saved.`,
      });
    } catch (error) {
      console.error('Failed to save note:', error);
      toast({
        title: 'Error saving note',
        description: 'Failed to save the session note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleNotesChange = () => {
    setNotesKey((prev) => prev + 1); // Force notes list to refresh
  };

  if (selectedClient) {
    return (
      <div className='flex flex-col w-full px-10 min-h-screen bg-background'>
        <div className='sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'>
          <div className='mx-auto px-4 py-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='min-w-0 flex-1'>
                <h1 className='text-2xl sm:text-3xl font-bold text-foreground truncate'>
                  {selectedClient.firstName} {selectedClient.lastName}
                </h1>
                <p className='text-sm sm:text-base text-muted-foreground'>
                  Client Session Notes
                </p>
              </div>
              <Button
                variant='outline'
                onClick={() => setSelectedClient(null)}
                className='self-start sm:self-auto'
                size='sm'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                <span className='hidden sm:inline'>Back to Clients</span>
                <span className='sm:hidden'>Back</span>
              </Button>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full mx-auto px-4 py-6 space-y-6'>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <User className='h-5 w-5 flex-shrink-0' />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4'>
                <div className='flex items-center gap-2 min-w-0'>
                  <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                  <span className='text-sm truncate'>
                    {formatDate(selectedClient.dateOfBirth)} (Age{' '}
                    {calculateAge(selectedClient.dateOfBirth)})
                  </span>
                </div>
                <div className='flex items-center gap-2 min-w-0'>
                  <Phone className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                  <span className='text-sm truncate'>
                    {selectedClient.phone}
                  </span>
                </div>
                <div className='flex items-center gap-2 min-w-0 sm:col-span-2'>
                  <Mail className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                  <span className='text-sm truncate'>
                    {selectedClient.email}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <AudioRecorder
            onTranscriptionComplete={handleTranscriptionComplete}
          />
          <NotesList
            key={notesKey}
            client={selectedClient}
            onNotesChange={handleNotesChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full min-h-screen bg-background'>
      <div className='px-12'>
        <div className='mx-auto'>
          <div className='text-center sm:text-left mb-8 sm:mb-12'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4'>
              Clients
            </h1>
            <p className='text-lg sm:text-xl text-muted-foreground'>
              Choose a client to record and manage session notes
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6'>
            {mockClients.map((client) => (
              <Card
                key={client.userId}
                className='w-full xl:w-80 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-cyan-700'
                onClick={() => setSelectedClient(client)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedClient(client);
                  }
                }}
                aria-label={`Select client ${client.firstName} ${client.lastName}`}
              >
                <CardHeader className=''>
                  <CardTitle className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                    <span className='text-base sm:text-lg font-semibold truncate'>
                      {client.firstName} {client.lastName}
                    </span>
                    <Badge
                      variant='secondary'
                      className='bg-cyan-200/40 rounded-sm self-start sm:self-auto flex-shrink-0'
                    >
                      Age {calculateAge(client.dateOfBirth)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className='text-xs sm:text-sm'>
                    Client ID: {client.userId}
                  </CardDescription>
                </CardHeader>
                <div className='border-b' />
                <CardContent className='space-y-2 pt-0'>
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0'>
                    <Calendar className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
                    <span className='truncate'>
                      {formatDate(client.dateOfBirth)}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0'>
                    <Phone className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
                    <span className='truncate'>{client.phone}</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0'>
                    <Mail className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
                    <span className='truncate'>{client.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
