# MARKSPRINT

 HEAD
**MARKSPRINT** is an interactive, open-source quiz engine tailored to help 12th-grade Tamil Nadu State Board students master one-mark questions and maximize their board exam scores.
=======
currently subjects like 
physics 
chemistry
maths
computer has been added to practice 
and biology is still in development .
17d2ab2 (Fixed navbar responsiveness)

![MarkSprint Preview](https://via.placeholder.com/800x400.png?text=MarkSprint+Preview)

## 🚀 Features
- **Comprehensive Subject Support**: Practice tests for Physics, Chemistry, Maths, Computer Science, Biology, English, and Tamil.
- **Multiple Test Modes**:
  - *Practice Mode*: Instant visual feedback for correct/incorrect answers.
  - *Test Mode*: Delayed evaluation with a comprehensive Review Section at the end of the sprint.
- **Global & Question Timers**: Custom time constraints to simulate real exam pressure.
- **MathJax Integration**: Perfect rendering of complex mathematical and chemical formulas.
- **Dark/Light Themes**: A globally persistent, beautiful UI featuring an animated galaxy background.

## ⚙️ How It Works
1. **Selection**: Users begin by choosing a subject on the Home Page. The app seamlessly routes them to the quiz engine using React Router.
2. **Configuration**: The `QuizSetup` component allows the user to specify which lessons or volumes to cover, set global timers (e.g. 30 mins) and per-question timers (e.g. 15s), and toggle Practice vs Test mode.
3. **Data Loading**: Using Vite's asset bundling and PapaParse, the requested subject's CSV file is fetched locally, parsed, and passed into the `useQuizEngine` state manager.
4. **Execution**: The `QuizActive` component sequentially displays questions. If MathJax formatting is detected (`$$` or `\\[`), it renders it dynamically. 
5. **Evaluation**: Once completed, the `ResultsBoard` calculates accuracy metrics and provides a detailed Review Section showing the questions the user got wrong and highlighting the correct answers.

## 🛠 Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & Vanilla CSS (Glassmorphism design)
- **Data Layer**: PapaParse (CSV Parsing via Vite Asset Bundling)
- **Routing**: React Router DOM
- **Deployment**: Vercel Ready (`vercel.json` configured)

## 🏗 Architecture
This project utilizes a modern **Feature-Sliced Architecture**:
- `src/pages/`: Dedicated routing components (`HomePage`, `QuizPage`, `AboutPage`, `PortfolioPage`).
- `src/features/quiz/`: Encapsulated domain logic, including the highly modular `useQuizEngine` hook.
- `src/layouts/`: Persistent wrappers (`MainLayout`) to maintain canvas animations across routes.
- `src/data/`: Tightly bundled CSV datastores for zero-latency fetching.

## 🤝 Contributing
This is an open-source initiative! If you'd like to suggest features, fix bugs, or add new subject CSVs:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes.
4. Push to the branch and open a Pull Request!

## 🌟 Open Source
MARKSPRINT is proudly completely open-source. We welcome contributions from the community to help students succeed!
