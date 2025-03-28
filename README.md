# AI Spin Wheel Creator

An interactive decision wheel with AI-powered option generation. Perfect for random selections, decision making, games, and classroom activities.

<p align="center">
  <img src="./assets/spinwheel-icon.png" alt="AI Spin Wheel Icon" width="150"/>
</p>

# AI Spin Wheel

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)&nbsp;&nbsp;&nbsp;

An interactive app that uses AI logic to generate custom spin wheel outcomes for gamified user experiences.

## ✨ Features

- **Interactive Spin Wheel**: Visually appealing wheel with smooth spinning animation
- **AI-Powered Options**: Generate wheel content using Groq API based on simple prompts
- **Manual Entry**: Enter your own options when you prefer not to use AI
- **Save & Load**: Store your favorite wheels for later use
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

This guide will help you get the AI Spin Wheel Creator up and running quickly.

### Prerequisites

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment. You can download it from the official website. (Recommended version: 18 or later)
- **[npm](https://www.npmjs.com/)**: Node Package Manager, usually comes bundled with Node.js.
- **[Git](https://git-scm.com/)**: Version control system. If you don't have it, download and install it from [https://git-scm.com/](https://git-scm.com/).
- **[Netlify CLI](https://docs.netlify.com/cli/get-started/)**: Command-line interface for Netlify, used for local development and deployment. Install it using npm:
  ```bash
  npm install netlify-cli -g
  ```
- **[Groq API Key](https://console.groq.com/keys)**: You'll need an API key from Groq to use the AI-powered options generation. Sign up or log in at [https://console.groq.com/keys](https://console.groq.com/keys) to create an API key.

### Local Development - Step-by-Step

Follow these steps to run the AI Spin Wheel Creator on your local machine:

1. **Clone the repository:**
   Open your terminal or command prompt and navigate to the directory where you want to store the project. Then, clone the repository from GitHub:
   ```bash
   git clone https://github.com/EdenDigitalUK/ai-spin-wheel-public.git
   ```
   This command will download the project files into a folder named `ai-spin-wheel-public`. Navigate into this folder:
   ```bash
   cd ai-spin-wheel-public
   ```

2. **Set up your environment variables:**
   - Create a file named `.env` in the root of your project directory.
   - Open `.env` in a text editor and add your Groq API key:
     ```
     GROQ_API_KEY=your_api_key_here
     ```
     Replace `your_api_key_here` with the actual API key you obtained from Groq.

3. **Start the development server:**
   Run the following command in your terminal from the project directory:
   ```bash
   netlify dev
   ```
   This command starts the Netlify development server, which will run the application locally. It might take a few moments to start.

4. **Open in your browser:**
   Once the development server is running, open your web browser and go to the address provided in the terminal (usually `http://localhost:8888`). You should see the AI Spin Wheel Creator application running in your browser.

## 🌐 Live Demo

You can see a live demo of the AI Spin Wheel Creator here: [https://ai-spin-wheel-creator.netlify.app/](https://ai-spin-wheel-creator.netlify.app/)

## 🎮 How to Use

1. **Generate options with AI**
   - Enter a prompt like "5 pizza toppings" or "10 vacation destinations"
   - Click "Generate Options"

2. **Enter options manually**
   - Type options in the textarea (one per line)
   - Click "Use These Options"

3. **Spin the wheel**
   - Click the "SPIN" button
   - See your randomly selected result

## 💾 Data Storage

The app uses browser localStorage to save your custom wheels with these characteristics:

- **Persistence**: Saved wheels remain available between sessions in the same browser
- **Limitations**:
  - Wheels are only saved in the browser where they were created
  - Saved wheels will be cleared if browser data is cleared
  - Not synced across devices or browsers
- **Clearing Data**:
  - To manually clear all saved wheels:
    1. Open browser developer tools (F12)
    2. Go to Application > Storage > Local Storage
    3. Find and remove the 'savedWheels' entry

## 🚀 Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/ai-spin-wheel)

1. **Deploy to Netlify**
   - Connect to your GitHub repository
   - Add your `GROQ_API_KEY` as an environment variable

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Groq API](https://console.groq.com/) for AI option generation
- [Netlify](https://www.netlify.com/) for serverless functions and hosting

## Contact

**Anil Clifford**

<p align="left">
<a href="https://www.linkedin.com/in/anilcliff/" target="_blank"><img align="center" src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg" alt="LinkedIn Logo" height="30"/></a>
<a href="https://x.com/anil_clifford" target="_blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/d/d4/X_%28formerly_Twitter%29_logo_%282023%29.svg" alt="X Logo" height="30"/></a>
</p>
