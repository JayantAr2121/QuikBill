import React from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
const UpdateProductService = (props) => {
    const set = (event) => { props.setobj({ ...props.obj, [event.target.name]: event.target.value }) }
    const navigate = useNavigate()
    const updateproduct = async (e) => {
        try {
            e.preventDefault()
            props.setloading(true)
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.put('/UpdateProduct/' + props.id, props.obj, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data?.message)
            if (response.status === 202) { await props.getallproducts(userinfo.Authorization); props.setToggle(false); props.setid(null); props.setobj({}) }
            props.setloading(false)
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
    return { updateproduct, set }
}

export default UpdateProductService