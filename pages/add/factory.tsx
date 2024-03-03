// Imports
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { useState } from "react";
import * as Yup from "yup";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";

// Module Imports
import { uploadCloudinary } from "@/lib/utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface ValuesProps {
  nameAR: string;
  nameEN: string;
  descriptionAR: string;
  descriptionEN: string;
  typeAR: string;
  typeEN: string;
  phone: string;
  email: string;
}

const initialValues: ValuesProps = {
  nameAR: "",
  nameEN: "",
  descriptionAR: "",
  descriptionEN: "",
  typeAR: "",
  typeEN: "",
  email: "",
  phone: "",
};

export default function AddFactory() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [urls, setUrls] = useState<(string | ArrayBuffer)[]>([]);
  const [images, setImages] = useState<(File | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);

  // validation schema using yup
  const validationSchema = Yup.object({
    nameAR: Yup.string().required("الاسم مطلوب"),
    nameEN: Yup.string().required("الاسم مطلوب"),
    descriptionAR: Yup.string().required("الوصف مطلوب"),
    descriptionEN: Yup.string().required("الوصف مطلوب"),
    typeAR: Yup.string().required("النوع مطلوب"),
    typeEN: Yup.string().required("النوع مطلوب"),
    email: Yup.string()
      // .email("ادخل ايميل صحيح")
      .required("الايميل مطلوب"),
    phone: Yup.string().required("الهاتف مطلوب"),
  });

  const onSubmit = async (values: ValuesProps) => {
    // if (images.length > 0) {
    setLoading(true);
    try {
      let arr = [];

      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i] as File);
        arr.push(data);
      }

      const res = await fetch("/api/factory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          images: arr,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم اضافة المشروع بنجاح");
        mutate("/api/factory");
        router.push("/");
      } else {
        toast.error("حدث خطأ ما");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // } else {
    //   setError("ادخل صورة واحدة على الاقل");
    // }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selected = e.target.files ? e.target.files[0] : null;
      setError(null);

      setImages((prevValue) => [...prevValue, selected]);
      setUrls((prevValue) => [
        ...prevValue,
        URL.createObjectURL(selected as Blob),
      ]);
    }
  };

  const handleDeleteImage = (i: number) => {
    console.log(i);
    let tempUrls = urls;
    tempUrls.splice(i, 1);
    console.log(tempUrls);
    setUrls(tempUrls);

    let tempImages = images;
    tempImages.splice(i, 1);
    console.log(tempImages);
    setImages(tempImages);

    setKey(key + 1);
  };

  return (
    <section className="bg-[#E2E3E3] min-h-[calc(100vh-82px)] max-md:pt-16 max-md:pb-10 pt-28 pb-14 flex flex-col items-center">
      <h1 className="text-3xl font-black max-md:text-base mb-14 max-md:mb-6">
        اضافة مشروع
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
                placeholder="اسم المشروع عربي"
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
                placeholder="اسم المشروع انجليزي"
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
          <div className="flex flex-col my-2">
            <Field
              type="text"
              as="textarea"
              name="descriptionAR"
              placeholder="الوصف بالعربي"
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
              placeholder="الوصف بالانجليزي"
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
          <div className="flex justify-between my-2">
            <div>
              <Field
                type="text"
                name="typeAR"
                placeholder="النوع بالعربي"
                className="outline-none max-md:h-[16px] max-md:p-1 w-[205px] max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="typeAR"
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
                name="typeEN"
                placeholder="النوع بالانجليزي"
                className="outline-none max-md:h-[16px] w-[205px] max-md:p-1  max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="typeEN"
                render={(msg) => (
                  <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                    {msg}
                  </p>
                )}
              />
            </div>
          </div>
          <div className="flex justify-between my-2">
            <div>
              <Field
                type="text"
                name="email"
                placeholder="الايميل"
                className="outline-none max-md:h-[16px] max-md:p-1 w-[205px] max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="email"
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
                name="phone"
                placeholder="الهاتف"
                className="outline-none max-md:h-[16px] w-[205px] max-md:p-1  max-md:w-[100px] max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
              />
              <ErrorMessage
                name="phone"
                render={(msg) => (
                  <p className="text-red-700 w-1/2 text-xs max-md:text-[6px]/3">
                    {msg}
                  </p>
                )}
              />
            </div>
          </div>
          {images.length ? (
            <div className="flex justify-between flex-wrap">
              {urls.map((url, i) => (
                <div key={String(url)} className="max-w-[205px] relative my-2">
                  <Image
                    src={String(url)}
                    alt="image"
                    width={10}
                    height={10}
                    className="w-full"
                  />
                  <div
                    onClick={() => handleDeleteImage(i)}
                    className="absolute cursor-pointer top-5 right-5 py-2 px-2 rounded-full bg-white"
                  >
                    <FaTrash color="red" />
                  </div>
                </div>
              ))}
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
