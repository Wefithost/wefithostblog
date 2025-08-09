'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../context/auth-context';
import Sidebar from './components/sidebar/sidebar';
import Image from 'next/image';
import loader from '~/public/icons/double-loading.svg';
import Header from './products/components/header';
export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const router = useRouter();
   const { loading, user } = useUser();
   useEffect(() => {
      if (loading) return;

      if (!user || !user.isAdmin) {
         router.push('/');
      }
   }, [loading, user, router]);
   return (
      <main className="h-screen overflow-hidden  flex items-start  bg-white">
         <Sidebar hidden />

         <section className="h-full overflow-auto  w-full bg-[#f1f1f4]    border-l-[2px] border-l-lightGrey">
            <Header />

            {children}
         </section>
      </main>
   );
}
