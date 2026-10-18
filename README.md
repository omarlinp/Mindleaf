# Mindleaf

<p align="center">
  <img src="public/img/mark-teal.svg" alt="Mindleaf logo" width="112" />
</p>

<p align="center">
  A calm, simple practice-management dashboard for psychologists.
</p>

Mindleaf brings patient records, appointments, session notes, and payment tracking together in one lightweight web application. The current repository is a server-rendered demo/prototype with sample data included so the dashboard can be explored immediately.

## Features

- Dashboard with patient, appointment, completion, and payment summaries
- Patient records with contact details, referral information, concerns, and notes
- Patient search and patient detail pages
- Appointment creation, editing, filtering, and deletion
- Support for individual, couples, family, initial-assessment, and follow-up sessions
- Appointment statuses: scheduled, completed, and cancelled
- Structured session notes covering mood, risk, summary, interventions, progress, and plan
- Payment tracking with paid/unpaid totals and payment dates
- Responsive UI built with Bootstrap and Bootstrap Icons

## Tech stack

- Node.js with ES modules
- Express 5
- EJS templates
- Bootstrap 5
- Bootstrap Icons
- JSON file persistence in `data/patients-appointments.json`

## Getting started

### Prerequisites

- Node.js 18 or newer
- pnpm 12 (or a compatible pnpm version)

### Install dependencies

```bash
pnpm install
```

### Run the app

For development, with automatic restarts:

```bash
pnpm dev
```

For a regular start:

```bash
pnpm start
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing page |
| `/login` | Login screen prototype |
| `/signup` | Signup screen prototype |
| `/dashboard` | Practice overview and payment summary |
| `/patients` | Patient list and search |
| `/patients/new` | Add a patient |
| `/patient/:id` | View a patient and their appointments |
| `/appointments` | Appointment list and status filtering |
| `/appointments/new` | Add an appointment |
| `/appointment/:id` | View an appointment and its session notes |

## Project structure

```text
.
├── data/
│   └── patients-appointments.json  # Local demo data store
├── public/
│   ├── css/                        # Application styles
│   ├── img/                        # Logo, icon, and favicon assets
│   └── js/                         # Browser-side scripts
├── src/
│   ├── controllers/                # Request handlers and view data
│   ├── models/                     # JSON-backed data operations
│   ├── routes/                     # Express route definitions
│   └── views/                      # EJS pages and shared partials
├── server.js                       # Express application entry point
└── package.json
```



## License

This project currently uses the ISC license declared in `package.json`.
