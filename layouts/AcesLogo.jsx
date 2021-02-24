export const ACESPurple = () => {
  return (
    <div className="flex flex-row text-gray-100 hover:text-white text-center text-sm font-bold leading-none">
      <div className="rounded-full bg-purple-700 h-6 w-6 pt-1 z-50">a</div>
      <div className="rounded-full bg-purple-600 h-6 w-6 pt-1 -ml-2 z-40">c</div>
      <div className="rounded-full bg-purple-500 h-6 w-6 pt-1 -ml-2 z-30">e</div>
      <div className="rounded-full bg-purple-500 bg-opacity-75 h-6 w-6 pt-1 -ml-2 z-20">s</div>
    </div>
  )
}

export const ACESRed = () => {
  return (
    <div className="flex flex-row text-gray-50 text-xl text-center font-bold leading-none">
      <div className="rounded-full bg-red-700 h-8 w-8 pt-1 z-40">a</div>
      <div className="rounded-full bg-red-600 h-8 w-8 pt-1 -ml-2 z-30">c</div>
      <div className="rounded-full bg-red-500 h-8 w-8 pt-1 -ml-2 z-20">e</div>
      <div className="rounded-full bg-red-500 bg-opacity-75 h-8 w-8 pt-1 -ml-2 z-10">s</div>
    </div>
  )
}



export const ACESGray = ({ size=4 }) => {
  return (
    <div className="flex flex-row text-gray-50 text-xl text-center font-bold leading-none">
      <div className="rounded-full bg-yellow-700 h-8 w-8 pt-1 z-40">a</div>
      <div className="rounded-full bg-yellow-600 h-8 w-8 pt-1 -ml-2 z-30">c</div>
      <div className="rounded-full bg-yellow-500 h-8 w-8 pt-1 -ml-2 z-20">e</div>
      <div className="rounded-full bg-yellow-500 bg-opacity-75 h-8 w-8 pt-1 -ml-2 z-10">s</div>
    </div>
  )
}