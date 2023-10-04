import nodemailer from "nodemailer";
export const emailCon = nodemailer.createTransport({
  // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
  service: "gmail",
  // host를 gmail로 설정
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // Gmail 주소 입력, 'testmail@gmail.com'
    user: process.env.GMAIL_ID,
    // Gmail 패스워드 입력
    pass: process.env.GMAIL_PW,
  },
});
