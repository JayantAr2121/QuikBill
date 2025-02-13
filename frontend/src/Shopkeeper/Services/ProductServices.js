import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'

const ProductServices = () => {
    const [EditProductToggle, setEditProductToggle] = useState(false)
    const [data, setdata] = useState([])
    const [editproductid, seteditproductid] = useState(null)
    const [editobj, seteditobj] = useState({})
    const [editloading, seteditloading] = useState(false)
    const [products, setproducts] = useState([])
    const [currentpage, setcurrentpage] = useState(1)
    const [totalpages, settotalpages] = useState(0)
    const productsperpage = 5
    const navigate = useNavigate()
    useEffect(() => {
        if (data.length !== 0) {
            const indexoflastproduct = currentpage * productsperpage;
            const indexoffirstproduct = indexoflastproduct - productsperpage;
            const currentproducts = data.slice(indexoffirstproduct, indexoflastproduct);
            const totalpage = Math.ceil(data.length / productsperpage);
            setproducts(currentproducts)
            settotalpages(totalpage)
        }
    }, [data, currentpage])
    const getallproducts = async (token) => {
        try {
            const resp = await Api.get("/Getproducts", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
            if (resp.status === 200) setdata(resp.data.allproducts)
            else alert(resp?.message)
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('No response from server');
            } else {
                console.log('An unexpected error occurred');
            }
        }finally{
            seteditloading(false)
        }
    }
    const deleteproduct = async (id) => {
        try {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            const response = await Api.delete("/DeleteProduct/" + id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) { await getallproducts(userinfo.Authorization) }
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
    const editproduct = (id) => {
        const editproductitem = data?.filter(obj => obj._id === id)
        const { name, model, description, company, rate, tax, discount, price, stock, _id } = editproductitem[0]
        seteditobj({ name, model, description, company, rate, tax, discount, price, stock })
        seteditproductid(_id)
        setEditProductToggle(true)
    }
    return { EditProductToggle, setEditProductToggle, data, editproductid, editobj, editloading, products, currentpage, totalpages, getallproducts, deleteproduct, editproduct, setcurrentpage, seteditloading, seteditobj, seteditproductid }
}

export default ProductServices