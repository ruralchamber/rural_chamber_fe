import Image from 'next/image';

export default function ExploreWorld() {
  const galleryImages = [
    { src: '/1.jpg', alt: 'Speaker at podium presenting about livestock wealth as a bank', className: 'col-span-2 row-span-2' },
    { src: '/2.jpg', alt: 'Speaker presenting at event', className: 'col-span-2 row-span-2' },
    { src: '/3.jpg', alt: 'Networking event with attendees', className: 'col-span-2' },
    { src: '/6.jpg', alt: 'Community gathering outdoors with tree', className: 'col-span-2 row-span-2' },
    { src: '/4.jpg', alt: 'Group photo at event', className: 'col-span-2' },
    { src: '/5.jpg', alt: 'Speaker at ASMA conference podium', className: 'col-span-2 row-span-2' },
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#490F13] mb-4">
            Explore our World
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore a variety of events and achievements by Amanella Onnotho,
            showcasing their impact, initiatives, and contributions to economic
            development.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-[220px]">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}