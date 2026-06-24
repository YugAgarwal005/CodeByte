import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { styled } from 'styled-components'
import heart from '../assets/images/icons8-love.png'
import { useState } from 'react'
import useSound from 'use-sound'
import success from '../assets/audio/correct.mp3'
import fail from '../assets/audio/wrong.mp3'
import skip from '../assets/audio/skip.mp3'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import loader from '../assets/images/loader.gif';
import resultimg from '../assets/images/result.png';
import { getquestionsRoute, quizsubmitRoute } from '../utils/Apiroutes'
import err from '../assets/images/4044.png'
import gem from '../assets/images/icons8-emeraldd.png'

function Quiz() {
    const { unitnum, levelnum } = useParams();
    const [isCorrect] = useSound(success);
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [isWrong] = useSound(fail);
    const [quiz, setQuiz] = useState(null);
    const [isSkip] = useSound(skip);
    const [isLoading, SetisLoading] = useState(true);
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
    const [checked, SetChecked] = useState(null);
    const [name, Setname] = useState("CONTINUE");
    const [showResult, setshowResult] = useState(false);
    const [result, setResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    });
    const [correctindex,setcorrectIndex]=useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${getquestionsRoute}/${unitnum}/${levelnum}`, {
                    params: { course, id }
                });
                setQuiz(data);
                SetisLoading(false);
            } catch (error) {
                SetisLoading(false);
                console.error('Error fetching data:', error);
            }
        };
        const course = localStorage.getItem('course');
        const id = JSON.parse(localStorage.getItem('codebyte-user'))._id;
        setTimeout(fetchData, 2000);
    }, []);

    useLayoutEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [quiz]);

    useEffect(() => {
    }, [quiz]);

    if (quiz) {
        var { questions } = quiz;
        var { question, choices, correctAnswer } = questions[activeQuestion];
    }

    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (quiz) {
            if (progress === questions.length) { Setname("FINISH") }
        }
    }, [progress]);

    const onClickNext = () => {
        setcorrectIndex(null);
        if (activeQuestion !== questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
            setSelectedAnswerIndex(null);
            SetChecked(null);
            setResult((prev) => {
                if (selectedAnswer != null) {
                    const updatedState = selectedAnswer
                        ? { ...prev, score: prev.score + 5, correctAnswers: prev.correctAnswers + 1, }
                        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
                    setSelectedAnswer(null);
                    return updatedState
                }
                else {
                    return prev;
                }
            })
        }
        else {
            setResult((prev) => {
                if (selectedAnswer != null) {
                    const updatedState = selectedAnswer
                        ? { ...prev, score: prev.score + 5, correctAnswers: prev.correctAnswers + 1, }
                        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
                    console.log(updatedState);
                    return updatedState
                }
                else {
                    return prev;
                }
            })
            setSelectedAnswer(null);
        }
        if (name === 'FINISH') {
            setshowResult(true);
            isCorrect();
        }
    }

    const handleSubmit = async () => {
        const course = localStorage.getItem('course');
        const id = JSON.parse(localStorage.getItem('codebyte-user'))._id;
        const postData={
            xp:result.correctAnswers === 0 ? 0 : 15 + result.score,
            gems:result.score * 5,
            noofques:result.correctAnswers,
            level:levelnum,
            unitnum :unitnum,
            topic:course,
            id:id,
            totalques:questions.length
        }

        const postDataString = JSON.stringify(postData);

        try {
            const { data } = await axios.post(`${quizsubmitRoute}`, {postDataString});
            // Handle the response data if needed
            // console.log(data);
        } catch (error) {
            // Handle errors if the POST request fails
            console.error('Error submitting quiz:', error);
        }
        navigate('/',{ state: { setShowStreak: true } });
        isCorrect();
        window.location.reload();
    }

    const onClickSkip = () => {
        setSelectedAnswer(null);
        isSkip();
        if (activeQuestion !== questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
            setSelectedAnswerIndex(null);
            SetChecked(null);
        }
        if (progress < questions.length) {
            setProgress((prev) => prev + 1)
        }
    }

    const OnCheck = (index) => {
        if (index != null) {
            if (index + 1 === correctAnswer) {
                isCorrect();
                SetChecked(true);
                setSelectedAnswer(true)
            }
            else {
                isWrong();
                setcorrectIndex(correctAnswer-1);
                SetChecked(false);
                setSelectedAnswer(false)
            }
            if (progress < questions.length) {
                setProgress((prev) => prev + 1)
            }
        }
    }

    const onAnswerSelected = (index) => {
        if (selectedAnswerIndex === index) {
            setSelectedAnswerIndex(null)
        }
        else {
            setSelectedAnswerIndex(index)
        }
    }

    return (
        <>
            {isLoading ?
                <ContainerError>
                    <img src={loader} alt="loader" className='loader' />
                </ContainerError> :
                quiz === null ?
                    <Containererror>
                        <img src={err} alt="error" className='errorr' />
                    </Containererror>
                    :
                    <Container>
                        {!showResult ?
                            <div className="bar">
                                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/4af31393cf9dee6fd35c07fc7155d404.svg" alt="" onClick={() => navigate('/')} />
                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${(progress) * 100 / questions.length}%` }}
                                    ></div>
                                </div>
                                <div className='heartdiv'>
                                    <img src={heart} alt="heart" className='heart' /><span>♾️</span>
                                </div>
                            </div> : null
                        }
                        {!showResult ?
                            <div className="question" ref={scrollContainerRef}>
                                <div className="question-text">
                                    <h3><span>{`0${activeQuestion + 1}`}</span>/0{`${questions.length}`}</h3>
                                    <h4>{question}</h4>
                                </div>
                                <div className={checked !== null || name === "FINISH" ? "answer-section dis" : "answer-section"}>
                                    {choices.map((item, index) => (
                                        <button onClick={() => onAnswerSelected(index)} key={index}
                                            className={correctindex ===index ?'crect': selectedAnswerIndex === index && selectedAnswer === true ? 'crect' :
                                                selectedAnswerIndex === index && selectedAnswer === false ? 'wrng' :
                                                    selectedAnswerIndex === index ? "selected" : null}
                                        >{item}</button>
                                    ))}
                                </div>
                            </div> :
                            <div className="result">
                                <img src={resultimg} alt="" />
                                <div className="resultdiv">
                                    <div className="three">
                                        <div className='top'>Gems</div>
                                        <div className='shape'>
                                            <img src={gem} alt="" />
                                            <span>+{result.score * 5}</span>
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className='top'>Total XP</div>
                                        <div className='shape'>
                                            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/1c76664edfc0acb1d01183db9a6f7ca4.svg" alt="" />
                                            <span>+{result.correctAnswers === 0 ? 0 : 15 + result.score}</span>
                                        </div>
                                    </div>
                                    <div className="two">
                                        <div className='top'>Accuracy</div>
                                        <div className='shape'>
                                            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/9ace13520a375f5661415ff7d470f243.svg" alt="" />
                                            <span>
                                                {Math.round(result.correctAnswers * 100 / (result.correctAnswers + result.wrongAnswers)) || 0}
                                                %</span>
                                        </div>
                                    </div>
                                    <div className="four">
                                        <div className='top'>score</div>
                                        <div className='shape'>
                                            <div>{String(result.score).padStart(2, '0')}<span>/{questions.length * 5}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {showResult ? (
                            <div className="check">
                                <button className='skip' onClick={() => { window.location.reload() }}>RETRY</button>
                                <button onClick={() => handleSubmit()}
                                >CONTINUE</button>
                            </div>)
                            : checked === null ? (
                                <div className="check">
                                    <button className='skip' onClick={onClickSkip}>SKIP</button>
                                    {progress !== questions.length ?
                                        (<button className={selectedAnswerIndex === null ? 'disabled' : null}
                                            onClick={() => OnCheck(selectedAnswerIndex)}
                                        >CHECK</button>)
                                        : (<button onClick={onClickNext}>{name}</button>)}
                                </div>)
                                : checked ? (
                                    <div className="check">
                                        <button >CORRECT !</button>
                                        <button onClick={onClickNext}
                                        >{name}</button>
                                    </div>) : (
                                    <div className="check wrong">
                                        <button >WRONG !</button>
                                        <div className="cans">Correct Solution<h3>option [ {correctAnswer} ]</h3></div>
                                        <button onClick={onClickNext}
                                        >{name}</button>
                                    </div>
                                )}
                    </Container>
            }
        </>
    )
}

