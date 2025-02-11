import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'

const ChooseCustomerServices = () => {
    const [data, setdata] = useState([])
    const navigate = useNavigate()
    const [search, setsearch] = useState("")
    const [searched, setsearched] = useState([])
    const getallitems = async (token) => {
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
            const searcheddata = data.filter(customer => customer.name.match(search))
            setsearched(searcheddata);
        }
    }, [search])
    return { getallitems, search, searched, data, setsearch, setsearched }
}

export default ChooseCustomerServices