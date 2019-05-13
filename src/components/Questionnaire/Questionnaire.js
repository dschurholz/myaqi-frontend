// SiteDetails.js

// eslint-disable-next-line
import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

import { userActions } from '../../actions';

class Questionnaire extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  constructor (props) {
    super(props);

    this.state = {
      answers: {},
      submitted: false
    };

    
    this.handleAnswerInputChange = this.handleAnswerInputChange.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(userActions.getQuestionnaire());
  }

  componentDidMount() {
    const { answers, questionnaire, onInit } = this.props;
    var upAnswers = {};

    for (let ans in answers) {
      upAnswers[answers[ans].question_id] = answers[ans].answer_id;
    }
    
    this.setState({
      answers: upAnswers
    });

    if (onInit && typeof onInit === 'function') { 
      onInit((questionnaire && questionnaire.length) || 0);
    }
  }

  handleAnswerInputChange = e => {
    const { name, value } = e.target;
    const { answers } = this.state;
    const { onChange } = this.props;

    this.setState({
      answers: {
        ...answers,
        [parseInt(name)]: value !== '' ? parseInt(value) : answers[name]
      },
    });

    if (onChange && typeof onChange === 'function') { 
      onChange(e, {
        ...answers,
        [parseInt(name)]: parseInt(value)
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    console.log('submitted', this.state);
  };

  render () {
    const { answers } = this.state;
    const { questionnaire, isFetchingQuestionnaire } = this.props;

    if(!questionnaire && isFetchingQuestionnaire) {
      return (
        <div>
          Retrieving questionnaire.
        </div>
      );
    }

    if(!questionnaire && !isFetchingQuestionnaire) {
      return (
        <div>
          Questionnaire not found.
        </div>
      );
    }

    return (
      <Suspense fallback={this.loading()}>
        {
          questionnaire.map(question => {
            return (
              <FormGroup row key={question.id}>
                <Col md="12">
                  <Label htmlFor={ question.id + 'questionSelect' }>{question.order + '. ' + question.text}</Label>
                </Col>
                <Col md="12">
                  <Input style={{ width: '95%' }} type="select" name={question.id.toString()} id={ question.id + 'questionSelect' } onChange={ this.handleAnswerInputChange } value={answers[question.id]}>
                    <option value="">Please select</option>
                    {question.answers.map(answer => {
                      return (
                        <option key={answer.id} value={answer.id}>{answer.text}</option>
                      );
                    })}
                  </Input>
                </Col>
              </FormGroup>
            );
          })
        }
      </Suspense>
    );
  }
};

function mapStateToProps(state) {
    const { questionnaire, isFetchingQuestionnaire } = state.questionnaire;
  
    return {
        questionnaire: questionnaire,
        isFetchingQuestionnaire: isFetchingQuestionnaire
    };
}

export default connect(
  mapStateToProps,
  null
)(Questionnaire);
