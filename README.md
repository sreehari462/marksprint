# MARKSPRINT

**MARKSPRINT** is an interactive, open-source quiz engine tailored to help 12th-grade Tamil Nadu State Board students master one-mark questions and maximize their board exam scores.

![MarkSprint Preview](https://via.placeholder.com/800x400.png?text=MarkSprint+Preview)

## 🚀 Features
- **Comprehensive Subject Support**: Practice tests for Physics, Chemistry, Maths, Computer Science, Biology, English, and Tamil.
- **Multiple Test Modes**:
  - *Practice Mode*: Instant visual feedback for correct/incorrect answers.
  - *Test Mode*: Delayed evaluation with a comprehensive Review Section at the end of the sprint.
- **Global & Question Timers**: Custom time constraints to simulate real exam pressure.
- **MathJax Integration**: Perfect rendering of complex mathematical and chemical formulas.
- **Dark/Light Themes**: A globally persistent, beautiful UI featuring an animated galaxy background.

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

## 👨‍💻 Creator
Developed by **S.K. Sreehari** 
Connect with me or view my portfolio through the application links!

*Co Creator :* **Saravanan S** 
