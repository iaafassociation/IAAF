// Imports
import { signOut, useSession } from "next-auth/react";

// Module Imports
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { status, data: session } = useSession();

  return (
    <header
      className={`${
        status === "loading" && "hidden"
      } sticky bg-white border-b-2 border-black top-0 z-50  flex rtl:flex-row-reverse px-10 max-md:px-2 items-center justify-between`}
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
        {status === "authenticated" && <p>مرحبا {session?.user.username}</p>}
      </div>
      <nav>
        <ul className="flex flex-row-reverse max-md:hidden">
          {session?.user.role === "admin" && (
            <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
              <Link
                href="/admin"
                className={
                  router.pathname === "/admin" ? "text-main" : "text-black"
                }
              >
                المستخدمين
              </Link>
            </li>
          )}
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
          <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
            <Link
              href="/works"
              className={
                router.pathname === "/works" ? "text-main" : "text-black"
              }
            >
              طلبات التوظيف
            </Link>
          </li>
          {status === "unauthenticated" && (
            <li className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs">
              <Link
                href="/sign-in"
                className={
                  router.pathname === "/sign-in" ? "text-main" : "text-black"
                }
              >
                تسجيل الدخول
              </Link>
            </li>
          )}
          {status === "authenticated" && (
            <li
              className="mx-5 max-lg:mx-3 font-extrabold text-sm max-lg:text-xs cursor-pointer"
              onClick={() => signOut()}
            >
              تسجيل الخروج
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
