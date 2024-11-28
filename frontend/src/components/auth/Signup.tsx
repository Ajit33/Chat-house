import axios from "axios";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { server } from "@/main";
import { UseSocket } from "@/hooks/UseSocket";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.userName || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.post(`${server}/auth/signup`, formData);

      if (response) {
        setSuccess("Signup successful! Welcome aboard.");
        console.log("Signup successful:", response.data);
        const connection = UseSocket(response.data.websocketUrl);
        console.log(connection)
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Fill the below input box to create your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={submitForm}>
          <CardContent className="text-left gap-4">
            <div>
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                name="userName"
                placeholder="Enter your Name"
                type="text"
                onChange={handleOnChange}
                value={formData.userName}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your Email"
                type="email"
                onChange={handleOnChange}
                value={formData.email}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Enter your Password"
                type="password"
                onChange={handleOnChange}
                value={formData.password}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </CardFooter>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </Card>
    </div>
  );
};

export default Signup;
