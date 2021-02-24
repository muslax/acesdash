import { useState } from 'react'

function ChevronRight() {
  return <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20"><path d="M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.46a.5.5 0 01-.7-.7L12.8 10 7.65 4.85a.5.5 0 010-.7z"></path></svg>
}

function ChevronDown() {
  return <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 01-.78 0L4.15 8.35a.5.5 0 01.7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0z"></path></svg>
}

export const ButtonExpander = ({ clickHandler, disabled=false, initialState=false }) => {
  const [state, setState] = useState(initialState)

  return (
    <button disabled={disabled} onClick={e => {
      setState(!state)
      if (clickHandler) clickHandler()
    }}
    className="inline-block w-5 h-5 leading-none hover:bg-gray-100 focus:outline-none text-gray-600 hover:text-gray-800"
    >{ state ? <ChevronDown/> : <ChevronRight/>}</button>
  )
}

export default ButtonExpander

export function ButtonExpanderRight({ clickHandler, disabled=false }) {
  return (
    <button
    disabled={disabled}
    onClick={e => {
      if (clickHandler) clickHandler()
    }}
    className="inline-block w-5 h-5 leading-none hover:bg-gray-100 focus:outline-none text-gray-600 hover:text-gray-800"
    ><ChevronRight/></button>
  )
}

export function ButtonExpanderDown ({ clickHandler, disabled=false }) {
  return (
    <button
    disabled={disabled}
    onClick={e => {
      if (clickHandler) clickHandler()
    }}
    className="inline-block w-5 h-5 leading-none hover:bg-gray-100 focus:outline-none text-gray-600 hover:text-gray-800"
    ><ChevronDown/></button>
  )
}