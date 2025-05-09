import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/styles/app.scss';
import { ReduxProvider } from '@/providers/redux';
import { ReactQueryProvider } from '@/providers/react-query';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={openSans.className}>
        <ReduxProvider>
          <ReactQueryProvider>
            <AntdRegistry>{children}</AntdRegistry>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
