// Imports
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface ValuesProps {
  username: string;
  password: string;
}

const initialValues: ValuesProps = {
  username: "",
  password: "",
};

export default function AddUser({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // validation schema using yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("اسم المستخدم مطلوب")
      .min(4, "4 أحرف على الأقل"),
    password: Yup.string()
      .required("كلمة المرور مطلوبة")
      .min(8, "8 أحرف على الأقل"),
  });

  const onSubmit = async (values: ValuesProps) => {
    setLoading(true);
    try {
      const status = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await status.json();

      if (status?.ok) {
        router.push("/admin");
        toast.success("تم اضافة المستخدم بنجاح");
      } else {
        toast.error("اسم المستخدم موجود بالفعل");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#E2E3E3] min-h-[calc(100vh-82px)] max-md:pt-16 max-md:pb-10 pt-28 pb-14 flex flex-col items-center">
      <h1 className="text-3xl font-black max-md:text-base mb-14 max-md:mb-6">
        اضافة مستخدم
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="w-[430px] max-md:w-[206px]">
          <div className="flex flex-col my-2">
            <Field
              type="text"
              name="username"
              placeholder="اسم المستخدم"
              className="outline-none max-md:h-[16px] max-md:p-1 max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
            />
            <ErrorMessage
              name="username"
              render={(msg) => (
                <p className="text-red-700 text-xs max-md:text-[6px]/3">
                  {msg}
                </p>
              )}
            />
          </div>
          <div className="flex flex-col my-2">
            <Field
              type="password"
              name="password"
              placeholder="كلمة المرور"
              className="outline-none max-md:h-[16px] max-md:p-1 max-md:text-[8px] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5 placeholder:text-[#A3AAC2]"
            />
            <ErrorMessage
              name="password"
              render={(msg) => (
                <p className="text-red-700 text-xs max-md:text-[6px]/3">
                  {msg}
                </p>
              )}
            />
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

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
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
