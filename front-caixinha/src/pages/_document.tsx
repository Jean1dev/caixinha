import { Html, Head, Main, NextScript } from 'next/document'

const Vendors = () => (
  <>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />
  </>
);

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Vendors />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
