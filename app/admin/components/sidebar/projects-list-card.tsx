import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
const SidebarList = (props: any) => {
   const linkname = usePathname();

   return (
      <div className="relative flex  items-center">
         <Link
            href={`${props.href}`}
            className={`  h-[55px] pl-3 pr-5  text-[22px]  flex items-center  gap-2  w-full xl:text-xl relative hover:bg-dimGreen      ${
               linkname.startsWith(`${props.href}`)
                  ? ' bg-dimGreen  text-softGreen'
                  : ' text-grey'
            }`}
         >
            <Image
               src={
                  linkname.startsWith(`${props.href}`)
                     ? props.activeIcon
                     : props.icon
               }
               alt=""
               className="w-6   "
            />
            <span className="line-clamp-1 neue   text-lg   ">{props.dir}</span>
         </Link>
         {linkname.startsWith(`${props.href}`) && (
            <div className="absolute right-0 bg-softGreen h-full p-1"></div>
         )}
      </div>
   );
};

export default SidebarList;
