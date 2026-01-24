// Audio utility functions
import { Howl, HowlOptions } from 'howler';

export const playAudio = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sound = new Howl({
      src: [url],
      onend: () => resolve(),
      onerror: () => reject(new Error('Audio playback failed')),
    } as HowlOptions);
    sound.play();
  });
};

export const stopAudio = (howlInstance: Howl | null) => {
  if (howlInstance) {
    howlInstance.stop();
  }
};

