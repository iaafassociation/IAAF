// Imports
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import Image from "next/image";
import { useState } from "react";
import * as Yup from "yup";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";

// Module Imports
import { uploadCloudinary } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface ValuesProps {
  nameAR: string;
  nameEN: string;
  role: string;
}

const initialValues: ValuesProps = {
  nameAR: "",
  nameEN: "",
  role: "",
};

export default function AddMember() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [url, setUrl] = useState<string | ArrayBuffer>("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // validation schema using yup
  const validationSchema = Yup.object({
    nameAR: Yup.string().required("الاسم مطلوب"),
    nameEN: Yup.string().required("الاسم مطلوب"),
    role: Yup.string().required("النوع مطلوب"),
  });

  const onSubmit = async (values: ValuesProps) => {
    console.log(values);

    if (image) {
      setLoading(true);
      try {
        const link = await uploadCloudinary(image);

        const res = await fetch("/api/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            image: link,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("تم اضافة العضو بنجاح");
          mutate("/api/members");
          router.push("/members");
        } else {
          toast.error("حدث خطأ ما");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("من فضلك ادخل صورة");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setError(null);
      setImage(e.target.files[0]);
      setUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // const handleDeleteImage = () => {
  //   setUrl("");
  //   setImage(null);
  // };

  return (
    <section className="bg-[#E2E3E3] min-h-[calc(100vh-82px)] max-md:pt-16 max-md:pb-10 pt-28 pb-14 flex flex-col items-center">
      <h1 className="text-3xl font-black max-md:text-base mb-14 max-md:mb-6">
        اضافة عضو
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="w-[430px] max-md:w-[206px]">
          <div className="flex justify-between my-2">
            <div>
              <Field
                type="text"
                name="nameAR"
                placeholder="اسم العضو عربي"
                className="outline-none max-md:h-[16px] max-md:p-1 w-[205px] max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="nameAR"
                render={(msg) => (
                  <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                    {msg}
                  </p>
                )}
              />
            </div>
            <div>
              <Field
                type="text"
                name="nameEN"
                placeholder="اسم العضو انجليزي"
                className="outline-none max-md:h-[16px] w-[205px] max-md:p-1  max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="nameEN"
                render={(msg) => (
                  <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                    {msg}
                  </p>
                )}
              />
            </div>
          </div>
          <div className="flex justify-between my-2">
            <div className="flex w-full flex-col justify-start">
              <Field type="text" name="role">
                {({ field, form }: FieldProps) => (
                  <Select
                    defaultValue={field.value}
                    onValueChange={(st) => {
                      form.values.role = st;
                      form.validateForm();
                    }}
                  >
                    <SelectTrigger
                      dir="rtl"
                      onBlur={field.onBlur}
                      className="outline-none max-md:h-[16px] max-md:p-1  focus:shadow-none w-full max-md:w-[100px] max-md:text-[6px]/3 text-[#A3AAC2] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5"
                    >
                      <SelectValue placeholder="اختر نوع العضوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="member">
                        عضو مجلس الادارة
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="chairman">
                        رئيس مجلس الادارة
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="vice">
                        نائب رئيس مجلس الادارة
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="secretary">
                        الأمين العام
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="treasurer">
                        أمين الصندوق
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </Field>
              <ErrorMessage
                name="role"
                render={(msg) => (
                  <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                    {msg}
                  </p>
                )}
              />
            </div>
          </div>
          {image ? (
            <div className="flex justify-between flex-wrap">
              <div key={String(url)} className="w-full relative my-2">
                <Image
                  src={String(url)}
                  alt="image"
                  width={10}
                  height={10}
                  className="w-full"
                />
                {/* <div
                  onClick={handleDeleteImage}
                  className="absolute cursor-pointer top-5 right-5 py-2 px-2 rounded-full bg-white"
                >
                  <FaTrash color="red" />
                </div> */}
              </div>
            </div>
          ) : null}
          <div className="flex justify-between my-2">
            <label className="w-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                  <p className="font-bold text-2xl cursor-pointer">
                    <AiOutlineCloudUpload />
                  </p>
                  <p className="text-lg cursor-pointer">ارفع صورة</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="w-0 h-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </label>
          </div>
          {error && (
            <p className="text-red-700 text-center text-xs max-md:text-[6px]/3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading && "opacity-60"
            } mt-6 max-md:mt-3 w-[200px] max-md:w-[70px] py-3 max-md:py-1 text-sm max-md:text-xs font-semibold text-white bg-sec m-auto rounded-sm block`}
          >
            {loading ? "جاري الاضافة" : "اضافة"}
          </button>
        </Form>
      </Formik>
    </section>
  );
}

// export const getServerSideProps = (async ({ req, res }) => {
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/sign-in",
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} };
// }) satisfies GetServerSideProps;
