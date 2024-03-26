import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>IAAF Admin</title>
        </Head>
        <Navbar />
        <main className="min-h-[calc(100vh-82px)]">
          <Component {...pageProps} />
          <Toaster />
        </main>
        <footer>
          <div className="bg-[#0B298D] text-white text-xs max-md:text-[8px] font-normal text-center py-5">
            <p className="mb-2">
              جمعية مستثمري الإسكندرية © 2023. جميع الحقوق محفوظة
            </p>
            <p className="mt-2">
              تم انشاءه بواسطة{" "}
              <span className="font-black text-sm max-md:text-xs text-[#9038d8]">
                <a href="https://devlab-tech.com" target="_blank">
                  DevLab
                </a>
              </span>
            </p>
          </div>
        </footer>
      </SessionProvider>
    </>
  );
}
