import { capitalizeFirstLetter } from '../../utils/text.helpers';
import logger from '../logger';

interface quoteInfo {
  quote_key: string;
  product_name: string;
}

export const generateQuoteEmail = ({ quote_key, product_name }: quoteInfo) => {
  logger.info(`Generating quote email with details: quote_key=${quote_key}`);

  return `
  <div style="width: 90% !important;">
    <p>Thank you for your interest in our product(s).</p>
    <p>You can access your most recent progress from the below link that will expire in a 1 month or earlier depending on the commencement date.</p>
    <p>${capitalizeFirstLetter(product_name)} Insurance</p>
    <p> 
      <a href="${process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}/continue-quote/${product_name}?key=${quote_key}"
          style="color: #004FFF; text-decoration: underline;">
          ${process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}/continue-quote/${product_name}?key=${quote_key}
        </a>
      </p>

    <p>For any clarification or assistance, please feel free to contact us at
      <a href="tel:+65 6206 5588"> +65 6206 5588 </a>or email
      <a href="mailto:customerservice@ecics.com.sg" style="color: #004FFF; text-decoration: underline;">customerservice@ecics.com.sg</a>
      We are available from Monday to Friday, 8:30 AM to 6:00 PM and closed on Saturday and Sunday.
    </p>
    <p>Warmest Regards,</p>
    <div>
      <a href="https://ecics.com/"><img style="width: 122px" src=${process.env.LOGO_EMAIL_URL} alt="" ></a>
    </div>
    <p><b>Hotline: </b><a href="tel:+65 6206 5588">(65) 6206 5588 </a></p>
    <p><b>Email: </b><a href="mailto:customerservice@ecics.com.sg" style="color: #004FFF; text-decoration: underline;">customerservice@ecics.com.sg</a></p>
    <p><b>Web: </b><a href="https://www.ecics.com/" style="color: #004FFF; text-decoration: underline;">https://www.ecics.com/</a></p>
    <p><b>Address: </b>10 Eunos Road 8, Singapore Post Centre, #09-04A, Singapore 408600.</p>
  </div>`;
};

export const quoteReminderHTML = (
  quoteKey: string,
  quoteNo: string,
  productType: string,
  name: string,
) => {
  return `
  <div style="width: 90% !important;">
    <p>Hi ${name},</p>
    <p>Thank you for your interest in our product(s).</p>
    <p>You can access your most recent quote(s) from the below link that will expire in a 1 month or earlier depending on the commencement date.</p>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td
          style="border: 1px solid #cccc; text-align: left; padding: 1px 8px; text-align: center;">
          ${capitalizeFirstLetter(productType)} Insurance
        </td>
        <td
          style="border: 1px solid #cccc; text-align: left; padding: 1px 8px;">
          <p><b>${quoteNo}</b></p>
        </td>
        <td style="border: 1px solid #cccc; text-align: left; padding: 1px 8px;">
          <a href="${process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}/continue-quote/${productType}?key=${quoteKey}"
            style="color: #004FFF; text-decoration: underline;">
            ${process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}/continue-quote/${productType}?key=${quoteKey}
          </a>
        </td>
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
  </div>`;
};

