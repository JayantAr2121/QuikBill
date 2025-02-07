import React, { useState } from 'react'
import Api from '../../Api/InstanceApi.js'
import { useNavigate } from 'react-router-dom'
import AddCustomersServices from '../Services/AddCustomersServices.js'
const AddCustomerModal = (props) => {
    const {submit,set,loading,setloading}= AddCustomersServices(props)
    return (
        <div>
            <div class="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{display:"block"}} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Add Customer</h5>
                            <button type="button" onClick={()=>props.setToggle(false)}  className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={submit}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label htmlFor="Name" className="form-label">Customer Name</label>
                                            <input type="text" onChange={set} name='name' className="form-control" id="Name" placeholder="Enter Customer Name" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="paymentdetails" className="form-label">Customer Address</label>
                                            <input className="form-control" onChange={set} name='address' placeholder="Enter Customer Address" id="paymentdetails" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="amount" className="form-label">Customer Phone</label>
                                            <input type="number" name='phone' onChange={set} className="form-control" id="amount" placeholder="Enter Customer Phone No." />
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" onClick={()=>props.setToggle(false)} >Close</button>
                                            <button type="submit" className="btn btn-success" id="addNewMember">{loading?"Adding....":"Add Customer"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCustomerModal