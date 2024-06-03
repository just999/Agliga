import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { Nunito } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/navbar';

import ToasterProvider from '@/providers/toaster-provider';

import { auth } from '@/auth';

import AuthModal from '@/components/modals/auth-modal';

import SearchModal from '@/components/modals/search-modal';
import DepositWdModal from '@/components/modals/deposit-wd-modal';

// import ClientOnly from '@/lib/client-only';
import { cn } from '@/lib/utils';
import PostModal from '@/components/modals/post-modal';
import DeleteModal from '@/components/modals/delete-modal';

import Footer from '@/components/footer';

import LiveScoreModal from '@/components/modals/live-score-modal';

import TopicModal from '@/components/modals/topic-modal';
import { SessionProvider } from 'next-auth/react';
import NoUserModal from '@/components/modals/no-user-modal';
import SoccerModal from '@/components/modals/soccer-modal';
import getCurrentUser from '@/actions/get-user';
import UserProfileModal from '@/components/modals/user-profile-modal';
import AddPostModal from '@/components/modals/add-post-modal';
import SliderModal from '@/components/modals/slider-modal';

const inter = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AL',
  description: 'agenliga',
};

type RootLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default async function RootLayout({
  children,
  className,
}: Readonly<RootLayoutProps>) {
  const currentUser = await getCurrentUser();
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang='en' className='relative '>
        <body
          className={cn(
            'flex flex-col   overflow-x-hidden ',
            inter.className,
            className
          )}
          suppressHydrationWarning={true}
        >
          <ToasterProvider />
          <UserProfileModal />
          <SoccerModal />
          <TopicModal />
          <LiveScoreModal />
          <DeleteModal />
          <DepositWdModal />
          <PostModal />
          {/* <AddPostModal /> */}
          <SliderModal />
          <SearchModal />
          <NoUserModal />
          <AuthModal />
          <Navbar currentUser={currentUser} />
          <div className='pb-20 flex-1'>{children}</div>
          <div>
            <Footer />
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
