import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComplaintProps, MessageProps } from "@/types";
import { FaTrash } from "react-icons/fa6";
import useSWR from "swr";
import Swal from "sweetalert2";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Messages() {
  const fetcher = (key: string) => fetch(key).then((res) => res.json());
  const {
    data: messageData,
    error: messageError,
    isLoading: messageLoading,
    mutate: messageMutate,
  } = useSWR("/api/message", fetcher);

  const { data, error, isLoading, mutate } = useSWR("/api/complaint", fetcher);

  console.log(data);

  const handleDeleteMessage = async (id: string) => {
    const result = await Swal.fire({
      title: "هل انت متاكد؟",
      text: "هل تريد حذف هذه الرسالة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "الغاء",
    });
    if (result.isConfirmed) {
      const res = await fetch(`/api/message/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("تم الحذف!", undefined, "success");
        console.log(data);
        messageMutate();
      } else {
        Swal.fire("حدث خطأ اثناء الحذف!", undefined, "error");
        console.log("error");
      }
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    const result = await Swal.fire({
      title: "هل انت متاكد؟",
      text: "هل تريد حذف هذه الشكوى؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "الغاء",
    });
    if (result.isConfirmed) {
      const res = await fetch(`/api/complaint/${id}`, {
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
      <div className="text-center text-4xl text-sec my-10 font-black">
        الرسائل
      </div>
      {messageLoading ? (
        <div className="text-center text-4xl">جاري تحميل البيانات...</div>
      ) : messageError ? (
        <div className="text-center text-4xl">
          حدث خطأ يرجى المحاولة مرة اخرى
        </div>
      ) : messageData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right min-w-[200px]">الاسم</TableHead>
              <TableHead className="text-right min-w-[200px]">
                الايميل
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                سبب التواصل
              </TableHead>
              <TableHead className="text-right min-w-[200px]">الهاتف</TableHead>
              <TableHead className="text-right min-w-[200px]">
                الرسالة
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                اجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messageData.map((message: MessageProps) => (
              <TableRow key={message._id}>
                <TableCell className="text-right min-w-[200px]">
                  {message.name}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {message.email}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {message.reason}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {message.phone}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {message.message}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="m-4 rounded-full p-4 bg-main text-white"
                  >
                    <FaTrash />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-4xl">لا يوجد بيانات لعرضها</div>
      )}
      <div className="text-center text-4xl text-sec my-10 font-black">
        الشكاوي و المقترحات
      </div>
      {isLoading ? (
        <div className="text-center text-4xl">جاري تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center text-4xl">
          حدث خطأ يرجى المحاولة مرة اخرى
        </div>
      ) : data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right min-w-[200px]">الاسم</TableHead>
              <TableHead className="text-right min-w-[200px]">
                الايميل الشخصي
              </TableHead>
              <TableHead className="text-right min-w-[200px]">الشركة</TableHead>
              <TableHead className="text-right min-w-[200px]">
                الوظيفة
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                ايميل الشركة
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                تليفون الشركة
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                رقم الموبايل
              </TableHead>
              <TableHead className="text-right min-w-[200px]">
                رقم الواتساب
              </TableHead>
              <TableHead className="text-right min-w-[200px]">الشكوى</TableHead>
              <TableHead className="text-right min-w-[200px]">
                اجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((complaint: ComplaintProps) => (
              <TableRow key={complaint._id}>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.name}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.email}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.company}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.job}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.companyEmail}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.companyPhone}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.phone}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.whats}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  {complaint.message}
                </TableCell>
                <TableCell className="text-right min-w-[200px]">
                  <button
                    onClick={() => handleDeleteComplaint(complaint._id)}
                    className="m-4 rounded-full p-4 bg-main text-white"
                  >
                    <FaTrash />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-4xl">لا يوجد بيانات لعرضها</div>
      )}
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
