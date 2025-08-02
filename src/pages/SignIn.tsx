import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

type User = {
    username: string,
    password: string
}

export default function SignIn() {

    const [signUp, setSignUp] = useState<User>({
        username: "",
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
            const res = await axios.post('https://fakestoreapi.com/auth/login', signUp )
            console.log(res)
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
                    label="Enter username"
                    variant="outlined"
                    name="username"
                    value={signUp.username}
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