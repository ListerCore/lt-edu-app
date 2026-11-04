'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';

// Drag-and-drop state of a drop zone (announcement image, future uploads)
export interface UseFileDropResult {
  isDragging: boolean;
  dropHandlers: {
    onDragEnter: (event: DragEvent<HTMLElement>) => void;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: (event: DragEvent<HTMLElement>) => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
}

// Drag-and-drop handlers for a drop zone; hands the first dropped file to onFile
export const useFileDrop = (onFile: (file: File) => void): UseFileDropResult => {
  const [isDragging, setIsDragging] = useState(false);
  // dragenter/dragleave also fire for child elements, so count them instead of toggling
  const depth = useRef(0);

  const onDragEnter = useCallback((event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    depth.current += 1;
    setIsDragging(true);
  }, []);

  // preventDefault on dragover is what allows the drop
  const onDragOver = useCallback((event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLElement>): void => {
      event.preventDefault();
      depth.current = 0;
      setIsDragging(false);
      const file = event.dataTransfer.files.item(0);
      if (file) onFile(file);
    },
    [onFile],
  );

  return { isDragging, dropHandlers: { onDragEnter, onDragOver, onDragLeave, onDrop } };
};
