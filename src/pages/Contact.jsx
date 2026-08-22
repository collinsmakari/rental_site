import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import GoogleMap from "../components/contact/GoogleMap";

const Contact = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">Contact Us</h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Have questions about our rental properties? We're here to help you
            find the perfect place to call home.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-100 py-24">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-2">
          <ContactInfo />

          <ContactForm />
        </div>
      </section>

      {/* Google Map */}
      {/*<GoogleMap />*/}
    </>
  );
};

export default Contact;
