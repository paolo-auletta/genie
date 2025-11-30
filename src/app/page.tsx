"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DM_Serif_Display } from "next/font/google";

const playfair = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#254031] flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row relative">
        <section className="relative w-full h-56 md:h-auto md:w-1/2 overflow-hidden">
          <Image
            src="/home.jpg"
            alt="People connecting"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </section>

        <section className="flex-1 flex justify-center items-center px-6 py-10 md:px-14">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <Image
                src="/lampada.png"
                alt="Lamp icon"
                width={160}
                height={160}
                className="w-24 h-24 md:w-36 md:h-36 object-contain"
              />
              <div
                className={`${playfair.className} text-4xl md:text-7xl font-medium text-[#254031]`}
              >
                Genius
              </div>
            </div>
            <h2 className="text-base md:text-lg font-semibold text-[#254031]">
              Which one are you?
            </h2>

            <div className="space-y-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => router.push("/genius")}
                className="group rounded-2xl border border-[rgba(69,91,80,0.15)] bg-[#F3F6F4] px-4 py-4 text-left cursor-pointer transition-all shadow-sm hover:shadow-xl md:px-6 md:py-6"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-xl font-semibold text-[#254031]">Genius</div>
                  <div className="text-sm text-[#455B50]">Make a wish</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#455B50] opacity-100 max-h-48 md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-48 transition-all duration-700">
                  If you are a Genius, this is the right place to ask for support. Click here
                  to be matched with a Genie.
                </p>
                <div className="mt-3 opacity-100 max-h-16 md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-16 transition-all duration-700">
                  <button className="rounded-full border border-[#254031] bg-transparent px-4 py-1.5 text-xs font-medium text-[#254031] hover:bg-[#254031] hover:text-white transition-colors">
                    Login as Genius
                  </button>
                </div>
              </div>

              <div
                role="button"
                tabIndex={0}
                className="group rounded-2xl border border-transparent bg-[#254031] px-4 py-4 text-left cursor-pointer text-white transition-all shadow-sm hover:bg-[#1c3125] hover:shadow-xl md:px-6 md:py-6"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-xl font-semibold">Genie</div>
                  <div className="text-sm text-[#F0F4F2]">Make a wish come true</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#F0F4F2] opacity-100 max-h-48 md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-48 transition-all duration-700">
                  If you are a Genie, this is the right place to help someone in need.
                </p>
                <div className="mt-3 opacity-100 max-h-16 md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-16 transition-all duration-700">
                  <button
                    className="rounded-full border border-white/80 bg-transparent px-4 py-1.5 text-xs font-medium text-white hover:bg-white hover:text-[#254031] hover:border-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/genie");
                    }}
                  >
                    Login as Genie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
