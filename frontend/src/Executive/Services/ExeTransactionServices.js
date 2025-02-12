import React, { useState } from 'react'
import Api from '../../Api/InstanceApi'

const ExeTransactionServices = () => {
    const [transactions, settransactions] = useState([])
    const getalltransactions = async (token, id) => {
        try {
            const response = await Api.get("/getalltransactions/" + id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) settransactions(response?.data.result)
            else alert(response?.data.message)
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('No response from server');
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }
    return { getalltransactions, transactions }
}

export default ExeTransactionServices