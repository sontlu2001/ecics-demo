import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import { Suspense } from 'react';

import '@/styles/app.scss';

import { ReactQueryProvider } from '@/providers/react-query';
import { ReduxProvider } from '@/providers/redux';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ECICS Insurance',
  description: 'ECICS Insurance',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={openSans.className}>
        <Suspense fallback={null}>
          <ReduxProvider>
            <ReactQueryProvider>
              <AntdRegistry>{children}</AntdRegistry>
            </ReactQueryProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
