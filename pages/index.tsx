import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FactoryProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaPen, FaTrash, FaXmark } from "react-icons/fa6";
import useSWRInfinite from "swr/infinite";
import Swal from "sweetalert2";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");

  const LIMIT = 10;
  const fetcher = (key: string) => fetch(key).then((res) => res.json());
  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(
      (index) => `/api/factory?search=${search}&limit=${LIMIT}&page=${index}`,
      fetcher,
      {
        refreshInterval: 3000,
      }
    );

  const factories: FactoryProps[] = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < LIMIT);
  // const isRefreshing = isValidating && data && data.length === size;

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "هل انت متاكد؟",
      text: "هل تريد حذف هذا المشروع؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "الغاء",
    });
    if (result.isConfirmed) {
      const res = await fetch(`/api/factory/${id}`, {
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
        <Link href="/add/factory">
          <button className="w-fit my-10 bg-sec text-white py-2 px-6 rounded-sm">
            اضافة مشروع
          </button>
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center text-4xl">جاري تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center text-4xl">
          حدث خطأ يرجى المحاولة مرة اخرى
        </div>
      ) : isEmpty ? (
        <div className="text-center text-4xl">لا يوجد بيانات لعرضها</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right min-w-[200px]">
                اسم المشروع
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                نوع المشروع
              </TableHead>
              <TableHead className="text-right min-w-[200px]">النشاط</TableHead>
              <TableHead className="text-right min-w-[200px]">
                التليفون
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                الايميل
              </TableHead>
              <TableHead className="text-right min-w-[200px]">الصور</TableHead>
              <TableHead className="text-right min-w-[200px]">
                اجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factories.map((factory: FactoryProps) => (
              <TableRow key={factory._id}>
                <TableCell className="text-right min-w-[200px]">
                  {factory.nameAR}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {factory.typeAR}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {factory.descriptionAR}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {factory.phone}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {factory.email}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  <div>
                    {factory.images.map((img) => (
                      <Image
                        src={img}
                        width={80}
                        height={80}
                        key={img}
                        alt="img"
                        className="w-20"
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  <button
                    onClick={() => handleDelete(factory._id)}
                    className="m-4 rounded-full p-4 bg-main text-white"
                  >
                    <FaTrash />
                  </button>
                  <Link href={`/edit/factory/${factory._id}`}>
                    <button className="m-4 rounded-full p-4 bg-main text-white">
                      <FaPen />
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <button
        onClick={() => setSize(size + 1)}
        disabled={isLoadingMore || isReachingEnd}
        className={`${
          (isLoadingMore || isReachingEnd) && "opacity-60"
        } w-[215px] max-sm:w-[70px] more-shadow bg-[#292E3D] my-10 m-auto block text-xl max-sm:text-xs font-bold text-white py-3 max-sm:py-1`}
      >
        {isLoadingMore
          ? "جاري التحميل..."
          : isReachingEnd
          ? "لا يوجد بيانات اخرى"
          : "المزيد"}
      </button>
    </section>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return { props: {} };
}) satisfies GetServerSideProps;
