# 📍 Smart Attendance Tracker

### Location-aware attendance for a flexible workforce.

🚧 **Status: Prototype — not production-ready**

## Overview
A mobile attendance solution designed around SIH1707, combining GPS geofencing, face verification, and approval workflows for office, client-site, and remote work.

## ✨ Features
- 📍 **Geofencing:** Attendance prompts within an authorized 200 m area.
- 🔔 **Mobile Notifications:** Entry/exit alerts guide employees through verification.
- 👤 **Identity Verification:** Face matching with liveness checks.
- ⏱️ **Work-Hour Tracking:** Check-in, check-out, and break management.
- 🚗 **Client Visits:** Manager-approved temporary geofences.
- 🏠 **WFH Requests:** Remote-work approval workflows.
- 📊 **HR Dashboard:** Attendance records, working-hour summaries, and alerts.

## 🛠️ Tech Stack
Flutter · FastAPI / Node.js · MongoDB · React.js  
ML Kit for face detection · FaceNet for verification · MediaPipe for liveness

## 🔄 Workflow
Geofence Entry → Mobile Notification → Check In → Face & Liveness Verification → Attendance Recorded → HR Dashboard
