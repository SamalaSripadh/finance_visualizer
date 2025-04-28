import './globals.css';

export const metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track and visualize your personal finances',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
