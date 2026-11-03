
import { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          reply_to: form.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("Email sending failed:", error);
      setStatus("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-3xl font-bold text-slate-900">
        Send Us a Message
      </h2>

      <p className="mb-8 text-slate-600">
        We'd love to hear from you. Fill out the form below.
      </p>

      {status === "success" && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
          Your message has been sent successfully!
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:border-blue-600"
        />

        <textarea
          rows="6"
          name="message"
          placeholder="Write your message..."
          value={form.message}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none focus:border-blue-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

      </form>
    </div>
  );
};

export default ContactForm;
