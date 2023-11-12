// Imports
import { HiBars3BottomRight } from "react-icons/hi2";
import { FaChevronLeft } from "react-icons/fa6";

// Module Imports
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <header
      className={`${"sticky bg-white border-b-2 border-black"} top-0 z-50  flex rtl:flex-row-reverse px-10 max-md:px-2 items-center justify-between`}
    >
      <div className="flex rtl:flex-row-reverse items-center">
        <div className="mr-20 max-lg:mr-10 max-md:mr-4">
          <Image
            src="/logo.jpg"
            alt="logo"
            height={80}
            width={80}
            className="h-20 max-lg:h-16 max-md:h-12"
          />
        </div>
      </div>
      <nav>
        <ul className="flex flex-row-reverse max-md:hidden">
          <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
            <Link
              href="/"
              className={router.pathname === "/" ? "text-main" : "text-black"}
            >
              المشروعات
            </Link>
          </li>
          <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
            <Link
              href="/members"
              className={
                router.pathname === "/members" ? "text-main" : "text-black"
              }
            >
              اعضاء مجلس الادارة
            </Link>
          </li>
          <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
            <Link
              href="/news"
              className={
                router.pathname === "/news" ? "text-main" : "text-black"
              }
            >
              الاخبار
            </Link>
          </li>
          <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
            <Link
              href="/messages"
              className={
                router.pathname === "/messages" ? "text-main" : "text-black"
              }
            >
              الرسائل
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
