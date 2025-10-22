import { useState, useRef, MouseEvent, TouchEvent } from "react";

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipe: (direction: 'left' | 'right') => void;
  onCardLeftScreen?: () => void;
}

const SwipeableCard = ({ children, onSwipe, onCardLeftScreen }: SwipeableCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newX = clientX - startPos.x;
    const newY = clientY - startPos.y;
    setPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(position.x) > threshold) {
      const direction = position.x > 0 ? 'right' : 'left';
      const moveOutWidth = document.body.clientWidth * 1.5;
      setPosition({ 
        x: position.x > 0 ? moveOutWidth : -moveOutWidth, 
        y: position.y 
      });
      
      setTimeout(() => {
        onSwipe(direction);
        onCardLeftScreen?.();
      }, 300);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const rotation = position.x / 20;
  const opacity = Math.max(0.5, 1 - Math.abs(position.x) / 200);

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className="absolute w-full select-none"
    >
      {children}
    </div>
  );
};

export default SwipeableCard;
