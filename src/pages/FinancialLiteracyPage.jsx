import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  DollarSign, 
  Percent, 
  Calendar, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Calculator,
  Info,
  CheckCircle2,
  Trophy,
  Play,
  RotateCcw,
  X,
  Check
} from "lucide-react";

const topics = [
  {
    id: "apr",
    title: "What is APR?",
    icon: Percent,
    color: "bg-blue-500",
    content: {
      definition: "APR (Annual Percentage Rate) is the yearly interest rate you pay on a loan. It includes both the interest rate and any fees.",
      explanation: "APR represents the true cost of borrowing money. A lower APR means you pay less interest over the life of your loan.",
      example: {
        scenario: "You finance a $30,000 car with a 5% APR over 60 months",
        calculation: "Monthly interest rate = 5% ÷ 12 = 0.417% per month",
        impact: "You'll pay approximately $3,968 in total interest over 5 years"
      },
      tips: [
        "Shop around for the best APR - even 1% difference can save thousands",
        "Your credit score directly affects your APR - higher score = lower rate",
        "Toyota typically offers APRs between 2.9% and 7.9% depending on credit",
        "Consider making a larger down payment to reduce the amount you finance"
      ]
    }
  },
  {
    id: "interest",
    title: "How Interest Works",
    icon: TrendingUp,
    color: "bg-green-500",
    content: {
      definition: "Interest is the cost of borrowing money. It's calculated on the remaining loan balance each month.",
      explanation: "With amortization, you pay more interest at the beginning of the loan and more principal toward the end.",
      example: {
        scenario: "$30,000 loan at 5% APR for 60 months",
        calculation: "Month 1: $125 interest, $440 principal\nMonth 30: $62 interest, $503 principal\nMonth 60: $2 interest, $563 principal",
        impact: "Early payments go mostly to interest, later payments go mostly to principal"
      },
      tips: [
        "Making extra payments early saves more interest than paying extra later",
        "A shorter loan term means less total interest paid",
        "Interest is calculated daily in most cases, so paying early in the month helps",
        "Refinancing to a lower rate can save significant interest"
      ]
    }
  },
  {
    id: "downpayment",
    title: "Down Payments",
    icon: DollarSign,
    color: "bg-purple-500",
    content: {
      definition: "A down payment is the initial cash payment you make when purchasing a vehicle. It reduces the amount you need to finance.",
      explanation: "A larger down payment means a smaller loan, lower monthly payments, and less interest paid overall.",
      example: {
        scenario: "$30,000 car with different down payment amounts",
        calculation: "$0 down: $566/month, $3,968 interest\n$5,000 down: $471/month, $3,260 interest\n$10,000 down: $377/month, $2,620 interest",
        impact: "A $10,000 down payment saves $1,348 in interest and reduces monthly payment by $189"
      },
      tips: [
        "Aim for at least 10-20% down payment to avoid being 'upside down' on your loan",
        "Larger down payments often qualify you for better interest rates",
        "Consider your emergency fund - don't deplete savings for a down payment",
        "Trade-in value can count toward your down payment"
      ]
    }
  },
  {
    id: "loanterm",
    title: "Loan Terms",
    icon: Calendar,
    color: "bg-orange-500",
    content: {
      definition: "Loan term is the length of time you have to repay the loan, typically 36, 48, 60, 72, or 84 months.",
      explanation: "Longer terms mean lower monthly payments but more total interest paid. Shorter terms mean higher payments but less interest.",
      example: {
        scenario: "$30,000 car at 5% APR with $5,000 down",
        calculation: "36 months: $752/month, $2,072 interest\n60 months: $471/month, $3,260 interest\n84 months: $360/month, $5,240 interest",
        impact: "An 84-month loan costs $3,168 more in interest than a 36-month loan"
      },
      tips: [
        "Shorter terms (36-48 months) are best if you can afford the payment",
        "Longer terms (72-84 months) increase risk of being upside down",
        "Consider the vehicle's depreciation - don't finance longer than the car will last",
        "Your monthly payment should be no more than 10-15% of your monthly income"
      ]
    }
  },
  {
    id: "credit",
    title: "Credit Scores & Financing",
    icon: CreditCard,
    color: "bg-red-500",
    content: {
      definition: "Your credit score (300-850) determines the interest rate you qualify for. Higher scores get better rates.",
      explanation: "Lenders use credit scores to assess risk. Excellent credit (750+) gets the best rates, while poor credit (below 600) pays much higher rates.",
      example: {
        scenario: "$30,000 car with $5,000 down over 60 months",
        calculation: "Excellent (750+): 2.9% APR = $448/month, $1,880 interest\nGood (700-749): 4.9% APR = $471/month, $3,260 interest\nFair (650-699): 6.9% APR = $495/month, $4,700 interest\nPoor (<600): 9.9% APR = $530/month, $6,800 interest",
        impact: "A 300-point credit score difference can cost $4,920 more in interest"
      },
      tips: [
        "Check your credit score before shopping - know where you stand",
        "Pay bills on time - payment history is 35% of your score",
        "Keep credit card balances below 30% of limits",
        "Don't open new credit accounts right before applying for a loan",
        "Dispute any errors on your credit report"
      ]
    }
  },
  {
    id: "totalcost",
    title: "Total Cost of Ownership",
    icon: Calculator,
    color: "bg-indigo-500",
    content: {
      definition: "Total cost includes the purchase price, interest, taxes, fees, insurance, maintenance, and fuel.",
      explanation: "The sticker price is just the beginning. Consider all costs over the life of the vehicle to make an informed decision.",
      example: {
        scenario: "$30,000 car over 5 years",
        calculation: "Purchase: $30,000\nInterest (5% APR): $3,968\nTaxes & Fees: $2,400\nInsurance: $6,000\nMaintenance: $3,000\nFuel (15k mi/yr): $7,500",
        impact: "Total 5-year cost: $52,868 - that's 76% more than the sticker price"
      },
      tips: [
        "Factor in insurance costs - sports cars and luxury vehicles cost more",
        "Consider fuel economy - hybrids can save thousands in fuel costs",
        "Budget for maintenance - typically $500-1,000 per year",
        "Research reliability ratings - repairs can add thousands",
        "Consider resale value - some brands hold value better than others"
      ]
    }
  }
];

