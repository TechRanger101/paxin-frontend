'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

type VideoPlayerProps = {
  src: string; // URL к HLS .m3u8
  poster: string; // Постер
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  return (
    <MediaPlayer
      title='Custom title'
      src='https://app.ddrw.org/static/streams/1b1d345a-a76b-4ea0-8dc0-894665090377/stream.m3u8'
      autoPlay
      playsInline
    >
      <MediaProvider />
      <DefaultVideoLayout
        thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
};

export default VideoPlayer;
