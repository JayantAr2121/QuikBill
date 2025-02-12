const express = require("express")
const Routes = express.Router()
const { User, Shopkeeper, Executive } = require('../Model/UserModel/UserModel')
const { otpGenerator, verifyOtp } = require('../Services/otp/Otp')
const EmailSender = require('../Services/Email/emailSender')
const Product = require("../Model/ProductModel/Product.model")
const Customer = require("../Model/CustomerModel/Customer.js")
const jwt = require("jsonwebtoken");
const checkuserdetails = require("../Middleware/Checkuserdetails")
const { default: mongoose } = require("mongoose")
const { Transaction, Invoice, Payment } = require("../Model/TransactionModel/Transaction.model.js")
const OrderedItems = require("../Model/OrderModel/Order.model.js")
require('dotenv').config()

// Health Check API
Routes.get('/', async (req, resp) => {
    return resp.status(200).json({ message: "Server Health is okay" })
})

// User API
Routes.post('/verify', checkuserdetails, async (req, resp) => {
    try {
        const { name, phone, email, address, password, city, state, role, executiveof } = req.body

        if (!name || !phone || !email || !password || !city || city === "None" || !address || !state || state === "None" || !role) return resp.status(404).send({ message: "Feild is Empyty" })

        const alreadyExist = await User.findOne({ email })
        if (alreadyExist) return resp.status(400).send({ message: "Account already Exist" })

        if (role === "Executive") {
            if (!executiveof) return resp.status(404).json({ message: "Select The Admin" })
            if (!mongoose.isValidObjectId(executiveof)) return resp.status(404).json({ message: "Admin is not valid" })
            const Shopkeeperexist = await User.findOne({ _id: executiveof })
            if (!Shopkeeperexist) return resp.status(404).json({ message: "Shopkeeper Not Found" })
        }
        const otp = otpGenerator(email)

        const response = EmailSender(email, otp)

        resp.status(202).send({ message: "otp Send" })
    } catch (error) {
        resp.status(500).send({ Message: "Internal Error", error })
    }


})
Routes.post('/CreateAccount', checkuserdetails, async (req, resp) => {
    try {

        const { name, phone, email, address, password, city, state, role, otp, executiveof } = req.body

        if (!name || !phone || !email || !address || !city || city === "None" || !state || state === "None" || !password || !role) return resp.status(404).send({ message: "Feild is Empyty" })

        if (!otp) return resp.status(404).send({ message: "Enter the Otp" })

        const existinguser = await User.findOne({ email });
        if (existinguser) return resp.status(400).json({ "Message": "Account already exists" })

        if (role === "Executive") {
            if (!executiveof) return resp.status(404).json({ message: "Select The Admin" })
            if (!mongoose.isValidObjectId(executiveof)) return resp.status(404).json({ message: "Admin is not valid" })
            const Shopkeeperexist = await User.findOne({ _id: executiveof })
            if (!Shopkeeperexist) return resp.status(404).json({ message: "Shopkeeper Not Found" })
        }

        const result = verifyOtp(email, otp)
        if (!result.status) return resp.status(401).send({ message: "please Send Valid Otp", result })

        if (role === "Shopkeeper") {
            const createresp = await User.create({ name, phone, email, address, password, city, state, role })
            return resp.status(201).send({ message: "Account Created Successfully", createresp })
        } else if (role === "Executive") {
            const createresp = await Executive.create({ name, phone, email, address, password, city, state, role, executiveof })
            return resp.status(201).send({ message: "Account Created Successfully", createresp })
        }
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

        if (validuser.role === "Executive") {

            if (!validuser.executiveof) resp.status(404).json({ message: "Executive Not Found" })

            const payload = { id: validuser._id, executiveid: validuser.executiveof }

            const token = jwt.sign(payload, process.env.JSON_SECRET_KEY)


            return resp.status(202).send({ message: "Login Successfully", "resultObj": { token, role: validuser.role } })

        }
        console.log("hello")
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

        const existingproduct = await Product.findOne({ model, userid: req.user._id });
        if (existingproduct) return resp.status(400).send({ message: "Product of this model already exists" });

        const result = await Product.create({ userid: req.user._id, name, company, model: model, description, price, discount, rate, tax, stock })
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
    const response = await Product.findOne({ model, userid: req.user._id });

    if (response && response._id.toString() !== id) return resp.status(400).send({ message: "Product of this model is already exists in your product list" });

    const updatedproduct = await Product.updateOne({ _id: id }, { $set: { name, company, model, description, price, discount, rate, tax, stock } })
    return resp.status(202).send({ message: "Product updated successfully", updatedproduct });
})
Routes.get("/GetProducts", checkuserdetails, async (req, resp) => {
    try {
        console.log(req.user)
        const allproducts = await Product.find({ userid: req.user._id });
        console.log(allproducts)
        if (allproducts.length === 0) return resp.status(404).json({ message: "Your product list is empty" })
        // console.log("hello")
        return resp.status(200).send({ message: "all Products", allproducts });
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error });
    }
})


