import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../components/Navbar';

type User = {
    email: string,
    password: string
}

export default function SignIn() {

    const [signUp, setSignUp] = useState<User>({
        email: "",
        password: ""
    });


    async function handleClick() {
        try {
            const res = await axios.get("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/users")
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
            <ResponsiveAppBar />
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
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