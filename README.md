# ZenSand Garden

A meditative 3D experience where you can rake sand, place rocks, and generate soothing procedural soundscapes while conversing with a Zen AI companion.

## Getting Started

1.  **Clone the repository** (or copy the files to a local folder).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add your Google Gemini API Key:
    ```
    API_KEY=your_api_key_here
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Features

-   **3D Sand Raking**: Interactive sand simulation using bump maps.
-   **Garden Design**: Place rocks, bonsai trees, cherry blossoms, pagodas, bridges, and ponds.
-   **Procedural Audio**: Wind, rain, and singing bowl sounds generated in real-time.
-   **Zen Companion**: AI-powered chat for mindfulness guidance using Google Gemini.
-   **PWA Support**: Installable as a native-like app on mobile devices.

## Tech Stack

-   React 19
-   TypeScript
-   Three.js / React Three Fiber
-   Google GenAI SDK
-   Tailwind CSS
-   Vite
