import logger from "../logger";

interface quoteInfo {
  quote_key: string;
  name: string;
}

export const generateQuoteEmail = ({name, quote_key}: quoteInfo) => {
  logger.info(`Generating quote email with details: quote_key=${quote_key}, name=${name}`);

  return `
  <div style="width: 90% !important;">
    <p>Hi ${name},</p>
    <p>Thank you for your interest in our product(s).</p>
    <p>You can access your most recent quote(s) from the below link that will expire in a 1 month or earlier depending on the commencement date.</p>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <a href="${process.env.DOMAIN_WEBSITE}/quote?key=${quote_key}"
          style="color: #004FFF; text-decoration: underline;">
          ${process.env.DOMAIN_WEBSITE}/quote?key=${quote_key}
        </a>
      </tr>
    </table>
    <p>For any clarification or assistance, please feel free to contact us at
      <a href="tel:+65 6206 5588"> +65 6206 5588 </a>or email
      <a href="mailto:customerservice@ecics.com.sg" style="color: #004FFF; text-decoration: underline;">customerservice@ecics.com.sg</a>
      We are available from Monday to Friday, 8:30 AM to 6:00 PM and closed on Saturday and Sunday.
    </p>
    <p>Warmest Regards,</p>
    <div>
      <a href="https://ecics.com/"><img style="width: 122px" src=${process.env.LOGO_EMAIL_URL} alt="" ></a>
    </div>
    <p><b>Hotline: </b>(65) 6206 5588</p>
    <p><b>Email: </b><a href="mailto:customerservice@ecics.com.sg" style="color: #004FFF; text-decoration: underline;">customerservice@ecics.com.sg</a></p>
    <p><b>Web: </b><a href="https://www.ecics.com/" style="color: #004FFF; text-decoration: underline;">https://www.ecics.com/</a></p>
    <p><b>Address: </b>10 Eunos Road 8, Singapore Post Centre, #09-04A, Singapore 408600.</p>
  </div>`
};
