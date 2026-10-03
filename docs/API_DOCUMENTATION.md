# Pet Connect — REST API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require an HTTP Authorization header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password@123",
    "role": "adopter",
    "phone": "+91 98765 43210",
    "city": "Pune"
  }
  ```
- **Response:** `201 Created` with user record and JWT token.

### Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@petconnect.demo",
    "password": "Demo@123"
  }
  ```
- **Response:** `200 OK` with user record and JWT token.

### Current User Profile
- **Method:** `GET`
- **Endpoint:** `/auth/me`
- **Headers:** `Bearer Token`
- **Response:** `200 OK` with user data.

---

## 2. Pet Catalog Endpoints

### Get All Pets
- **Method:** `GET`
- **Endpoint:** `/pets`
- **Query Parameters:** `species`, `breed`, `gender`, `ageCategory`, `city`, `vaccinated`, `sterilized`, `status`, `search`
- **Response:** `200 OK` array of pet documents.

### Get Single Pet
- **Method:** `GET`
- **Endpoint:** `/pets/:id`
- **Response:** `200 OK` single pet document with owner/shelter details.

### Create Pet Listing
- **Method:** `POST`
- **Endpoint:** `/pets`
- **Headers:** `Bearer Token` (Requires `owner`, `ngo`, or `admin`)
- **Body:** Pet schema fields (name, species, breed, age, photos, temperament, medical history).
- **Response:** `201 Created`.

---

## 3. Adoption Applications

### Submit Application
- **Method:** `POST`
- **Endpoint:** `/adoptions`
- **Headers:** `Bearer Token`
- **Body:**
  ```json
  {
    "petId": "pet-1",
    "applicantName": "Rahul Sharma",
    "phone": "+91 98220 12345",
    "address": "Baner, Pune",
    "occupation": "Software Engineer",
    "homeType": "Apartment",
    "hasPets": true,
    "currentPets": "1 Golden Retriever",
    "familyMembers": 3,
    "adoptionReason": "Looking for a companion dog."
  }
  ```
- **Response:** `201 Created`.

### Update Application Status
- **Method:** `PATCH`
- **Endpoint:** `/adoptions/:id/status`
- **Headers:** `Bearer Token` (Requires `ngo` or `admin`)
- **Body:** `{"status": "approved", "adminNotes": "Home inspection completed successfully."}`
- **Response:** `200 OK`.

---

## 4. AI Recommendation & Matching

### Compute Compatibility Matches
- **Method:** `POST`
- **Endpoint:** `/pets/ai-match`
- **Body:**
  ```json
  {
    "species": "Dog",
    "homeType": "Apartment",
    "activityLevel": "High",
    "experience": "Intermediate",
    "hasChildren": true,
    "hoursAlone": 4
  }
  ```
- **Response:** `200 OK` array of pets annotated with `compatibilityScore` (e.g. 96) and `explanationReasons`.

---

## 5. Animal Rescue Module

### Report Emergency Case
- **Method:** `POST`
- **Endpoint:** `/rescue`
- **Body:**
  ```json
  {
    "animalType": "Dog",
    "condition": "Injured leg, unable to walk",
    "emergencyLevel": "High",
    "location": "Near FC Road, Deccan Gymkhana, Pune",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "reporterName": "Amit Patil",
    "reporterPhone": "+91 98230 45678"
  }
  ```
- **Response:** `201 Created`.

### Update Rescue Status
- **Method:** `PATCH`
- **Endpoint:** `/rescue/:id/status`
- **Headers:** `Bearer Token` (Volunteer, NGO, Admin)
- **Body:** `{"status": "in_progress", "assignedVolunteerId": "user-volunteer-1"}`
- **Response:** `200 OK`.

---

## 6. Community Lost & Found

### Get All Reports
- **Method:** `GET`
- **Endpoint:** `/lost-found`
- **Query Parameters:** `type` (`lost` | `found`), `species`, `city`, `status`
- **Response:** `200 OK` list of cases with GPS markers.

### File Report
- **Method:** `POST`
- **Endpoint:** `/lost-found`
- **Headers:** `Bearer Token`
- **Body:** Details of pet, photos, sighting address, and latitude/longitude.
- **Response:** `201 Created`.

---

## 7. PetCare AI Assistant

### Send Chat Query
- **Method:** `POST`
- **Endpoint:** `/petcare/chat`
- **Body:** `{"message": "What should I feed my 3-month-old puppy?"}`
- **Response:**
  ```json
  {
    "reply": "Puppies require high-protein nutrient-dense puppy kibble...",
    "disclaimer": "PetCare AI provides general educational information and does not replace professional veterinary advice.",
    "isEmergency": false
  }
  ```

---

## 8. Administrative Analytics

### Get Platform Metrics
- **Method:** `GET`
- **Endpoint:** `/admin/analytics`
- **Headers:** `Bearer Token` (Requires `admin`)
- **Response:**
  ```json
  {
    "totalUsers": 14,
    "totalPets": 12,
    "adoptionSuccessRate": 86,
    "rescueResolutionRate": 92,
    "monthlyAdoptions": [...],
    "speciesDistribution": [...]
  }
  ```
