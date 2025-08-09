'use client';
import { useEffect, useRef } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import { usePathname } from 'next/navigation';
import { MainContext } from '~/app/context/context';

const AdminOverlay = () => {
   const { setIsAdminOverlayOpen } = MainContext();

   const ref = useRef<any>(null);
   const toggleOverlay = () => {
      const overlayElement = document.getElementById('adminOverlay');
      if (!overlayElement) {
         return;
      }

      if (overlayElement.style.width === '100%') {
         overlayElement.style.width = '0%';
      }
   };
   useEffect(() => {
      const handleClickOutside = (event: any) => {
         if (ref.current && !ref.current.contains(event.target)) {
            toggleOverlay();
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);
   const linkname = usePathname();

   useEffect(() => {
      const overlayElement = document.getElementById('adminOverlay');

      if (!overlayElement) {
         return;
      }
      overlayElement.style.width = '0%';
      setIsAdminOverlayOpen(false);
   }, [linkname, setIsAdminOverlayOpen]);
   return (
      <div
         className="hidden  fixed  z-40 top-o  left-0   ease-out duration-[0.2s]    overflow-hidden  h-full    lg:flex   items-start backdrop-brightness-[.6]  w-[0px]"
         id="adminOverlay"
      >
         <div className="flex flex-col bg-white h-full  relative" ref={ref}>
            <Sidebar />
         </div>
      </div>
   );
};
export default AdminOverlay;
