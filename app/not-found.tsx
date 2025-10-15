import Link from 'next/link';

const NotFoundPage = () => {
	return (
		<main className="flex items-center justify-center w-full min-h-[90vh] bg-purple-50 p-5">
			<div className="flex items-center gap-4 flex-col max-xs:items-start">
				<h3>404</h3>
				<h1 className="text-8xl poppins text-center max-lg:text-5xl max-xs:text-start">
					Page Not Found
				</h1>
				<p className="text-base text-center max-xs:text-start">
					The page you are looking for does&apos;nt exist or has been moved
				</p>
				<Link
					href="/"
					className="text-uppercase text-sm bg-purple hover:bg-darkPurple h-10 px-5 text-center flex items-center justify-center text-white duration-150"
				>
					Go Home
				</Link>
			</div>
		</main>
	);
};

export default NotFoundPage;

