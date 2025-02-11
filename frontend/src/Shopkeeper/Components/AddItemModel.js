import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Api from '../../Api/InstanceApi'
import AddItemServices from '../Services/AddItemServices'
const AddItemModal = (props) => {
    const { search, searched, setsearch, setsearched, getallitems, data } = AddItemServices()
    const navigate = useNavigate()

    useEffect(() => {
        const getdata = async () => {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (userinfo && userinfo.Authorization) return await getallitems(userinfo.Authorization)
            localStorage.clear()
            return navigate("/")
        }
        getdata()
    }, [])

    return (
        <div>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Search for product</h5>
                            <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="app-search me-2">
                                        <div className="position-relative">
                                            <input onChange={(event) => setsearch(event.target.value)} type="text" className="form-control custominputwidth" placeholder="Search..." autoComplete="off" />
                                            <span className="las la-search search-widget-icon" />
                                            <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" />
                                        </div>
                                    </form>
                                    {
                                        search && searched && searched.length !== 0 && <table className='table table-bordered table-striped table-hover'>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Product Name & Model</th>
                                                    <th>Company</th>
                                                    <th>Price</th>
                                                    <th>Tax</th>
                                                    <th>Disc.</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    searched?.map((obj, index) => {
                                                        return (
                                                            <tr style={{ cursor: "pointer" }} onClick={() => { props.setitems([...props.items, { ...obj, "quantity": 1 }]); props.setToggle(false); setsearch("") }} key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{obj?.name + " - " + obj?.model}</td>
                                                                <td>{obj?.company}</td>
                                                                <td>₹{obj?.price}/-</td>
                                                                <td>{obj?.tax}%</td>
                                                                <td>{obj?.discount}%</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddItemModal