import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const questions = [
  {
    id: 1,
    question: "Что такое растровая графика и в чём её основные отличия от векторной?",
    options: [
      "Растровая графика состоит из математических формул, а векторная — из пикселей.",
      "Растровая графика состоит из пикселей, каждый из которых имеет свой цвет и яркость, а векторная использует математические формулы и векторы для описания форм и линий. При увеличении растрового изображения качество может ухудшаться, а векторные изображения масштабируемы без потери качества.",
      "Растровая и векторная графика ничем не отличаются, разница только в программах для их создания.",
      "Растровая графика используется только для текста, а векторная — для изображений."
    ],
    correct: 1,
    explanation: "Растровая графика состоит из пикселей, что делает её зависимой от разрешения, в то время как векторная использует математические описания форм."
  },
  {
    id: 2,
    question: "Перечислите основные разновидности компьютерной графики.",
    options: [
      "Только растровая и векторная.",
      "Только фрактальная и векторная.",
      "Растровая, векторная и фрактальная.",
      "Трёхмерная, двухмерная и объёмная."
    ],
    correct: 2,
    explanation: "Основные виды компьютерной графики включают растровую, векторную и фрактальную графику."
  },
  {
    id: 3,
    question: "Что такое фрактальная графика и где она применяется?",
    options: [
      "Фрактальная графика — это вид растровой графики, используется исключительно в печати.",
      "Фрактальная графика основана на повторении простых математических формул для создания сложных структур, применяется в создании фоновых изображений, текстур и для визуализации математических и научных данных.",
      "Фрактальная графика используется только в анимации и кино.",
      "Фрактальная графика — это разновидность векторной графики, применяется исключительно в веб-дизайне."
    ],
    correct: 1,
    explanation: "Фрактальная графика основывается на математических алгоритмах для создания самоподобных структур."
  },
  {
    id: 4,
    question: "Какие существуют цветовые модели в компьютерной графике?",
    options: [
      "Только RGB.",
      "Только CMYK.",
      "RGB и CMYK.",
      "HSL и HSV."
    ],
    correct: 2,
    explanation: "Основные цветовые модели включают RGB (для мониторов) и CMYK (для печати), а также HSL и HSV."
  },
  {
    id: 5,
    question: "Для чего нужна стандартизация в компьютерной графике?",
    options: [
      "Для усложнения работы с графическими программами.",
      "Для обеспечения совместимости между различными программами, устройствами и платформами, упрощения обмена данными и сохранения качества изображений.",
      "Для ограничения использования определённых форматов графических файлов.",
      "Для создания единых правил создания логотипов и брендинга."
    ],
    correct: 1,
    explanation: "Стандартизация обеспечивает совместимость и единообразие в работе с графическими данными."
  }
];

interface TestResult {
  question: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

interface UserStats {
  name: string;
  score: number;
  totalTime: number;
  completedAt: Date;
}

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [activeTab, setActiveTab] = useState<'test' | 'stats' | 'rating'>('test');
  const [userStats] = useState<UserStats[]>([
    { name: "Анна С.", score: 95, totalTime: 420, completedAt: new Date() },
    { name: "Михаил К.", score: 88, totalTime: 380, completedAt: new Date() },
    { name: "Елена Д.", score: 82, totalTime: 450, completedAt: new Date() },
    { name: "Вы", score: 0, totalTime: 0, completedAt: new Date() }
  ]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Date.now() - questionStartTime;
    const result: TestResult = {
      question: currentQuestion,
      selectedAnswer,
      isCorrect: selectedAnswer === questions[currentQuestion].correct,
      timeSpent
    };

    setTestResults([...testResults, result]);

    if (currentQuestion < questions.length - 1) {
      setShowExplanation(false);
      setSelectedAnswer(null);
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      setIsTestCompleted(true);
      setActiveTab('stats');
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const calculateScore = () => {
    const correctAnswers = testResults.filter(result => result.isCorrect).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getTotalTime = () => {
    return Math.round((Date.now() - startTime) / 1000);
  };

  const renderTest = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Подготовка к экзамену</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            <Icon name="Clock" size={16} className="mr-1" />
            Вопрос {currentQuestion + 1} из {questions.length}
          </Badge>
        </div>
      </div>

      <Progress value={(currentQuestion / questions.length) * 100} className="w-full h-2" />

      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-xl text-slate-800">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedAnswer === index
                  ? showExplanation
                    ? index === questions[currentQuestion].correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : showExplanation && index === questions[currentQuestion].correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  selectedAnswer === index
                    ? showExplanation
                      ? index === questions[currentQuestion].correct
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : 'border-blue-500 bg-blue-500 text-white'
                    : showExplanation && index === questions[currentQuestion].correct
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {String.fromCharCode(97 + index)}
                </div>
                <p className="text-gray-700 leading-relaxed">{option}</p>
              </div>
            </div>
          ))}

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Объяснение:</h4>
                  <p className="text-blue-800">{questions[currentQuestion].explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {!showExplanation ? (
              <Button
                onClick={handleShowExplanation}
                disabled={selectedAnswer === null}
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Icon name="Eye" size={16} className="mr-2" />
                Показать ответ
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {currentQuestion < questions.length - 1 ? 'Следующий' : 'Завершить тест'}
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStats = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Статистика результатов</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Icon name="Trophy" size={32} className="mx-auto mb-3 text-green-600" />
            <h3 className="text-2xl font-bold text-green-800">{calculateScore()}%</h3>
            <p className="text-green-600">Итоговый балл</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Icon name="Target" size={32} className="mx-auto mb-3 text-blue-600" />
            <h3 className="text-2xl font-bold text-blue-800">{testResults.filter(r => r.isCorrect).length}</h3>
            <p className="text-blue-600">Правильных ответов</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Icon name="Clock" size={32} className="mx-auto mb-3 text-purple-600" />
            <h3 className="text-2xl font-bold text-purple-800">{getTotalTime()}с</h3>
            <p className="text-purple-600">Время прохождения</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="BarChart" size={24} className="mr-2 text-slate-700" />
            Детальный анализ ответов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                  result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {result.isCorrect ? '✓' : '✗'}
                </div>
                <span className="font-medium">Вопрос {index + 1}</span>
              </div>
              <div className="text-sm text-gray-600">
                {Math.round(result.timeSpent / 1000)}с
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderRating = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Рейтинг учащихся</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Users" size={24} className="mr-2 text-slate-700" />
            Топ результатов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats
              .sort((a, b) => b.score - a.score)
              .map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.name === 'Вы' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : 'bg-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">
                        Завершен {user.completedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-800">{user.score}%</div>
                    <div className="text-sm text-gray-600">{user.totalTime}с</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="GraduationCap" size={28} className="text-blue-600" />
              <h1 className="text-xl font-bold text-slate-800">ExamPrep</h1>
            </div>
            <div className="flex space-x-1">
              {[
                { key: 'test', label: 'Тест', icon: 'FileQuestion' },
                { key: 'stats', label: 'Статистика', icon: 'BarChart3' },
                { key: 'rating', label: 'Рейтинг', icon: 'Trophy' }
              ].map(({ key, label, icon }) => (
                <Button
                  key={key}
                  variant={activeTab === key ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 ${
                    activeTab === key 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon name={icon as any} size={16} className="mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {activeTab === 'test' && renderTest()}
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'rating' && renderRating()}
      </main>
    </div>
  );
};

export default Index;