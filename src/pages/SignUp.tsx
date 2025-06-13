import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

type User = {
    name: string,
    email: string,
    number: string,
    password: string
}

export default function SignUp() {

    const [signUp, setSignUp] = useState<User>({
        name: "",
        email: "",
        number: "",
        password: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("idUser")) {
            navigate("/")
        }
    }, [])

    function handleChange({ target }: any) {
        const { name, value } = target;
        setSignUp({
            ...signUp,
            [name]: value
        })
        console.log(name, value)
    }

    async function handleClick() {
        try {
            const res = await axios.post("https://67b5223ba9acbdb38ed16600.mockapi.io/api/v1/users", signUp)
            console.log(res)
            localStorage.setItem("idUser", res.data.id)
            return navigate("/")
        } catch (error) {
            console.error("error to send the data", error)
        }
    }

    return (
        <div>

            <Navbar />
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
                className="margin-top"
            >
                <TextField
                    id="outlined-basic"
                    label="Full Name*"
                    variant="outlined"
                    name="name"
                    value={signUp.name}
                    onChange={handleChange} />
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
                    label="Phone Number*"
                    variant="outlined"
                    name="number"
                    value={signUp.number}
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
                <TextField
                    id="outlined-basic"
                    label="Confirm Password*"
                    variant="outlined"
                    name="password"
                    value={signUp.password}
                    onChange={handleChange}
                />

                <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms of service" />
                </FormGroup>

                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={handleClick}>SignUp</Button>
                </Stack>
            </Box>

            <Footer />
        </div>
    )
}