import React, { useState, useEffect } from 'react';
import ostv from './ostv.png';
import heart from './heart.png';
import arrow from './arrow.png';
import tvStatic from './static.gif'
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

function Tv() {

  const [showStatic, setShowStatic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([{ url: tvStatic, text: "hello :) flip the channel forward with the top knob and flip back with the one below it" }]);

  // const onClick = e => {
  //   e.preventDefault();
  //   this.setState({
  //     showResults: this.state.name === null ? false : true
  //   });
  // };

  useEffect(() => {
    const storage = getStorage();
    const listRef = ref(storage, '/');
    let fetchedImages = [];
    async function fetchImages() {
      const allRefs = await listAll(listRef);
      console.log("gang", allRefs);
      const urlRequests = allRefs.items.map(itemRef => getDownloadURL(itemRef));
      const urls = await Promise.all(urlRequests);
      const metadataRequests = allRefs.items.map(itemRef => getMetadata(itemRef));
      const metadatas = await Promise.all(metadataRequests);
      fetchedImages = urls.map(function (url, i) {
        return { url, ...metadatas[i].customMetadata };
      });
      console.log(fetchedImages);
      fetchedImages = fetchedImages.sort(function (a, b) {
        var d1 = Date.parse(a["memDate"]);
        var d2 = Date.parse(b["memDate"]);
        console.log(a);
        console.log(b);
        console.log(d1, d2, d1 < d2)
        return d1 < d2 ? -1 : 1;
      });
      console.log(fetchedImages);
      setImages(fetchedImages);

      // allRefs.items.forEach(async (itemRef) => {
      //   console.log(itemRef); 
      //   const url = await getDownloadURL(itemRef);
      //   const metadata = await getMetadata(itemRef);
      //   console.log({url, ...metadata.customMetadata});
      //   fetchedImages.push({url, ...metadata.customMetadata});
      //   console.log(fetchedImages);
      //   setImages(fetchedImages);

      // });

      // listAll(listRef)
      //   .then((res) => {
      //     res.items.forEach((itemRef) => {
      //       console.log(itemRef); 
      //      // console.log(itemRef.getDownloadUrl())
      //       //fetchedImages.push(itemRef.getDownloadUrl())
      //     });
      //   }).catch((error) => {
      //     // Uh-oh, an error occurred!
      //   });
    }
    fetchImages();

    setLoading(false);
    //setImages(fetchedImages);
    console.log(fetchedImages);
  }, []);

  useEffect(() => {
    if (showStatic) {
      setTimeout(function () {
        setShowStatic(false)
      }, 700);
    }
  });

  const onClickNext = () => {
    setShowStatic(true);
    setIndex((index + 1) % images.length);
  }
  const onClickPrev = () => {
    let nextIndex = index - 1
    if (nextIndex < 0)
      nextIndex = images.length + nextIndex;
    console.log(nextIndex);
    setIndex(nextIndex);
  }

  const handleSliderChange = (e) => {
    setShowStatic(true);
    setIndex(parseInt(e.target.value));
  };

  return (
    <div className=" rounded-sm object-center content-center relative w-196 h-full" >
      <div className="transition bg-green p-2 text-left absolute left-2 top-16 h-28 font-mono text-black w-160">
        {images[index]["text"]}
      </div>
      <div className="bg-pink border-solid border-0 border-pink w-4 h-28 absolute left-170 top-16">
        <div style={{ height: `${100 - (100 * index / (images.length - 1))}%` }} className="bg-sage w-4 absolute" ></div>
      </div>
      <div className="bg-yellow absolute top-38 left-180 h-6 w-28 font-mono text-black">
        {images[index]["memDate"]}
      </div>
      <img src={heart} className=" absolute top-16 left-182 h-20 w-20" />
      <img src={ostv} className="select-none z-20 top-48 object-center absolute w-190" />
      <div className="z-10 border-solid border-4 border-black absolute top-60 left-10 w-128 h-96 overflow-hidden object-cover">
        {showStatic || loading ? <img src={tvStatic} className="w-128 h-96" /> : null}
      </div>
      <img src={images[index]["url"]} className="select-none object-cover top-48 absolute top-60 left-10 w-128 h-96" />
      {showStatic || loading ? <div className="z-40 absolute top-119 left-179 w-20 h-20 rounded-full">
      </div> : null}
      <div onClick={onClickNext} className="text-green z-30 absolute top-119 left-179 w-20 h-20 rounded-full">
      </div>
      <div onClick={onClickPrev} className="z-30 border-solid border-4 border-black absolute top-128 left-180 w-16 h-16 rounded-full">
      </div>
      {index == 0 ? <img src={arrow} className=" z-40 absolute top-119 left-184 h-20 w-28" /> : null}

      <div className="absolute top-[700px] left-10 w-128 flex flex-col items-center">
        <input
          type="range"
          min="0"
          max={images.length - 1}
          value={index}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="mt-2 font-mono text-sm">
          Channel: {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );

}

export default Tv;
