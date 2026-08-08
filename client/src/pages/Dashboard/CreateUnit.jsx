import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { createunitRoute } from '../../utils/Apiroutes';
import { ToastContainer, toast } from 'react-toastify';

function CreateUnit() {
    const navigate = useNavigate();
    const options = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formdata = {};
        formData.forEach((value, key) => {
            formdata[key] = value;
        });
        
        try {
            const { data } = await axios.post(`${createunitRoute}`, {
                formdata
            })
            if (data.status) {
                toast.success(data.msg, options)
            }
            else {
                toast.error(data.msg, options)
            }
        } catch (error) {
            toast.error("Failed to Create or Update Unit", options)
        }

    };
    return (
        <>
            <Container>
                <h1>Create unit</h1>
                <form onSubmit={handleSubmit} method="post">
                    <select id="options" name="topic">
                        <option value="c&c++">C & C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                    </select>
                    <label for="numberField">unit number:</label>
                    <input type="number" id="numberField" name="unitnum" min="1" required></input>
                    <label for="textField">Heading of unit: max 5 words</label>
                    <input type="text" id="textField" name="heading" required spellCheck='false'></input>
                    <label for="textField">12-15 word guidebook doent exceed this textarea:</label>
                    <textarea id="textareaField" name="guidebook" rows="2" cols="50" required spellCheck='false'></textarea>
                    <button type="submit">submit</button>
                </form>
                <button onClick={() => navigate("/createques")}>CREATE QUESTIONS</button>
            </Container>
            <ToastContainer />
        </>
    )
}

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
background-color: white;
min-height: 100vh;
padding: 20px 15px;
box-sizing: border-box;
form{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 500px;
    input{
        padding: 10px;
        font-size: 1.2rem;
        width: 100%;
        box-sizing: border-box;
    }
    textarea{
        font-size: 1.2rem;
        width: 100%;
        box-sizing: border-box;
    }
}
button{
    margin: 20px 0;
    padding: 15px;
    font-size: 1rem;
    cursor: pointer;
}
select{
    padding: 10px 20px;
    width: 100%;
    option{
        padding: 10px;
        font-size: 1.2rem;
    }
}
`

export default CreateUnit