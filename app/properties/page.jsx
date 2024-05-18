import PropertyCard from '@/components/PropertyCard';

async function fetchProperties() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties`);

    if (!res.ok) {
      throw new Error('Failed to fetch data!');
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

const Properties = async () => {
  const properties = await fetchProperties();

  // Sort properties by Date()
  properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className='px-4 py-6'>
      <div className='px-4 py-6 m-auto container-xl lg:container'>
        {properties.length === 0 ? (
          <p>No Properties Found!</p>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {properties?.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default Properties;
