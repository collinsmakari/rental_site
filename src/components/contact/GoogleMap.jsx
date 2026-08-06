const GoogleMap = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=YOUR_MAP_LINK"
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
