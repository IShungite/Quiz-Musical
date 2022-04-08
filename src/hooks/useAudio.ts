import React, { useCallback, useEffect, useState } from "react";

export default function useAudio(audioUrl: string) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio]);

  useEffect(() => {
    if (audioUrl && (!audio || audio.src !== audioUrl)) {
      const newAudio = new Audio(audioUrl);
      newAudio.autoplay = true;
      console.log("new audio", audioUrl);
      setTimeout(() => {
        console.log("play");
        console.log(newAudio);
        newAudio.play();
      }, 2000);
      setAudio(newAudio);
    }
  }, [audio, audioUrl]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return { stopAudio };
}
