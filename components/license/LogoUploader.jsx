import fetchJson from "@lib/fetchJson"
import Link from "next/link"
import { useState } from "react"

export default function LogoUploader({ setView }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploaded, setUploaded] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function updateLicenseLogo(cloudinaryUrl) {
    const url = `/api/post?q=update-logo`
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ imageUrl: cloudinaryUrl })
    })

    console.log('API Response', response)
    return response
  }

  const handleImageUpload = () => {
    setSubmitting(true)
    const { files } = document.querySelector('input[type="file"]')
    const formData = new FormData();
    formData.append('file', files[0]);
    // replace this with your upload preset name
    formData.append('upload_preset', 'acespics');
    const options = {
      method: 'POST',
      body: formData,
    };

    // replace cloudname with your Cloudinary cloud_name
    return fetch('https://api.Cloudinary.com/v1_1/ptkj/image/upload', options)
      .then(res => res.json())
      // .then(res => console.log(res))
      .then(res => {
        updateLicenseLogo(res.secure_url)
        setUploaded({
          imageUrl: res.secure_url,
          imageAlt: `An image of ${res.original_filename}`
        })
      })
      .then(res => {
        setSubmitting(false)
        setSelectedFile(null)
      })
      .catch(err => console.log(err));

    // const response = await fetch('https://api.Cloudinary.com/v1_1/ptkj/image/upload', options)
    // console.log(response)
  }

  return (
    <div className="max-w-xl">
      <div className="hidden">
        <form>
          <div className="form-group">
            <input id="input" type="file"
              onChange={e => {
                document.getElementById('preview').innerHTML =''
                if (e.target.files[0]) {
                  const file = e.target.files[0]
                  console.log('File', file)
                  setSelectedFile(file.name)
                  const reader = new FileReader()
                  reader.onload = function(ev) {
                    const image = document.createElement('img')
                    image.src = ev.target.result
                    document.getElementById('preview').appendChild(image)
                  }
                  // declare file loading
                  reader.readAsDataURL(file)
                }
              }}
            />
            <button
              className="bg-white rounded shadow border border-gray-400 px-3 py-1"
            >Select file</button>
          </div>
          <button
          >
            OK
          </button>
        </form>
      </div>

      <div className="">
        <h1 className="text-2xl text-gray-700 mb-1">Upload Logo</h1>
        <p className="text-sm text-gray-500 mb-6">
          Foto atau logo yang diupload hanya akan dipakai dalam
          platform ACES.
        </p>
        <div className="bg-white max-w-md border shadow-sm p-4 mb-6">
          <div id="preview" className="bg-gray-50">
            <div className="text-center py-16">
              <button
                onClick={e => document.getElementById('input').click()}
                className="rounded border border-gray-300 hover:bg-white hover:border-gray-400 focus:outline-none hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-5 py-2"
              >
                Select file
              </button>
            </div>
          </div>
          {!submitting && uploaded && (
            <div className="text-center mt-4">
              {/* <Link href="/license/info">
                <a className="inline-flex text-sm font-bold ml-2 rounded border border-gray-300 hover:bg-white hover:border-gray-400 focus:outline-none hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-1">
                  SELESAI
                </a>
              </Link> */}
              <button
                onClick={setView}
                className="inline-flex text-sm font-bold ml-2 rounded border border-gray-300 hover:bg-white hover:border-gray-400 focus:outline-none hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-1"
              >
                SELESAI
              </button>
            </div>
          )}
          {submitting && (
            <div className="flex items-center rounded border border-gray-300 text-sm px-4 py-1 mt-4">
              <div className="-my-1 py-1 pr-4 border-r">
                Uploading:
              </div>
              <div id="progress" className="bg-gray-300 flex-grow h-1 rounded-full ml-4"></div>
            </div>
          )}
          {selectedFile && !submitting && (
            <div className="flex items-center mt-4">
              <p className="flex-grow text-sm">
                File:{` `}
                <span className="truncate">{selectedFile}</span>
              </p>
              <button onClick={e => document.getElementById('input').click()} className="text-sm rounded border border-gray-300 hover:bg-white hover:border-gray-400 focus:outline-none hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-1">Ganti</button>
              <button onClick={handleImageUpload} className="text-sm font-bold ml-2 rounded border border-gray-300 hover:bg-white hover:border-gray-400 focus:outline-none hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-1">OK</button>
            </div>
          )}
        </div>

        {uploaded && (
          <div className="text-sm text-center px-6">
            Kalau logo tidak secara otomatis muncul di sebelah kiri nama
            perusahaan di bagian atas, mungkin Anda perlu me-refresh browser.
          </div>
        )}
        {/* <pre className="my-4">
          {JSON.stringify(uploaded, null, 2)}
        </pre> */}
      </div>
      <style jsx>{`
      #progress {
        background-image: url("/mango-in-progress-01.gif");
      }
      `}</style>
    </div>
  )
}