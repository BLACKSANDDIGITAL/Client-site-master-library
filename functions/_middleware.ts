import staticFormsPlugin from "@cloudflare/pages-plugin-static-forms";

interface Env {
  CONTACT_SUBMISSIONS: KVNamespace;
}

export const onRequest: PagesFunction<Env> = staticFormsPlugin({
  respondWith: async ({ formData, name }) => {
    if (name !== "contact") {
      return new Response("Unknown form.", { status: 400 });
    }

    const submittedAt = new Date().toISOString();

    const submission = {
      submittedAt,
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      service: String(formData.get("service") || ""),
      message: String(formData.get("message") || ""),
    };

    const id = crypto.randomUUID();

    await CONTACT_SUBMISSIONS.put(
      `contact:${submittedAt}:${id}`,
      JSON.stringify(submission),
    );
return new Response(null, {
  status: 303,
  headers: {
    Location: "/thank-you",
  },
});