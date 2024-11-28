import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"




const Signin = () => {
    const [formData,setFormData]=useState({
        email:"",
        password:""
    })
  return (
    <div className="w-full h-screen flex justify-center items-center">
       <Card className="w-[450px] ">
          <CardHeader>
            <CardTitle>Welcome back :)</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Sign in for getstarted with the app</CardDescription>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Email</Label>
            <Input placeholder="Enter Your Email" value={formData.email}  />
            <Label>Password</Label>
            <Input placeholder="Enter Your password" value={formData.password}  />
          </CardContent>
       </Card>
    </div>
  )
}

export default Signin
