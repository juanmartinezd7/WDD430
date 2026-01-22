//app/like-button.tsx
'use client';
import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button
      className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      onClick={() => setLikes((l) => l + 1)}
    >
      Like ({likes})
    </button>
  );
}



