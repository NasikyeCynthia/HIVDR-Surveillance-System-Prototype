# HIVDR Surveillance Prototype

React + Vite + Tailwind CSS + Lucide + React Router. Frontend-only, with in-memory mock data.

## Run
    npm install
    npm run dev

## Push to GitHub
    git init && git add . && git commit -m "HIVDR prototype"
    git branch -M main
    git remote add origin <your-repo-url> && git push -u origin main

## Demo notes
- Use the **Role simulator** (bottom right) to switch roles and facilities. Navigation and actions change with permissions.
- Facility scoping: users only see patients from their assigned facility. MoH sees aggregates only.
- Data resets on refresh. Risk scores and Stanford HIVDB output are simulated.
- Frontend checks are not security. A real backend must enforce roles and facility access.
