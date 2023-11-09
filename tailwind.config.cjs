// @ts-check

// 1. Import the Skeleton plugin
const { skeleton } = require('@skeletonlabs/tw-plugin');
// import forms from '@tailwindcss/forms';
/** @type {import('tailwindcss').Config} */
module.exports = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			fontFamily:{
				osans:['Open-sans'],
				},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-9deg)' },
					'50%': { transform: 'rotate(9deg)' },
				  },
				  fadeInOut:{
					"0%,100%":{
						opacity: '1'
					},
					"50%": {
						opacity: '0.5'
					}
				  }
			},
			animation: {
				wiggle: 'wiggle 800ms ease-in-out infinite',
				fade: 'fadeInOut 1s ease-in-out infinite'
			  }
		},
	},
	plugins: [
		// forms,
		skeleton({
			themes: { preset: ["crimson"] }
		})
	]
}