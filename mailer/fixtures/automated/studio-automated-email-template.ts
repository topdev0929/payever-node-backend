/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from '.';

const TEMPLATE_TYPE: string = 'system';

export const studioAutomatedEmailTemplate: any[] = [
  {
    _id: 'eaf81e29-c378-4185-ac4d-9d2b301e2341',
    body:
      headerTemplate(`Hi {{first_name|default('')}}, Your video has been generated.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever studio</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Your video has been successfully generated.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please check your studio page for your generated video.
              </p>
          </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{studioUrl}}">Manage your studio</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Your video has been generated.',
    template_name: 'generated_video_finished_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '15974a3b-4539-4d84-b8b1-ca31f9e9bfe3',
    body:
      headerTemplate(`Hi {{first_name|default('')}}, Your medias has been uploaded.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever studio</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Your medias has been uploaded.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please check your studio page for your uploaded medias.
              </p>
          </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
            <p>Your medias:</p>
            <ul>
            {% for media in medias %}
              <li>{{ media.name }}.{{ media.type }}</li>
            {% endfor %}
            </ul>
            </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{studioUrl}}">Manage your studio</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Your medias has been successful uploaded.',
    template_name: 'studio_user_medias_uploaded_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'ee481ca2-c774-491d-8cd2-2d9a933c6778',
    body:
      headerTemplate(`Hi {{first_name|default('')}}, unfortunately your medias has failed to upload.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever studio</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Unfortunately, Your medias has failed to be uploaded.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please check your studio page to upload your medias.
              </p>
          </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
            <p>You need to reupload your medias:</p>
            <ul>
            {% for media in medias %}
              <li>{{ media }}</li>
            {% endfor %}
            </ul>
            </td>
          </tr>
					<tr>
					<td>
							<a class="button-black-rounded"
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{studioUrl}}">Manage your studio</a>
					</td>
					</tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Your medias has been failed to be uploaded.',
    template_name: 'studio_user_medias_uploaded_error_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '881fc7bb-57ee-47b3-8f01-1d177be3548a',
    body:
      headerTemplate(`Hi {{first_name|default('')}}, Subscription medias has been uploaded.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever studio</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Subscription medias has been uploaded.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please check studio page for uploaded subscription medias.
              </p>
          </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
            <p>Your medias:</p>
            <ul>
            {% for media in medias %}
              <li>{{ media.name }}.{{ media.type }}</li>
            {% endfor %}
            </ul>
            </td>
          </tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Subscription medias has been successful uploaded.',
    template_name: 'studio_subscription_medias_uploaded_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '4257224e-bacf-49bb-8153-4911c39f02d4',
    body:
      headerTemplate(`Hi {{first_name|default('')}}, subscription medias has failed to upload.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever studio</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Unfortunately, subscription medias has failed to be uploaded.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please check your studio page to upload subscription medias.
              </p>
          </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
            <p>You need to reupload subscription medias:</p>
            <ul>
            {% for media in medias %}
              <li>{{ media }}</li>
            {% endfor %}
            </ul>
            </td>
          </tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Subscription medias has been failed to be uploaded.',
    template_name: 'subscription_medias_uploaded_error_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },

];