const Containererror = styled.div`
display: flex;
justify-content: center;
height: 100vh;
align-items: center;
overflow: hidden;
.errorr{
    width: 80%;
    z-index: -1;
}`;

const ContainerError = styled.div`
display: flex;
justify-content: safe center;
align-items: safe center;
height:100vh;
width: 100vw;
`

const Container = styled.div`
background-color: #0f0f0f;
display: flex;
flex-direction: column;
align-items: center;
/* border: 1px solid white; */
color: white;
.bar{
    display: flex;
    flex-direction: row;
    width: 1000px;
    align-items: center;
    gap: 30px;
    padding: 50px 0;
    img{
        cursor: pointer;
    }
    .progress-container {
          width: 100%;
          background-color: #33333380;
          border-radius: 16px;
          height: 16px;
         }
        .progress-bar {
          width: 0;
          height: 16px;
          border-radius: 16px;
          background: linear-gradient(to left, #FF5722, #FFC107);
         }
         .heartdiv{
         flex-direction: row;
         display: flex;
         transform: translateY(-3%);
         gap:4px;
          .heart{
         width: 30px;
      }
       span{
      transform: translateY(9%);
     }
  }     
}
.result{
    width:1000px ;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 87vh;
    justify-content: center;
    flex-basis: 50% 1;
    .resultdiv{
        width: 50%;
        display: grid;
        height: 400px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 10px;
        .one,.two,.three,.four{
            border: 1.5px solid rgb(206,130,255);
            margin: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            div{
                padding: 10px;
            }
            .top{
                background: rgb(206,130,255);
                border-top: 1.5px solid rgb(206,130,255);
                border-top-right-radius: 16px;
                border-top-left-radius:16px;
                padding-bottom:20px;
                font-size: 1.1rem;
                text-transform:uppercase;
                font-weight: 600;
            }
            .shape{
                border-top: 1.5px solid rgb(206,130,255);
                border-radius: 16px;
                transform: translateY(-15px);
                background-color: #0f0f0f;
                display: flex;
                justify-content: center;
                gap: 15px;
                align-items: center;
                img{
                    width: 20%;
                    transform: translateY(20px);
                }
                span{
                    font-size: 2rem;
                    color: rgb(206,130,255);
                    transform: translateY(24px);
                }
            }
            border-radius: 16px;
        }
        .two{
            border: 1.5px solid rgb(88,204,2);
            .top{
                background: rgb(88,204,2);
                border-top: 1.5px solid rgb(88,204,2);
            }
            .shape{
                img{
                    width: 25%;
                    transform: translateY(24px);
                }
                border-top: 1.5px solid rgb(88,204,2);
                span{
                color:rgb(88,204,2) ;
                transform: translateY(25px);
                font-size: 1.8rem;
            }
            }
        }
        .three{
            border: 1.5px solid #1cb0f6;
            .top{
                background: #1cb0f6;
                border-top: 1.5px solid #1cb0f6;
            }
            .shape{
                img{
                    width: 27%;
                    transform: translateY(19px);
                }
                border-top: 1.5px solid #1cb0f6;
                span{
                color:#1cb0f6 ;
                transform: translateY(25px);
                font-size: 1.9rem;
            }
            }
        }
        .four{
            border: 1.5px solid goldenrod;
            .top{
                background: goldenrod;
                border-top: 1.5px solid goldenrod;
            }
            .shape{
                border-top: 1.5px solid goldenrod;
                div{
                color:#ffffff ;
                font-size: 2.1rem;
                transform: translateY(21px);
                span{
                font-size: 1.3rem;
                color: #77777780;
                }
            }
            }
        }
    }
}
.question{
    width: 600px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* height: 540px; */
    padding-bottom: 50px;
    height:calc(100vh - 276px);
    overflow-y: scroll;
    scroll-behavior: smooth;
    &::-webkit-scrollbar{
    width: 0;
  }
    .question-text{
        h4{
            font-size: 1.7rem;
            margin: 0;
            line-height: 1.3;
        }
        h3{
            font-weight: 500;
            color: #333333cc;
        }
        span{
            font-size: 2.5rem;
            color: white;
        }
    }
    .answer-section{
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding: 15px;
        button{
            text-align: left;
            padding: 15px 20px;
            border-radius: 12px;
            border: 1.5px solid #333;
            font-size: 1.1rem;
            line-height: 1.2;
            color: #ffffffcc;
            background-color: #0f0f0f;
            box-shadow: 3px 3px 4px 0px rgba(255,255,255,0.1);
            cursor: pointer;
            &:hover{
                color: #ffffff;
                border: 1.5px solid #ffffff;
                box-shadow: 2px 2px 3px 0px #ffffff;
                opacity: 0.8;
            }
        }
        .selected{
            border: 1.5px solid #1cb0f6;
            border: 1.5px solid #1cb0f6;
            color: #1cb0f6;
            box-shadow: 2px 2px 4px 0px #1cb0f6;
            &:hover{
                border: 1.5px solid #1cb0f6;
                color: #1cb0f6;
                box-shadow: 2px 2px 4px 0px #1cb0f6;
                opacity: 1;
            }
        }
        .crect{
            border: 1.5px solid #58a700;
            color: #58a700;
            background: #d7ffb8;
            box-shadow: 2px 2px 4px 0px #58a700;
        }
        .wrng{
            border: 1.5px solid #ea2b2b;
            color: #ea2b2b;
            background: #ffdfe0;
            box-shadow: 2px 2px 4px 0px #ea2b2b;
        }
    }
    .dis{
        pointer-events: none;
    }
}
.check{
   position: fixed;
   justify-self: flex-end;
   background: #0f0f0f;
   align-items: center;
   bottom: 0;
   border-top: 1.5px solid #333;
   display: flex;
   justify-content: space-between;
   width: 1000px;
   padding: 50px 40px;
   .cans{
            position: absolute;
            width: 190px;
            font-size: 0.9rem;
            text-align: center;
            height: 100px;
            left: 230px;
            cursor: pointer;
            top: 34px;
            padding: 23px 17px;
            color: #ffffff;
            text-transform: uppercase;
            border-radius:14px;
            background-color: #0f0f0f;
            h3{
                margin: 6px 15px;
                font-weight: normal;
                font-size: 1rem;
                color: #58cc02;
                text-align: center;
            }
    }
   button{
    width: 150px;
    height: 45px;
    border-radius: 16px;
    font-weight: 600;
    font-size: 1.1rem;
    font-family:"Bricolage Grotesque";
    background-color: #58cc02;
    border: none;
    box-shadow: 0px 4px 0px 0px green;
    border-bottom: 1.5px solid green;
    color: #ffffff;
    cursor: pointer;
    &:active{
        box-shadow: none;
        transform: translateY(5%);
    }
    &:hover{
        opacity: 0.8;
    }
   }
   .skip{
    background-color: #0f0f0f;
    box-shadow: 0px 4px 0px 0px #333;
    border: 1.5px solid #333;
    color: #afafaf;
   }
   .disabled{
    background-color: #e5e5e580;
    box-shadow: 0px 4px 0px 0px #444;
    border-bottom: 1.5px solid #777;
    color: #22222280;
    &:hover{
     opacity: 1;
    }
   }
}
.wrong{
    button{
      background-color: #ff4b4b;
      box-shadow: 0px 4px 0px 0px red;
      border-bottom: 1.5px solid red;
      color: white;
    }
}
`

export default Quiz