import React, { useEffect, useState } from 'react'
import Api from '../../Api/InstanceApi'

const FetchProductServices = () => {

    const [data, setdata] = useState([])
    const [products, setproducts] = useState([])
    const [currentpage, setcurrentpage] = useState(1)
    const [totalpages, settotalpages] = useState(0)
    const productsperpage = 5
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
        }
    }
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
    return { currentpage,setcurrentpage,totalpages,getallproducts,data,setdata,products}
}

export default FetchProductServices