const quizQuestions = {
  apr: [
    {
      question: "What does APR stand for?",
      options: [
        "Annual Percentage Rate",
        "Average Payment Rate",
        "Auto Purchase Rate",
        "Applied Principal Rate"
      ],
      correct: 0,
      explanation: "APR stands for Annual Percentage Rate, which represents the yearly interest rate you pay on a loan."
    },
    {
      question: "If you have a 6% APR on a $30,000 loan, how much interest will you pay in the first year?",
      options: [
        "$1,800",
        "$600",
        "$300",
        "$1,200"
      ],
      correct: 0,
      explanation: "6% of $30,000 = $1,800. This is the interest you'd pay in the first year (though actual payments include principal too)."
    },
    {
      question: "Which factor most directly affects your APR?",
      options: [
        "Your credit score",
        "The car's color",
        "The dealership location",
        "The time of year"
      ],
      correct: 0,
      explanation: "Your credit score is the primary factor lenders use to determine your APR. Higher scores get better rates."
    }
  ],
  interest: [
    {
      question: "In an amortized loan, what happens to your interest payments over time?",
      options: [
        "They decrease each month",
        "They stay the same",
        "They increase each month",
        "They vary randomly"
      ],
      correct: 0,
      explanation: "Interest payments decrease over time because you're paying down the principal, so there's less balance to charge interest on."
    },
    {
      question: "If you make an extra $500 payment early in your loan, what's the main benefit?",
      options: [
        "Saves more interest than paying later",
        "Reduces your APR",
        "Extends your loan term",
        "Increases your credit score immediately"
      ],
      correct: 0,
      explanation: "Extra payments early in the loan save more interest because you're reducing the principal when interest charges are highest."
    },
    {
      question: "What is the formula for calculating monthly interest?",
      options: [
        "APR ÷ 12",
        "APR × 12",
        "APR × loan amount",
        "APR ÷ loan amount"
      ],
      correct: 0,
      explanation: "Monthly interest rate = APR ÷ 12. For example, 6% APR ÷ 12 = 0.5% per month."
    }
  ],
  downpayment: [
    {
      question: "What's the recommended minimum down payment percentage?",
      options: [
        "10-20%",
        "5-10%",
        "0-5%",
        "25-30%"
      ],
      correct: 0,
      explanation: "Financial experts recommend 10-20% down to avoid being 'upside down' (owing more than the car is worth)."
    },
    {
      question: "How does a larger down payment affect your monthly payment?",
      options: [
        "Decreases it",
        "Increases it",
        "No effect",
        "Depends on the APR"
      ],
      correct: 0,
      explanation: "A larger down payment reduces the amount you finance, which directly lowers your monthly payment."
    },
    {
      question: "If you put $10,000 down on a $30,000 car instead of $5,000, how much less will you finance?",
      options: [
        "$5,000",
        "$10,000",
        "$15,000",
        "$20,000"
      ],
      correct: 0,
      explanation: "You'll finance $5,000 less ($20,000 vs $25,000), which reduces both your monthly payment and total interest."
    }
  ],
  loanterm: [
    {
      question: "What's the main disadvantage of a longer loan term (72-84 months)?",
      options: [
        "You pay more total interest",
        "Your APR increases",
        "You can't refinance",
        "Your credit score drops"
      ],
      correct: 0,
      explanation: "Longer terms mean more interest payments over time, even though monthly payments are lower."
    },
    {
      question: "According to the 20/4/10 rule, what should your maximum loan term be?",
      options: [
        "4 years (48 months)",
        "5 years (60 months)",
        "6 years (72 months)",
        "7 years (84 months)"
      ],
      correct: 0,
      explanation: "The 20/4/10 rule recommends keeping your loan term to 4 years or less to avoid excessive interest."
    },
    {
      question: "Why might someone choose a 60-month loan over a 36-month loan?",
      options: [
        "Lower monthly payments",
        "Less total interest",
        "Better APR",
        "Faster payoff"
      ],
      correct: 0,
      explanation: "A 60-month loan spreads payments over more months, making each payment smaller, though you'll pay more interest overall."
    }
  ],
  credit: [
    {
      question: "What credit score range typically gets the best APR rates?",
      options: [
        "750+",
        "700-749",
        "650-699",
        "600-649"
      ],
      correct: 0,
      explanation: "Credit scores of 750+ are considered excellent and qualify for the best interest rates from lenders."
    },
    {
      question: "How much more interest might someone with poor credit (600) pay vs excellent credit (750) on a $30,000 loan?",
      options: [
        "$4,000-$5,000 more",
        "$1,000-$2,000 more",
        "Same amount",
        "$10,000+ more"
      ],
      correct: 0,
      explanation: "Poor credit can result in 4-5% higher APR, which can add $4,000-$5,000 in extra interest over a 60-month loan."
    },
    {
      question: "What's the most important factor in your credit score?",
      options: [
        "Payment history",
        "Credit card balances",
        "Length of credit history",
        "Number of credit accounts"
      ],
      correct: 0,
      explanation: "Payment history accounts for 35% of your credit score - making payments on time is the most critical factor."
    }
  ],
  totalcost: [
    {
      question: "Besides the purchase price, what's typically the largest cost over 5 years?",
      options: [
        "Interest payments",
        "Insurance",
        "Maintenance",
        "Fuel"
      ],
      correct: 0,
      explanation: "Interest payments are usually the largest additional cost, especially on longer-term loans with higher APRs."
    },
    {
      question: "What percentage more than the sticker price might you pay over 5 years?",
      options: [
        "50-75% more",
        "10-20% more",
        "100% more",
        "5-10% more"
      ],
      correct: 0,
      explanation: "When you factor in interest, taxes, insurance, maintenance, and fuel, total cost is typically 50-75% more than sticker price."
    },
    {
      question: "Which vehicle type typically has the lowest total cost of ownership?",
      options: [
        "Hybrid vehicles",
        "Sports cars",
        "Luxury SUVs",
        "Large trucks"
      ],
      correct: 0,
      explanation: "Hybrids save significantly on fuel costs and often have better resale value, reducing total ownership cost."
    }
  ]
};

