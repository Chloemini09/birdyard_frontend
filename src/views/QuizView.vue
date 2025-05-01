<template>
    <div class="page-background">
        <!-- Banner -->
        <div class="banner">
            <h1 class="banner-title">QUIZ HUB</h1>
            <p class="banner-subtitle">TEST YOUR KNOWLEDGE WITH FUN QUIZZES</p>
            <p class="banner-subtitle">SEE HOW MUCH YOU'VE LEARNED ABOUT BIRDS AND GARDENS</p>
            <p class="banner-subtitle">ENJOY THE FUN QUIZ!</p>
        </div>

        <!-- Quiz Content -->
        <div class="quiz-background">
            <div class="quiz-wrapper">
                <div v-if="!quizCompleted" class="quiz-content">
                    <h2>Question {{ currentQuestionIndex + 1 }}</h2>
                    <h3>{{ currentQuestion.question }}</h3>
                    <div class="options">
                        <button v-for="(option, index) in currentQuestion.options" :key="index"
                            :class="{ selected: selectedOptionIndex === index }" @click="selectOption(index)">
                            {{ option }}
                        </button>
                    </div>
                    <button class="next-btn" @click="nextQuestion">
                        {{ currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next' }}
                    </button>
                </div>

                <div v-else class="quiz-result">
                    <h3>Your Score: {{ score }}/{{ questions.length }}</h3>
                    <img :src="badgeImage(scorePercentage)" alt="Badge" class="badge-img" />
                    <p class="badge-label">{{ badgeLabel(scorePercentage) }}</p>
                    <button class="retry-btn" @click="retryQuiz">Re-attempt</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import badge1 from '@/assets/images/medal6.png'
import badge2 from '@/assets/images/medal5.png'
import badge3 from '@/assets/images/medal4.png'
import badge4 from '@/assets/images/medal3.png'
import badge5 from '@/assets/images/medal2.png'
import badge6 from '@/assets/images/medal1.png'

export default {
    data() {
        return {
            questions: [
                { question: 'Which bird is critically endangered in Australia?', options: ['Gouldian Finch', 'Orange-bellied Parrot', 'Emu', 'Sulphur-crested Cockatoo'], answer: 1 },
                { question: 'What native plant benefits honeyeaters in gardens?', options: ['Roses', 'Grevillea', 'Tulips', 'Sunflowers'], answer: 1 },
                { question: 'Which bird is known for its elaborate courtship dances?', options: ['Lyrebird', 'Penguin', 'Magpie', 'Cockatoo'], answer: 0 },
                { question: 'Ideal garden feature for birds?', options: ['Water source', 'Concrete', 'Plastic lawn', 'Glass walls'], answer: 0 },
                { question: 'Which habitat is vital for many rare Australian birds?', options: ['Rainforest', 'Desert', 'City center', 'Farmland'], answer: 0 }
            ],
            currentQuestionIndex: 0,
            selectedOptionIndex: null,
            userAnswers: [],
            quizCompleted: false,
            score: 0,
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        scorePercentage() {
            return (this.score / this.questions.length) * 100;
        }
    },
    methods: {
        selectOption(index) {
            this.selectedOptionIndex = index;
        },
        nextQuestion() {
            if (this.selectedOptionIndex === null) return;
            this.userAnswers.push(this.selectedOptionIndex);
            this.selectedOptionIndex = null;
            if (this.currentQuestionIndex === this.questions.length - 1) {
                this.submitQuiz();
            } else {
                this.currentQuestionIndex++;
            }
        },
        submitQuiz() {
            this.quizCompleted = true;
            this.calculateScore();
        },
        calculateScore() {
            this.score = this.userAnswers.reduce((sum, answer, idx) => {
                return sum + (answer === this.questions[idx].answer ? 1 : 0);
            }, 0);
        },
        retryQuiz() {
            this.currentQuestionIndex = 0;
            this.selectedOptionIndex = null;
            this.userAnswers = [];
            this.quizCompleted = false;
            this.score = 0;
        },
        badgeImage(score) {
            if (score >= 90) return badge6;
            else if (score >= 75) return badge5;
            else if (score >= 60) return badge4;
            else if (score >= 45) return badge3;
            else if (score >= 30) return badge2;
            else return badge1;
        },
        badgeLabel(score) {
            if (score >= 90) return 'Expert Level';
            else if (score >= 75) return 'Advanced Level';
            else if (score >= 60) return 'Skilled Level';
            else if (score >= 45) return 'Intermediate Level';
            else if (score >= 30) return 'Beginner Level';
            else return 'Try Again!';
        }
    }
}
</script>

<style scoped>
.page-background {
    background: #f0f8f5;
    min-height: 100vh;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
}

/* Banner styles */
.banner {
    width: 100%;
    background-image:
        linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.6)), url('@/assets/images/garden.jpeg');
    background-size: cover;
    background-position: center;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 40px;
}

.banner-title {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.banner-subtitle {
    font-size: 1.2rem;
}

.quiz-background {
    width: 100%;
    background: #f9f7f0;
    min-height: 60vh;
    padding: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
}

.quiz-wrapper {
    background: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    text-align: center;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
}

.options button {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #eefaf0;
    cursor: pointer;
}

.options button.selected {
    background-color: #c2e59c;
}

.next-btn,
.retry-btn {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #0a3200;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}


/* medal */
.badge-img {
    width: 300px;
    margin: 1.5rem auto;
    display: block;
}

.badge-label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}
</style>