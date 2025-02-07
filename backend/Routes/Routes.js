const express = require("express")
const Routes = express.Router()
const { User, Shopkeeper, Executive } = require('../Model/UserModel/UserModel')
const { otpGenerator, verifyOtp } = require('../Services/otp/Otp')
const EmailSender = require('../Services/Email/emailSender')
const Product = require("../Model/ProductModel/Product.model")
const Customer = require("../Model/CustomerModel/Customer.js")
const jwt = require("jsonwebtoken");
const checkuserdetails = require("../Middleware/Checkuserdetails")
require('dotenv').config()

// Health Check API
Routes.get('/', async (req, resp) => {
    return resp.status(200).json({ message: "Server Health is okay" })
})

// User API
Routes.post('/verify', checkuserdetails, async (req, resp) => {
    try {
        const { name, phone, email, address, password, city, state, role } = req.body

        if (!name || !phone || !email || !password || !city || city === "None" || !address || !state || state === "None" || !role) return resp.status(404).send({ message: "Feild is Empyty" })

        const alreadyExist = await User.findOne({ email })
        if (alreadyExist) return resp.status(400).send({ message: "Account already Exist" })

        const otp = otpGenerator(email)

        const response = EmailSender(email, otp)

        resp.status(202).send({ message: "otp Send", otp, response })
    } catch (error) {
        resp.status(500).send({ Message: "Internal Error", error })
    }


})
Routes.post('/CreateAccount', checkuserdetails, async (req, resp) => {
    try {

        const { name, phone, email, address, password, city, state, role, otp } = req.body

        if (!name || !phone || !email || !address || !city || city === "None" || !state || state === "None" || !password || !role) return resp.status(404).send({ message: "Feild is Empyty" })

        if (!otp) return resp.status(404).send({ message: "Enter the Otp" })

        const existinguser = await User.findOne({ email });
        if (existinguser) return resp.status(400).json({ "Message": "Account already exists" })

        const result = verifyOtp(email, otp)
        if (!result.status) return resp.status(401).send({ message: "please Send Valid Otp", result })

        const createresp = await User.create({ name, phone, email, address, password, city, state, role })
        return resp.status(201).send({ message: "Account Created Successfully", createresp })
    } catch (error) {
        resp.status(500).send({ Message: "Internal Error", error })
    }

})
Routes.post('/Login', async (req, resp) => {

    try {
        const { email, password } = req.body
        if (!email || !password) return resp.status(404).send({ message: "Feild is Empyty" })

        const validuser = await User.findOne({ email })
        if (!validuser) return resp.status(404).send({ message: "user not found" })

        if (validuser.password !== password) return resp.status(404).send({ message: "Wrong Password" })

        if (!validuser.service) return resp.status(400).send({ message: "No Subscription" })

        const payload = { id: validuser._id }

        const token = jwt.sign(payload, process.env.JSON_SECRET_KEY)

        resp.status(202).send({ message: "Login Successfully", "resultObj": { token, role: validuser.role } })
    } catch (error) {
        resp.status(500).send({ Message: "Internal Error", error })
    }
})
Routes.put("/enableUser", checkuserdetails, async (req, resp) => {

    try {
        const { id } = req.body;
        if (!id) return resp.status(404).send({ message: "Plz Select the user" });

        const existinguser = await User.findOne({ _id: id });
        if (!existinguser) return resp.status(404).send({ message: "User is not found" });

        const result = await User.updateOne({ _id: id }, { $set: { service: true } });
        return resp.status(202).send({ message: "Service is enabled", result })
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error })
    }
});
Routes.put("/disableUser", checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.body;
        if (!id) return resp.status(404).send({ message: "Plz Select the user" });

        const existinguser = await User.findOne({ _id: id });
        if (!existinguser) returnresp.status(404).send({ message: "User is not found" });

        const result = await User.updateOne({ _id: id }, { $set: { service: false } });
        return resp.status(202).send({ message: "Service is disabled", result })

    } catch (error) {
        return resp.status(404).send({ message: "Internal Server error", error })
    }

});
Routes.get("/Getallusers", checkuserdetails, async (req, resp) => {
    try {
        const users = await Shopkeeper.find({ role: { $ne: 'Superadmin' } }).select("-password")

        if (users.length === 0) return resp.status(400).json({ message: "No user found" })

        return resp.status(202).json({ message: "Users fetched successfully", users })
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error })
    }
})
Routes.post('/fetchuserdetails', checkuserdetails, async (req, resp) => {

    const payload = { id: req.user._id }
    const token = jwt.sign(payload, process.env.JSON_SECRET_KEY)
    return resp.status(202).json({ message: "Login Successfully", role: req.user.role, token })
})


