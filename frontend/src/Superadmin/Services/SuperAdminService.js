import React, { useEffect, useState } from 'react'
import Api from '../../Api/InstanceApi'
import { useNavigate } from 'react-router-dom'
const SuperAdminService = () => {
    const [data, setdata] = useState([]) // getting  Data 
    const [users, setusers] = useState([]) // getting All Users
    const [currentpage, setcurrentpage] = useState(1) // Pagination
    const [totalpages, settotalpages] = useState(0) // Pagination
    const usersperpage = 5 //  Pagination
    const navigate = useNavigate()
    useEffect(() => {
        if (data.length !== 0) {
            const indexoflastuser = currentpage * usersperpage;
            const indexoffirstuser = indexoflastuser - usersperpage;
            const currentusers = data.slice(indexoffirstuser, indexoflastuser);
            const totalpage = Math.ceil(data.length / usersperpage);
            setusers(currentusers)
            settotalpages(totalpage)
        }
    }, [data, currentpage]) // Pagination 
    const getallusers = async (token) => {
        try {
            const response = await Api.get('/Getallusers', {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': token
                }
            })
            if (response.status === 202) setdata(response.data.users)
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
    } // all Users
    const makeenable = async (id) => {
        try {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.put("/enableUser", { id }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) await getallusers(userinfo.Authorization);
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
    } // Service Enable 
    const makedisable = async (id) => {
        try {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.put("/disableUser", { id }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) await getallusers(userinfo.Authorization);
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
    }// Service Enable  
    return { getallusers, makedisable, makeenable, users, setcurrentpage, currentpage, totalpages }
}

export default SuperAdminService