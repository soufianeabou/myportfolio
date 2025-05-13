/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      // Add these lines to ensure all files are scanned
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // or 'media' depending on your preference
    theme: {
      extend: {
        // Your custom theme extensions
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        // Re-add your custom animations
        animation: {
          'reveal-text': 'reveal-text 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
          'fade-in-delayed': 'fade-in-delayed 1.5s forwards',
          'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
          'volumetric-light': 'volumetric-light 10s ease-in-out infinite',
          'twinkle': 'twinkle 4s infinite'
        },
        keyframes: {
          'reveal-text': {
            '0%': { transform: 'translateY(100%)' },
            '100%': { transform: 'translateY(0)' }
          },
          'fade-in-delayed': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '50%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
          },
          'bounce-slow': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' }
          },
          'volumetric-light': {
            '0%, 100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.3' },
            '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.6' }
          },
          'twinkle': {
            '0%, 100%': { opacity: '0.3' },
            '50%': { opacity: '1' }
          }
        }
      },
    },
    plugins: [],
  }