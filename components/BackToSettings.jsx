import Link from 'next/link'

export default function BackToSettings({ text, href }) {
  const linkText = text ? text : 'Back to Settings'
  const backLink = href ? href : '/settings'
  return (
    <div className="">
      <Link href={backLink}>
        <a className="block sm:hidden bg-white font-semibold border-b -mx-4 px-4 py-6">
          <div className="hover:text-gray-500">
            <svg className="inline-block mr-2 stroke-current stroke-2" viewBox="0 0 24 24" width="20" height="20" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision"><path d="M15 18l-6-6 6-6"></path></svg>
            <span className="">{linkText}</span>
          </div>
        </a>
      </Link>
    </div>
  )
}