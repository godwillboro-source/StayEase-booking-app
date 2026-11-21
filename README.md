# StayEase

A property booking platform for Kenya where property managers list apartments and rooms, and customers search, view and book them online.

## The Idea

Small property owners (for example, *Agunda Apartments Naivasha*) have no easy way to get bookings online. StayEase lets them register, list rooms with photos and prices, and manage bookings, while customers browse every property in one place and book by date.

## User Roles

- **Admin:** approves or rejects property managers, views all properties and bookings, and blocks users.
- **Property Manager:** creates properties and rooms (photos, price per night, amenities), and confirms or cancels bookings for their own property.
- **Customer:** searches by location, price and dates, books a room, and views or cancels their own bookings.

## Tech Stack

- **Frontend:** React
- **Backend:** Flask, SQLAlchemy
- **Auth:** JWT, with email verification
- **Services:** SendGrid (email), Cloudinary (images)
- **Docs and CI/CD:** Swagger, GitHub Actions

## Repositories

- Frontend: _link to be added_
- Backend: _link to be added_

## Getting Started

Setup instructions for each repository will be added here as the project is built.

## Cloudinary Property Image Uploads

1. In Cloudinary, open **Settings → Upload → Upload presets**.
2. Create an unsigned upload preset.
3. In the frontend Render static-site settings, add:
   - `VITE_CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>`
   - `VITE_CLOUDINARY_UPLOAD_PRESET=<your unsigned preset name>`
4. Redeploy the frontend.

Property add/edit forms accept JPEG, PNG, or WebP images up to 5 MB. Cloudinary returns a secure URL, which is saved as the property image.

## Team

- Godwill Boro
- Margaret Miranda
- John Brian Waweru
- Douglas Wachira
- Michael Mwangi
- Ken Njoroge