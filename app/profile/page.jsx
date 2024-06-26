'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import profileDefault from '@/assets/images/profile.png';
import Spinner from '@/components/Spinner';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  useEffect(() => {
    const fetchUserProperties = async (userId) => {
      if (!userId) return;

      try {
        const res = await fetch(`/api/properties/user/${userId}`);

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUserProperties(session.user.id);
    }
  }, [session]);

  const handleDeleteProperty = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowModal(true);
  };

  const confirmDeleteProperty = async () => {
    try {
      const res = await fetch(`/api/properties/${selectedPropertyId}`, {
        method: 'DELETE',
      });

      if (res.status === 200) {
        setProperties((prevProperties) =>
          prevProperties.filter(
            (property) => property._id !== selectedPropertyId
          )
        );
        setShowModal(false);
        setSelectedPropertyId(null);
        toast.success('Property Deleted');
      } else {
        toast.error('Failed to delete property.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete property.');
    }
  };

  return (
    <section className='bg-blue-50'>
      <div className='container py-24 m-auto'>
        <div className='px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0'>
          <h1 className='mb-4 text-3xl font-bold'>Your Profile</h1>
          <div className='flex flex-col md:flex-row'>
            <div className='mx-20 mt-10 md:w-1/4'>
              <div className='mb-4'>
                <Image
                  className='w-32 h-32 mx-auto rounded-full md:h-48 md:w-48 md:mx-0'
                  src={profileImage || profileDefault}
                  width={200}
                  height={200}
                  alt='User'
                />
              </div>
              <h2 className='mb-4 text-2xl'>
                <span className='block font-bold'>Name: </span> {profileName}
              </h2>
              <h2 className='text-2xl'>
                <span className='block font-bold'>Email: </span> {profileEmail}
              </h2>
            </div>

            <div className='md:w-3/4 md:pl-4'>
              <h2 className='mb-4 text-xl font-semibold'>Your Listings</h2>
              {!loading && properties.length === 0 && (
                <p className='py-3 text-center text-white rounded-sm shadow-md bg-cyan-800'>
                  You have no property listings!
                </p>
              )}

              {loading ? (
                <Spinner loading={loading} />
              ) : (
                properties?.map((property) => (
                  <div className='mb-10' key={property._id}>
                    <Link href={`/properties/${property._id}`}>
                      <Image
                        className='object-cover w-full h-32 rounded-md'
                        src={property.images[0]}
                        alt={property.name}
                        width={500}
                        height={100}
                        priority={true}
                      />
                    </Link>
                    <div className='mt-2'>
                      <p className='text-lg font-semibold'>{property.name}</p>
                      <p className='font-semibold text-gray-600'>
                        Address: {property.location.street}{' '}
                        {property.location.city} {property.location.state}
                      </p>
                    </div>
                    <div className='mt-2'>
                      <Link
                        href={`/properties/${property._id}/edit`}
                        className='px-3 py-3 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className='px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
                        type='button'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeleteProperty}
        title='Delete Confirmation'
        message='Are you sure you want to delete this property?'
      />
    </section>
  );
}
