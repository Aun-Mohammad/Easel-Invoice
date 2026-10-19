export const metadata = {
  title: "Easel Invoice Maker",
  description: "Invoice and quotation generator for Easel Outdoor.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "black" }}>{children}</body>
    </html>
  );
}