// Products API
Routes.post('/UploadProduct', checkuserdetails, async (req, resp) => {

    try {
        const { name, company, model, description, price, discount, rate, tax, stock } = req.body
        if (!name || !company || !model || !description || !price || !discount || !rate || !tax || !stock) return resp.status(404).send({ message: "Feild is Empyty" })

        const existingproduct = await Product.findOne({ model });
        if (existingproduct) return resp.status(400).send({ message: "Product of this model already exists" });

        const result = await Product.create({ userid: req.user._id, name, company, model, description, price, discount, rate, tax, stock })
        resp.status(202).send({ message: "Uploaded Successfully", result })
    } catch (error) {
        resp.status(500).send({ Message: "Internal Error", error })
    }


})
Routes.delete('/DeleteProduct/:id', checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.params;
        if (!id) return resp.status(404).send({ message: "Plz select the product" });

        const existingproduct = await Product.findOne({ _id: id, userid: req.user._id });
        if (!existingproduct) return resp.status(404).send({ message: "This product is not found in your product list" })

        const result = await Product.deleteOne({ "_id": id, userid: req.user._id })
        resp.status(202).send({ message: "Deleted Successfully", result })
    } catch (error) {
        resp.status(500).send({ Message: "Internal Error", error })
    }
})
Routes.put("/UpdateProduct/:id", checkuserdetails, async (req, resp) => {
    const { name, company, model, description, price, discount, rate, tax, stock } = req.body;
    if (!name || !company || !model || !description || !price || !discount || !rate || !tax || !stock) return resp.status(404).send({ message: "Field is Empty" });

    const { id } = req.params;
    if (!id) return resp.status(404).send({ message: "Plz select the product" });
    const existingproduct = await Product.findOne({ _id: id, userid: req.user._id });
    if (!existingproduct) return resp.status(404).send({ message: "This product is not found in your product list" });
    const response = await Product.findOne({ model });

    if (response && response._id.toString() !== id) return resp.status(400).send({ message: "Product of this model is already exists in your product list" });

    const updatedproduct = await Product.updateOne({ _id: id }, { $set: { name, company, model, description, price, discount, rate, tax, stock } })
    return resp.status(202).send({ message: "Product updated successfully", updatedproduct });
})
Routes.get("/GetProducts", checkuserdetails, async (req, resp) => {
    try {
        const allproducts = await Product.find({ userid: req.user._id });
        if (allproducts.length === 0) return resp.status(404).json({ message: "Your product list is empty" })

        return resp.status(200).send({ message: "all Products", allproducts });
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error });
    }
})


// Customers API
Routes.post("/createcustomer",checkuserdetails,async(req,resp)=>{
    try {
      const {name,phone,address}=req.body
      if(!name || !phone || !address) return resp.status(404).json({message:"Feild is empty"})
        const existingcustomer=await Customer.findOne({phone})
      if(existingcustomer) return resp.status(400).json({message:"Customer Already Exists"})
        const newcustomer= await Customer.create({name,phone,address,customerof:req.user._id})
      return resp.status(202).send({message:"Customer Created Successfully",newcustomer})
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error });
    }
  })
  Routes.get("/getallcustomers",checkuserdetails,async(req,resp)=>{
    try {
      const existingcustomers=await Customer.find({customerof:req.user._id})
      if(!existingcustomers || existingcustomers.length===0) return resp.status(404).json({message:"Customer list is empty"})
      return resp.status(202).send({message:"Customers fetched successfully",existingcustomers})
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error });
    }
  })




// Getting All ShopKeepers
Routes.get("/getallShopkeepers", checkuserdetails, async (req, resp) => {
    try {
        const result = await Shopkeeper.find().select("email _id")
        if (result.length === 0) return resp.status(400).json({ message: "No Shopkeeper found" })
        return resp.status(202).json({ message: "Shopkeeper fetched successfully", result })
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error })
    }
})
Routes.get("/getallcitiesandstates", checkuserdetails, async (req, resp) => {
    try {
        const response = await fetch("https://city-state.netlify.app/index.json")
        const result = await response.json()
        if (response.status === 200 && result.length !== 0) return resp.status(202).json({ message: "Cities & States fetched successfully", result })
        return resp.status(400).json({ message: "Cities & States are not fetched successfully" })
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server error", error })
    }
})


