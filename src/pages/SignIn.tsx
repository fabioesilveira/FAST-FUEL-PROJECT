import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

type User = {
    email: string,
    password: string
}

export default function SignIn() {

    const [signUp, setSignUp] = useState<User>({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("idUser")) {
            navigate("/")
        }
    }, [])

    async function handleClick() {
        try {
            const res = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/users")
            console.log(res)
            const checkUser = res.data.find((e: any) => e.email === signUp.email && e.password === signUp.password)
            if (checkUser) {
                localStorage.setItem("idUser", checkUser.id)
                return navigate("/")
            } return alert("The user you've entered does not exist, please check your email or password!")
        } catch (error) {
            console.error("error to send the data", error)
        }
    }

    function handleChange({ target }: any) {
        const { name, value } = target;
        setSignUp({
            ...signUp,
            [name]: value
        })
        console.log(name, value)
    }

    return (
        <div>
            {/* <Navbar /> */}
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
                className="margin-top"
            >

                <TextField
                    id="outlined-basic"
                    label="Email Address*"
                    variant="outlined"
                    name="email"
                    value={signUp.email}
                    onChange={handleChange}
                />

                <TextField
                    id="outlined-basic"
                    label="Password*"
                    variant="outlined"
                    name="password"
                    value={signUp.password}
                    onChange={handleChange}
                />

                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={handleClick}>SignIn</Button>
                </Stack>
            </Box>
        </div>
    )
}