import React from 'react'

import UpdateProductService from '../Services/UpdateProductService'

const EditProductModal = (props) => {
const  {updateproduct,set} =UpdateProductService(props)
    return (
        <div>
            <div class="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: "block" }} id="addpaymentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Edit Product</h5>
                            <button type="button" onClick={() => props.setToggle(false)} className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={updateproduct} >
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Name" className="form-label">Product Name</label>
                                                <input type="text" name='name' value={props?.obj?.name ? props?.obj?.name : ""} onChange={set} className="form-control" id="Name" placeholder="Enter Product Name" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Model" className="form-label">Product Model</label>
                                                <input type="text" name="model" value={props?.obj?.model ? props?.obj?.model : ""} onChange={set} className="form-control" id="Model" placeholder="Enter Product Model" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Description" className="form-label">Description</label>
                                                <input type="text" className="form-control" value={props?.obj?.description ? props?.obj?.description : ""} onChange={set} name='description' id="Description" placeholder="Enter Description" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Company" className="form-label">Company</label>
                                                <input type="text" className="form-control" value={props?.obj?.company ? props?.obj?.company : ""} onChange={set} name='company' id="Company" placeholder="Enter Company" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Rate" className="form-label">Rate(₹)</label>
                                                <input type="number" className="form-control" value={props?.obj?.rate ? props?.obj?.rate : ""} onChange={set} name='rate' id="Rate" placeholder="Enter Rate" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Price" className="form-label">Price(₹)</label>
                                                <input type="number" name='price' className="form-control" value={props?.obj?.price ? props?.obj?.price : ""} onChange={set} id="Price" placeholder="Enter Price" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-4">
                                                <label htmlFor="Discount" className="form-label">Discount(%)</label>
                                                <input type="number" className="form-control" name='discount' value={props?.obj?.discount ? props?.obj?.discount : ""} onChange={set} id="Discount" placeholder="Enter Discount" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="Tax" className="form-label">Tax(%)</label>
                                                <input type="number" name='tax' className="form-control" id="Tax" value={props?.obj?.tax ? props?.obj?.tax : ""} onChange={set} placeholder="Enter Tax" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="Stock" className="form-label">Stock</label>
                                                <input type="number" name='stock' className="form-control" id="Stock" value={props?.obj?.stock ? props?.obj?.stock : ""} onChange={set} placeholder="Enter Stock" />
                                            </div>
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" onClick={() => props.setToggle(false)} >Close</button>
                                            <button type="submit" disabled={props.loading} className="btn btn-success" id="addNewMember">{props.loading ? "Updating..." : "Update Product"}</button>
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

export default EditProductModal