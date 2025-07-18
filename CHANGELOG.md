# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.4.3] - 2024-12-19

### Added
- Nighttime text styling for all widgets (WeatherWidget, ActivityWidget, FunFact)
- Automatic light gray text (#e0e0e0) during night hours for better visual comfort
- TimeOfDay prop integration across all components for consistent night mode experience

### Changed
- Enhanced text readability during nighttime hours with softer gray instead of harsh white
- Improved visual comfort for night-time usage

## [v0.4.2] - 2024-12-19

### Fixed
- Minor adjustments to FunFact widget styling for optimal display

## [v0.4.1] - 2024-12-19

### Added
- Scrollbar functionality to FunFact widget with webkit and Firefox support
- Proper flex layout with min-height: 0 to enable scrolling in flexbox containers
- Mobile responsive design with FunFact widget hidden on screens ≤ 1024px

### Changed
- FunFact widget positioning adjusted for better spacing (4rem from WeatherWidget)
- Max-height set to 250px to trigger scrolling when content exceeds limit
- Height changed to auto for natural content sizing

### Fixed
- FunFact widget scrolling issues - now properly scrolls instead of expanding

## [v0.4.0] - 2024-12-19

### Added
- **FunFact Widget**: New AI-powered widget displaying interesting facts about searched cities
- Dynamic city-specific titles: "Fun Facts about [City Name]"
- 3-second delayed loading compared to ActivityWidget for staggered UX
- AI-generated content using OpenAI API with 300-character limit
- Glassmorphism styling matching ActivityWidget design
- Loading animations and close button functionality
- Positioned to the right of WeatherWidget with responsive layout

### Enhanced
- Comprehensive error handling with fallback content for FunFact generation
- 15-second timeout for API reliability
- Integration with existing chatbot state management system

## [v0.3.1] - 2024-12-17

### Enhanced
- ActivityWidget overflow handling and close button positioning
- Improved mobile layout for activity widget

## [v0.3.0] - 2024-12-17

### Enhanced
- ActivityWidget mobile responsiveness for better tablet and phone experience
- Improved layout handling on small screens

### Added
- Standardized chatbot minimize button to match activity widget close button styling

## [v0.2.0] - 2024-12-16

### Fixed
- Seamless background transitions in production build
- Background image loading and display issues

### Enhanced
- ActivityWidget visual styling with shadow effects matching weather widget
- Close button functionality for activity widget with reset visibility on chat submit

## [v0.1.0] - 2024-12-16

### Added
- **Docker Support**: Complete containerization with runtime environment variables
- **AWS ECR Integration**: Automated package and publish script for deployment
- **AWS App Runner**: Deployment script with environment management and interactive mode
- Production-ready deployment configuration

### Fixed
- Docker production build issues
- AWS App Runner deployment configuration and authentication
- Environment variable handling in containerized environments

### Enhanced
- Image platform optimization for deployment
- Secret environment variables management

## [v0.0.2] - 2024-12-16

### Changed
- AWS deployment region configuration
- Manual deployment adjustments

## [v0.0.1] - 2024-12-16

### Added
- **Core Weather App**: Initial release with weather data display
- **ActivityWidget**: AI-powered activity suggestions based on weather conditions
- **Responsive Design**: Mobile-first approach with glassmorphism UI
- **OpenAI Integration**: GPT-3.5-turbo for intelligent activity recommendations
- **Weather API Integration**: Real-time weather data from OpenWeatherMap
- **Time-of-Day Detection**: Automatic day/evening/night detection based on sunrise/sunset
- **Dynamic Backgrounds**: Weather and time-specific background images
- **Chat Interface**: Interactive city search with natural language processing

### Technical Features
- **ESLint Integration**: Code quality enforcement with pre-commit hooks
- **Custom Favicon**: Weather-themed partially cloudy icon
- **Husky & Lint-staged**: Automated code quality checks
- **Vite Build System**: Fast development and optimized production builds
- **React 18**: Modern React with hooks and functional components

### UI/UX Features
- **Glassmorphism Design**: Modern frosted glass aesthetic
- **Loading States**: Smooth loading animations for better UX
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Activity Generation**: Context-aware suggestions based on weather, time, and location
- **Error Handling**: Comprehensive fallback systems for reliability

### Examples Added
- Screenshot examples for Athens, Cluj, Johannesburg, and New York
- README documentation with usage instructions

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality  
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
- **Enhanced**: Improvements to existing features

---

*This changelog is automatically generated from git commit history and maintained manually for clarity.* 