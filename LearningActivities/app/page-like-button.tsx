// LearningActivities/app/page.tsx
import LikeButton from './like-button';

function Header({ title }: { title?: string }) {
  return <h1 className="text-4xl font-bold text-black-500">{title ?? 'Default title'}</h1>;
}

export default function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  return (
    <main className="p-8 space-y-6">
      <Header title="Develop. Preview. Ship." />

      <ul className="list-disc pl-6 space-y-1 text-lg">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <LikeButton />
    </main>
  );
}


