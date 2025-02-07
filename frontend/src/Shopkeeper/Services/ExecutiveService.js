import React, { useEffect, useState } from 'react'
import Api from '../../Api/InstanceApi'
import { useNavigate } from 'react-router-dom'
const ExecutiveService = () => {
    const [data, setdata] = useState([])
    const navigate = useNavigate()
    const [users, setusers] = useState([])
    const [currentpage, setcurrentpage] = useState(1)
    const [totalpages, settotalpages] = useState(0)
    const usersperpage = 5
    useEffect(() => {
        if (data.length !== 0) {
            const indexoflastuser = currentpage * usersperpage;
            const indexoffirstuser = indexoflastuser - usersperpage;
            const currentusers = data.slice(indexoffirstuser, indexoflastuser);
            const totalpage = Math.ceil(data.length / usersperpage);
            setusers(currentusers)
            settotalpages(totalpage)
        }
    }, [data, currentpage])
    const getallexecutives = async (token) => {
        try {
            const result = await Api.get('/getallExecutives', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            if (result.status === 201) setdata(result.data.users)
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
    const makeenable = async (id) => {
        try {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            console.log(userinfo.Authorization)
            console.log(id)
            const result = await Api.put('/enableExecutive', { "id": id }, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': userinfo.Authorization
                }
            })

            alert(result?.data.message)
            if (result.status === 202) await getallexecutives(userinfo.Authorization);
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
    const makedisable = async (id) => {
        try {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            console.log(userinfo.Authorization)
            console.log(id)
            const result = await Api.put('/disableExecutive', { "id": id }, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': userinfo.Authorization
                }
            })

            alert(result?.data.message)
            if (result.status === 202) await getallexecutives(userinfo.Authorization);
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
    return {makedisable,makeenable,getallexecutives,data,users,currentpage,totalpages,setcurrentpage}
}

export default ExecutiveService