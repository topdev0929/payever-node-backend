export function headerTemplate(intro: string): string {
  return `
	<tr class="header" style="display: flex; width: 400px; padding: 30px 18px;">
		<td style="width: 100%;">
			<table class="text" style="border:0;width:100%;color:#000000;">
				<tr>
					<td class="title" style="font-size: 14px; padding-bottom: 8px;">payever GmbH</td>
				</tr>
				<tr>
					<td class="subtitle" style="font-size: 20px; font-weight: 600;">${intro}</td>
				</tr>
			</table>
		</td>
		<td class="header-picture" style="width: 40px; height: 40px; min-width: 40px; min-height: 40px; max-width: 40px; max-height: 40px; border-radius: 50%; background-color: #9a9a9a; color: #ffffff; font-size: 20px; font-weight: 400; font-stretch: normal; font-style: normal; line-height: 40px; text-align: center;">SG</td>
	</tr>
  `;
}
