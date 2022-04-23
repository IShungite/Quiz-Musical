import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { styled } from "@mui/material";
import React from "react";

interface CustomLoadingButtonProps {
  disabledcolors: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const CustomLoadingButton = styled(LoadingButton)<CustomLoadingButtonProps>(({ disabledcolors }) => ({
  ":disabled": {
    borderColor: disabledcolors.borderColor,
    color: disabledcolors.textColor,
    backgroundColor: disabledcolors.backgroundColor,
  },
}));

export default CustomLoadingButton;
