import properties from '@/properties.json';
import PropertyCard from './PropertyCard';
import Link from 'next/link';

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

export default async function HomeProperties() {
  const properties = await fetchProperties();

  const recentProperties = properties
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <>
      <section className='px-4 py-6'>
        <div className='m-auto container-xl lg:container'>
          <h2 className='mb-6 text-3xl font-bold text-center text-blue-500'>
            Recent Properties
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {recentProperties === 0 ? (
              <p>No Properties Found!</p>
            ) : (
              recentProperties?.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>
      <section className='max-w-lg px-6 m-auto my-10'>
        <Link
          href='properties'
          className='block px-6 py-4 text-center text-white bg-black rounded-xl hover:bg-gray-700'
        >
          View All Properties
        </Link>
      </section>
    </>
  );
}
