import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { createTransport } from "nodemailer";
import Mailgen from "mailgen";

type Data = { message: string };

const cors = Cors({
  origin: [
    "http://localhost:5173",
    "http://iaafalex.com",
    "https://iaafalex.com",
  ],
  methods: ["POST"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  if (req.method === "POST") {
    const { email, language } = req.body;
    try {
      let transporter = createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name:
            language === "ar"
              ? "جمعية المستثمرين بالمنطقة الحرة الاسكندرية "
              : "Investors Association of Alexandria",
          link: "https://iaafalex.com",
          copyright:
            language === "ar"
              ? "جمعية مستثمري الإسكندرية © 2023. جميع الحقوق محفوظة"
              : "Investors Association of Alexandria © 2023. All Rights Reserved",
        },
        textDirection: language === "ar" ? "rtl" : "ltr",
      });

      const ArabicIntro = [
        "شروط العضوية :",
        "يجب أن يتوافر في مقدم الطلب الشروط التالية :",
        "- يجب أن يكون ذو سمعة طيبة ولم يتعرض لأي عقوبات تمس الشرف .",
        "- يجب أن يكون في منصب إداري في الشركة أو المنظمة التي يعمل بها .",
        "- يجب أن يملئ استمارة طلب العضوية باللغة العربية والانجليزية  ويرفق صورة شخصية وصورة إثبات الشخصية باسبور أو بطاقة رقم قومي وختم جهة العمل علي  .",
        "- يتم ارسال رسالة ترحيب بالانضمام لسيادتكم بعد موافقة مجلس الادارة من له الحق في قبول أو رفض أي متقدم .",
        "- يتم بعدها سداد رسم القيد  الذي يدفع لمرة واحدة 1000.00 ( الف جنيها ) ورسم الاشتراك 2000.00 ( الفان جنيها) سنويا",
      ];

      const EnglishIntro = [
        "Membership conditions:",
        "The applicant must meet the following conditions:",
        "- Must have a good reputation and not have been subject to any dishonorable punishments.",
        "- Must hold an administrative position in the company or organization they work for.",
        "- Must fill out the membership application form in Arabic and English, and attach a personal photo and proof of identity (passport or national ID card), as well as have the company's stamp on the form.",
        "- A welcome message will be sent to you upon the approval or rejection by the board of directors, who have the right to accept or reject any applicant.",
        "- Afterward, the registration fee of 1000.00 EGP (one thousand Egyptian pounds) and the annual subscription fee of 2000.00 EGP (two thousand Egyptian pounds) should be paid.",
      ];

      let response = {
        body: {
          title:
            language === "ar"
              ? "نرحب بسيادتكم بالانضمام لعضوية جمعية المستثمرين بالمنطقة الحرة الاسكندرية"
              : "We welcome you to join the membership of the Alexandria Free Zone Investors Association",
          intro: language === "ar" ? ArabicIntro : EnglishIntro,
          action: {
            instructions:
              language === "ar"
                ? "للحصول علي الاستمارة ارسال طلب انضمام الاسم والموبايل علي ميل الجمعية للمتابعة:"
                : "To obtain the form, please send a membership request with your name and mobile number to the association's email for further follow-up:",
            button: {
              color: "#2947A9", // Optional action button color
              text: "iaafalex@iaafalex.com ",
              link: "mailto:iaafalex@iaafalex.com ",
            },
          },
          signature: language === "ar" ? "مع أطيب التمنيات" : "Best Wishes",
        },
      };

      let mail = MailGenerator.generate(response);

      let data = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject:
          language === "ar" ? "الانضمام للعضوية" : "Joining the membership",
        html: mail,
        // html: `<h1>Hello there</h1>
        // <p>This is a test message.</p>`,
      };
      transporter.sendMail(data, (err: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Message sent");
        }
      });
      res.status(200).json({ message: "Message Sent" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
