import LenisProvider from '@/components/LenisProvider';
import './globals.css';

export const metadata = {
  title: 'Northern Arizona University IDEA Lab',
  description: 'Advanced additive manufacturing and engineering lab.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-black text-white antialiased selection:bg-purple-500/30 selection:text-white">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}