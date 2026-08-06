import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    alert("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-3xl font-bold text-slate-900">
        Send Us a Message
      </h2>

      <p className="mb-8 text-slate-600">
        We'd love to hear from you. Fill out the form below.
      </p>

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
            className="rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
          />
        </div>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
        />

        <textarea
          rows="6"
          name="message"
          placeholder="Write your message..."
          value={form.message}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
        />

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
