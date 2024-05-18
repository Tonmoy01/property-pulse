'use-client';
import { ClipLoader } from 'react-spinners';

const override = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
};

export default function Spinner({ loading }) {
  return (
    loading && (
      <div style={override}>
        <ClipLoader
          color='#3b82f6'
          loading={loading}
          size={150}
          aria-label='Loading Spinner'
        />
      </div>
    )
  );
}
