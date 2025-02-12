import React, { useEffect, useState } from 'react'
import Footer from "../../CommonComponents/Footer"
import Title from "../../CommonComponents/Title"
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
const DashboardComponent = () => {
  const [alltransaction, setalltransaction] = useState({})
  const [allrecenttransaction, setallrecenttransaction] = useState([])
  const [Invoicelist, setInvoicelist] = useState([])
  const navigate = useNavigate()
  const getalltransactions = async (token) => {
    try {
      const response = await Api.get("/GetAllTransaction", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })
      // console.log(response)
      if (response.status === 202) setalltransaction(response?.data.dataobj)
      else alert(response?.data.message)
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
  const getallRecenttransactions = async (token) => {
    try {
      const response = await Api.get("/GetAllRecentTransaction", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })
      if (response.status === 202) setallrecenttransaction(response?.data.result)
      else alert(response?.data.message)
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
  const getallInvoices = async (token) => {
    try {
      const response = await Api.get("/GetAllInvoiceList", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })
      console.log(response)
      if (response.status === 202) setInvoicelist(response?.data.invoices)
      else alert(response?.data.message)
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
  console.log(Invoicelist)
  useEffect(() => {
    const getdata = async () => {
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
      if (userinfo && userinfo.Authorization) {
        await getalltransactions(userinfo.Authorization);
        await getallRecenttransactions(userinfo.Authorization);
        await getallInvoices(userinfo.Authorization);
        return;
      }
      localStorage.clear()
      return navigate("/")
    }
    getdata()
  }, [])
  function getDate(date) {
    if (!date) return '----'
    const d = new Date(date)
    const monthName = d.toLocaleString('default', { month: 'long' });
    return (`${d.getDate()} ${monthName}, ${d.getFullYear()}`)
  }

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <Title Name="Dashboard" />
          <div className="row">
            <div className="col-xl-8">
              <div className="card dash-mini">
                <div className="card-header border-0 align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Overview</h4>
                  <div className="flex-shrink-0">
                    <div className="dropdown card-header-dropdown">
                      <a className="text-reset" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="fw-semibold text-uppercase fs-14">Sort by: </span><span className="text-muted">Current Week<i className="las la-angle-down fs-12 ms-2" /></span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">Today</a>
                        <a className="dropdown-item" href="#">Last Week</a>
                        <a className="dropdown-item" href="#">Last Month</a>
                        <a className="dropdown-item" href="#">Current Year</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-1">
                  <div className="row">
                    <div className="col-lg-4 mini-widget pb-3 pb-lg-0">
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1">
                          <h2 className="mb-0 fs-24 text-black"><span className="counter-value" >₹{alltransaction?.GrandTotalTax ? Math.round(alltransaction.GrandTotalTax) : "0"}/-</span></h2>
                          <h5 className="text-black fs-16 mt-2  mb-0">Tax Collected</h5>
                          <p className="text-muted mt-3 pt-1 mb-0 text-truncate"> <span className="badge bg-info me-1">This year</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mini-widget py-3 py-lg-0">
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1">
                          <h2 className="mb-0 fs-24 text-black"><span className="counter-value">₹{alltransaction?.GrandTotalDiscount ? Math.round(alltransaction.GrandTotalDiscount) : "0"}/-</span></h2>
                          <h5 className="text-black fs-16 mt-2 mb-0">Disount Given</h5>
                          <p className="text-muted mt-3 pt-1 mb-0 text-truncate"> <span className="badge bg-danger me-1">This year</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mini-widget pt-3 pt-lg-0">
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1">
                          <h2 className="mb-0 fs-24 text-black"><span className="counter-value" >₹{alltransaction?.GrandTotalProfit ? Math.round(alltransaction.GrandTotalProfit) : "0"}/-</span></h2>
                          <h5 className="text-black fs-16 mt-2 mb-0">Profit Generated</h5>
                          <p className="text-muted mt-3 pt-1 mb-0 text-truncate"> <span className="badge bg-info me-1">This Year</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div className="card-header border-0 align-items-center d-flex pb-2">
                  <h4 className="card-title mb-0 flex-grow-1">Payment Overview</h4>
                  <div>
                    <div className="dropdown">
                      <a className="text-reset" href="#" id="dropdownMenuYear" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="fw-semibold text-uppercase fs-14">Sort By: </span> <span className="text-muted">Monthly<i className="las la-angle-down fs-12 ms-2" /></span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuYear">
                        <a className="dropdown-item" href="#">Monthly</a>
                        <a className="dropdown-item" href="#">Yearly</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div style={{ height: "30px" }} className="apex-charts" />
                  <div className="row mt-3 text-center">
                    <div className="col-6 border-end">
                      <div className="my-1">
                        <p className="text-black text-truncate mb-2">Received Amount</p>
                        <h4 className="text-black mt-2 mb-0 fs-20">₹{alltransaction?.PaymentRecives ? Math.round(alltransaction.PaymentRecives) : "0"}/-</h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="my-1">
                        <p className="text-black text-truncate mb-2">Sales Generated</p>
                        <h4 className="text-black mt-2 mb-0 fs-20">₹{alltransaction?.GrandTotalAmount ? Math.round(alltransaction.GrandTotalAmount) : "0"}/-</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="card">
                <div className="card-header border-0 align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Invoice List</h4>
                  <div className="dropdown">
                    <a className="text-reset" href="#" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span className="fw-semibold text-uppercase fs-14">Sort By: </span>  <span className="text-muted">Weekly<i className="las la-angle-down fs-12 ms-2" /></span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                      <a className="dropdown-item" href="#">Monthly</a>
                      <a className="dropdown-item" href="#">Yearly</a>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-2">
                  <div className="table-responsive table-card">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr className="text-muted text-uppercase">
                          <th scope="col">#</th>
                          <th scope="col">Invoice ID</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Date</th>
                          <th scope="col" style={{ width: '16%' }}>Amount</th>
                          <th scope="col" style={{ width: '16%' }}>Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          Invoicelist && Invoicelist.reverse().map((obj, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td><p className="mb-0">{obj.InvoiceNo}</p></td>
                                <td><a href='#' className="text-body align-middle">{obj.customerId.name}</a></td>
                                <td>{getDate(obj.createdAt)}</td>
                                <td><span className="badge bg-success-subtle text-success p-2">₹{Math.round(obj.TotalAmount)}/-</span></td>
                                <td><span className="badge bg-primary-subtle text-primary p-2">₹{Math.round(obj.TotalProfit)}/-</span> </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-1">
                    <div className="flex-grow-1">
                      <h5 className="card-title">Recent Transaction</h5>
                    </div>
                  </div>
                  <div className="mx-n3 px-3" data-simplebar style={{ maxHeight: 418 }}>
                    <p className="text-muted mb-0">Recent</p>
                    {
                      allrecenttransaction && allrecenttransaction.map((obj, index) => {
                        return (
                          <div key={index} className="border-bottom sales-history">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-primary rounded-circle fs-3">
                                  <i className="lab la-paypal fs-22" />
                                </span>
                              </div>
                              <div className="flex-grow-1 ms-3 overflow-hidden">
                                <h5 className="fs-15 mb-1 text-truncate">Payment({obj.paymentType})</h5>
                                <p className="fs-14 text-muted text-truncate mb-0">{getDate(obj.createdAt)}</p>
                              </div>
                              <div className="flex-shrink-0">
                                {
                                  obj.paymentType === "credit" ? <span className="badge fs-12 bg-success-subtle text-success">+ ₹{obj.TotalAmount}/-</span> : <span className="badge fs-12 bg-danger-subtle text-danger">- ₹{obj.payment}/-</span>
                                }
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardComponent