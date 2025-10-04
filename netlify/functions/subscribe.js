// Note: This is a simple example storing emails in memory.
// For production, use a database like Firebase, Supabase, Airtable, or Netlify KV.

let subscribers = []; // Temporary in-memory store (resets on redeploy)

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const email = data.email?.trim();

    if (!email || !email.includes("@")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid email address" }),
      };
    }

    // Check if already subscribed
    if (subscribers.includes(email)) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Email already subscribed" }),
      };
    }

    // Add email to subscribers array
    subscribers.push(email);

    console.log("New subscriber added:", email);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully subscribed!" }),
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
