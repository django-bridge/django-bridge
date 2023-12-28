import React, { ReactElement } from "react";
import styled from "styled-components";

interface SpinnerIconProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function SpinnerIcon({
  size = 80,
  strokeWidth = 8,
  color = "#00C9D6",
}: SpinnerIconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      color={color}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinner-secondHalf">
          <stop offset="0%" stopOpacity="0" stopColor="currentColor" />
          <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id="spinner-firstHalf">
          <stop offset="0%" stopOpacity="1" stopColor="currentColor" />
          <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
        </linearGradient>
      </defs>

      <g strokeWidth={strokeWidth}>
        <path
          stroke="url(#spinner-secondHalf)"
          d={`M ${strokeWidth / 2} 100 A ${100 - strokeWidth / 2} ${
            100 - strokeWidth / 2
          } 0 0 1 ${200 - strokeWidth / 2} 100`}
        />
        <path
          stroke="url(#spinner-firstHalf)"
          d={`M ${200 - strokeWidth / 2} 100 A ${100 - strokeWidth / 2} ${
            100 - strokeWidth / 2
          } 0 0 1 ${strokeWidth / 2} 100`}
        />

        <path
          stroke="currentColor"
          strokeLinecap="round"
          d={`M ${strokeWidth / 2} 100 A ${100 - strokeWidth / 2} ${
            100 - strokeWidth / 2
          } 0 0 1 ${strokeWidth / 2} ${100 - strokeWidth / 4}`}
        />
      </g>

      <animateTransform
        from="0 0 0"
        to="360 0 0"
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1300ms"
      />
    </svg>
  );
}

const SpinnerWrapper = styled.div`
  position: absolute;
  left: calc(50% - 40px);
  top: calc(50% - 40px);
`;

const TextWrapper = styled.div`
  position: absolute;
  top: 35px;
  font-size: 13px;
  color: black;
  width: 80px;
  text-align: center;
`;

function LoadingSpinner(): ReactElement {
  return (
    <SpinnerWrapper>
      <SpinnerIcon />

      <TextWrapper>Loading</TextWrapper>
    </SpinnerWrapper>
  );
}

export default LoadingSpinner;
