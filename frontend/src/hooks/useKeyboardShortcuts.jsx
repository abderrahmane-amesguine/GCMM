// frontend/src/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' || 
          event.target.isContentEditable) {
        return;
      }

      shortcuts.forEach(({ key, ctrl, shift, alt, action, description }) => {
        const isCtrlPressed = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const isShiftPressed = shift ? event.shiftKey : !event.shiftKey;
        const isAltPressed = alt ? event.altKey : !event.altKey;

        if (event.key.toLowerCase() === key.toLowerCase() && 
            isCtrlPressed && 
            isShiftPressed && 
            isAltPressed) {
          event.preventDefault();
          action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;