import React from "react";
import { useTimer } from "react-timer-hook";

type Props = {
  expiryTimestamp: Date;
  onExpire: () => void;
};
const Timer = ({ expiryTimestamp, onExpire }: Props) => {
  const { seconds } = useTimer({
    expiryTimestamp: expiryTimestamp,
    onExpire: onExpire,
  });

  return <div>{seconds}</div>;
};

export default Timer;
