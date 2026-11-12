import React from 'react';

interface BionicTextProps {
  text: string;
  isActive: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BionicText: React.FC<BionicTextProps> = ({ text, isActive, className, style }) => {
  if (!isActive || !text) {
    return <span className={className} style={style}>{text}</span>;
  }

  const processedText = text.split(' ').map((word, index) => {
    if (word.length <= 1) {
      return <span key={index}>{word} </span>;
    }

    const mid = Math.ceil(word.length / 2);
    const boldPart = word.substring(0, mid);
    const restPart = word.substring(mid);

    return (
      <span key={index}>
        <strong className="fw-bold">{boldPart}</strong>
        {restPart}
        {' '}
      </span>
    );
  });

  return <span className={className} style={style}>{processedText}</span>;
};