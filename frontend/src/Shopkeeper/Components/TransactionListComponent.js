import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from "../../CommonComponents/Footer"
import Title from "../../CommonComponents/Title"
import Api from '../../Api/InstanceApi'
import TransactionListServices from '../Services/TransactionListServices'
const TransactionListComponent = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const getdata = async () => {
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
      const customerinfo = JSON.parse(localStorage.getItem("Customerinfo"))
      if (userinfo && userinfo.Authorization && customerinfo && customerinfo.id) return await getalltransactions(userinfo.Authorization, customerinfo.id)
      localStorage.clear()
      return navigate("/")
    }
    getdata()
  }, [])
  const {getalltransactions,transactions}=TransactionListServices()
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <Title Name="Transaction" />
          <div className="row pb-4 gy-3">
            <div className="col-sm-4">
              <Link to={'/AddTransaction'} className="btn btn-primary"><i className="las la-plus me-1" />Add Transaction</Link>
            </div>
            <div className="col-sm-auto ms-auto">
              <div className="d-flex gap-3">
                <div className="search-box">
                  <input type="text" className="form-control" id="searchMemberList" placeholder="Search for result" />
                  <i className="las la-search search-icon" />
                </div>
                <div className>
                  <button type="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false" className="btn btn-soft-info btn-icon fs-14"><i className="las la-ellipsis-v fs-18" /></button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                    <li><a className="dropdown-item" href="#">All</a></li>
                    <li><a className="dropdown-item" href="#">Last Week</a></li>
                    <li><a className="dropdown-item" href="#">Last Month</a></li>
                    <li><a className="dropdown-item" href="#">Last Year</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-hover table-nowrap align-middle mb-0">
                      <thead>
                        <tr className="text-muted text-uppercase">
                          <th scope="col">Transaction Id</th>
                          <th scope="col">Date</th>
                          <th scope="col">Credit / Debit</th>
                          <th scope="col">Amount/Payment</th>
                          <th scope="col">Tax</th>
                          <th scope="col">Discount</th>
                          <th scope="col">Profit</th>
                          <th scope="col">Get Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions && transactions.length !== 0 && transactions?.map((transaction, index) => (
                          <tr key={index}>
                            <td>{transaction.InvoiceNo || transaction.RecieptNo}</td>
                            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                            <td>{transaction.paymentType}</td>
                            <td>₹{transaction.TotalAmount || transaction.payment}/-</td>
                            <td>{transaction.TotalTax ? `₹ ${transaction.TotalTax} /-` : " - "}</td>
                            <td>{transaction.TotalDiscount ? `₹${transaction.TotalDiscount}/-` : " - "}</td>
                            <td>{transaction.TotalProfit ? `₹${transaction.TotalProfit}/-` : " - "}</td>
                            <td>{transaction.TotalProfit ? <button type='button' className='btn btn-primary' onClick={()=>{localStorage.setItem("InvoiceInfo",JSON.stringify({id:transaction._id}));navigate("/GenerateInvoice")}} >Get Invoice</button>: " - "}</td>
                          </tr>

                        ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row align-items-center mb-4 gy-3">
            <div className="col-md-5">
              <p className="mb-0 text-muted">Showing <b>1</b> to <b>5</b> of <b>10</b> results</p>
            </div>
            <div className="col-sm-auto ms-auto">
              <nav aria-label="...">
                <ul className="pagination mb-0">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item" aria-current="page">
                    <span className="page-link">2</span>
                  </li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TransactionListComponent