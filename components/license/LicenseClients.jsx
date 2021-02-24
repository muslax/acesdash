import ButtonExpander from "@components/buttons/ButtonExpander"
import { useClients } from "@lib/hooks/client"
import { useState } from "react"

export default function LicenseClients() {
  const { clients, isLoading, isError } = useClients()

  const [showStack, setShowStack] = useState([])

  return (
    <div className="-mt-2">
      <div className="">
        <div className="mb-6">
          <h3 className="text-2xl font-medium mb-2">Clients</h3>
          <p className="text-sm text-gray-500">
            Klien hanya dapat ditambahkan pada saat pembuatan proyek.
          </p>
        </div>
      </div>

      <table className="w-full leading-snug text-sm text-gray-700">
        <thead>
          <tr className="bg-yellow-200s border-b border-ts border-gray-300">
            <td width="30" className="rounded-tl bg-yellow-200 p-2">#</td>
            <td className="p-2 bg-yellow-200">Nama Perusahaan/Organisasi</td>
            <td width="150" className="bg-yellow-200 p-2 pr-3 text-right">Alamat</td>
            <td width="30" className="rounded-tr bg-yellow-200 p-2 pl-1"></td>{/* &#10070; */}
          </tr>
        </thead>
        {isLoading && (
          <tbody>
            <tr>
              <td colSpan="4" className="py-6 text-center">Loading...</td>
            </tr>
          </tbody>
        )}
        {isError && (
          <tbody>
            <tr>
              <td colSpan="4" className="py-6 text-center text-red-500">Error loading data.</td>
            </tr>
          </tbody>
        )}
        {clients?.map((client, index) => (
          <tbody key={client._id}>
            <tr className="border-b border-gray-200">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{client.name}</td>
              <td className="p-2 text-right">{!showStack.includes(client._id) ? client.city : ''}</td>
              <td className="pt-2">
                <ButtonExpander clickHandler={e => {
                  if (!showStack.includes(client._id)) {
                    setShowStack(prev => ([
                      ...prev,
                      client._id
                    ]))
                  } else {
                    setShowStack(showStack.filter((item) => {
                      return item !== client._id
                    }))
                  }
                }}/>
              </td>
            </tr>
            {showStack.includes(client._id) && (
              <tr className="border-b border-gray-200 bg-gray-50">
                <td></td>
                <td colSpan="3" className="px-2 py-4">
                  <table className="text-xs">
                    <tbody>
                      <tr>
                        <td width="120" className="align-top px-0 py-1">Nama Organisasi:</td>
                        <td className="align-top p-1">{client.name}</td>
                      </tr>
                      <tr>
                        <td className="align-top px-0 py-1">Alamat:</td>
                        <td className="align-top p-1">{client.address ? client.address : '-'}</td>
                      </tr>
                      <tr>
                        <td className="align-top px-0 py-1">Kota:</td>
                        <td className="align-top p-1">{client.city}</td>
                      </tr>
                      <tr>
                        <td className="align-top px-0 py-1">Telepon:</td>
                        <td className="align-top p-1">{client.phone ? client.phone : '-'}</td>
                      </tr>
                      <tr>
                        <td className="align-top px-0 py-1">Kontak:</td>
                        <td className="align-top p-1">
                          {/* <Contacts persons={client.contacts} /> */}
                          [TBD]
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  )
}