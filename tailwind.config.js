/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#F6F8FB',
        surface: '#FFFFFF',
        ink: '#111827',
        muted: '#6B7280',
        line: '#E5E7EB',
        primary: '#1D4ED8',
        'primary-soft': '#EFF6FF',
      },
      borderRadius: {
        card: '10px',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Microsoft YaHei',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
