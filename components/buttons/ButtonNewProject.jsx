import { SVGProject } from "@components/SVGIcon";
import Link from "next/link";

export function ButtonNewProject({ isFull = false }) {
  return (
    <Link href="/projects/new">
      <a className={(isFull ? 'w-full' : '') + ` inline-flex items-center justify-center text-sm font-semibold pl-4 pr-5 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}>
        <SVGProject className="text-green-500 w-5 h-5 mr-2"/>
        <span>New Project</span>
      </a>
    </Link>
  )
}