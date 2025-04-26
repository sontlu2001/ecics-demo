import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
      },
      colors: {
        primaryBlue: '#002EFF',
        secondaryBlue: '#007AFF',
        'brand-blue': '#00ADEF',
        'plan-blue': '#b6dbfd',
        'review-blue': '#F4FBFD',
        'coupon-blue': '#0095CE',
        'red-logo': '#F4333D',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
  plugins: [],
};

export default config;
