import { Box } from "@mui/material";
import ConfettiExplosion from "@reonomy/react-confetti-explosion";
import React, { useEffect } from "react";

const confettiAnimationDuration = 10000;
const confettiDuration = confettiAnimationDuration / 1.3;

const Confetti = () => {
  const [isExploding, setIsExploding] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExploding(false);
    }, confettiDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Box sx={{ display: "inline-block" }}>
        {isExploding && (
          <ConfettiExplosion duration={confettiAnimationDuration} floorWidth={window.innerWidth / 1.1} floorHeight={window.innerHeight / 1.1} />
        )}
      </Box>
    </>
  );
};

export default React.memo(Confetti);
