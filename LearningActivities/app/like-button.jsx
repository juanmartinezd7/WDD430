//app/like-button.jsx
'use client';

import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button
      className="mt-4 rounded bg-blue-600 px-3 py-2 text-white"
      onClick={() => setLikes((l) => l + 1)}
    >
      Like ({likes})
    </button>
  );
}

