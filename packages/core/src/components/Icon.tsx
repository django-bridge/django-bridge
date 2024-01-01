import { css, styled } from "styled-components";

// To add a new icon:
// - Find the icon that you'd like to use in the FontAwesome 5 library: https://fontawesome.com/v5.15/icons/
// - Download the SVG version of the image
// - Paste the SVG content in this file and add an entry to the IconName type and ICON_MAP, following existing icons as an example
// - Add the icon Story to the Icon.stories.tsx

// Things to note:
// - Remove the classes on the icon as we do not use these
// - Make sure the name you use here exactly matches the name on font awesome to improve findability

// https://fontawesome.com/v5.15/icons/exclamation-triangle?style=solid
export const ExclamationTriangleSolidIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="exclamation-triangle"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill="currentColor"
      d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
    />
  </svg>
);

// https://fontawesome.com/v5.15/icons/check-circle?style=solid
export const CheckCircleSolidIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="check-circle"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
    />
  </svg>
);

const ICON_MAP = {
  "fa/exclamation-triangle-solid": ExclamationTriangleSolidIcon,
  "fa/check-circle-solid": CheckCircleSolidIcon,
} as const;

const StyledIcon = styled.i`
  display: inline-block;
  svg {
    display: block;
    transition: color 0.2s ease-in-out;
  }
`;

interface IconProps {
  name: keyof typeof ICON_MAP;
}

function Icon({ name }: IconProps): React.ReactElement {
  return <StyledIcon>{ICON_MAP[name]}</StyledIcon>;
}

export default Icon;
