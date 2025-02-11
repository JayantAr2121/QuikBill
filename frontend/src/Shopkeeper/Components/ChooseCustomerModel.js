import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Api from '../../Api/InstanceApi'
import ChooseCustomerServices from '../Services/ChooseCustomerServices'
const ChooseCustomerModal = (props) => {
    const { getallitems, search, searched, data, setsearch, setsearched } = ChooseCustomerServices()
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

    console.log(searched)
    return (
        <div>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Search your Customer</h5>
                            <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="app-search me-2">
                                        <div className="position-relative">
                                            <input type="text" onChange={(e) => setsearch(e.target.value)} className="form-control custominputwidth" placeholder="Search..." autoComplete="off" />
                                            <span className="las la-search search-widget-icon" />
                                            <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" />
                                        </div>
                                    </form>
                                    {
                                        search && searched && searched.length !== 0 && <table className='table table-bordered table-striped table-hover'>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                    <th>Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    searched?.map((obj, index) => {
                                                        return (
                                                            <tr style={{ cursor: "pointer" }} onClick={() => { props.setcustomer(obj); props.setToggle(false) }} key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{obj?.name}</td>
                                                                <td>{obj?.phone}</td>
                                                                <td>₹{obj?.balance}/-</td>
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
export default ChooseCustomerModal