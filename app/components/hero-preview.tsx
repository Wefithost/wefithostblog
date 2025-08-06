import Image from 'next/image';
import { FaCircle } from 'react-icons/fa';
import heroImg from '~/public/images/hero-img.jpg';
// hero section slideshow
const HeroPreview = () => {
	return (
		<section className="flex min-h-[700px] max-h-[700px] w-full bg-black-50 overflow-hidden relative items-end rounded-lg max-2xl:min-h-[500px]  max-2xl:max-h-[500px] max-md:min-h-[300px] max-md:max-h-[300px]">
			<div className="w-full h-full absolute z-[20] object-cover top-0 left-0 bg-[#ffffff68]"></div>
			<Image
				src={heroImg}
				alt="hero-img"
				className="absolute top-0 left-0 w-full h-full object-cover z-2"
			/>
			<div className="flex flex-col gap-4 relative z-30 max-w-[800px] items-start p-8 py-16 max-lg:py-8 max-lg:max-w-full  max-xl:gap-2 max-md:px-4 text-black  max-2xs:py-4 ">
				<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:h-[30px] max-md:text-sm">
					Tips
				</button>
				<h1 className="text-[32px] poppins-bold max-2xl:text-2xl max-xl:text-xl max-2xs:text-base  line-clamp-2">
					5 Proven Ways to Supercharge Your Website’s Hosting Performance in
					2025
				</h1>
				<p className="text-lg max-2xl:text-base max-xl:text-sm  line-clamp-2">
					A slow website can cost you conversions, customers, and credibility.
					Discover the key strategies hosting experts use to deliver
					lightning-fast load times and rock-solid uptime
				</p>
				<div className="flex gap-4 items-center text-lg max-2xl:text-base max-xl:text-sm">
					<span>26, Jan 2025</span>
					<FaCircle className="text-[10px] " />
					<span>10 mins read</span>
				</div>
			</div>
		</section>
	);
};

export default HeroPreview;

