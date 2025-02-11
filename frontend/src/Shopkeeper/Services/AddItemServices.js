import React, { useEffect, useState } from 'react'
import Api from '../../Api/InstanceApi'

const AddItemServices = () => {
    const [data, setdata] = useState([])
    const [search, setsearch] = useState("")
    const [searched, setsearched] = useState([])
    const getallitems = async (token) => {
        try {
            const response = await Api.get("/getproducts", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 200) setdata(response.data.allproducts)
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
    return {search,searched,setsearch,setsearched,getallitems,data}
}

export default AddItemServices