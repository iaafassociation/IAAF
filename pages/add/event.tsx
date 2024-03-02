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
import { DatePicker } from "@/components/DatePicker";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface ValuesProps {
  titleAR: string;
  titleEN: string;
  descriptionAR: string;
  descriptionEN: string;
  date: Date | undefined;
}

const initialValues: ValuesProps = {
  titleAR: "",
  titleEN: "",
  descriptionAR: "",
  descriptionEN: "",
  date: undefined,
};

export default function AddEvent({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [url, setUrl] = useState<string | ArrayBuffer>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // validation schema using yup
  const validationSchema = Yup.object({
    titleAR: Yup.string().required("العنوان مطلوب"),
    titleEN: Yup.string().required("العنوان مطلوب"),
    descriptionAR: Yup.string().required("الوصف مطلوب"),
    descriptionEN: Yup.string().required("الوصف مطلوب"),
    date: Yup.string().required("التاريخ مطلوب"),
  });

  const onSubmit = async (values: ValuesProps) => {
    setLoading(true);
    try {
      const link = image ? await uploadCloudinary(image) : null;

      const res = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          // date: new Date(String(values.date)).getTime(),
          image: link,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم اضافة الخبر بنجاح");
        mutate("/api/event");
        router.push("/news");
      } else {
        toast.error("حدث خطأ ما");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImage(e.target.files[0]);
      setUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <section className="bg-[#E2E3E3] min-h-[calc(100vh-82px)] max-md:pt-16 max-md:pb-10 pt-28 pb-14 flex flex-col items-center">
      <h1 className="text-3xl font-black max-md:text-base mb-14 max-md:mb-6">
        اضافة خبر
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
                name="titleAR"
                placeholder="عنوان الحدث عربي"
                className="outline-none max-md:h-[16px] max-md:p-1 w-[205px] max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="titleAR"
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
                name="titleEN"
                placeholder="عنوان الحدث انجليزي"
                className="outline-none max-md:h-[16px] w-[205px] max-md:p-1  max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="titleEN"
                render={(msg) => (
                  <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                    {msg}
                  </p>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col my-2">
            <Field
              type="text"
              as="textarea"
              name="descriptionAR"
              placeholder="الوصف عربي"
              className="outline-none w-full h-[100px] max-md:p-1  max-md:h-[60px] max-md:text-[8px] resize-none text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
            />
            <ErrorMessage
              name="descriptionAR"
              render={(msg) => (
                <p className="text-red-700 text-xs max-md:text-[6px]/3">
                  {msg}
                </p>
              )}
            />
          </div>
          <div className="flex flex-col my-2">
            <Field
              type="text"
              as="textarea"
              name="descriptionEN"
              placeholder="الوصف انجليزي"
              className="outline-none w-full h-[100px] max-md:p-1  max-md:h-[60px] max-md:text-[8px] resize-none text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
            />
            <ErrorMessage
              name="descriptionEN"
              render={(msg) => (
                <p className="text-red-700 text-xs max-md:text-[6px]/3">
                  {msg}
                </p>
              )}
            />
          </div>
          <div className="flex flex-col my-2">
            <Field type="text" name="date">
              {({ field, form, meta }: FieldProps) => (
                <DatePicker field={field} form={form} meta={meta} />
              )}
            </Field>
            <ErrorMessage
              name="date"
              render={(msg) => (
                <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                  {msg}
                </p>
              )}
            />
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

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
