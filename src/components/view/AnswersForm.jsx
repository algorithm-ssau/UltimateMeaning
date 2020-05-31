import React, {Component} from 'react'
import styled from "styled-components";

const Title = styled.h1`
    text-align: center;
    margin-top: 10px;
    margin-bottom: 40px;
`

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 0px;
`

const Label = styled.label`
    margin: 0px;
`

const QuestionLabel = styled(Label)`
    font-size: 20px;
`

const Table = styled.table`
    margin-bottom: 0;
`

const SectionDelimiter = styled.div`
    margin-top: 30px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin-bottom: 10px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 0px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
    color: #fff !important;
`

const answerStartText = "Чтобы ";

export default class AnswersForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newAnswer: answerStartText
        }
    }

    handleChangeInputOldAnswer = async event => {
        const oldAnswer = event.target.value;
        this.setState({oldAnswer})
    }

    handleChangeInputNewAnswer = async event => {
        let newAnswer = event.target.value
        if (!newAnswer.startsWith(answerStartText)) {
            newAnswer = answerStartText;
        }
        this.setState({newAnswer: newAnswer})
    }

    handleAddAnswer = async () => {
        if (this.state.oldAnswer && this.state.oldAnswer !== "") {
            this.props.tester.addOldAnswer(this.state.oldAnswer);
            this.state.oldAnswer = "";
        } else if (this.state.newAnswer !== answerStartText) {
            this.props.tester.addNewAnswer(this.state.newAnswer);
            this.state.newAnswer = answerStartText;
        } else {
            alert("Не введена информация о добавляемом ответе.");
        }
    }

    render() {
        let currentAnswers;
        if (this.props.tester.getCurrentAnswers().length === 0) {
            currentAnswers = <Label>Нет</Label>;
        } else {
            currentAnswers = <Table className={"table table-bordered table-responsive-md table-striped"}>
                <tbody>
                {this.props.tester.getCurrentAnswers().map(function (answer) {
                    return <tr>
                        <td>{answer.text}</td>
                    </tr>;
                })}
                </tbody>
            </Table>;
        }

        return <Wrapper>
            <Title>Добавление ответов</Title>
            <QuestionLabel>{this.props.tester.getCurrentQuestion().text}?</QuestionLabel>

            <SectionDelimiter/>
            <Label>Текущие ответы: </Label>
            <br/>
            {currentAnswers}

            <SectionDelimiter/>
            <Label>Введите новый ответ:</Label>
            <InputText
                type="text"
                value={this.state.newAnswer}
                onChange={this.handleChangeInputNewAnswer}
            />

            <Label>Или выберите существующий:</Label>
            <select className="form-control" onChange={this.handleChangeInputOldAnswer} value={this.state.oldAnswer}>
                <option value={""}/>
                {this.props.tester.getAvailableAnswers().map(function (answer) {
                    return <option value={answer.id}>
                        {answer.text}
                    </option>;
                })}
            </select>

            <Button onClick={this.handleAddAnswer}>Добавить ответ</Button>
            <CancelButton onClick={this.props.tester.nextQuestion}>Всё, с этим вопросом закончил</CancelButton>
        </Wrapper>
    }
}
