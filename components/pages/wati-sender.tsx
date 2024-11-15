"use client";

const WATI_API_URL = "https://live-mt-server.wati.io/320742";
const WATI_API_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MWE5NTVhZS02YmM4LTRjMGQtYTljZS00OTU3MzIxZTI0ZGEiLCJ1bmlxdWVfbmFtZSI6Im15bWVkaXJlY29yZHNAZ21haWwuY29tIiwibmFtZWlkIjoibXltZWRpcmVjb3Jkc0BnbWFpbC5jb20iLCJlbWFpbCI6Im15bWVkaXJlY29yZHNAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDYvMjkvMjAyNCAxMDoxMToyMiIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJ0ZW5hbnRfaWQiOiIzMjA3NDIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.Nw-6g96C67FmE0qw0Up6f2Bl4W-x_WsEusImImV_7IU";

interface SendFileResponse {
  result: boolean;
  messageId: string;
}

async function sendFile(
  phoneNumber: string,
  fileBlob: Blob,
  fileName: string,
  caption: string = ""
): Promise<SendFileResponse> {
  console.log(`Attempting to send file to ${phoneNumber}: ${fileName}`);
  const url = `${WATI_API_URL}/api/v1/sendSessionFile/${phoneNumber}`;

  try {
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("caption", caption);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: WATI_API_TOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send file: ${response.status}, ${errorText}`);
      throw new Error(`Failed to send file: ${response.status}, ${errorText}`);
    }

    console.log(`File sent successfully to ${phoneNumber}`);
    return (await response.json()) as SendFileResponse;
  } catch (error) {
    console.error(`Error in sendFile: ${error}`);
    throw error;
  }
}

export async function sendPrescriptionToWhatsApp(
  phoneNumber: string,
  pdfBlob: Blob
): Promise<void> {
  try {
    const result = await sendFile(
      phoneNumber,
      pdfBlob,
      "prescription.pdf",
      "Your Prescription"
    );
    console.log("WhatsApp send result:", result);
  } catch (error) {
    console.error("Error sending to WhatsApp:", error);
    throw error;
  }
}
