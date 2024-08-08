import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';


function App() {
  const [clicked, setClicked] = useState(false);
  const [urls, setUrls] = useState({
    url: ""
  });

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUrls(prevUrls => ({ ...prevUrls, [name]: value }));

  }



  function shorten() {
    const len = 4;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let res = "bitly://";
    for (let i = 0; i < len; i++) {
      res +=
        chars.charAt(Math.floor(Math.random() * chars.length));
    }
    res += ".com";
    return res;
  }


  const onSubmitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shortUrl = shorten();
    try {
      axios.post("http://localhost:8080/", {
        url: urls.url,
        shorturl: shortUrl,
        count: 0
      }).then((res) => {
        console.log(res);
      })
    }
    catch (err) {
      console.error(err);
    }
  }

  interface Links {
    id: number,
    url: string,
    shorturl: string,
    count: number
  }

  const [arr, setArr] = useState();
  const getUrlList = () => {
    setClicked(!clicked);
    axios.get("http://localhost:8080/").
      then((res) => {
        res.data.map((url: string) => {
          console.log(url);
        })
      })
  }
  const [count, setCount] = useState(0);

  const handleCount = () => {
    setCount(count+1);
  }

const list = () => {
  return axios.get("http://localhost:8080/")
  .then((res) => setArr(res.data));
}

useEffect(() => {
  list();
},[]);

  return (
    <>

      <div className="flex justify-around mt-2">
        <div className='text-3xl'>URL Shortener</div>
        <button onClick={getUrlList} className='bg-green-500 rounded-full px-4 py-2 text-white'>Links</button>
      </div>
      <div className="mt-14">
        <form action="submit" onSubmit={onSubmitHandler} className='flex flex-col px-8'>
          <input onChange={onChangeHandler} name='url' value={urls.url} className='border-4 px-4 py-2' type="text" placeholder='Enter a link here' />
          <button className='bg-blue-500 rounded-full px-4 py-2 text-white w-24 mt-4'>Submit</button>
        </form>
      </div>

      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <th scope="col" className="px-6 py-3">URL</th>
        <th scope="col" className="px-6 py-3">ShortURL</th>
        <th scope="col" className="px-6 py-3">Count</th>
        <tbody>
          {arr?.length > 0 && arr?.map((item:Links) => <tr key={item.key}>
            <td onClick={handleCount}>{item.url}</td>
            <td>{item.shorturl}</td>
            <td>{item.count}</td>
          </tr>)}
        </tbody>
      </table>
    </>
  )

}

export default App
