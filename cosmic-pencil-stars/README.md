# Cosmic Pencil Stars

## Overview
Cosmic Pencil Stars is a web project that creates a visually captivating starry background using Three.js. The project features a dark blue pencil-style background with bright yellow pencil stars that have a light orange outline and glow. Additionally, it includes a volumetric light mist effect that resembles clouds, enhancing the depth and visual appeal of the scene.

## Features
- Dark blue pencil-style background
- Bright yellow pencil stars with light orange outlines and glow
- Many small stars moving through space
- Volumetric light mist resembling clouds for a deep and slow visual effect

## Project Structure
```
cosmic-pencil-stars
├── index.html          # Main HTML document
├── package.json        # npm configuration file
├── .gitignore          # Git ignore file
├── src
│   ├── main.js         # Entry point for the JavaScript application
│   ├── styles
│   │   └── main.css    # CSS styles for the project
│   ├── shaders
│   │   ├── background.frag.glsl  # Fragment shader for background
│   │   ├── star.frag.glsl         # Fragment shader for stars
│   │   └── common.vert.glsl       # Vertex shader for background and stars
│   ├── components
│   │   ├── Star.js      # Class for managing star objects
│   │   └── Mist.js      # Class for managing mist effect
│   └── utils
│       └── noise.js     # Utility functions for generating noise
└── README.md            # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd cosmic-pencil-stars
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Open `index.html` in a web browser to view the project.

## Usage
The project is designed to run in a web browser. Simply open the `index.html` file to see the cosmic pencil stars in action. You can modify the shader files and JavaScript components to customize the appearance and behavior of the stars and background.

## License
This project is open-source and available for modification and distribution. Please refer to the LICENSE file for more details.