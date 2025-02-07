import React, { useEffect, useState } from 'react'
import Api from '../Api/InstanceApi'
import { useNavigate } from 'react-router-dom'

const LoginServices = () => {
    const [obj, setobj] = useState({})
    const [rememberme, setrememberme] = useState(false)
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const set = (e) => setobj({ ...obj, [e.target.name]: e.target.value })
    const submit = async (e) => {

        try {
            e.preventDefault()
            setloading(true)
            const resp = await Api.post('/Login', obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            alert(resp?.data?.message)
            if (resp.status === 202) {
                localStorage.clear()
                localStorage.setItem("Userinfo", JSON.stringify({ "Authorization": resp.data.resultObj.token, "Rememberme": rememberme }))
                navigate("/" + resp.data.resultObj.role)
            }
            setloading(false)
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('No response from server');
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }
    useEffect(() => {
        const getdata = async () => {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (userinfo && userinfo.Rememberme) return await fetchuserdetails(userinfo.Authorization, userinfo.Rememberme)
        }
        getdata()
    }, [])
    const fetchuserdetails = async (token, remember) => {
        try {
            const resp = await Api.post('/fetchuserdetails', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                }
            });
            console.log(resp.data)
            alert(resp?.data?.message)
            if (resp.status === 202) {
                localStorage.clear()
                localStorage.setItem("Userinfo", JSON.stringify({ "Authorization": resp.data.token, "Rememberme": remember }))
                navigate("/" + resp?.data?.role, { replace: true })
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('No response from server');
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }
    return { submit, set, loading, rememberme, setrememberme };
}

export default LoginServices