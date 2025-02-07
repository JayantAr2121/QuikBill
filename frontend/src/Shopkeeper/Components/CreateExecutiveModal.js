import React, { useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import CreateExecutiveServices from '../Services/CreateExecutiveServices'
const CreateExecutiveModal = (props) => {
    const  { displayotpsection,otploading,loading,obj,otp,data,setotp,setdata,set,sendotp,submit,getallcityandstate}=CreateExecutiveServices(props)
    const navigate = useNavigate()
    
    useEffect(() => {
        const getdata = async () => {
            const userinfo = JSON.parse(localStorage.getItem("Userinfo"))
            if (userinfo && userinfo.Authorization) return await getallcityandstate(userinfo.Authorization)
            localStorage.clear()
            return navigate("/")
        }
        getdata()
    }, [])
    
    return (
        <div>
            <div className="modal fade show" style={{ display: "block" }} id="addtaxModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0">
                        <div className="modal-header p-4 pb-0">
                            <h5 className="modal-title" id="createMemberLabel">Add Payment</h5>
                            <button onClick={() => props.fun(false)} type="button" className="btn-close" id="createMemberBtn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            {displayotpsection ? <form onSubmit={submit}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label htmlFor="OTP" className="form-label">OTP is sent on the given email address:-</label>
                                            <input type="number" onChange={(event) => setotp(event.target.value)} className="form-control" id="OTP" placeholder="Enter OTP" />
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" onClick={() => props.fun(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" disabled={loading} className="btn btn-success" id="addNewMember">{loading ? "Creating..." : "Create Executive"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form> : <form onSubmit={sendotp}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Name" className="form-label">Name</label>
                                                <input type="text" name='name' onChange={set} className="form-control" id="Name" placeholder="Enter Name" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Phone" className="form-label">Phone</label>
                                                <input type="tel" name='phone' onChange={set} className="form-control" id="Phone" placeholder="Enter Phone" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-6">
                                                <label htmlFor="Email" className="form-label">Email</label>
                                                <input type="email" name='email' onChange={set} className="form-control" id="Email" placeholder="Enter Email" />
                                            </div>
                                            <div className="col-lg-6">
                                                <label htmlFor="Password" className="form-label">Password</label>
                                                <input type="password" name='password' onChange={set} className="form-control" id="Password" placeholder="Enter Password" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-12">
                                                <label htmlFor="Address" className="form-label">Address</label>
                                                <input type="text" name='address' onChange={set} className="form-control" id="Address" placeholder="Enter Address" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            {
                                                data && Object.keys(data).length !== 0 && <div className="col-6">
                                                    <div className="mb-4">
                                                        <label htmlFor="State" className="form-label">State</label>
                                                        <select className="form-select" onChange={set} name='state' aria-label="Default select example">
                                                            <option value="None">Select State</option>
                                                            {Object.keys(data)?.map((state, index) => <option key={index} value={state}>{state}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                data && Object.keys(data).length !== 0 && obj?.state && obj?.state !== "None" && <div className="col-6">
                                                    <div className="mb-4">
                                                        <label htmlFor="City" className="form-label">City/Town</label>
                                                        <select className="form-select" onChange={set} name='city' aria-label="Default select example">
                                                            <option value="None">Select City/Town</option>
                                                            {data[obj?.state]?.map((city, index) => <option key={index} value={city}>{city}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="hstack gap-2 justify-content-center">
                                            <button type="button" onClick={() => props.fun(false)} className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" disabled={otploading} className="btn btn-success" id="addNewMember">{otploading ? "Sending..." : "Send OTP"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </div>
    )
}

export default CreateExecutiveModal
