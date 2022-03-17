/**
 *
 * Quiz
 *
 */
import React, { useEffect, useRef, useState } from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { hooks, sendAnswers } from 'utils/metamask';

import { useInterval } from '../../../utils/hooks';

import surveyData from './survey.json';

const { useAccounts, useIsActive, useProvider } = hooks;

const loadData = () => JSON.parse(JSON.stringify(surveyData));

export function Answer(props) {
  const { questions, index, selectedAnswer, setAnswer } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          item
          xs={8}
        >
          <Typography>{questions[index].text} </Typography>
          {questions[index].options.map((e, i) => (
            <Button
              onClick={() => setAnswer(i)}
              key={e.text}
              variant={selectedAnswer == i ? 'contained' : 'outlined'}
              size="small"
            >
              {e.text}
            </Button>
          ))}
        </Grid>
        <Grid item xs={4}>
          <img
            src={questions[index].image}
            style={{ height: 'auto', width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function Quiz() {
  const [data, setData] = useState<any>(null);
  const [index, setIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const maxQuestions = useRef<number>(0);
  const answers = useRef<number[]>([]);

  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  const [delay, setDelay] = useState<number>(1000);
  const [start, setStart] = useState<boolean>(false);

  useInterval(
    () => {
      handleAnsweredQuestion();
    },
    start ? delay : null,
  );

  useEffect(() => {
    const ldata = loadData();
    maxQuestions.current = ldata.questions.length;
    setData(ldata);
  }, []);

  const handleAnsweredQuestion = () => {
    answers.current.push(selectedAnswer);
    if (maxQuestions.current - 1 == index) {
      setStart(false);
      setFinished(true);
      return;
    }
    setDelay(data.questions[index + 1].lifetimeSeconds * 1000);
    setIndex(index + 1);
  };

  const submitAnswers = () => {
    sendAnswers(answers.current, provider, accounts);
  };

  if (!data) return <></>;
  if (!start && !finished)
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop={1}
      >
        <Button
          onClick={() => {
            setStart(true);
            setDelay(data.questions[index].lifetimeSeconds * 1000);
          }}
          fullWidth
          variant="contained"
          size="small"
          color="success"
          disabled={!isActive}
        >
          Start Quiz
        </Button>
      </Grid>
    );

  if (finished)
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop={1}
        padding={1}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          item
        >
          <Typography>Answers overview: </Typography>
          {answers.current.map((e, i) => (
            <Typography key={i} variant="h6" component="div">
              {data.questions[i].options[e].text}
            </Typography>
          ))}
        </Grid>
        <Button
          onClick={() => {
            console.log(answers.current);
            submitAnswers();
          }}
          fullWidth
          variant="contained"
          size="small"
          color="success"
        >
          Submit
        </Button>
      </Grid>
    );

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      padding={1}
    >
      <Card sx={{ maxWidth: 600, marginTop: '24px' }}>
        <CardMedia
          component="img"
          height="200"
          image={data.image}
          alt="Quiz Media title"
        />
        <CardContent>
          <Answer
            selectedAnswer={selectedAnswer}
            setAnswer={setSelectedAnswer}
            questions={data.questions}
            index={index}
          />
        </CardContent>
        <CardActions>
          <Button
            onClick={handleAnsweredQuestion}
            fullWidth
            variant="contained"
            size="small"
            color="success"
            disabled={!isActive}
          >
            Next
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
