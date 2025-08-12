import React, { useState } from 'react';
import Markdown from 'react-markdown';
import Modal from './Modal'; // 你自定義的彈窗組件

interface MarkdownWithImagePreviewProps {
  content: string;
}

const MarkdownWithImagePreview: React.FC<MarkdownWithImagePreviewProps> = ({ content }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const renderers = {
    img: ({ src = '', alt = '' }) => {
      const fullSizeSrc = src.replace('/thumb/', '/');

      return (
        <img
          src={src}
          alt={alt}
          className="cursor-zoom-in max-w-full rounded shadow mb-4"
          onClick={() => {
            if (fullSizeSrc) setModalImage(fullSizeSrc);
          }}
        />
      );
    },
    h1: 'h3',
  };

  return (
    <>
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
