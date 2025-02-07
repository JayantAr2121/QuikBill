import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'

const CustomersServices = () => {
    const [data, setdata] = useState([])
    const [customers, setcustomers] = useState([])
    const [currentpage, setcurrentpage] = useState(1)
    const [totalpages, settotalpages] = useState(0)
    const customersperpage = 5

    const getallcustomers = async (token) => {
        try {
            const response = await Api.get("/getallcustomers", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) setdata(response.data.existingcustomers)
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
    useEffect(() => {
        if (data.length !== 0) {
            const indexoflastcustomer = currentpage * customersperpage;
            const indexoffirstcustomer = indexoflastcustomer - customersperpage;
            const currentcustomers = data.slice(indexoffirstcustomer, indexoflastcustomer);
            const totalpage = Math.ceil(data.length / customersperpage);
            setcustomers(currentcustomers)
            settotalpages(totalpage)
        }
    }, [data, currentpage])
    return { currentpage, totalpages, getallcustomers, setcustomers, customers, setcurrentpage }
}

export default CustomersServices