import { ACESGray } from "@layouts/AcesLogo";

export default function BillingInfo() {

  return (
    <div className="max-w-xl rounded-md border border-yellow-300 bg-gradient-to-t from-yellow-50 px-6 py-5">
      <div className="-mx-6 px-6">
        <div className="flex flex-row items-center _justify-center text-yellow-500 mb-6">
          <ACESGray />
          <div className="ml-5 pl-4 border-l text-4xl font-mediums ">
            Billing
          </div>
        </div>
        <div className="text-gray-500 text-sm mb-32">
          Saat ini ACES Billing belum dapat dilayani melalui platform ini.
        </div>
      </div>
    </div>
  )
}