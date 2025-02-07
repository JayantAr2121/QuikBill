import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
const AddproductService = (props) => {
    const navigate = useNavigate()

    const [obj, setobj] = useState({})

    const [loading, setloading] = useState(false)

    const set = (e) => setobj({ ...obj, [e.target.name]: e.target.value })

    const AddProduct = async (e) => {
        try {
            e.preventDefault()
            setloading(true)
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear()
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const resp = await Api.post('/UploadProduct', obj, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': userinfo.Authorization
                }
            })
            alert(resp?.data?.message)
            if (resp.status === 202) {
                props.setToggle(false)
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
        }finally{setloading(false)}

    }
    return { AddProduct, set, loading }
}

export default AddproductService