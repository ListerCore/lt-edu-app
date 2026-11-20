'use client';

import '@livekit/components-styles';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import type { JSX } from 'react';
import type { LiveCallProps } from '../types';

// The call inside the platform (LiveKit): camera, microphone, screen sharing and chat. Loaded only in the browser
const LiveCall = ({ serverUrl, token, onLeave }: LiveCallProps): JSX.Element => (
  <div data-lk-theme="default" className="h-[min(75svh,48rem)] min-h-[26rem] overflow-hidden rounded-2xl border border-border">
    <LiveKitRoom serverUrl={serverUrl} token={token} connect audio video onDisconnected={onLeave} className="h-full">
      <VideoConference />
    </LiveKitRoom>
  </div>
);

export default LiveCall;
