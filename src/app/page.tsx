// In your page.tsx
import Home from '../components/Home';
import ClientOnly from '../components/ClientOnly';

export default function Page() {
  return (
    <ClientOnly>
      <Home />
    </ClientOnly>
  );
}