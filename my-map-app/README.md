# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment Variables

This project uses environment variables for API keys. To set up your environment:

1. Copy the `.env.example` file to a new file named `.env`
2. Replace the placeholder values with your actual API keys:
   - `VITE_PLACEKIT_API_KEY`: Your PlaceKit API key
   - `VITE_WEATHER_API_KEY`: Your OpenWeatherMap API key

**Note**: The `.env` file is ignored by Git to prevent committing sensitive information. Make sure to set up these environment variables in your deployment platform as well.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
