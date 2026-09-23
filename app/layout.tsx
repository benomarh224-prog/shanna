import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/inter/400.css';
import './globals.css';
import './hero.css';
import './collection.css';
import './signature-footer.css';
import './product-dialog.css';
import './scent-finder.css';
import './mens-collection.css';
export const metadata: Metadata = { title: 'SHANNA — A scent. A signature.', description: 'An exploration of contrast. Discover SHANNA and a collection of three expressive eau de parfums.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
