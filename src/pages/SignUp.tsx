import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/fast-fuel.png';

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



            <div className="split-background">
                <div className="half solid-half">
                    <img src={Logo} className='img-signIn' />
                </div>
                <div className="half striped-half">
                    <div className="signin-container signin-wrapper">
                        <Box
                            component="form" className="signin-form"

                            noValidate
                            autoComplete="off"
                        >
                            <h2 className="signin-title">SIGN UP</h2>
                            <TextField
                                id="outlined-basic"
                                label="Full Name*"
                                variant="outlined"
                                name="name"
                                className="text-field-orange"
                                value={signUp.name}
                                onChange={handleChange} />
                            <TextField
                                id="outlined-basic"
                                label="Email Address*"
                                variant="outlined"
                                name="email"
                                className="text-field-orange"
                                value={signUp.email}
                                onChange={handleChange}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Phone Number*"
                                variant="outlined"
                                name="number"
                                className="text-field-orange"
                                value={signUp.number}
                                onChange={handleChange}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Password*"
                                variant="outlined"
                                name="password"
                                className="text-field-orange"
                                value={signUp.password}
                                onChange={handleChange}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Confirm Password*"
                                variant="outlined"
                                name="password"
                                className="text-field-orange"
                                value={signUp.password}
                                onChange={handleChange}
                            />

                            <FormGroup>
                                <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms of service" />
                            </FormGroup>


                            <Button variant="contained" className="signin-button" onClick={handleClick}>Sign Up</Button>

                        </Box>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}