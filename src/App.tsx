import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";

function App() {
  const [imageBlob, setImageBlob] = useState<Blob>();
  const [text, setText] = useState("");

  useEffect(() => {
    window.addEventListener("paste", function (e) {
      const file = e.clipboardData?.files[0];
      setImageBlob(file);
    });
  }, []);

  async function ocrImage() {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const worker = await createWorker("por");
      const ret = await worker.recognize(url);
      console.log(ret.data.text);
      setText(ret.data.text);
      await worker.terminate();
    }
  }

  useEffect(() => {
    if (imageBlob) {
      ocrImage();
    }
  }, [imageBlob]);

  return (
    <>
      <div>
        <img
          style={{ width: "100%", height: "60vh" }}
          src={imageBlob && URL.createObjectURL(imageBlob)}
          className="logo react"
          alt="React logo"
        />
        <textarea style={{ width: "100%", height: "10rem" }} value={text} />
      </div>
    </>
  );
}

export default App;
