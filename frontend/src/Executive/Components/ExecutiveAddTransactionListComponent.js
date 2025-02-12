import React, { useState } from 'react'
import Title from "../../CommonComponents/Title"
import Footer from "../../CommonComponents/Footer"
import Api from '../../Api/InstanceApi'
import { useNavigate } from 'react-router-dom'
import ExeAddTransaction from '../Services/ExeAddTransaction'
const ExecutiveAddTransactionListComponent = () => {
  const navigate = useNavigate()
  const { submit, set, loading } = ExeAddTransaction()
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <Title Name="New Transaction" />
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={submit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="desc">Description</label>
                      <textarea className="form-control" onChange={set} name='Description' id="desc" placeholder="Enter Description" rows={3} defaultValue={""} />
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label htmlFor="Reciept No" className="form-label">Reciept No</label>
                          <input id="Reciept No" name="RecieptNo" onChange={set} placeholder="Reciept No" type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="payment">payment</label>
                          <input id="payment" name="payment" onChange={set} placeholder="Enter payment" type="number" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="hstack gap-2 mt-4">
                    <button type="submit" onClick={submit} disabled={loading} className="btn btn-primary">{loading ? "Paying..." : "Pay Now"}</button>
                    <button type="button" onClick={() => navigate("/Executive")} className="btn btn-light">Discard</button>
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

export default ExecutiveAddTransactionListComponent