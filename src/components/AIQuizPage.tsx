import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, TextField } from '@mui/material';
import ThreeDLoader from './ThreeDLoader';
import { useNavigate } from 'react-router-dom';
import ResultPieChart from './ResultPieChart';

const AIQuizPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  // API key is loaded from environment variable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showEnd, setShowEnd] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const navigate = useNavigate();

  const generateQuiz = async (topicToUse: string) => {
    if (!topicToUse) {
      setError('Please enter a quiz topic.');
      return;
    }
    if (!apiKey) {
      setError('Gemini API key is not set in the environment.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a 5-question multiple choice quiz on the topic: ${topicToUse}. For each question, also provide a short information/explanation (max 50 words) about the question as an 'info' field.\nRespond ONLY with a valid JSON array in this format: [{\"question\":\"...\",\"options\":[...],\"answer\":0,\"info\":\"...\"}, ...] No explanation, no markdown, no extra text.` }] }]
        })
      });
      const data = await res.json();
      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      rawText = rawText.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
      let parsed: any[] = [];
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        setError('Could not parse quiz from AI response: ' + rawText);
        setLoading(false);
        return;
      }
      const questions = parsed.map((q, idx) => ({
        id: `aiq${Date.now()}_${idx}`,
        text: q.question || q.text || '',
        options: q.options || [],
        correctAnswer: typeof q.answer !== 'undefined' ? q.answer : (typeof q.correctAnswer !== 'undefined' ? q.correctAnswer : 0),
        info: q.info || '',
      }));
      setQuestions(questions);
      setCurrentQuestion(0);
      setShowEnd(false);
      setShowResults(false);
      setScore(0);
      setSelected(null);
      setQuizStarted(true);
    } catch (e) {
      setError('Failed to fetch quiz from Gemini API.');
    }
    setLoading(false);
  };

  const handleStart = async () => {
    generateQuiz(topic);
  };


  const handleAnswer = (idx: number) => {
    setSelected(idx);
    if (questions[currentQuestion].answer === idx) setScore(score + 1);
    setTimeout(() => {
      if (currentQuestion + 1 === questions.length) {
        setShowResults(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelected(null);
      }
    }, 800);
  };

  const handleEndQuiz = () => {
    setShowEnd(true);
  };

  const handleConfirmEnd = () => {
    setShowResults(true);
  };

  if (!quizStarted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>AI Quiz Generator</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Enter a topic and your Gemini API key to generate a quiz!</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Quiz Topic" value={topic} onChange={e => setTopic(e.target.value)} fullWidth />
            {error && <Typography color="error">{error}</Typography>}
            <Button variant="contained" onClick={handleStart} disabled={loading} sx={{ mt: 2 }}>Generate Quiz</Button>
            {loading && <ThreeDLoader />}
          </Box>
        </Paper>
      </Container>
    );
  }

  if (showResults) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>Quiz Results</Typography>
          {/* Pie chart for results */}
          <ResultPieChart correct={score} total={questions.length} />
          <Typography variant="h6" sx={{ mb: 2 }}>Score: {score} / {questions.length}</Typography>
          <Button variant="contained" onClick={() => navigate('/quizzes')} sx={{ mr: 2 }}>
            Back to Quizzes
          </Button>
          <Button variant="outlined" onClick={() => generateQuiz(topic)} disabled={loading}>
            {loading ? 'Generating...' : 'Generate More Questions'}
          </Button>
        </Paper>
      </Container>
    );
  }

  const q = questions[currentQuestion];
  // Correct answer logic
  const showAnswer = selected !== null;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>AI Quiz</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Question {currentQuestion + 1} of {questions.length}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {q.text}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {/* Option buttons with feedback */}
            {q.options.map((option: string, index: number) => {
              let bgColor = '#111';
              let textColor = '#fff';
              let boxShadow = 'none';
              if (showAnswer) {
                if (selected === q.correctAnswer && index === selected) {
                  // Selected correct answer
                  bgColor = '#4CAF50';
                  textColor = '#fff';
                  boxShadow = '0 0 16px 2px #4CAF50, 0 0 32px 8px #4CAF50';
                } else if (selected !== q.correctAnswer) {
                  if (index === selected) {
                    // Selected wrong answer
                    bgColor = '#F44336';
                    textColor = '#fff';
                    boxShadow = '0 0 16px 2px #F44336, 0 0 32px 8px #F44336';
                  } else if (index === q.correctAnswer) {
                    // The correct answer (not selected)
                    bgColor = '#4CAF50';
                    textColor = '#fff';
                    boxShadow = '0 0 16px 2px #4CAF50, 0 0 32px 8px #4CAF50';
                  }
                }
              }
              let emoji = null;
              if (showAnswer) {
                if (index === q.correctAnswer) {
                  emoji = <span style={{ marginLeft: 12, fontSize: '1.3em' }}>✅</span>;
                } else if (index === selected && selected !== q.correctAnswer) {
                  emoji = <span style={{ marginLeft: 12, fontSize: '1.3em' }}>❌</span>;
                }
              }
              return (
                <Button
                  key={index}
                  fullWidth
                  variant="contained"
                  color={selected === index ? 'primary' : 'inherit'}
                  onClick={() => {
                    if (selected !== null) return;
                    setSelected(index);
                    if (index === q.correctAnswer) setScore(score + 1);
                  }}
                  disabled={showAnswer}
                  sx={{
                    backgroundColor: bgColor,
                    color: textColor,
                    boxShadow,
                    mb: 1,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: showAnswer ? bgColor : selected === index ? 'primary.dark' : 'primary.light',
                      boxShadow,
                    },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{option}</span>
                  {emoji}
                </Button>
              );
            })}
          </Box>
          {/* Show info/explanation after answering */}
          {showAnswer && q.info && (
            <Box sx={{ mt: 3, p: 2, background: '#111', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>Info</Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>{q.info}</Typography>
            </Box>
          )}

          {/* Next button after answering */}
          {showAnswer && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 1, float: 'right' }}
              onClick={() => {
                if (currentQuestion + 1 === questions.length) {
                  setShowResults(true);
                } else {
                  setCurrentQuestion(currentQuestion + 1);
                  setSelected(null);
                }
              }}
            >
              {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
            </Button>
          )}
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={handleEndQuiz}>End Quiz</Button>
        </Box>
        {showEnd && (
          <Paper sx={{ mt: 3, p: 2, background: '#ffeaea', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>Are you sure you want to end the quiz?</Typography>
            <Button variant="contained" color="error" onClick={handleConfirmEnd} sx={{ mr: 2 }}>Yes, End</Button>
            <Button variant="outlined" onClick={() => setShowEnd(false)}>No, Continue</Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default AIQuizPage;
