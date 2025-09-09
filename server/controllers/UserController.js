import {Webhook} from 'svix'
import userModel from '../models/userModel.js'
// api configuratin function to manage clerk user with database
//http://localhost:4000/api/user/webhooks
const clerkWebhooks = async (req, res) => {
 
    try {
        // Initialize the webhook handler with your secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        // Verify and parse the incoming request
        await whook.verify(JSON.stringify(req.body),{
           "svix-id": req.headers["svix-id"],
           "svix-timestamp": req.headers["svix-timestamp"],
           "svix-signature": req.headers["svix-signature"]
        })
        const {type, data} = req.body

        switch(type){
            
            
            case "user.created":{
                // Handle user creation logic here
                const userData ={
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                    // Add other fields as necessary
                }

                await userModel.create(userData)
                res.json({})

                break
            }
            case "user.updated":{
                // Handle user update logic here
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                    // Add other fields as necessary
                }

                await userModel.findOneAndUpdate({clerkId:data.id},userData)
                res.json({})

                break
            }
            case "user.deleted":{
                // Handle user deletion logic here
                await userModel.findOneAndDelete({clerkId:data.id})
                res.json({})
                break
            }
            default:
                break;
        }
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }
}
export {clerkWebhooks}