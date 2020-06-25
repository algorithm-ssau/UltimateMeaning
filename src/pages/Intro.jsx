import React, {Component} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 150px;
    font-size: 30px;
    text-align: center;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    font-size: 40px;
`

class Intro extends Component {
    render() {
        return <Wrapper>
            <h1>Предлагаем Вам принять участие в исследовании!</h1>
            <br/>
            <p>Вам будет задаваться вопрос: «Зачем люди делают что-то?».</p>
            <p>Ответ должен соответствовать вопросу, то есть
                начинаться со «чтобы...», но не «потому что...».</p>
            <p>Вам нужно дать максимальное количество ответов на каждый вопрос.</p>
            <p>Начнем?</p>
            <br/>
            <Link to="/testing">
                <Button type="button">
                    Начать!
                </Button>
            </Link>
        </Wrapper>
    }
}

export default Intro