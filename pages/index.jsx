const { WebLayout } = require("@layouts/WebLayout")

const HomePage = () => {
  return (
    <div className="flex items-center justify-center w-full border-t-8 border-indigo-400 min-h-screen bg-white bg-gradient-to-b from-indigo-100">
      <div className="max-w-lg mb-24">
        <a
          href="/login"
          className="flex items-center justify-center w-48 h-48 border-4s border-transparent hover:border-gray-100 rounded-full bg-indigo-400 hover:bg-purple-500 text-blue-500"
        >
          <div className="flex items-center justify-center w-full h-full shadow-sms rounded-full border-2s hover:border-white bg-gradient-to-b from-white hover:from-yellow-50s text-center text-6xl text-indigo-300 hover:text-white pb-3 font-bold leading-none">aces</div>
        </a>
      </div>
    </div>
  )
}

HomePage.getLayout = (page) => <WebLayout>{page}</WebLayout>
HomePage.suppressFirstRenderFlicker = true;

export default HomePage