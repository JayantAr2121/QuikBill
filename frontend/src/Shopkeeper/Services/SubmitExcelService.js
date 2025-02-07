import React from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
const SubmitExcelService = (props) => {
    const navigate = useNavigate()
    const Submit = async () => {
        try {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.post("/addmultipleproducts", { items: props?.data }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 201) navigate("/AllProducts")
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
    return { Submit }
}

export default SubmitExcelService