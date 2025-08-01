import emailjs from "@emailjs/browser";

// EmailJS configuration
const SERVICE_ID = "service_c0zcx8p";
const NEW_REQUEST_TEMPLATE_ID = "template_hzz7mch";
const ENQUIRY_TEMPLATE_ID = "template_sd8u7lq";
const PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY"; // Get from environment variable or fallback

/*
 * TO CONFIGURE EMAILJS:
 * 1. Go to https://www.emailjs.com/ and create an account
 * 2. Create a service (Gmail, Outlook, etc.)
 * 3. Create email templates with the following template variables:
 *    For resource requests (template_hzz7mch): from_name, from_email, phone, resource_title, description, drive_link, to_name
 *    For contact forms (template_sd8u7lq): from_name, from_email, message, to_name
 * 4. Get your public key from the Account tab
 * 5. Replace "YOUR_EMAILJS_PUBLIC_KEY" above with your actual public key
 * 6. Update SERVICE_ID if needed (currently: service_c0zcx8p)
 * 7. Update template IDs if needed
 */

// Initialize EmailJS
let isEmailJSInitialized = false;
try {
  // Only initialize if we have a real public key
  if (PUBLIC_KEY && PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    emailjs.init(PUBLIC_KEY);
    isEmailJSInitialized = true;
    console.log("EmailJS initialized successfully");
  } else {
    console.warn(
      "EmailJS public key not configured. Please update PUBLIC_KEY in emailService.ts",
    );
  }
} catch (error) {
  console.warn("EmailJS initialization failed:", error);
}

export interface ResourceRequestData {
  name: string;
  phone: string;
  email: string;
  resourceTitle: string;
  description: string;
  driveLink?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ChatData {
  name: string;
  email: string;
  phone: string;
  message: string;
  urgent: boolean;
  helpType: string;
}

export const sendResourceRequest = async (
  data: ResourceRequestData,
): Promise<boolean> => {
  // Check if EmailJS is properly configured
  if (!isEmailJSInitialized) {
    console.error(
      "EmailJS is not initialized. Please configure the PUBLIC_KEY.",
    );
    // Don't show alert, let the form handle this gracefully
    return false;
  }

  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      resource_title: data.resourceTitle,
      description: data.description,
      drive_link: data.driveLink || "Not provided",
      to_name: "AdrosNotesHub Admin",
    };

    const result = await emailjs.send(
      SERVICE_ID,
      NEW_REQUEST_TEMPLATE_ID,
      templateParams,
    );

    return true;
  } catch (error) {
    console.error("Failed to send resource request:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid")) {
        console.error(
          "EmailJS configuration error - check service ID, template ID, or public key",
        );
      } else if (error.message.includes("Network")) {
        console.error("Network error - check internet connection");
      }
    }

    return false;
  }
};

export const sendContactMessage = async (
  data: ContactFormData,
): Promise<boolean> => {
  // Check if EmailJS is properly configured
  if (!isEmailJSInitialized) {
    console.error(
      "EmailJS is not initialized. Please configure the PUBLIC_KEY.",
    );
    // Don't show alert, let the form handle this gracefully
    return false;
  }

  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      message: data.message,
      to_name: "AdrosNotesHub Admin",
    };

    const result = await emailjs.send(
      SERVICE_ID,
      ENQUIRY_TEMPLATE_ID,
      templateParams,
    );

    return true;
  } catch (error) {
    console.error("Failed to send contact message:", error);
    return false;
  }
};

export const sendChatMessage = async (data: ChatData): Promise<boolean> => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      message: data.message,
      urgent: data.urgent ? "Yes" : "No",
      help_type: data.helpType,
      to_name: "AdrosNotesHub Admin",
    };

    await emailjs.send(SERVICE_ID, ENQUIRY_TEMPLATE_ID, templateParams);
    return true;
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return false;
  }
};
