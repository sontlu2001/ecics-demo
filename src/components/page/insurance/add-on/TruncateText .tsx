import React, { useEffect, useRef, useState } from 'react';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface TruncateTextProps {
  text: string | null;
  lines?: number;
  className?: string;
}

export const TruncateText = ({
  text,
  lines = 3,
  className = '',
}: TruncateTextProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const lineHeight = 19;
  const buttonHeight = 20;
  const buttonMargin = 4;
  const { isMobile } = useDeviceDetection();

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [text]);

  const minHeight = !expanded
    ? `${lineHeight * lines + buttonHeight + buttonMargin}px`
    : undefined;

  return (
    <div>
      <p
        ref={textRef}
        className={`
        text-justify text-[13px] font-semibold leading-[19px] text-[#535353] transition-all
        ${expanded ? '' : 'line-clamp-3'}
      `}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {text}
      </p>
      {isTruncated && (
        <button
          className='mt-1 text-xs font-semibold text-[#00ADEF] underline'
          style={{ height: buttonHeight, marginTop: buttonMargin }}
          onClick={() => setExpanded((prev) => !prev)}
          type='button'
        >
          {expanded ? 'View Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default TruncateText;