// Customers API
Routes.post("/createcustomer", checkuserdetails, async (req, resp) => {
    try {
        const { name, phone, address } = req.body
        if (!name || !phone || !address) return resp.status(404).json({ message: "Feild is empty" })
        const existingcustomer = await Customer.findOne({ phone })
        if (existingcustomer) return resp.status(400).json({ message: "Customer Already Exists" })
        const newcustomer = await Customer.create({ name, phone, address, customerof: req.user._id })
        return resp.status(202).send({ message: "Customer Created Successfully", newcustomer })
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server error", error });
    }
})
Routes.get("/getallcustomers", checkuserdetails, async (req, resp) => {
    try {
        const existingcustomers = await Customer.find({ customerof: req.user._id })
        if (!existingcustomers || existingcustomers.length === 0) return resp.status(404).json({ message: "Customer list is empty" })
        return resp.status(202).send({ message: "Customers fetched successfully", existingcustomers })
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

//  Get Transaction 
Routes.get("/getalltransactions/:id", checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.params
        if (!id || !mongoose.isValidObjectId(id)) return resp.status(404).json({ message: "Customer is not valid" })

        const existingCustomer = await Customer.findOne({ _id: id })
        if (!existingCustomer) return resp.status(404).json({ message: "Customer not found" })

        const result = await Transaction.find({ shopkeeperId: req.user._id, customerId: id })
        if (!result || result.length === 0) return resp.status(404).json({ message: "Transaction list is empty" })
        return resp.status(202).json({ message: "Transactions fetched successfully", result })
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server Error", error })
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

// generate Invoice
async function generateInvoiceNumber(userid) {
    const lastInvoice = await Invoice.findOne({ shopkeeperId: userid }).sort({ _id: -1 });
    let newInvoiceNumber;
    if (lastInvoice) {
        let lastNumber = parseInt(lastInvoice.InvoiceNo.split('-')[1]) + 1;
        newInvoiceNumber = `INV-${lastNumber.toString().padStart(5, '0')}`;
    } else {
        newInvoiceNumber = 'INV-00001';
    }
    return newInvoiceNumber;
}

const validateordereditems = (object) => {
    if (Object.keys(object).length === 0) return "Product Detail not found";
    if (!object.id || object.id === "" || object.id == null || !mongoose.isValidObjectId(object.id)) return "Product id is invalid";
    if (!object.quantity || object.quantity === "" || object.quantity === null || object.quantity <= 0) return "Product quantity is invalid";
    return null;
};

Routes.post('/createInvoice/:id', checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.params
        if (!id || !mongoose.isValidObjectId(id)) return resp.status(404).json({ message: "Customer is not valid" })

        const existingCustomer = await Customer.findOne({ _id: id })
        if (!existingCustomer) return resp.status(404).json({ message: "Customer Not Found" })

        const { ordereditems } = req.body
        if (!ordereditems) return resp.status(404).json({ message: "Select the Items" })

        if (!Array.isArray(ordereditems) || ordereditems.length === 0) return resp.status(400).json({ message: 'Invalid input. Provide an array of items' })

        const iserror = []

        ordereditems.map(async (item, index) => {
            const validationError = validateordereditems(item)
            if (validationError) iserror.push({ index, error: validationError })
        })

        if (iserror.length > 0) return resp.status(400).json({ message: "Validation error occur", iserror })

        const allids = ordereditems.map(item => new mongoose.Types.ObjectId(item.id))
        const allproducts = await Product.find({ _id: { $in: allids } })
        if (allids.length !== allproducts.length) return resp.status(404).json({ message: "One or More Products is missing" })

        for (const item of ordereditems) {
            const existingProduct = await Product.findOne({ _id: item.id, userid: req.user._id })
            if (existingProduct.stock < item.quantity) return resp.status(404).json({ message: "Stock of this product:" + existingProduct.name + "is insufficient" })
        }
        const newOrder = []
        for (const item of ordereditems) {
            const existingProduct = await Product.findOne({ _id: item.id, userid: req.user._id })
            existingProduct.stock -= item.quantity
            await existingProduct.save()
            const { name, model, company, description, rate, price, tax, discount } = existingProduct
            const obj = { name, model, company, description, rate, price, tax, discount, quantity: item.quantity, subtotal: price * item.quantity }
            newOrder.push(obj)
        }


        let TotalTax = 0
        let TotalDiscount = 0
        let TotalCost = 0
        let Subtotal = 0

        for (const item of newOrder) {
            TotalTax += item.quantity * ((item.price * item.tax) / 100)
            TotalDiscount += item.quantity * ((item.price * item.discount) / 100)
            Subtotal += item.quantity * item.price
            TotalCost += item.quantity * item.rate
        }

        const grandtotal = Subtotal - TotalDiscount + TotalTax
        const totalprofit = grandtotal - TotalCost - TotalDiscount - TotalTax



        const orders = await OrderedItems.insertMany(newOrder)
        const allid = orders.map(obj => obj._id)
        const invoiceNumber = await generateInvoiceNumber(req.user._id);
        existingCustomer.balance += parseInt(grandtotal)
        await existingCustomer.save()
        const result = await Invoice.create({ InvoiceNo: invoiceNumber, OrderItems: allid, TotalAmount: parseInt(grandtotal), Subtotal: Subtotal, TotalProfit: totalprofit, TotalDiscount: TotalDiscount, TotalTax: TotalTax, customerId: id, shopkeeperId: req.user._id });
        return resp.status(202).json({ message: 'Invoice generated successfully', result, ordereditems: newOrder })
    } catch (error) {
        resp.status(500).send({ message: "Internal Server Error", error })
    }
})
// get Customers 
Routes.get("/getCustomer/:id", checkuserdetails, async (req, resp) => {
    try {
        const { id } = req.params
        if (!id || !mongoose.isValidObjectId(id)) return resp.status(404).json({ message: "Customer is not valid" })

        const existingCustomer = await Customer.findOne({ _id: id, customerof: req.user._id })
        if (!existingCustomer) return resp.status(404).json({ message: "Customer is not found in your list" })
        return resp.status(202).json({ message: "Customer fetched successfully", existingCustomer })
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server Error", error })
    }
})
Routes.get("/getShopkeeper", checkuserdetails, async (req, resp) => {
    try {
        const existingShopkeeper = await Shopkeeper.findOne({ _id: req.user._id }).select("-password -_id")
        if (!existingShopkeeper) return resp.status(404).json({ message: "Shopkeeper is not found in your list" })
        return resp.status(202).json({ messsage: "Shopkeeper fetched successfully", existingShopkeeper })
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server Error", error })
    }
})
Routes.post("/addpayment/:id", checkuserdetails, async (req, resp) => {
    try {
        const { RecieptNo, payment, Description } = req.body
        if (!RecieptNo || !payment) return resp.status(404).json({ message: "Field is Empty" })
        const { id } = req.params
        if (!id || !mongoose.isValidObjectId(id)) return resp.status(404).json({ message: "Customer is not valid" })

        const existingCustomer = await Customer.findOne({ _id: id, customerof: req.user._id })
        if (!existingCustomer) return resp.status(404).json({ message: "Customer is not found in your list" })
        existingCustomer.balance -= payment
        const updatedCustomer = await Customer.updateOne({ _id: id, customerof: req.user._id }, { $set: { balance: existingCustomer.balance } })
        const result = await Payment.create({ shopkeeperId: req.user._id, customerId: id, RecieptNo, payment, Description })
        return resp.status(202).json({ message: "Customer updated successfully", updatedCustomer, result })
    } catch (error) {
        return resp.status(500).json({ message: "Internal Server Error", error })
    }
})

// Dashboard  
Routes.get('/GetAllTransaction', checkuserdetails, async (req, resp) => {
    try {
        if (!req.user || !req.user._id) {
            return resp.status(401).json({ message: "Unauthorized access" });
        }
        const result = await Transaction.find({ shopkeeperId: req.user._id })
        if (!result || result.length === 0) return resp.status(404).json({ message: "Transaction list is empty" })
        let PaymentRecives = 0
        let GrandTotalAmount = 0
        let GrandTotalTax = 0
        let GrandTotalDiscount = 0
        let GrandTotalProfit = 0
        let GrandSubTotal = 0

        result.map((invoiceobj) => {
            if (invoiceobj.paymentType === "credit") {
                GrandTotalAmount += invoiceobj.TotalAmount
                GrandTotalTax += invoiceobj.TotalTax
                GrandTotalDiscount += invoiceobj.TotalDiscount
                GrandTotalProfit += invoiceobj.TotalProfit
                GrandSubTotal += invoiceobj.Subtotal
            }
            if (invoiceobj.paymentType === "debit") {
                PaymentRecives += invoiceobj.payment
            }
        })
        const dataobj = { "GrandTotalAmount": GrandTotalAmount, "GrandTotalTax": GrandTotalTax, "GrandTotalDiscount": GrandTotalDiscount, "GrandTotalProfit": GrandTotalProfit, "GrandSubTotal": GrandSubTotal, "PaymentRecives": PaymentRecives }
        return resp.status(202).json({ message: "fetched Successfully", dataobj })
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        return resp.status(500).json({ message: "Internal server error", error: error.message });
    }
})
Routes.get('/GetAllRecentTransaction', checkuserdetails, async (req, resp) => {
    try {
        if (!req.user || !req.user._id) {
            return resp.status(401).json({ message: "Unauthorized access" });
        }
        const result = await Transaction.find({ shopkeeperId: req.user._id }).sort({ createdAt: -1 }).limit(5).select("paymentType createdAt payment TotalAmount ")
        return resp.status(202).json({ message: "fetched Successfully", result })
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        return resp.status(500).json({ message: "Internal server error", error: error.message });
    }
})
Routes.get('/GetAllInvoiceList', checkuserdetails, async (req, resp) => {
    try {
        const allInvoices = await Invoice.find({ shopkeeperId: req.user._id }).sort({ createdAt: -1 }).limit(7).populate("customerId", "name");
        if (!allInvoices || allInvoices.length === 0) return resp.status(404).json({ message: "No latest invoices found" })

        return resp.status(202).json({
            message: "Fetched Successfully",
            invoices: allInvoices
        });

    } catch (error) {
        console.error("Error fetching invoices:", error.message);
        return resp.status(500).json({ message: "Internal server error", error: error.message });
    }
});


module.exports = Routes