// Multiple Products
const validateObjectKeys = (object, schema) => {

    const schemaKeys = Object.keys(schema.paths).filter((key) => key !== '__v' && key !== '_id' && key !== 'createdAt');
    const objectKeys = Object.keys(object);
    for (const key of schemaKeys) {
        if (!object.hasOwnProperty(key) || object[key] === null || object[key] === '') return "The key " + key + " is missing or empty."
    }

    for (const key of objectKeys) {
        if (!schemaKeys.includes(key)) return "The key " + key + " is not declared in the schema."
    }

    return null;
};
Routes.post("/addmultipleproducts", checkuserdetails, async (req, resp) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) return resp.status(400).json({ message: 'Invalid input. Provide an array of items.' })
        const updateditems = items.map(item => { return { ...item, userid: req.user._id } })
        const errors = [];
        updateditems.map(async (item, index) => {
            const validationError = validateObjectKeys(item, Product.schema);
            if (validationError) errors.push({ index, error: validationError })

            const existingproduct = await Product.findOne({ model: item.model });
            if (existingproduct) errors.push({ index, error: "The modelNumber " + item.model + " already exists." })
        })

        if (errors.length > 0) return resp.status(400).json({ message: 'Validation errors occurred.' });

        const result = await Product.insertMany(updateditems);
        return resp.status(201).json({ message: 'All products are added successfully', result })
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error })

    }
})
// Executive API
Routes.post("/verifyExecutive", checkuserdetails, async (req, resp) => {
    try {
        const { name, phone, email, password, address, city, state } = req.body;
        if (!name || !phone || !email || !password || !city || city === "None" || !address || !state || state === "None") return resp.status(404).json({ message: "Field is Empty" })

        const existinguser = await User.findOne({ email });
        if (existinguser) return resp.status(400).json({ message: "Account already exists" })

        const otp = otpGenerator(email)

        const repp = EmailSender(email, otp)

        resp.status(202).send({ message: "otp Send", repp })
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server Error", error });
    }

})

Routes.post("/createExecutive", checkuserdetails, async (req, resp) => {
    try {
        const { name, phone, email, address, password, city, state, otp } = req.body;

        if (!name || !phone || !email || !address || !city || city === "None" || !state || state === "None" || !password) return HandleResponse(resp, 404, "Field is Empty")

        if (!otp) return resp.status(404).json({ message: "Enter the otp" })

        const existinguser = await User.findOne({ email });
        if (existinguser) return resp.status(400).json({ message: "Account already exists" })

        const response = verifyOtp(email, otp);
        if (!response.status) resp.status(404).json({ message: response.message });

        const result = await Executive.create({ name, phone, email, password, address, city, state, executiveof: req.user._id });
        resp.status(201).send({ message: "Account created successfully", result });
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server error", error })
    }
});
Routes.get("/getallExecutives", checkuserdetails, async (req, resp) => {
    try {
        const users = await Executive.find({ executiveof: req.user._id }).select("-password")
        if (users.length === 0) return resp.status(400).json({ message: "No user found" })
        return resp.status(201).send({ message: "Users fetched successfully", users })

    } catch (error) {
        return resp.status(500).json({ message: "Internal Server error", error })
    }
})
Routes.put("/enableExecutive", checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.body;
        if (!id) return resp.status(404).json({ message: "Plz Select the Executive" })

        const existinguser = await Executive.findOne({ _id: id });
        if (!existinguser) return resp.status(404).json({ message: "Executive is not found" })

        const result = await Executive.updateOne({ _id: id }, { $set: { service: true } });
        return resp.status(202).json({ message: "Service is enabled", result })
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server error", error })
    }
});
Routes.put("/disableExecutive", checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.body;
        if (!id) return resp.status(404).json({ message: "Plz Select the Executive" });

        const existinguser = await Executive.findOne({ _id: id });
        if (!existinguser) return resp.status(404).json({ message: "Executive is not found" });

        const result = await Executive.updateOne({ _id: id }, { $set: { service: false } });
        return resp.status(202).json({ message: "Service is disabled", result })
    } catch (error) {
        return resp.status(500).json({ mesage: "Internal Server error", error })
    }
});

module.exports = Routes