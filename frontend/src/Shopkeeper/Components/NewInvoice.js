import React, { useEffect, useState } from 'react'
import Title from '../../CommonComponents/Title'
import Footer from '../../CommonComponents/Footer'
import ChooseCustomerModal from './ChooseCustomerModel'
import AddItemModal from './AddItemModel'
import NewInvoiceServices from '../Services/NewInvoiceServices'
import { useNavigate } from 'react-router-dom'
const NewInvoice = ({ setinvoices }) => {
    const [ChooseCustomerToggle, setChooseCustomerToggle] = useState(false)
    const [AddItemModalToggle, setAddItemModalToggle] = useState(false)
    const { submit, remove, changediscount, removequantity, addquantity, loading, result, items, customer, setitems, setcustomer } = NewInvoiceServices({ setinvoices })
    const navigate = useNavigate()
    return (

        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Title Name={"New Invoice"} />
                    <div className="row justify-content-center">
                        <div className="col-xxl-9">
                            <div className="card">
                                <form onSubmit={submit} className="needs-validation" noValidate id="invoice_form">
                                    <div className="card-body border-bottom border-bottom-dashed p-4">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="row g-3">
                                                    <div className="col-lg-8 col-sm-6">
                                                        <label htmlFor="invoicenoInput">Select Customer</label>
                                                        <div className="input-light">
                                                            <a onClick={() => setChooseCustomerToggle(!ChooseCustomerToggle)} id="add-item" className="btn btn-soft-secondary fw-medium"><i className="ri-add-fill me-1 align-bottom" />Choose Customer</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-sm-6">
                                                <div><label htmlFor="billingName" className="text-muted text-uppercase fw-semibold">Billing Address</label></div>
                                                <div className="mb-2">
                                                    <input value={customer?.name ? customer?.name : ""} readOnly={true} type="text" className="form-control bg-light border-0" id="billingName" placeholder="Full Name" required />
                                                </div>
                                                <div className="mb-2">
                                                    <textarea value={customer?.address ? customer?.address : ""} readOnly={true} className="form-control bg-light border-0" id="billingAddress" rows={3} placeholder="Address" required />
                                                </div>
                                                <div className="mb-2">
                                                    <input value={customer?.phone ? customer?.phone : ""} readOnly={true} type="text" className="form-control bg-light border-0" id="billingPhoneno" placeholder="Phone" required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="table-responsive">
                                            <table className="invoice-table table table-borderless table-nowrap mb-0">
                                                <thead className="align-middle">
                                                    <tr className="table-active">
                                                        <th scope="col" style={{ width: 50 }}>#</th>
                                                        <th scope="col" style={{ width: 300 }}>Product Details</th>
                                                        <th scope="col"><div className="d-flex text-center currency-select input-light align-items-center">Price(₹)</div></th>
                                                        <th scope="col" style={{ width: 150, textAlign: "center" }}>Quantity</th>
                                                        <th scope="col" style={{ width: 12 }}>Tax(%)</th>
                                                        <th scope="col" style={{ width: 12 }}>Disc.(%)</th>
                                                        <th scope="col" className='text-center' style={{ width: 120 }}>Amount(₹)</th>
                                                        <th scope="col" className="text-end"></th>
                                                    </tr>
                                                </thead>
                                                <tbody id="newlink">
                                                    {
                                                        items && items.length !== 0 && items?.map((item, index) => {
                                                            return (
                                                                <tr key={index} id={index + 1} className="product">
                                                                    <th scope="row" className="product-id">{index + 1}</th>
                                                                    <td className="text-start">
                                                                        <div className="mb-2">
                                                                            <input type="text" readOnly={true} value={item?.name} className="form-control bg-light border-0" id="productName-1" placeholder="Product Name" required />
                                                                        </div>
                                                                        <input type='text' readOnly={true} value={item?.description} className="form-control bg-light border-0" id="productDetails-1" placeholder="Product Details" />
                                                                    </td>
                                                                    <td><input type="number" readOnly={true} value={item?.price} className="form-control product-price bg-light border-0" id="productRate-1" required /></td>
                                                                    <td>
                                                                        <div className="input-step">
                                                                            <button type="button" onClick={() => removequantity(item)} className="minus">–</button>
                                                                            <input readOnly={true} type="number" className="product-quantity" id="product-qty-1" value={item?.quantity} />
                                                                            <button type="button" onClick={() => addquantity(item)} className="plus" >+</button>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" value={item?.tax} className="form-control bg-light border-0 product-line-price" id="productPrice-1" readOnly={true} />
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" onChange={(event) => changediscount(event.target.value, item)} value={item?.discount} className="form-control bg-light border-0 product-line-price" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" value={item?.price * item?.quantity} className="form-control bg-light border-0 product-line-price" id="productPrice-1" readOnly={true} />
                                                                    </td>
                                                                    <td className="text-end product-removal"><a onClick={() => remove(item)} s style={{ fontSize: "25px" }} className="btn btn-success">&times;</a></td>
                                                                </tr>)
                                                        })
                                                    }
                                                </tbody>
                                                <tbody>
                                                    <tr id="newForm" style={{ display: 'none' }}><td className="d-none" colSpan={5}><p>Add New Form</p></td></tr>
                                                    <tr>
                                                        <td colSpan={5}><a onClick={() => setAddItemModalToggle(!AddItemModalToggle)} id="add-item" className="btn btn-soft-secondary fw-medium"><i className="ri-add-fill me-1 align-bottom" /> Add Item</a></td>
                                                    </tr>
                                                    <tr className="border-top border-top-dashed mt-2">
                                                        <td colSpan={4} />
                                                        <td colSpan={4} className="p-0">
                                                            <table className="table table-borderless table-sm table-nowrap align-middle mb-0">
                                                                <tbody>
                                                                    <tr>
                                                                        <th scope="row">Sub Total</th>
                                                                        <td style={{ width: 150 }}><input type="number" value={result?.subtotal ? result?.subtotal : ""} className="form-control bg-light border-0" id="cart-subtotal" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Total Tax</th>
                                                                        <td><input type="number" value={result?.totaltax ? result.totaltax : ""} className="form-control bg-light border-0" id="cart-tax" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Total Discount <small className="text-muted">(QuickBill-10%)</small></th>
                                                                        <td><input type="number" value={result?.totaldiscount ? result.totaldiscount : ""} className="form-control bg-light border-0" id="cart-discount" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                    <tr className="border-top border-top-dashed">
                                                                        <th scope="row">Total Amount</th>
                                                                        <td><input type="number" value={result?.grandtotal ? result.grandtotal : ""} className="form-control bg-light border-0" id="cart-total" placeholder="$0.00" readOnly /></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label text-muted text-uppercase fw-semibold">NOTES</label>
                                            <textarea className="form-control alert alert-info" id="exampleFormControlTextarea1" placeholder="Notes" rows={2} required defaultValue={"All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above."} />
                                        </div>
                                        <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                            <button type="submit" disabled={loading} className="btn btn-info"><i className="ri-printer-line align-bottom me-1" />{loading ? "Saving...." : "Save Invoice"}</button>
                                            <a onClick={() => navigate("/Shopkeeper")} className="btn btn-danger"><i className="ri-send-plane-fill align-bottom me-1" />Discard</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {ChooseCustomerToggle && <ChooseCustomerModal setcustomer={setcustomer} setToggle={setChooseCustomerToggle} />}
            {AddItemModalToggle && <AddItemModal items={items} setitems={setitems} setToggle={setAddItemModalToggle} />}
            <Footer />
        </div>
    )
}

export default NewInvoice