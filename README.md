# Personal Finance Visualizer

A modern, full-featured personal finance dashboard built with Next.js, MongoDB Atlas, and Recharts.

## Features
- Add, edit, and delete transactions (amount, date, description, category)
- Transaction list view
- Monthly expenses bar chart
- Category-wise pie chart
- Dashboard summary cards (total expenses, top categories, recent transactions)
- Set and track monthly category budgets
- Budget vs actual comparison chart
- Simple spending insights
- Professional, responsive UI

## Tech Stack
- Next.js (App Router)
- MongoDB Atlas
- Recharts
- CSS (custom, with Inter font)

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/SamalaSripadh/finance_vis.git
   cd finance_vis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your MongoDB Atlas connection string:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

- Deploy easily to [Vercel](https://vercel.com/):
  1. Push your code to GitHub.
  2. Import your repo in Vercel.
  3. Set the `MONGODB_URI` environment variable.
  4. Click Deploy!

## License
MIT