export default function FinancialLiteracyPage() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0].id);
  const [showExample, setShowExample] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const currentTopic = topics.find(t => t.id === selectedTopic);
  const currentQuestions = quizQuestions[selectedTopic] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;
  const progress = quizStarted ? ((answeredQuestions.size / totalQuestions) * 100) : 0;

  const handleStartQuiz = () => {
    setQuizMode(true);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const handleAnswerSelect = (index) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowAnswer(true);
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizMode(false);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    if (quizMode) {
      handleResetQuiz();
    }
  };

  return (
    <div className="min-h-screen py-8 px-6 bg-[#e0e0e0]" style={{ paddingTop: '100px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neumorphic p-8 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="neumorphic p-4 bg-[#EB0A1E] rounded-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1C1C1C]">Financial Literacy Center</h1>
              <p className="text-gray-600 mt-2">
                Learn the fundamentals of car financing and make informed decisions
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            <div className="neumorphic p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Topics</h2>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const Icon = topic.icon;
                  const isActive = selectedTopic === topic.id;
                  return (
                    <motion.button
                      key={topic.id}
                      onClick={() => {
                        handleTopicChange(topic.id);
                        setShowExample(true);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 ${
                        isActive
                          ? "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-[#EB0A1E]"
                          : "neumorphic-button text-[#1C1C1C] hover:text-[#EB0A1E]"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg ${topic.color} bg-opacity-20`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#EB0A1E]' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-medium">{topic.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTopic}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Topic Header */}
                <div className="neumorphic p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl ${currentTopic.color} bg-opacity-20`}>
                        {React.createElement(currentTopic.icon, {
                          className: "w-8 h-8 text-[#EB0A1E]"
                        })}
                      </div>
                      <h2 className="text-3xl font-bold text-[#1C1C1C]">
                        {currentTopic.title}
                      </h2>
                    </div>
                    {!quizMode && (
                      <motion.button
                        onClick={handleStartQuiz}
                        className="flex items-center gap-2 px-6 py-3 toyota-red-button text-white rounded-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-5 h-5" />
                        Start Quiz
                      </motion.button>
                    )}
                    {quizMode && (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Score</div>
                          <div className="text-2xl font-bold text-[#EB0A1E]">
                            {score}/{totalQuestions}
                          </div>
                        </div>
                        <motion.button
                          onClick={handleResetQuiz}
                          className="p-3 neumorphic-button rounded-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <RotateCcw className="w-5 h-5 text-[#1C1C1C]" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  {quizMode && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-semibold text-[#1C1C1C]">
                          {answeredQuestions.size}/{totalQuestions} answered
                        </span>
                      </div>
                      <div className="neumorphic-inset h-3 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-[#EB0A1E] to-[#ff4466]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quiz Mode */}
                {quizMode && currentQuestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="neumorphic p-8"
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-[#EB0A1E]">
                          Question {currentQuestionIndex + 1} of {totalQuestions}
                        </span>
                        {showAnswer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              selectedAnswer === currentQuestion.correct
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {selectedAnswer === currentQuestion.correct ? (
                              <>
                                <Check className="w-5 h-5" />
                                <span className="font-semibold">Correct!</span>
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5" />
                                <span className="font-semibold">Incorrect</span>
                              </>
                            )}
                          </motion.div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-[#1C1C1C] mb-6">
                        {currentQuestion.question}
                      </h3>
                    </div>

                    <div className="space-y-3 mb-6">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correct;
                        const showResult = showAnswer;

                        let buttonClass = "neumorphic-button text-left p-4 w-full transition-all";
                        if (showResult) {
                          if (isCorrect) {
                            buttonClass = "bg-green-100 border-2 border-green-500 text-green-800 text-left p-4 w-full";
                          } else if (isSelected && !isCorrect) {
                            buttonClass = "bg-red-100 border-2 border-red-500 text-red-800 text-left p-4 w-full";
                          } else {
                            buttonClass = "neumorphic-inset text-gray-500 text-left p-4 w-full";
                          }
                        } else if (isSelected) {
                          buttonClass = "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] bg-[#EB0A1E] bg-opacity-10 border-2 border-[#EB0A1E] text-[#1C1C1C] text-left p-4 w-full";
                        }

                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={buttonClass}
                            whileHover={!showResult ? { scale: 1.02 } : {}}
                            whileTap={!showResult ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                showResult && isCorrect ? "bg-green-500 text-white" :
                                showResult && isSelected ? "bg-red-500 text-white" :
                                isSelected ? "bg-[#EB0A1E] text-white" :
                                "neumorphic-inset"
                              }`}>
                                {showResult && isCorrect && <Check className="w-4 h-4" />}
                                {showResult && isSelected && !isCorrect && <X className="w-4 h-4" />}
                                {!showResult && isSelected && <Check className="w-4 h-4" />}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="neumorphic-inset p-4 mb-6"
                      >
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-[#EB0A1E] flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold text-[#1C1C1C] mb-1">Explanation:</p>
                            <p className="text-gray-700">{currentQuestion.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      {!showAnswer ? (
                        <motion.button
                          onClick={handleSubmitAnswer}
                          disabled={selectedAnswer === null}
                          className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                            selectedAnswer !== null
                              ? "toyota-red-button text-white"
                              : "neumorphic-button text-gray-400 cursor-not-allowed"
                          }`}
                          whileHover={selectedAnswer !== null ? { scale: 1.02 } : {}}
                          whileTap={selectedAnswer !== null ? { scale: 0.98 } : {}}
                        >
                          Submit Answer
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={handleNextQuestion}
                          className="flex-1 py-4 toyota-red-button text-white rounded-xl font-semibold"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "View Results"}
                        </motion.button>
                      )}
                    </div>

                    {showAnswer && currentQuestionIndex === totalQuestions - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 neumorphic p-6 text-center"
                      >
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">
                          Quiz Complete!
                        </h3>
                        <p className="text-xl text-gray-700 mb-4">
                          You scored {score} out of {totalQuestions}
                        </p>
                        <div className="text-4xl font-bold text-[#EB0A1E] mb-4">
                          {Math.round((score / totalQuestions) * 100)}%
                        </div>
                        <p className="text-gray-600 mb-6">
                          {score === totalQuestions
                            ? "Perfect score! You're a financial expert! 🎉"
                            : score >= totalQuestions * 0.7
                            ? "Great job! You have a solid understanding! 👍"
                            : "Good effort! Review the topics and try again! 📚"
                          }
                        </p>
                        <motion.button
                          onClick={handleResetQuiz}
                          className="px-8 py-3 neumorphic-button text-[#1C1C1C] rounded-xl font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Take Another Quiz
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Learning Mode */}
                {!quizMode && (
                  <>

                {/* Definition */}
                <div className="neumorphic p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="w-6 h-6 text-[#EB0A1E] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">Definition</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {currentTopic.content.definition}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="neumorphic p-6">
                  <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">How It Works</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {currentTopic.content.explanation}
                  </p>
                </div>

                {/* Example */}
                <div className="neumorphic p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#1C1C1C]">Real-World Example</h3>
                    <button
                      onClick={() => setShowExample(!showExample)}
                      className="text-sm text-[#EB0A1E] hover:underline"
                    >
                      {showExample ? "Hide" : "Show"} Example
                    </button>
                  </div>
                  {showExample && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3"
                    >
                      <div className="neumorphic-inset p-4">
                        <p className="font-semibold text-[#1C1C1C] mb-2">
                          {currentTopic.content.example.scenario}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-[#EB0A1E] mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                              {currentTopic.content.example.calculation}
                            </p>
                          </div>
                          <div className="mt-3 p-3 bg-[#EB0A1E] bg-opacity-10 rounded-lg">
                            <p className="text-sm font-semibold text-[#1C1C1C]">
                              💡 Impact: {currentTopic.content.example.impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Tips */}
                <div className="neumorphic p-6">
                  <h3 className="text-xl font-bold text-[#1C1C1C] mb-4">Pro Tips</h3>
                  <div className="space-y-3">
                    {currentTopic.content.tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 neumorphic-inset"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Reference Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 neumorphic p-6"
        >
          <h3 className="text-xl font-bold text-[#1C1C1C] mb-4">Quick Reference: The 20/4/10 Rule</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="neumorphic-inset p-4 text-center">
              <div className="text-3xl font-bold text-[#EB0A1E] mb-2">20%</div>
              <p className="text-sm text-gray-700">Down Payment</p>
              <p className="text-xs text-gray-600 mt-1">Put at least 20% down to avoid being upside down</p>
            </div>
            <div className="neumorphic-inset p-4 text-center">
              <div className="text-3xl font-bold text-[#EB0A1E] mb-2">4 Years</div>
              <p className="text-sm text-gray-700">Loan Term</p>
              <p className="text-xs text-gray-600 mt-1">Keep your loan term to 4 years or less</p>
            </div>
            <div className="neumorphic-inset p-4 text-center">
              <div className="text-3xl font-bold text-[#EB0A1E] mb-2">10%</div>
              <p className="text-sm text-gray-700">Monthly Income</p>
              <p className="text-xs text-gray-600 mt-1">Payment should be ≤10% of gross monthly income</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

