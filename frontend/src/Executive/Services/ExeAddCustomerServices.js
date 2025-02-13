import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'

const ExeAddCustomerServices = (props) => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [obj, setobj] = useState({})
    const set = (e) => (setobj({ ...obj, [e.target.name]: e.target.value }))
    const submit = async (e) => {

        try {
            e.preventDefault()
            setloading(true)
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.post('/createcustomer', obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userinfo.Authorization
                }
            })
            console.log(response)
            alert(response?.data.message)
            if (response.status === 202) {
                props.setToggle(false)
                await props.getallcustomers(userinfo.Authorization)
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
            setloading(false)
        }
    }
    return { submit, set, loading, obj }
}

export default ExeAddCustomerServices