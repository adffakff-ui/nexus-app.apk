import { useState, useRef, useCallback } from 'react';

export const useLongPress = (onLongPress: () => void, onClick: () => void, ms = 300) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setLongPressTriggered(false);
    timeout.current = setTimeout(() => {
      onLongPress();
      setLongPressTriggered(true);
    }, ms);
  }, [onLongPress, ms]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    if (!longPressTriggered) {
      onClick();
    }
  }, [onClick, longPressTriggered]);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
};
