"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
// Optional: For showing toast notifications

interface Question {
  id: number;
  question: string;
  type: "radio" | "slider";
  options?: string[];
}

const questions: Question[] = [
  {
    id: 1,
    type: "radio",
    question: "What is your preferred working style?",
    options: [
      "I prefer working independently",
      "I enjoy a mix of independent and team work",
      "I thrive in collaborative environments",
    ],
  },
  {
    id: 2,
    type: "radio",
    question: "How do you handle project deadlines?",
    options: [
      "I complete work well ahead of deadlines",
      "I pace myself to finish just in time",
      "I work best under pressure close to deadlines",
    ],
  },
  {
    id: 3,
    type: "slider",
    question: "Rate your comfort level with public speaking (1-10)",
  },
  {
    id: 4,
    type: "radio",
    question: "What role do you typically take in a team?",
    options: [
      "Leader/Coordinator",
      "Creative/Innovator",
      "Implementer/Doer",
      "Analyzer/Researcher",
    ],
  },
  {
    id: 5,
    type: "slider",
    question:
      "Rate your technical skills in your primary programming language (1-10)",
  },
  {
    id: 6,
    type: "radio",
    question: "How do you prefer to communicate in a team?",
    options: [
      "Primarily through written communication (email, chat)",
      "Mix of written and verbal communication",
      "Primarily through verbal communication (calls, meetings)",
    ],
  },
  {
    id: 7,
    type: "radio",
    question: "What type of projects interest you most?",
    options: [
      "Frontend/UI Development",
      "Backend/API Development",
      "Full-stack Development",
      "Data Analysis/ML",
    ],
  },
  {
    id: 8,
    type: "slider",
    question: "Rate your problem-solving skills (1-10)",
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast(); // Optional for notifications

  const handleAnswerChange = (value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);

    const payload = {
      username: "Prasad", // Replace with dynamic username if needed
      answers: Object.values(answers),
    };

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save quiz results");
      }

      const responseData = await response.json();
      toast({
        title: "Success",
        description: responseData.message,
        status: "success",
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">{question.question}</h2>

        {question.type === "radio" && (
          <RadioGroup
            onValueChange={handleAnswerChange}
            value={answers[question.id]?.toString()}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "slider" && (
          <div className="space-y-4">
            <Slider
              min={1}
              max={10}
              step={1}
              value={[(answers[question.id] as number) || 1]}
              onValueChange={(value) => handleAnswerChange(value[0])}
            />
            <div className="text-center font-medium">
              Selected: {answers[question.id] || 1}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quiz Completed!</h2>
        <p>Your responses have been recorded successfully!</p>
        {isSubmitting && <p>Saving your responses...</p>}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Team Matching Quiz</CardTitle>
        <CardDescription>
          Help us find your ideal team members by answering a few questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progressPercentage} className="w-full" />

        {!showResult ? (
          <>
            {renderQuestion()}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[questions[currentQuestion].id]}
              >
                {currentQuestion === questions.length - 1
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit"
                  : "Next"}
              </Button>
            </div>
          </>
        ) : (
          renderResult()
        )}
      </CardContent>
    </Card>
  );
}
