import React, { useRef } from 'react'
import * as xlsx from "xlsx"
const UploadExcelService = (props) => {
  const file = useRef()
  const upload = (event) => {
    const filedata = event.target.files[0]
    if (!filedata) return alert("Plz upload the excel file")
    if (filedata.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return alert("Only Excel file is allowed")

    const reader = new FileReader()
    reader.readAsArrayBuffer(filedata)
    reader.onload = function () {
      const workbook = xlsx.read(reader.result, { type: 'buffer' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      const array = xlsx.utils.sheet_to_json(worksheet)
      props.fun(array);
    }
  }
  return { upload, file }
}

export default UploadExcelService