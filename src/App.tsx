import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";
import { When } from "./components/When";

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
        <When value={!!imageBlob}>
          <img
            style={{ width: "100%", height: "60vh" }}
            src={imageBlob && URL.createObjectURL(imageBlob)}
            alt="Ocr image"
          />
        </When>

        <When value={!imageBlob}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid red",
              height: "60vh",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h1 style={{ margin: "0 3rem" }}>
              {" "}
              Control + V to paste any clipboard image
            </h1>
          </div>
        </When>

        <textarea style={{ width: "100%", height: "10rem" }} value={text} />
      </div>
    </>
  );
}

export default App;
