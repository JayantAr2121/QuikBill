import React, { useEffect, useState } from 'react'
import Api from '../../Api/InstanceApi'
import { useNavigate } from 'react-router-dom'

const ExeCreateInvoice = ({ setinvoices }) => {
    const navigate = useNavigate()
    const [items, setitems] = useState([])
    const [customer, setcustomer] = useState({})
    const [result, setresult] = useState({})
    const [loading, setloading] = useState(false)

    const addquantity = (obj) => {
        obj.quantity += 1
        setitems(items.map(item => item._id === obj._id ? obj : item))
    }
    const removequantity = (obj) => {
        if (obj.quantity <= 1) {
            setitems(items.filter(item => item._id !== obj._id))
        } else {
            obj.quantity -= 1
            setitems(items.map(item => item._id === obj._id ? obj : item))
        }
    }
    const changediscount = (updateddiscount, obj) => {
        obj.discount = updateddiscount
        setitems(items.map(item => item._id === obj._id ? obj : item))
    }
    const remove = (obj) => {
        setitems(items.filter(item => item._id !== obj._id))
    }

    useEffect(() => {
        let subtotal = 0
        let totaltax = 0
        let totaldiscount = 0
        items?.map(item => {
            subtotal += item.quantity * item.price
            totaltax += item.quantity * (item.price * item.tax) / 100
            totaldiscount += item.quantity * (item.price * item.discount) / 100
        })
        const grandtotal = subtotal + totaltax - totaldiscount
        setresult({ grandtotal, subtotal, totaltax, totaldiscount });
    }, [items])
    const submit = async (e) => {
        try {
            e.preventDefault()
            setloading(true)
            const userinfo = JSON.parse(localStorage.getItem('Userinfo'))
            if (!userinfo || !userinfo.Authorization) {
                localStorage.clear();
                alert("Unauthorised user")
                window.history.replaceState(null, null, "/")
                return navigate("/", { replace: true })
            }
            if (!customer._id) return alert("Choose your Customer")
            if (items.length === 0) return alert("Add products to your invoice")
            const ordereditems = items.map(item => ({ id: item._id, quantity: item.quantity }))
            const response = await Api.post("/createInvoice/" + customer._id, { "ordereditems": ordereditems }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userinfo.Authorization
                }
            })
            alert(response?.data.message)
            if (response.status === 202) {
                setinvoices(response.data)
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
        } finally {
            setloading(false)
        }
    }
    return { submit, remove, changediscount, removequantity, addquantity, loading, result, customer, items, setcustomer, setitems }
}

export default ExeCreateInvoice