// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { SeatProvider } from './seatContext';
import SeatMap from './Seatmap';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Stadium Seat Booking</title>
        <meta name="description" content="Book your stadium seats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <SeatProvider>
          <SeatMap />
        </SeatProvider>
      </main>

      <footer className="border-t mt-12 py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Stadium Seat Booking</p>
      </footer>
    </div>
  );
};

export default Home;