import React, { useState } from 'react';
import Markdown from 'react-markdown';
import Modal from './Modal';

interface MarkdownWithImagePreviewProps {
  content: string;
}

const MarkdownWithImagePreview: React.FC<MarkdownWithImagePreviewProps> = ({ content }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const renderers = {
    img: ({ src = '', alt = '' }) => (
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in max-w-full rounded shadow mb-4"
        onClick={() => {
          setModalImage(src.replace('/thumb/', '/'));
        }}
      />
    ),
    h1: 'h3',
  };

  return (
    <>
      {/* @ts-expect-error The type checker considers `h1: 'h3'` to be an error, but it is a valid documented usage. */}
      <Markdown components={renderers}>{content}</Markdown>

      {modalImage && (
        <Modal onClose={() => setModalImage(null)}>
          <img src={modalImage} alt="Full Size" className="max-w-full max-h-screen mx-auto" />
        </Modal>
      )}
    </>
  );
};

export default MarkdownWithImagePreview;
