import type {Metadata} from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Elysium Spaces | Luxury Property Customization',
  description: "Experience stealth luxury and sophisticated minimalism with Elysium Spaces. Curated by Collins Mang'oli, CEO.",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className="font-sans min-h-screen bg-elysium-black text-white antialiased selection:bg-elysium-rosegold selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
