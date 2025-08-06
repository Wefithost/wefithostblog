import ArticlesContainer from './components/articles-container';
import CtaSection from './components/cta';
import HeroPreview from './components/hero-preview';

export default function Home() {
	return (
		<main className="  mx-auto px-16 max-2xl:px-10 max-xs:px-5 ">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10">
				<HeroPreview />
				<section className="flex flex-col gap-4 max-w-[900px]">
					<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl ">
						WeFitHost Blog
					</h1>
					<p className="text-lg max-2xl:text-base">
						WeFitHost Blog brings you the latest tips, updates, and insights on
						web hosting, website management, and digital tools — helping
						individuals and businesses build faster, smarter, and more secure
						online experiences
					</p>
				</section>
				<ArticlesContainer />
				{/* CTA Section */}
				<CtaSection />
			</div>
		</main>
	);
}

