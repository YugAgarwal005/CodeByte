import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { styled } from 'styled-components'
import { createquestionRoute } from '../utils/Apiroutes'
import axios from 'axios';

function CreateQues() {
    const navigate=useNavigate();
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

    const handleSubmit = async(event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formdata = {};
        formData.forEach((value, key) => {
            formdata[key] = value;
        });

        try {
            const { data } = await axios.post(`${createquestionRoute}`, {
                formdata
            })
            if (data.status) {
                toast.success(data.msg, options)
            }
            else {
                toast.error(data.msg, options)
            }
        } catch (error) {
            toast.error("Failed to Create or Update Questions", options)
        }
      };

  return (
    <>
    <Container>
    <h1>Create questions</h1>
    <form onSubmit={handleSubmit} method="get">
    <select id="options" name="topic">
        <option value="c&c++">C & C++</option>
        <option value="java">Java</option>
    </select>
    <label for="numberField">unit number:</label>
    <input type="number" id="numberField" name="unitnum" min="1" required></input>
    <label for="numberField">lesson number: only six lessons so chose from 1 to 6</label>
    <input type="number" id="numberField" name="level" min="1" max='6' required></input>
    <label for="textField">QUESTION </label>
    <input type="text" id="textField" name="question" required spellCheck='false'></input>
    <label for="textField">option 1--- </label>
    <input type="text" id="textField" name="one" required spellCheck='false'></input>
    <label for="textField">2---</label>
    <input type="text" id="textField" name="two" required spellCheck='false'></input>
    <label for="textField">3---</label>
    <input type="text" id="textField" name="three" required spellCheck='false'></input>
    <label for="textField">4---</label>
    <input type="text" id="textField" name="four" required spellCheck='false'></input>
    <label for="numberField">correct answer:</label>
    <input type="number" id="numberField" name="correctoption" min="1" max='4' required></input>
    <button type="submit">submit</button>
    </form>
    <button onClick={()=>navigate("/createunit")}>CREATE UNIT</button>

    </Container>
    <ToastContainer />
    </>
  )
}

const Container=styled.div`
display: flex;
flex-direction: column;
align-items: center;
background-color: white;
height: 100%;
form{
    display: flex;
    flex-direction: column;
    gap: 6px;
    input{
        padding: 10px;
        font-size: 1.5rem;
    }
    textarea{
        font-size:1.6rem;
    }
}
select{
    padding: 10px 40px;
    option{
        padding: 10px;
        font-size: 1.5rem;
    }
}
button{
    margin: 30px;
    padding: 20px;
}
`

export default CreateQues