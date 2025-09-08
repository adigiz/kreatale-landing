import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Validate locale and provide fallback
  const validLocale = locale && ["en", "id"].includes(locale) ? locale : "en";

  try {
    const messages = (await import(`../messages/${validLocale}.json`)).default;
    return {
      messages,
      locale: validLocale,
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${validLocale}:`, error);
    // Fallback to empty messages
    return {
      messages: {},
      locale: validLocale,
    };
  }
});
