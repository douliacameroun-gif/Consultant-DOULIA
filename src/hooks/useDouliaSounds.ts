import useSound from 'use-sound';

// URLs de sons UI propres et professionnels
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  pop: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  woosh: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3' // Correction URL if needed
};

export const useDouliaSounds = () => {
  const [playClick] = useSound(SOUNDS.click, { volume: 0.5 });
  const [playPop] = useSound(SOUNDS.pop, { volume: 0.4 });
  const [playWoosh] = useSound(SOUNDS.woosh, { volume: 0.3 });
  const [playSuccess] = useSound(SOUNDS.success, { volume: 0.6 });

  return {
    playClick,
    playPop,
    playWoosh,
    playSuccess
  };
};
