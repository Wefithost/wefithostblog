import type { Metadata } from 'next';
import './globals.css';

import localFont from 'next/font/local';
import Header from './components/header/header';
import { ToastContainer } from 'react-toastify';
import Footer from './components/footer/footer';
import { UtilsProvider } from './context/utils-context';
import Overlay from './components/overlay';
import AuthPrompt from './components/auth/auth';
import { AuthProvider } from './context/auth-context';
import { NextAuthProvider } from './next-auth-provider';
import { TopicsProvider } from './context/topics-context';
import Script from 'next/script';
import UpdateIp from './components/update-ip';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
const PoppinsReg = localFont({
	src: './fonts/Poppins-Regular.ttf',
	variable: '--font-poppins',
});

const QuicksandReg = localFont({
	src: './fonts/Quicksand-VariableFont_wght.ttf',
	variable: '--font-quicksand',
});
const PoppinsBold = localFont({
	src: './fonts/Poppins-ExtraBold.ttf',
	variable: '--font-poppinsextra',
});
export const metadata: Metadata = {
	title: 'WefitHost Blog – Smarter, Faster, and Safer Hosting Guides',
	description:
		'WeFitHost Blog shares tips, updates, and insights on hosting, site management, and digital tools to help you build smarter, faster, and safer online.',

	openGraph: {
		title: 'WefitHost Blog',
		description:
			'WeFitHost Blog shares tips, updates, and insights on hosting, site management, and digital tools to help you build smarter, faster, and safer online.',
		url: 'https://res.cloudinary.com/dl6pa30kz/image/upload/v1757335730/weFitHost-blog_vqp2he.png',
		siteName: 'WefitHost Blog',
		images: [
			{
				url: 'https://res.cloudinary.com/dl6pa30kz/image/upload/v1757335730/weFitHost-blog_vqp2he.png', // your OG image
				width: 1200,
				height: 630,
				alt: 'WefitHost Blog Cover',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'WefitHost Blog',
		description:
			'Tips, updates, and insights on hosting, site management, and digital tools.',
		images: [
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1757335730/weFitHost-blog_vqp2he.png',
		], // can reuse OG image
	},
	alternates: {
		canonical: 'https://blog.wefithost.com/',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<head>
				<meta
					name="google-site-verification"
					content="KOKNMGeWap4j_ppWm9uSPp6Hk7OSv-BWkSkHkW4_rWU"
				/>
				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-0TTFKMFS01"
				></Script>
				<Script id="google-analytics">
					{` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-0TTFKMFS01');`}
				</Script>
			</head>
			<body
				className={`${PoppinsReg.variable}  ${PoppinsBold.variable}  ${QuicksandReg.variable} antialiased  flex flex-col mx-auto`}
				id="body"
			>
				<NextAuthProvider>
					<ToastContainer position="bottom-right" closeButton={false} />
					<Suspense>
						<UtilsProvider>
							<TopicsProvider>
								<AuthProvider>
									<UpdateIp />
									<Header />
									<Overlay />
									<AuthPrompt />
									{children}
									<Analytics />
									<Footer />
								</AuthProvider>
							</TopicsProvider>
						</UtilsProvider>
					</Suspense>
				</NextAuthProvider>
			</body>
		</html>
	);
}

