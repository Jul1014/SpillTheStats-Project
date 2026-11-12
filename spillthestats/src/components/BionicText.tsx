import React, { useMemo } from 'react';

interface BionicTextProps {
  text: string;
  isActive: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BionicText: React.FC<BionicTextProps> = ({ text, isActive, className }) => {
  // Si no está activo o no hay texto, lo renderizamos normal
  if (!isActive || !text) {
    return <span className={className}>{text}</span>;
  }

  // Procesamos el texto solo si está activo
  const processedText = useMemo(() => {
    return text.split(' ').map((word, index) => {
      // Palabras de 1 letra no se resaltan
      if (word.length <= 1) {
        return <span key={index}>{word} </span>;
      }

      // Número de letras / 2 redondeado hacia arriba
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
  }, [text]);

  return <span className={className}>{processedText}</span>;
};