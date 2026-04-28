import React from 'react';

interface EyeIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen?: boolean;
}

export const EyeIcon: React.FC<EyeIconProps> = ({ isOpen = true, ...props }) => {
  if (isOpen) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
          d="M2.4 12s3.6-7 9.6-7 9.6 7 9.6 7-3.6 7-9.6 7S2.4 12 2.4 12z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 5l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2.4 12s3.6-7 9.6-7c2.1 0 3.9.7 5.4 1.7M21.6 12s-1.3 2.5-3.7 4.4c-1.6 1.2-3.6 2.6-5.9 2.6-6 0-9.6-7-9.6-7 0 0 1.2-2.4 3.5-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.2 10.2a3 3 0 004.2 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
