import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Title from "../../CommonComponents/Title"
import Footer from "../../CommonComponents/Footer"
import Api from '../../Api/InstanceApi'
import FetchProductServices from '../Services/FetchProductServices'
const ExecutiveProductsData = () => {
    const { currentpage,setcurrentpage,totalpages,getallproducts,data,setdata,products}=FetchProductServices()
    const navigate = useNavigate()
    
    useEffect(() => {
        const getdata = async () => {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (userinfo && userinfo.Authorization) return await getallproducts(userinfo.Authorization)
            localStorage.clear()
            return navigate("/")
        }
        getdata()
    }, [])

    return (
        <div>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Title Name="All Products" />
                        <div className="row pb-4 gy-3">
                            <div className="col-sm-auto ms-auto">
                                <div className="d-flex gap-3">
                                    <div className="search-box">
                                        <input type="text" className="form-control" id="searchMemberList" placeholder="Search for Result" />
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
                                        <ul className="nav nav-tabs nav-tabs-custom nav-success mb-3" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true">Page-{currentpage}</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content text-muted pt-2">
                                            <div className="tab-pane active" id="nav-border-top-all" role="tabpanel">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="table-responsive table-card">
                                                            <table className="table table-hover table-nowrap align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr className="text-muted text-uppercase">
                                                                    <th scope='col' style={{ width: '1%' }}>S.No</th>
                                                                        <th scope="col" style={{ width: '16%' }}>Product Name-Model</th>
                                                                        <th scope="col" style={{ width: '16%' }}>Product Description</th>
                                                                        <th scope="col" style={{ width: '8%' }}>Company</th>
                                                                        <th scope="col" style={{ width: '3%' }}>Stock</th>
                                                                        <th scope="col" style={{ width: '5%' }}>Rate(₹)</th>
                                                                        <th scope="col" style={{ width: '3%' }}>Dis.(%)</th>
                                                                        <th scope="col" style={{ width: '3%' }}>Tax(%)</th>
                                                                        <th scope="col" style={{ width: '5%' }}>Price(₹)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {products && products.length !== 0 ? products?.map((obj, index) => {
                                                                        return (<tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{obj?.name + " - " + obj?.model}</td>
                                                                            <td>{obj?.description}</td>
                                                                            <td><span className="badge bg-success-subtle text-success p-2">{obj?.company}</span></td>
                                                                            <td>{obj?.stock}</td>
                                                                            <td>₹{obj?.rate}</td>
                                                                            <td>{obj?.discount}%</td>
                                                                            <td>{obj?.tax}%</td>
                                                                            <td>₹{obj?.price}</td>
                                                                        </tr>)
                                                                    }) : <tr className='text-center'><td colSpan={9}>No Product Found</td></tr>}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2 gy-3">
                                            <div className="col-md-5">
                                                <p className="mb-0 text-muted">Showing <b>{currentpage}</b>  of <b>{totalpages}</b> results</p>
                                            </div>
                                            <div className="col-sm-auto ms-auto">
                                                <nav aria-label="...">
                                                <ul className="pagination mb-0">
                                                        {currentpage !== 1 ? <li style={{ cursor: "pointer" }} className="page-item" onClick={() => setcurrentpage(currentpage - 1)}><span className="page-link">Previous</span></li> : <li className="page-item disabled"><span className="page-link">Previous</span></li>}
                                                        {Array.from({ length: totalpages }, (_, index) => <li key={index} onClick={() => setcurrentpage(index + 1)} className={currentpage === index + 1 ? 'page-item active' : 'page-item'}><a className="page-link">{index + 1}</a></li>)}
                                                        {currentpage !== totalpages ? <li className="page-item" onClick={() => setcurrentpage(currentpage + 1)}><a className="page-link" href="#">Next</a></li> : <li className="page-item disabled"><a className="page-link" href="#">Next</a></li>}
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer /> 
            </div>
        </div>
    )
}

export default ExecutiveProductsData