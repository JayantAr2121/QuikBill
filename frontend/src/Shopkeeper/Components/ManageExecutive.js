import React, { useEffect, useState } from 'react'
import Footer from '../../CommonComponents/Footer'
import Title from '../../CommonComponents/Title'
import CreateExecutiveModal from './CreateExecutiveModal'
import { useNavigate } from 'react-router-dom'
import ExecutiveService from '../Services/ExecutiveService'

const ManageExecutive = () => {
    const navigate = useNavigate()

    const [Toggle, setToggle] = useState(false)
    const {makedisable,makeenable,getallexecutives,data,users,currentpage,totalpages,setcurrentpage}= ExecutiveService()
    useEffect(() => {
        const getdata = async () => {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (userinfo && userinfo.Authorization) return await getallexecutives(userinfo.Authorization)
            localStorage.clear()
            return navigate('/')
        }
        getdata()
    }, [])
    
    return (
        <div>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Title Name={"Taxes"} />
                        <div className="row pb-4 gy-3">
                            <div className="col-sm-4">
                                <button onClick={() => setToggle(true)} className="btn btn-primary addtax-modal"><i className="las la-plus me-1" /> Add Executive</button>
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
                                                <thead>
                                                    <tr className="text-muted text-uppercase">
                                                        <th scope="col" style={{ width: '10%' }}>Name</th>
                                                        <th scope="col" style={{ width: '10%' }}>Phone</th>
                                                        <th scope="col" style={{ width: '22%' }}>Email</th>
                                                        <th scope="col" style={{ width: '13%' }}>Address</th>
                                                        <th scope="col" style={{ width: '12%' }}>City/State</th>
                                                        <th scope="col" style={{ width: '8%' }}>Service</th>
                                                        <th scope="col" style={{ width: '8%' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users && users.length !== 0 ? users?.map((obj, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{obj?.name}</td>
                                                                    <td>{obj?.phone}</td>
                                                                    <td>{obj?.email}</td>
                                                                    <td>{obj?.address}</td>
                                                                    <td>{obj?.city + " - " + obj?.state}</td>
                                                                    <td>{obj?.service ? <span className="badge bg-success-subtle text-success p-2">Enabled</span> : <span className="badge bg-danger-subtle text-danger p-2">Disabled</span>}</td>
                                                                    <td>
                                                                        <div className="form-check form-switch">
                                                                            {obj?.service ? <input className="form-check-input" checked={true} onChange={() => makedisable(obj._id)} type="checkbox" role="switch" id="switch1" /> : <input className="form-check-input" checked={false} onChange={() => makeenable(obj._id)} type="checkbox" role="switch" id="switch1" />}
                                                                            <label className="form-check-label" htmlFor="switch1" />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) : <tr><td className='text-center' colSpan={7}>No user found</td></tr>
                                                    }
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
                <Footer />
            </div>
            {Toggle && <CreateExecutiveModal getallexecutives={getallexecutives} fun={setToggle} />}
        </div>
    )
}

export default ManageExecutive