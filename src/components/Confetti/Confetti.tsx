import ConfettiExplosion from "@reonomy/react-confetti-explosion";
import React, { useEffect } from "react";

const confettiDuration = 10000;
const confettiAnimationDuration = 10000;

const Confetti = () => {
  const [isExploding, setIsExploding] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExploding(false);
    }, confettiDuration);

    return () => clearTimeout(timer);
  }, []);

  return <>{isExploding && <ConfettiExplosion duration={confettiAnimationDuration} />}</>;
};

export default React.memo(Confetti);
