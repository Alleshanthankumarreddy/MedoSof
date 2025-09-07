const login = (req,res) => {

    const {name,password}  = req.body

    if(!name || !password) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }

    if(name !== "Shanthan" && password !== "shanthan@reddy") {
        return res.json({ success: false, message: "Please check the details of Owner" });
    }

    if(name === "Shanthan" && password === "shanthan@reddy") {
        return res.json({success : true ,message : "successfully logged as owner"})
    }

}

export {login}