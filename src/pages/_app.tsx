import "@/styles/global.css";

import type { AppProps } from "next/app";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Unilever | Treinamento</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default MyApp;
