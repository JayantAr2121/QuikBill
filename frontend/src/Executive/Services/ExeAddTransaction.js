import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Api from '../../Api/InstanceApi'
const ExeAddTransaction = () => {
    const navigate=useNavigate
    const [loading, setloading] = useState(false)
    const [obj, setobj] = useState({})
    const set = (event) => setobj({ ...obj, [event.target.name]: event.target.value })
    const submit = async (e) => {
        try {
            e.preventDefault()
            setloading(true)
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            const customerinfo = JSON.parse(localStorage.getItem("Customerinfo"))
            if (!userinfo || !userinfo.Authorization || !customerinfo || !customerinfo.id) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.post("/addpayment/" + customerinfo.id, obj, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) {
                navigate("/ExecutiveCustomers")
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('No response from server');
            } else {
                console.log('An unexpected error occurred');
            }
        } finally {
            return setloading(false)
        }
    }
    return { submit, set, loading }
}

export default ExeAddTransaction