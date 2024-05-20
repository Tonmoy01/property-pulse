import React from 'react';

const Modal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
        <p>{message}</p>
        <div className='flex justify-end mt-4 space-x-2'>
          <button
            className='px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700'
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
