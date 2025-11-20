import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Toluwani & Gbenga Wedding",
  description: "Wedding ticketing and check-in system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-full  relative">
          <Navigation />
          <div className="absolute top-0 left-0 bottom-0 right-0 -z-10 ">
            <Image
              src="/assets/bg.png"
              alt="Wedding background"
              width={10000}
              height={10000}
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
