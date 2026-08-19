# MERN Support Desk Lite

A lightweight full-stack support desk baseline on the approved React and Express convention for mandatory project delivery.

## Template Metadata
- Project kind: mandatory
- Stack: mern
- Framework: react-express
- Deploy target: render
- Deploy type: fullstack_multi_service
- Default branch: main
- Setup version: v1

## Day 1 Expectations

- Backend exposes `/health`, `/api/version`, and `/api/ping`.
- Frontend renders a live connectivity card and checks backend health.
- Render blueprint lives in `render.yaml` and template metadata lives under `niyati/`.
- The scaffold is intentionally incomplete for business features. Students must build those features.

## Local Runbook

Frontend build: `cd frontend && npm install && npm run build`
Backend start: `cd backend && npm install && npm start`
Backend baseline tests: `cd backend && npm test`

## Version Note

Initial MERN baseline closure draft created on 2026-07-16 for Support Desk Lite.

## Project Brief

Build a lightweight Support Desk application for handling student or internal service tickets. The minimum scope proves the approved MERN full-stack delivery path on Render while giving SPC a requirement-based review flow.

The app must let authenticated users create and manage tickets, track open versus closed workload, and review ticket history from a stable full-stack repository structure.

This template is intentionally baseline-sized. It establishes a clean React and Express starter, trusted evaluation metadata, and explicit feature coverage without pre-completing an enterprise product.

## Minimum Features

- Login flow for approved users
- Create, edit, and delete tickets
- Filter ticket list by status
- Dashboard cards showing open and closed ticket totals

## Generated Files

- `niyati/feature-contract.json`
- `niyati/deployment-contract.json`
- `niyati/service-manifest.json`
- `render.yaml`








------AXIOS-----------

Axios is a JavaScript library used to make HTTP requests from the browser or from a Node.js server. It allows your frontend or backend to communicate with APIs.

---> {req.params.id} it store the value that comes from the URL, it's an object created by the express

---> aggregate() is used when we want MongoDB to perform calculations on your data.