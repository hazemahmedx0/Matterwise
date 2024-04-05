import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/services/auth/auth-provider';
import QueryClientProvider from '@/services/react-query/query-client-provider';
import queryClient from '@/services/react-query/query-client';
// import ReactQueryDevtools from '@/services/react-query/react-query-devtools';
import ModalsProvider from '@/hooks/modals-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Matterwise',
  description: 'Simplify team communication',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <ModalsProvider>
            <AuthProvider> {children}</AuthProvider>
          </ModalsProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
