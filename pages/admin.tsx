import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaPen, FaTrash, FaXmark } from "react-icons/fa6";
import useSWR from "swr";
import Swal from "sweetalert2";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Admin({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");

  const fetcher = (key: string) => fetch(key).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR("/api/users", fetcher);
  const {
    data: searchData,
    error: searchError,
    isLoading: searchLoading,
  } = useSWR(search ? `/api/users?search=${search}` : null, fetcher, {
    refreshInterval: 3000,
  });

  console.log(data);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "هل انت متاكد؟",
      text: "هل تريد حذف هذا المستخدم؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "الغاء",
    });
    if (result.isConfirmed) {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("تم الحذف!", undefined, "success");
        console.log(data);
        mutate();
      } else {
        Swal.fire("حدث خطأ اثناء الحذف!", undefined, "error");
        console.log("error");
      }
    }
  };

  return (
    <section className="py-10 px-10">
      <div className="bg-sec rounded-full w-[400px] max-lg:w-[350px] max-sm:w-[200px] guide-shadow m-auto max-lg:px-4 max-lg:py-3 px-6 py-4 max-sm:px-2 max-sm:py-1.5 flex justify-between mb-10">
        <input
          type="text"
          placeholder="ابحث"
          value={text}
          onChange={(e) => {
            if (e.target.value) {
              setText(e.target.value);
            } else {
              setText(e.target.value);
              setSearch("");
            }
          }}
          className="bg-transparent outline-none placeholder:font-bold max-lg:text-sm max-sm:text-[8px]/3 w-[300px] max-lg:w-[270px] max-sm:w-[160px] border-b text-white border-white/60"
        />
        <FaXmark
          onClick={() => {
            setSearch("");
            setText("");
          }}
          className="relative w-5 h-5 max-lg:w-3 max-lg:h-3 max-sm:w-2 max-sm:h-2 left-4 top-1 text-white cursor-pointer"
        />
        <button
          onClick={() => {
            setSearch(text);
          }}
        >
          <FaSearch
            color="white"
            className="w-9 h-9 max-lg:w-7 max-lg:h-7 max-sm:w-4 max-sm:h-4"
          />
        </button>
      </div>
      <div>
        <Link href="/add/user">
          <button className="w-fit my-10 bg-sec text-white py-2 px-6 rounded-sm">
            اضافة مستخدم
          </button>
        </Link>
      </div>
      {search ? (
        searchLoading ? (
          <div className="text-center text-4xl">جاري تحميل البيانات...</div>
        ) : searchError ? (
          <div className="text-center text-4xl">
            حدث خطأ يرجى المحاولة مرة اخرى
          </div>
        ) : searchData.length > 0 ? (
          <>
            <div className="text-center text-4xl mb-10 text-sec font-black">
              المستخدمين
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[200px]">
                    اسم المستخدم
                  </TableHead>

                  <TableHead className="text-right min-w-[200px]">
                    اجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchData.map((user: UserProps) => (
                  <TableRow key={user._id}>
                    <TableCell className="text-right min-w-[200px]">
                      {user.username}
                    </TableCell>

                    <TableCell className="text-right min-w-[200px]">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="m-4 rounded-full p-4 bg-main text-white"
                      >
                        <FaTrash />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center text-4xl">لا يوجد بيانات لعرضها</div>
        )
      ) : isLoading ? (
        <div className="text-center text-4xl">جاري تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center text-4xl">
          حدث خطأ يرجى المحاولة مرة اخرى
        </div>
      ) : data.length > 0 ? (
        <>
          <div className="text-center text-4xl mb-10 text-sec font-black">
            المستخدمين
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right min-w-[200px]">
                  اسم المستخدم
                </TableHead>
                <TableHead className="text-right min-w-[200px]">
                  اجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user: UserProps) => (
                <TableRow key={user._id}>
                  <TableCell className="text-right min-w-[200px]">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-right min-w-[200px]">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="m-4 rounded-full p-4 bg-main text-white"
                    >
                      <FaTrash />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className="text-center text-4xl">لا يوجد بيانات لعرضها</div>
      )}
    </section>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
