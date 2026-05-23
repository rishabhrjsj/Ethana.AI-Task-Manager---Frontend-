import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}

export default App;
