import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
const CreateExecutiveServices = (props) => {
    const [displayotpsection, setdisplayotpsection] = useState(false)
    const [otploading, setotploading] = useState(false)
    const [loading, setloading] = useState(false)
    const [obj, setobj] = useState({})
    const [otp, setotp] = useState('')
    const [data, setdata] = useState({})
    const navigate = useNavigate()
    const getallcityandstate = async (token) => {
        try {
            const response = await Api.get("/getallcitiesandstates", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) setdata(response.data.result)
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
    const set = (event) => setobj({ ...obj, [event.target.name]: event.target.value })
    const sendotp = async (e) => {
        try {
            e.preventDefault()
            setotploading(true)
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.post("/verifyExecutive", obj, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) setdisplayotpsection(true)
            setotploading(false)
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
            const response = await Api.post("/createExecutive", { ...obj, otp }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 201) {
                props.fun(false)
                props.getallexecutives(userinfo.Authorization)
            }
            setloading(false)
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
    return { displayotpsection, otploading, loading, obj, otp, data, setotp, setdata, set, sendotp, submit, getallcityandstate }
}

export default CreateExecutiveServices