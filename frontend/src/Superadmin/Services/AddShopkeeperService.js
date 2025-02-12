import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'

const AddShopkeeperService = (props) => {
    const navigate = useNavigate()
    const [displayotpsection, setdisplayotpsection] = useState(false) // Display Otp Section
    const [otploading, setotploading] = useState(false) // Otp Loading
    const [loading, setloading] = useState(false) // Loading
    const [obj, setobj] = useState({}) // Set Obj
    const [shopkeepers, setshopkeepers] = useState([]) // Set Shopkeepers
    const [otp, setotp] = useState('') // Set Otp
    const [AllState, setAllState] = useState({}) // Set State and Cities
    //  Getting All Shopkeeper
    const getallshopkeepers = async (token) => {
        try {
            const response = await Api.get("/getallShopkeepers", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) setshopkeepers(response.data.result)
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
    // getting All States And Cities
    const getallcityandstate = async (token) => {
        try {
            const response = await Api.get("/getallcitiesandstates", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) setAllState(response.data.result)
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
    //  Set data
    const set = (event) => setobj({ ...obj, [event.target.name]: event.target.value })

    //    Verify Shopkeeper
    const sendotp = async (e) => {
        try {
            e.preventDefault()
            // setotploading(true)
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.post("/verify", obj, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) {
                setdisplayotpsection(true)
            }
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
        } finally {
            setloading(false)
        }
    }
    //    Creating User
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
            const response = await Api.post("/CreateAccount", { ...obj, otp }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })

            
            alert(response?.data.message)
            if (response.status === 201) {
                props.fun(false)
                props.getallusers(userinfo.Authorization)
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
        } finally {
            setloading(false)
            setotploading(false)
        }
    }
    return { displayotpsection, otploading, loading, obj, shopkeepers, otp, AllState, setotp, set, getallcityandstate, getallshopkeepers, sendotp, submit }
}

export default AddShopkeeperService