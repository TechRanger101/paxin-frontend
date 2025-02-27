import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';

import { useParticipants } from '@livekit/components-react';
import { useState } from 'react';
import { Icons } from './ui/icons';

export default function Presence({
  participantIdentity,
}: {
  participantIdentity: string;
}) {
  const [open, setOpen] = useState(false);
  const participants = useParticipants();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='flex items-center gap-2 rounded-lg px-2 py-1 bg-primary hover:bg-violet-100 hover:transition-all focus:outline-none focus:ring'>
          <Icons.user className='h-5 w-5' />
          <div className='font-bold'>{participants.length}</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className='border-b pb-4 text-lg font-bold'>
              {participants.length}{' '}
              {participants.length > 1 ? 'people' : 'person'} here
            </div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ul className='space-y-2'>
          {participants.map((participant) => (
            <li key={participant.identity}>
              <div className='flex items-center gap-3'>
                <div className={'h-6 w-6 rounded-full bg-slate-600'}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className='rounded-full'
                    src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${participant?.metadata}`}
                    alt={participant.identity}
                  />
                </div>
                <div className='text-sm'>
                  {participant.name}
                  {participant.identity === participantIdentity && ' (You)'}
                  {participant.videoTrackPublications.size > 0 && ' (Host)'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
