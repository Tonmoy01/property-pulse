'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProperty } from '@/utils/requests';
import PropertyHandlerImage from '@/components/PropertyHandlerImage';
import Link from 'next/link';
import PropertyDetails from '@/components/PropertyDetails';
import { FaArrowLeft } from 'react-icons/fa';
import Spinner from '@/components/Spinner';
import PropertyImages from '@/components/PropertyImages';
import BookMarkButton from '@/components/BookMarkButton';
import ShareButtons from '@/components/ShareButtons';
import PropertyContactForm from '@/components/PropertyContactForm';

const PropertyPage = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        const property = await fetchProperty(id);

        setProperty(property);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (property === null) {
      fetchPropertyData();
    }
  }, [id, property]);

  if (!property && !loading) {
    return (
      <h1 className='mt-10 text-2xl font-bold text-center'>
        Property Not Found!
      </h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && property && (
        <>
          <PropertyHandlerImage image={property.images[0]} />

          <section>
            <div className='container px-6 py-6 m-auto'>
              <Link
                href='/properties'
                className='flex items-center text-blue-500 hover:text-blue-600'
              >
                <FaArrowLeft className='mr-2' /> Back to Properties
              </Link>
            </div>
          </section>

          <section className='bg-blue-50'>
            <div className='container px-6 py-10 m-auto'>
              <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-70/30'>
                <PropertyDetails property={property} />

                <aside className='space-y-4'>
                  <BookMarkButton property={property} />
                  <ShareButtons property={property} />
                  <PropertyContactForm />
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images} />
        </>
      )}
    </>
  );
};
export default PropertyPage;
