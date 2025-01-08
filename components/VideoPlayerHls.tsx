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
      streamType='live'
      title='Custom title'
      src='https://app.ddrw.org/api/v1/streams/d8e8f724-9954-48cc-9463-cc3d3e46b0fd/stream.m3u8'
      autoPlay
      playsInline
    >
      {/* <MediaProvider />
      <DefaultVideoLayout
        thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
        icons={defaultLayoutIcons}
      /> */}
    </MediaPlayer>
  );
};

export default VideoPlayer;
