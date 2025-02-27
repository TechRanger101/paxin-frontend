import { AudioPresets, ScreenSharePresets, VideoPresets } from 'livekit-client';

export async function getDevices(kind: MediaDeviceKind) {
  let constraints: MediaStreamConstraints = {
    audio: true,
  };
  if (kind === 'videoinput') {
    constraints = {
      video: true,
    };
  }
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  let devices = await navigator.mediaDevices.enumerateDevices();
  devices = devices.filter((device) => device.kind === kind);

  if (devices.length > 1 && devices[0].deviceId === 'default') {
    // find another device with matching group id, and move that to 0
    const defaultDevice = devices[0];
    for (let i = 1; i < devices.length; i += 1) {
      if (devices[i].groupId === defaultDevice.groupId) {
        const temp = devices[0];
        devices[0] = devices[i];
        devices[i] = temp;
        break;
      }
    }
    return devices.filter((device) => device !== defaultDevice);
  }

  stream.getTracks().forEach(function (track) {
    track.stop();
  });

  return devices;
}

const dec2hex = (dec: { toString: (arg0: number) => string }) => {
  return dec.toString(16).padStart(2, '0');
};

export const randomString = (len = 20) => {
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

export const randomInteger = (len = 10) => {
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Number(arr.join(''));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getWebcamResolution = () => {
  const selected = (window as any).DEFAULT_WEBCAM_RESOLUTION ?? 'h720';
  let resolution = VideoPresets.h720.resolution;

  switch (selected) {
    case 'h90':
      resolution = VideoPresets.h90.resolution;
      break;
    case 'h180':
      resolution = VideoPresets.h180.resolution;
      break;
    case 'h216':
      resolution = VideoPresets.h216.resolution;
      break;
    case 'h360':
      resolution = VideoPresets.h360.resolution;
      break;
    case 'h540':
      resolution = VideoPresets.h540.resolution;
      break;
    case 'h720':
      resolution = VideoPresets.h720.resolution;
      break;
    case 'h1080':
      resolution = VideoPresets.h1080.resolution;
      break;
    case 'h1440':
      resolution = VideoPresets.h1440.resolution;
      break;
    case 'h2160':
      resolution = VideoPresets.h2160.resolution;
      break;
  }

  return resolution;
};

export const getScreenShareResolution = () => {
  const selected =
    (window as any).DEFAULT_SCREEN_SHARE_RESOLUTION ?? 'h1080fps15';
  let resolution = ScreenSharePresets.h1080fps15.resolution;

  switch (selected) {
    case 'h360fps3':
      resolution = ScreenSharePresets.h360fps3.resolution;
      break;
    case 'h720fps5':
      resolution = ScreenSharePresets.h720fps5.resolution;
      break;
    case 'h720fps15':
      resolution = ScreenSharePresets.h720fps15.resolution;
      break;
    case 'h1080fps15':
      resolution = ScreenSharePresets.h1080fps15.resolution;
      break;
    case 'h1080fps30':
      resolution = ScreenSharePresets.h1080fps30.resolution;
      break;
  }

  return resolution;
};

export const getAudioPreset = () => {
  const selected = (window as any).DEFAULT_AUDIO_PRESET ?? 'music';
  let preset = AudioPresets.music;

  switch (selected) {
    case 'telephone':
      preset = AudioPresets.telephone;
      break;
    case 'speech':
      preset = AudioPresets.speech;
      break;
    case 'music':
      preset = AudioPresets.music;
      break;
    case 'musicStereo':
      preset = AudioPresets.musicStereo;
      break;
    case 'musicHighQuality':
      preset = AudioPresets.musicHighQuality;
      break;
    case 'musicHighQualityStereo':
      preset = AudioPresets.musicHighQualityStereo;
      break;
  }

  return preset;
};

export function getMasterToken() {
  const cookies = document.cookie.split('; ');
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith('access_token=')
  );
  return accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
}

/**
 * getAccessToken will try to get token by the following:
 * from `access_token` GET/Search parameter from URL OR
 * from cookie name `pnm_access_token`
 * */
export function setAccessToken(token: string) {
  const tokenName = 'paxmeet_access_token';
  localStorage.setItem(tokenName, token);
}

export function clearAccessToken() {
  const tokenName = 'paxmeet_access_token';
  localStorage.removeItem(tokenName);
}
export function setMeetingId(id: string) {
  const tokenName = 'paxmeet_id';
  localStorage.setItem(tokenName, id);
}
export function clearMeetingId() {
  const tokenName = 'paxmeet_id';
  localStorage.removeItem(tokenName);
}
export const getMeetId = () => {
  let accessToken: string;
  const tokenName = 'paxmeet_id';

  accessToken = localStorage.getItem(tokenName) ?? '';
  console.log('Access LocalStorage', accessToken);
  if (accessToken) {
    return accessToken;
  } else {
    return null;
  }
};
export const getAccessToken = () => {
  let accessToken: string;
  const tokenName = 'paxmeet_access_token';

  accessToken =
    document.cookie
      .match('(^|;)\\s*' + tokenName + '\\s*=\\s*([^;]+)')
      ?.pop() || '';

  if (accessToken) {
    return accessToken;
  }

  accessToken = localStorage.getItem(tokenName) ?? '';
  console.log('Access LocalStorage', accessToken);
  if (accessToken) {
    return accessToken;
  } else {
    return null;
  }
};

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    throw err;
  }
}

export function timeAgo(date: string): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  function getPlural(n: number, one: string, few: string, many: string): string {
      if (n % 10 === 1 && n % 100 !== 11) {
          return one;
      } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
          return few;
      } else {
          return many;
      }
  }

  if (years > 0) {
      return `${years} ${getPlural(years, 'год', 'года', 'лет')} назад`;
  } else if (months > 0) {
      return `${months} ${getPlural(months, 'месяц', 'месяца', 'месяцев')} назад`;
  } else if (days > 0) {
      return `${days} ${getPlural(days, 'день', 'дня', 'дней')} назад`;
  } else if (hours > 0) {
      return `${hours} ${getPlural(hours, 'час', 'часа', 'часов')} назад`;
  } else if (minutes > 0) {
      return `${minutes} ${getPlural(minutes, 'минута', 'минуты', 'минут')} назад`;
  } else {
      return `${seconds} ${getPlural(seconds, 'секунда', 'секунды', 'секунд')} назад`;
  }
}