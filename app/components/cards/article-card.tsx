import Link from 'next/link';
import { FaCircle } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';
import { IArticle } from '~/types/article';
interface articleProps {
	article: IArticle;
}
const ArticleCard = ({ article }: articleProps) => {
	return (
		<Link
			href={`/${slugify(article?.title)}`}
			className="flex flex-col gap-4 h-[520px] items-start overflow-hidden  rounded-xl p-3 hover:shadow-md duration-150 bg-gray-50 max-xs:gap-2 max-xs:h-[490px] max-2xs:h-auto "
		>
			<div className="min-h-[300px] max-h-[300px] w-full overflow-hidden rounded-xl blog-img relative   max-2xs:max-h-auto max-2xs:min-h-[200px]">
				{/* eslint-disable-next-line */}
				<img
					src={article?.img}
					alt=""
					className="w-full h-full object-cover max-2xs:min-h-[200px]"
				/>
				<button className="bg-purple h-[40px] hover:bg-darkPurple duration-150 px-3 text-white text-sm rounded-sm absolute  top-5 left-5 font-semibold max-2xs:h-[30px] max-2xs:px-2  max-2xs:text-xs max-2xs:top-3 max-2xs:left-3 ">
					{article?.topic}
				</button>
			</div>
			<div className="flex gap-4 items-center text-lg  max-md:text-base">
				<span>{formatDate(article?.date)}</span>
				<FaCircle className="text-[10px] " />
				<span>{article?.duration} mins read</span>
			</div>
			<h1 className="text-lg poppins-bold line-clamp-1 max-2xs:text-base">
				{article?.title}
			</h1>
			<p className="text-lg line-clamp-2 article-desc max-md:text-base max-2xs:text-sm">
				{article.description}
			</p>
			<button className="text-purple hover:text-darkPurple duration-150">
				Read more
			</button>
		</Link>
	);
};

export default ArticleCard;

