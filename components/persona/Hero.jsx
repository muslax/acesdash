export default function Hero({ title, subTitle1, subTitle2, isForm }) {
  const width = isForm ? 'max-w-xl mx-auto' : ''

  return (
    <div className="aces-wrap bg-white pt-8 pb-10">
      <div className="aces-geist">
        <div className={`${width} text-center sm:text-left`}>
          <div className="flex flex-col">
            <div className="text-center md:text-left mb-2">
              <h2 className="text-2xl text-gray-700 tracking-loose">
                {title || 'Daftar Peserta'}
              </h2>
              <div className="text-sm text-green-600">
                {subTitle1 || 'What Project'}
              </div>
              <div className="text-sm text-gray-600s">
                {subTitle2 || 'What Client'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}