import React from 'react'
import Footer from '../../CommonComponents/Footer'
import Title from '../../CommonComponents/Title'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
import SubmitExcelService from '../Services/SubmitExcelService'
const ReviewExcelData = (props) => {
    const {Submit} = SubmitExcelService(props)
    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Title Name={"Product List"} />
                    <div className="row pb-4 gy-3">
                        <div className="col-sm-4">
                            <a onClick={Submit} className="btn btn-primary addtax-modal"><i className="las la-plus me-1" />Submit</a>
                        </div>
                        <div className="col-sm-auto ms-auto">
                            <div className="d-flex gap-3">
                                <div className="search-box">
                                    <input type="text" className="form-control" id="searchMemberList" placeholder="Search for Result" />
                                    <i className="las la-search search-icon" />
                                </div>
                                <div>
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
                                                    <th scope="col" style={{ width: '5%' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props?.data && props?.data.length !== 0 ? props?.data?.map((obj, index) => {
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
                                                        <td>
                                                            <div className="dropdown">
                                                                <button className="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="las la-ellipsis-h align-middle fs-18" />
                                                                </button>
                                                                <ul className="dropdown-menu dropdown-menu-end">
                                                                    <li><button className="dropdown-item"><i className="las la-pen fs-18 align-middle me-2 text-muted" />Edit</button></li>
                                                                    <li ><a className="dropdown-item remove-item-btn" ><i className="las la-trash-alt fs-18 align-middle me-2 text-muted" />Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    </tr>)
                                                }) : <tr className='text-center'><td colSpan={9}>No Product Found</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center mb-2 gy-3">
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
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ReviewExcelData
