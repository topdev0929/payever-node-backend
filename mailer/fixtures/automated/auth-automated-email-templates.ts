/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from '.';

const TEMPLATE_TYPE: string = 'system';

export const authAutomatedEmailTemplates: any[] = [
  {
    _id: '3f0ffc8a-d1b7-40e1-b7e7-4e149d48a9cf',
    body:
      headerTemplate(`Hi {{first_name|default('')}}, Welcome to payever.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Get started with payever and sell more.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please confirm your registration by clicking the button below and get started to sell via payever.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{verificationLink}}">Finish up your registration</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Welcome to payever - just one more step!',
    template_name: 'registerConfirmation',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'e68679ff-4b5e-4979-98f2-5e2480ce37e0',
    body:
      headerTemplate(`Hi {{first_name}}. Congratulation, your account is ready to use.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Congratulation your payever account is complete.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Congratulation your payever account is complete and ready to use. Lets manage your account.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{url}}">Manage your account</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Welcome to payever - account ready to use!',
    template_name: 'registerConfirmationSuccess',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'c9ff30db-f01b-4037-88d2-0be315a94484',
    body:
      headerTemplate(`Hi, please change your password.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Change your password.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              You are receiving this because you have registered in Payever.<br/><br/>    Please click on the following button to complete the process (link is valid for 24 hours)<br/><br/>    If you did not request this, please ignore this email.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{password_set_url}}">Set password</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'payever account password set',
    template_name: 'passwordSet',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '46d50b68-5bd5-4d4a-9824-3a45073d589f',
    body:
      headerTemplate(`Hi, you have request for reset password.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Reset password.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              You are receiving this because you (or someone else) have requested the reset of the password for your account.<br/><br/>    Please click on the following button to complete the process:<br/><br/>If you did not request this, please ignore this email and your password will remain unchanged.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{password_reset_url}}">Set password</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Reset Password',
    template_name: 'passwordReset',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '84fab216-5cc0-4c2d-82d4-4a949d85881d',
    body:
      headerTemplate(`Hi {{first_name}}, we detect suspicious login attempt to your account.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Suspicious login attempt.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Our system detect that you have suspicious login attempt. For security reason we disable your account for {{duration}}.
              <br/>
              You will be available to access your account after {{blockedToDate}}.
              </p>
          </td>
          </tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Suspicious activity',
    template_name: 'suspiciousActivityBan',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '49b26265-d5d5-4099-b565-b51bf5ebad78',
    body:
      headerTemplate(`Hi{{first_name}}, we are missing you`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We are missing you, please come back.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We have not seen yoou for a week. We are missing you and your shop is waiting for you. Please come back.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{url}}">Login</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Last Seen One Week',
    template_name: 'lastSeenOneWeek',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '8c1e27e7-1a54-4dd6-a27c-158c480e000e',
    body:
      headerTemplate(`Hi{{first_name}}, we are missing you`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We are missing you, please come back.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We have not seen yoou for a month. We are missing you and your shop is waiting for you. Please come back.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{url}}">Login</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Last Seen One Month',
    template_name: 'lastSeenOneMonth',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '5f18778d-0450-493c-b659-80bac0af530c',
    body:
      headerTemplate(`Hi{{first_name}}, we are missing you`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We are missing you, please come back.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We have not seen yoou for three month. We are missing you and your shop is waiting for you. Please come back.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{url}}">Login</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Last Seen three Month',
    template_name: 'lastSeenThreeMonth',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '43b13b00-4ede-4fc6-9784-43a1bcc0aefd',
    body:
      headerTemplate(`Hi {{ user.first_name|default('') }}, we have seen you login from new device`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              New device login detected.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Your email address {{ user.email }} was just used to log into Payever from a new browser and/or device.<br/><br/>New login from {{ login_location.browser }} on {{ login_location.os }}. Ip: {{ login_location.ip }}. Date: {{ login_location.date }}.<br/><br/>If you don't recognize this activity, we recommend changing your password as soon as possible. Otherwise, you can disregard this message.
              </p>
          </td>
          </tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'New login from {{ login_location.browser }} on {{ login_location.os }}',
    template_name: 'login_new_location',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '1dcad22b-3158-4b79-85bc-48184fa1ece0',
    body:
      headerTemplate(`Hi, you have invitation to join payever`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Join payever and find greatness.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              The business {{ business.name }} invites you to join their company account.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{staff_invitation.link}}">Join {{ business.name }}</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'Staff invitation',
    subject: 'You’ve been invited to payever',
    template_name: 'staff_invitation_new',
    template_type: 'business',
    use_layout: true,
  },
  {
    _id: '2344dc2c-3e50-4fc0-ae40-87163c7f06e4',
    body:
      headerTemplate(`Guten Tag, sie haben die Einladung, sich payever anzuschließen`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Mach mit bei payever.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              das Unternehmen {{ business.name }} möchte Ihnen Zugang zum Firmen-Account geben. Um die Einladung anzunehmen, klicken Sie bitte auf folgenden Link und vergeben Sie anschließend ein eigenes Passwort, mit dem Sie sich später jederzeit wieder anmelden können.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{staff_invitation.link}}">Treten Sie {{business.name}} bei</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    locale: 'de',
    section: 'Staff invitation',
    subject: 'You’ve been invited to payever',
    template_name: 'staff_invitation_new',
    template_type: 'business',
    use_layout: true,
  },
  {
    _id: '061c1612-0ca2-4020-8af7-339c7b4887db',
    body:
      headerTemplate(`Hi 
      {% if user.firstName is defined %}{{user.firstName}}{% endif %}
      {% if user.lastName is defined %}{{user.lastName}}{% endif %},
      there was a sign in attempt.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever auth</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              There was a sign in attempt to your payever account.
              </h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              We noticed that there was an sign in attempt to your payever account. If you were prompted for a verification code, please enter the following to complete your sign in.
              <br/><br/>
              <strong>{{code}}</strong>
              <br/><br/>
              This code will expire in 10 minutes.
              <br/><br/>
              If you did not try to sign in to your account, please change your password immediately by visiting the account settings on payever.
              <br/><br/>
              If you have additional questions about account security, please visit https://support.payever.org
              <br/><br/>
              Thanks for visiting payever!
              </p>
          </td>
          </tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Payever ID verification',
    template_name: 'second-factor',
    template_type: 'system',
    use_layout: true,
  },
];
