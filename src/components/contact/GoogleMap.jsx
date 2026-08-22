const GoogleMap = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <iframe
            title="Nairobi City Map"
            src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&z=12&output=embed"
            width="100%"
            height="500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />
        </div>
      </div>
    </section>
  );
};

export default GoogleMap;