'use client';

import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Send,
  Edit,
  Loader2,
  Mic2Icon,
  MicIcon,
  Mic2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({
  onTranscriptionComplete,
  disabled = false,
}: AudioRecorderProps) {
  const {
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
  } = useAudioRecorder();

  const [isPlaying, setIsPlaying] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update edited transcription when transcription changes
  useEffect(() => {
    if (transcription) {
      setEditedTranscription(transcription);
    }
  }, [transcription]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTranscribe = () => {
    transcribeAudio();
  };

  const handleSaveTranscription = () => {
    if (editedTranscription.trim()) {
      onTranscriptionComplete(editedTranscription.trim());
      // Reset the recorder after saving
      resetRecording();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);

  const getRecordingStateInfo = () => {
    switch (recordingState) {
      case 'idle':
        return { text: 'Ready to record', variant: 'secondary' as const };
      case 'processing':
        return { text: 'Initializing...', variant: 'default' as const };
      case 'recording':
        return { text: 'Recording', variant: 'destructive' as const };
      case 'transcribing':
        return { text: 'Transcribing...', variant: 'default' as const };
      case 'editing':
        return { text: 'Ready to edit', variant: 'default' as const };
      case 'saving':
        return { text: 'Saving...', variant: 'default' as const };
      case 'saved':
        return { text: 'Saved', variant: 'default' as const };
      default:
        return { text: 'Ready', variant: 'secondary' as const };
    }
  };

  const stateInfo = getRecordingStateInfo();

  return (
    <Card>
      <CardHeader className='pb-4'>
        <CardTitle className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <div className='flex flex-row gap-1'>
            <MicIcon />
            <span className='text-lg'>Audio Recording</span>
          </div>

          <Badge
            variant={stateInfo.variant}
            className='bg-cyan-200/40 text-black rounded-sm self-start sm:self-auto'
          >
            {stateInfo.text}
          </Badge>
        </CardTitle>
        <CardDescription className='text-sm'>
          Record your session notes and transcribe them automatically
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription className='text-sm'>{error}</AlertDescription>
          </Alert>
        )}

        <div className='flex flex-col items-center space-y-6'>
          {/* Recording Controls */}
          <div className='flex items-center justify-center'>
            {recordingState === 'idle' && !audioBlob && (
              <Button
                onClick={startRecording}
                disabled={disabled}
                size='lg'
                className='h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-200'
                aria-label='Start recording'
              >
                <Mic className='h-6 w-6 sm:h-8 sm:w-8' />
              </Button>
            )}

            {recordingState === 'recording' && (
              <Button
                onClick={stopRecording}
                variant='destructive'
                size='lg'
                className='h-16 w-16 sm:h-20 sm:w-20 rounded-full animate-pulse shadow-lg'
                aria-label='Stop recording'
              >
                <MicOff className='h-6 w-6 sm:h-8 sm:w-8' />
              </Button>
            )}

            {(recordingState === 'processing' ||
              recordingState === 'transcribing') && (
              <Button
                disabled
                size='lg'
                className='h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-lg'
                aria-label='Processing'
              >
                <Loader2 className='h-6 w-6 sm:h-8 sm:w-8 animate-spin' />
              </Button>
            )}
          </div>

          {/* Duration Display */}
          {(recordingState === 'recording' || duration > 0) && (
            <div className='text-3xl sm:text-4xl font-mono font-bold text-foreground tabular-nums'>
              {formatDuration(duration)}
            </div>
          )}

          {/* Audio Playback Controls */}
          {audioUrl && (
            <div className='w-full space-y-4'>
              <audio ref={audioRef} src={audioUrl} className='hidden' />

              <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-4'>
                <Button
                  onClick={handlePlayPause}
                  variant='outline'
                  size='sm'
                  className='flex-shrink-0 bg-transparent'
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? (
                    <Pause className='h-4 w-4' />
                  ) : (
                    <Play className='h-4 w-4' />
                  )}
                  <span className='ml-2'>{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>

                <Button
                  onClick={resetRecording}
                  variant='outline'
                  size='sm'
                  className='flex-shrink-0 bg-transparent'
                  aria-label='Reset recording'
                >
                  <RotateCcw className='h-4 w-4' />
                  <span className='ml-2'>Reset</span>
                </Button>

                {!transcription && (
                  <Button
                    onClick={handleTranscribe}
                    disabled={disabled || recordingState === 'transcribing'}
                    size='sm'
                    className='flex-shrink-0'
                    aria-label='Transcribe audio'
                  >
                    {recordingState === 'transcribing' ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Send className='h-4 w-4' />
                    )}
                    <span className='ml-2'>
                      {recordingState === 'transcribing'
                        ? 'Transcribing...'
                        : 'Transcribe'}
                    </span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {recordingState === 'idle' && !audioBlob && (
            <div className='w-full text-center mx-auto'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Click the microphone button to start recording your session
                notes. Make sure your microphone is connected and permissions
                are granted.
              </p>
            </div>
          )}
        </div>

        {transcription && (
          <div className='space-y-4 border-t pt-6'>
            <div className='flex items-center gap-2'>
              <Edit className='h-4 w-4 flex-shrink-0' />
              <h3 className='text-lg font-semibold'>Edit Transcription</h3>
            </div>
            <Textarea
              value={editedTranscription}
              onChange={(e) => setEditedTranscription(e.target.value)}
              placeholder='Edit your transcription here...'
              className='min-h-32 sm:min-h-40 resize-y'
              aria-label='Edit transcription'
            />
            <div className='flex flex-col sm:flex-row justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setEditedTranscription(transcription)}
                className='order-2 sm:order-1'
              >
                Reset
              </Button>
              <Button
                onClick={handleSaveTranscription}
                disabled={!editedTranscription.trim()}
                className='order-1 sm:order-2'
              >
                Save Note
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
