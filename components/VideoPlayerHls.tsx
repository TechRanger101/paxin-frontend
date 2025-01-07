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
      title='Sprite Fight'
      src='https://app.ddrw.org/api/v1/streams/bd36a973-cb7c-44e0-8c7f-fa9dcea45833/stream.m3u8'
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
