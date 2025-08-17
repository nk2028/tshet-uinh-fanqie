import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'nk2028 反切計算器',
  description: 'nk2028 反切計算器可以根據反切上下字計算出被切字的中古音韻地位及現代發音，並附有詳細的推導步驟。',
  keywords: [
    '反切',
    '反切計算器',
    '自動反切',
    '反切工具',
    '反切計算',
    '反切推導',
    '中古漢語',
    '音韻學',
    '反切上字',
    '反切下字',
    '音韻地位',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ayaka14732/syyon-vencie@6b08e67/charissil/CharisSIL.css" />
        {children}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{\"token\": \"16ad6c356b37426cb31816318ed5a42d\"}'
        ></script>
      </body>
    </html>
  );
}
