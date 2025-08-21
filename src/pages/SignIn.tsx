import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../assets/fast-fuel.png';

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
            const res = await axios.post('https://fakestoreapi.com/auth/login', signUp)
            console.log(res)
            localStorage.setItem('idUser', res.data.token)
            navigate("/") 
        } catch (error) {
            alert('user not found, please try again')
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
       
        <div className="split-background">
            <div className="half solid-half">
                <img src={Logo} className='img-signIn'/>
            </div>
            <div className="half striped-half">
                
                <div className="signin-container signin-wrapper">
                    <Box component="form" className="signin-form" noValidate autoComplete="off">
                        <h2 className="signin-title">SIGN IN</h2>
                        <TextField
                            label="Enter username"
                            variant="outlined"
                            name="username"
                            value={signUp.username}
                            onChange={handleChange}
                            className="text-field-orange"
                        />
                        <TextField
                            label="Password*"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={signUp.password}
                            onChange={handleChange}
                            className="text-field-orange"
                        />
                        <Button
                            variant="contained"
                            onClick={handleClick}
                            className="signin-button"
                        >
                            Sign In
                        </Button>
                        <h3 className="signin-title">or</h3>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/sign-up')} 
                            className="signin-button"
                        >
                            Create new account
                        </Button>
                    </Box>
                </div>
                
            </div>
            <Footer />
        </div>
    )
}