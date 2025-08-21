import { mockClients } from '@/lib/mock-data';
import { Card, CardContent } from './ui/card';
import {
  Activity,
  ActivityIcon,
  Clock,
  File,
  FileText,
  Users,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className='flex flex-col w-full min-h-screen bg-background'>
      <div className='flex flex-col w-full px-12'>
        <div className='flex flex-col w-full mx-auto'>
          <div className='text-center sm:text-left mb-8 sm:mb-12'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-dblue mb-3 sm:mb-4'>
              Doc<span className='text-black'>Notes</span>
            </h1>
            <p className='text-lg sm:text-xl text-muted-foreground'>
              Professional therapy session management with AI-powered
              transcription
            </p>
          </div>

          <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-4'>
            <Card className='w-full border-gray-300'>
              <CardContent className=''>
                <div className='flex flex-col items-start gap-4'>
                  <div className='flex gap-3 items-center'>
                    <div className='bg-cyan-200/40 rounded-md p-2 border border-cyan-700'>
                      <Users className='h-5 w-5 text-cyan-700' />
                    </div>

                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Clients
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-primary'>
                    {mockClients.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='w-full border-gray-300'>
              <CardContent className=''>
                <div className='flex flex-col items-start gap-4'>
                  <div className='flex gap-3 items-center'>
                    <div className='bg-red-200/40 rounded-md p-2 border border-red-700'>
                      <ActivityIcon className='h-5 w-5 text-red-700' />
                    </div>

                    <p className='text-sm font-medium text-muted-foreground'>
                      Active Sessions
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-primary'>12</p>
                </div>
              </CardContent>
            </Card>

            <Card className='w-full border-gray-300'>
              <CardContent className=''>
                <div className='flex flex-col items-start gap-4'>
                  <div className='flex gap-3 items-center'>
                    <div className='bg-yellow-200/40 rounded-md p-2 border border-yellow-700'>
                      <File className='h-5 w-5 text-yellow-700' />
                    </div>

                    <p className='text-sm font-medium text-muted-foreground'>
                      Notes Created
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-primary'>48</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
