'use client';

import React, { createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PostAppModal } from '@/components/PostAppModal';

interface PostModalContextType {
  openPostModal: () => void;
  closePostModal: () => void;
}

const PostModalContext = createContext<PostModalContextType>({
  openPostModal: () => {},
  closePostModal: () => {},
});

export function PostModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const openPostModal = () => setIsOpen(true);
  const closePostModal = () => setIsOpen(false);

  return (
    <PostModalContext.Provider value={{ openPostModal, closePostModal }}>
      {children}
      {isOpen && <PostAppModal onClose={closePostModal} />}
    </PostModalContext.Provider>
  );
}

export function usePostModal() {
  return useContext(PostModalContext);
}
