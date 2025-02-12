import React, { useState } from 'react'
import ExecutiveHeader from '../Components/ExecutiveHeader'
import CreateInvoice from '../Components/CreateInvoice'
import ReviewInvoices from '../Components/ReviewInvoices'

const ExecutiveInvoices = () => {
  const [invoices, setinvoices] = useState(null)
  return (
    <div>
      <ExecutiveHeader />
      {
        invoices ? <ReviewInvoices data={invoices} /> : <CreateInvoice setinvoices={setinvoices} />
      }
    </div>
  )
}

export default ExecutiveInvoices
