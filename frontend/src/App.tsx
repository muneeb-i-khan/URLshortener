import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import QRCode from 'qrcode.react'; 
import './App.css';

interface Links {
  id: number;
  url: string;
  shorturl: string;
  count: number;
}

const fetchLinks = async (): Promise<Links[]> => {
  const { data } = await axios.get('http://localhost:8080/');
  return data;
};

const shortenUrl = async (url: string): Promise<string> => {
  const { data } = await axios.post('http://localhost:8080/shorten', { url });
  return data.shorturl;
};

function App() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); 
  const queryClient = useQueryClient();

  const { data: links = [], isLoading, error } = useQuery({
    queryKey: ['links'],
    queryFn: fetchLinks,
  });

  const mutation = useMutation({
    mutationFn: shortenUrl,
    onSuccess: () => {
      queryClient.invalidateQueries(['links']);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(url);
  };

  const generateQRCode = (shorturl: string) => {
    setQrCodeUrl(`http://localhost:8080/${encodeURIComponent(shorturl)}`);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <>
      <div className="flex justify-around mt-2">
        <div className='text-3xl'>URL Shortener</div>
      </div>
      <div className="mt-14">
        <form onSubmit={handleSubmit} className='flex flex-col px-8'>
          <input
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            className='border-4 px-4 py-2'
            type="text"
            placeholder='Enter a link here'
          />
          <button 
            type="submit" 
            className='bg-blue-500 rounded-full px-4 py-2 text-white w-24 mt-4'
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>An error occurred: {error.message}</p>}
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3">URL</th>
            <th scope="col" className="px-6 py-3">ShortURL</th>
            <th scope="col" className="px-6 py-3">Count</th>
            <th scope="col" className="px-6 py-3">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {links.map((item: Links) => (
            <tr key={item.shorturl}>
              <td>{item.url}</td>
              <td>
                <a 
                  href={`http://localhost:8080/${encodeURIComponent(item.shorturl)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {item.shorturl}
                </a>
              </td>
              <td>{item.count}</td>
              <td>
                <button 
                  onClick={() => generateQRCode(item.shorturl)} 
                  className='bg-green-500 rounded-full px-4 py-2 text-white'
                >
                  Generate QR Code
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {qrCodeUrl && (
        <div className='mt-4 flex justify-center items-center flex-col'>
          <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col items-center'>
            <QRCode value={qrCodeUrl} />
            <button 
              onClick={downloadQRCode} 
              className='bg-blue-500 rounded-full px-4 py-2 text-white mt-4'
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