export const teslaFractionalEmail = (email: string, name: string) => {
  return `
    <div style="font-size: 13px; font-family: Aptos; color: #000000">
    <p style="margin-bottom: 8pt">
      <span> Dear ${name}, </span>
    </p>
    <p style="margin-bottom: 8pt">
      <span>
        Thank you for choosing ECICS as your preferred motor insurer.
      </span>
    </p>
    <p style=" margin-bottom: 8pt">
      <span>
        We are pleased to offer you complimentary Tesla Fractional Shares in collaboration with Phillip Securities Pte Ltd.
      </span>
    </p>
    <div style="margin-left: 0pt" align="left">
      <table style="border: none; border-collapse: collapse; font-size: 13px;">
        <tbody>
          <tr style="height: 0pt">
            <td
              style="
                vertical-align: top;
                padding: 0pt 5.4pt 0pt 5.4pt;
                overflow: hidden;
                overflow-wrap: break-word;
                border: solid #000000 0.5pt;
              "
            >
              <p >
                <span style="font-weight: bold"> How to Redeem? </span>
              </p>
            </td>
          </tr>
          <tr style="height: 0pt">
            <td
              style="
                vertical-align: top;
                padding: 0pt 5.4pt 0pt 5.4pt;
                overflow: hidden;
                overflow-wrap: break-word;
                border: solid #000000 0.5pt;
              "
            >
              <br />
              <p>
                <span style="font-weight: bold">
                  1. Shares redemption from POEMS
                </span>
              </p>
              <ul style="padding-inline-start: 48px">
                <li style="margin-left: 20px" >
                  <p style=" margin-bottom: 8pt">
                    <span>
                      Click on the respective URL link provided below and following the instructions to claim your Tesla Fractional Shares.
                    </span>
                  </p>
                </li>
                 <li style="margin-left: 20px" >
                  <p style=" margin-bottom: 8pt">
                    <span>
                      Redemption must be made <b>within one month</b> of your Tesla Motor Insurance policy activation date. Any redemptions made after this period will be deemed invalid.
                    </span>
                  </p>
                </li>
              </ul>
              <p >
                <span style="font-weight: bold">
                  2. Open a Trading Account with POEMS
                </span>
              </p>
              <ul style="padding-inline-start: 48px">
                <li style="margin-left: 20px" >
                  <p >
                   The Policyholder must have a POEMS account with name and NRIC details matching his/her
                   ECICS Tesla Motor Insurance policy to be eligible for the Campaign and to receive Tesla shares.
                  </p>
                </li>
                <li style="margin-left: 20px" >
                  <p>
                    <strong>Existing</strong> clients of Phillip Securities with a POEMS account will receive up to <strong>S$50</strong>
                    worth of Tesla Fractional Shares. Click here and provide your respective details >
                    <a style="color: #467886;" href="https://www.poems.com.sg/redeem-free-tesla-shares/">I have a POEMS Account<sup style="font-size: 10px;">1</sup></a>
                    .Expect a Phillip Securities employee to get in touch with you.
                  </p>
                </li>
                <li style="margin-left: 20px" >
                  <p style=" margin-bottom: 8pt">
                    <strong>New</strong> clients of Phillip Securities are eligible for an <strong>additional SGD50</strong> worth of Tesla Fractional Shares.
                    Phillip Securities terms and conditions apply. Please click the link to open a POEMS account >
                    <a style="color: #467886;" href="https://www.poems.com.sg/redeem-free-tesla-shares/">Open a POEMS Account<sup style="font-size: 10px;">1</sup></a>
                  </p>
                </li>
              </ul>
              <p >
                <span style="font-weight: bold">
                  3. Wait for the shares to be credited into your Account
                </span>
              </p>
              <ul style="padding-inline-start: 48px">
                <li style="margin-left: 20px" >
                  <p style=" margin-bottom: 8pt">
                    The processing and crediting of Tesla Fractional Shares shall occur within 3 to 4 months following the policy activation date of your Tesla Motor Insurance policy.
                  </p>
                </li>
                <li style="margin-left: 20px" >
                  <p style=" margin-bottom: 8pt">
                    The Policyholder is required to maintain a minimum of 3 continuous months of effective coverage to be eligible.
                  </p>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <small>1. By clicking the links, you consent to PDPA (Terms & Conditions) and will be directed to POEMS.</small>

    <p style=" margin-bottom: 8pt">
      Please click
      <a
        style="color: #467886;"
        href="https://ecics-trs-s3.s3.ap-southeast-1.amazonaws.com/PSPL+Fractional+Shares+Campaign+T%26C+(FSPROMO).pdf"
      > here</a>
      for the full Terms and Conditions of the campaign.
    </p>
    <p>
      For POEMS account inquiries, contact Phillip Securities’ Customer Experience Unit at 6531 1555 or
      <a style="color: #467886;" href="mailto:talktophilip@philip.com.sg">talktophilip@philip.com.sg</a>.
       For campaign-related matters, reach us at 6206 5588 or
      <a style="color: #467886;" href="mailto:customerservice@ecics.com.sg">customerservice@ecics.com.sg</a>
    </p>
    <p>
      Thank you for choosing ECICS. We are committed to ensuring your peace of mind on the road.
    </p>

    <div style="margin-top: 20px;">
      <p >
        <span> Yours Sincerely </span>
      </p>
      <p >
        <span> ECICS Limited </span>
      </p>
      <p >
        <span> 10 Eunos Road 8, </span>
      </p>
      <p >
        <span> Singapore Post Centre, #09-04A </span>
      </p>
      <p >
        <span> Singapore 408600 </span>
      </p>
    </div>
    </div>`;
};
