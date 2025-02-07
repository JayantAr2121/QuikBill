import React, { useState } from 'react'

import AddproductService from '../Services/AddproductService'
const AddProductModal = (props) => {
    const { AddProduct,set,loading}=AddproductService(props)

    return (
        <div>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Add Product</h5>
                            <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={AddProduct} >
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Name" className="form-label">Product Name</label>
                                                <input type="text" name='name' onChange={set} className="form-control" id="Name" placeholder="Enter Name" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Model" className="form-label">Product Model</label>
                                                <input type="text" name='model' onChange={set} className="form-control" id="Model" placeholder="Enter Model" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Description" className="form-label">Product Description</label>
                                                <input type="text" name='description' onChange={set} className="form-control" id="Description" placeholder="Enter Description" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Company" className="form-label">Product Company</label>
                                                <input type="text" name='company' onChange={set} className="form-control" id="Company" placeholder="Enter Company" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Rate" className="form-label">Rate(₹)</label>
                                                <input type="number" name='rate' onChange={set} className="form-control" id="Rate" placeholder="Enter Rate" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Price" className="form-label">Price(₹)</label>
                                                <input type="number" name='price' onChange={set} className="form-control" id="Price" placeholder="Enter Price" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-4">
                                                <label htmlFor="Discount" className="form-label">Discount(%)</label>
                                                <input type="number" name='discount' onChange={set} className="form-control" id="Discount" placeholder="Enter Discount" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="Tax" className="form-label">Tax(%)</label>
                                                <input type="number" name='tax' onChange={set} className="form-control" id="Tax" placeholder="Enter Tax" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="Stock" className="form-label">Stock</label>
                                                <input type="number" name='stock' onChange={set} className="form-control" id="Stock" placeholder="Enter Stock" />
                                            </div>
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" onClick={() => props.setToggle(false)} >Close</button>
                                            <button type="submit" className="btn btn-success" id="addNewMember">{loading?"Adding..":"Add Product"}</button>
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

export default AddProductModal