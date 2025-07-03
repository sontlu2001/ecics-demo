import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import { Suspense } from 'react';

import '@/styles/app.scss';

import { NavigationConfirmProvider } from '@/providers/NavigationConfirmProvider';
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
      <head>
        <title>ECICS Insurance</title>
        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rntrxo7r12");`,
          }}
        />
      </head>
      <body className={openSans.className}>
        <Suspense fallback={null}>
          <ReduxProvider>
            <ReactQueryProvider>
              <AntdRegistry>
                <NavigationConfirmProvider />
                {children}
              </AntdRegistry>
            </ReactQueryProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
