
import { Webhook } from 'svix';
import userModel from '../models/userModel.js';
import razorpay from 'razorpay';
import transactionModel from '../models/transactionModel.js';

// ---------------- Clerk Webhooks ----------------
const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify incoming request
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { type, data } = req.body;

        switch (type) {
            case "user.created":
                await userModel.create({
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                });
                res.json({});
                break;

            case "user.updated":
                await userModel.findOneAndUpdate(
                    { clerkId: data.id },
                    {
                        email: data.email_addresses[0].email_address,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        photo: data.image_url,
                    }
                );
                res.json({});
                break;

            case "user.deleted":
                await userModel.findOneAndDelete({ clerkId: data.id });
                res.json({});
                break;

            default:
                res.json({});
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ---------------- Get User Credit ----------------
const userCredit = async (req, res) => {
    try {
        const { clerkId } = req.user;

        if (!clerkId) {
            return res.status(400).json({ success: false, message: "clerkId is required" });
        }

        const userData = await userModel.findOne({ clerkId });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, credits: userData.creditBalance });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ---------------- Razorpay Instance ----------------
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------- Payment with Razorpay ----------------
const paymentRazorpay = async (req, res) => {
    try {
        const { planId } = req.body;      // from frontend
        const { clerkId } = req.user;     // from auth middleware

        if (!clerkId || !planId) {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }

        const userData = await userModel.findOne({ clerkId });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let credits, plan, amount;
        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.json({ success: false, message: 'Invalid Plan ID' });
        }

        // Create transaction
        const newTransaction = await transactionModel.create({
            clerkId,
            plan,
            amount,
            credits,
            date: Date.now(),
        });

        // Razorpay order
        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id.toString(),
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Api controller function to verify payments
const verifyRazorpay = async(req,res) =>{
    try {
        const{razorpay_order_id} = req.body // check 
        const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderinfo.status ==='paid'){
            const transactionData = await transactionModel.findById(orderinfo.receipt)
            if(transactionData.payment){
                return res.json({syccess:false,message:'payment failed'})
            }
            //addding credits
            const userData = await userModel.findOne({clerkId:transactionData.clerkId})
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id,{creditBalance})

            //making the payment true
            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})
            res.json({success:true,message: "Credits Added"});
        }
    } catch (error) {
         console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

// ---------------- Exports ----------------
export { clerkWebhooks, userCredit, paymentRazorpay,verifyRazorpay};
