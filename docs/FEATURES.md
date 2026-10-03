# Pet Connect — Features Specification

## 1. Authentication & Role-Based Authorization
- **Multi-Role User Registration:** Create accounts as Adopter, Pet Owner, Rescuer/Volunteer, NGO Representative, or Veterinarian.
- **Secure Password Security:** Passwords hashed with salt rounds via `bcryptjs`.
- **JWT Session Tokens:** Signed JSON Web Tokens with Bearer authentication and token expiration.
- **Role Guards & Route Protection:** Granular client and server-side authorization filters.
- **1-Click Demo Profile Switcher:** Instant evaluation of all 5 primary roles without manual credential typing.

---

## 2. Pet Adoption Module
- **Extensive Catalog:** Comprehensive pet listings with high-resolution photography, vaccination badges, sterilization verification, and temperament tags.
- **Multi-Parameter Filtering:**
  - Species: Dog, Cat, Bird, Rabbit, Other
  - Breed, Gender, Age Category
  - Location / City
  - Health criteria: Vaccinated, Neutered/Spayed, Special Needs
- **Pet Detail Profiles:**
  - Medical background & vaccination history
  - Behavioral personality traits
  - Special requirements (diet, space, handling)
  - Direct shelter / rescuer contact details
- **Favorites & Wishlists:** Hearting pets with instant profile dashboard synchronization.

---

## 3. Comprehensive Adoption Application Workflow
- **Detailed Vetting Questionnaire:**
  - Applicant contact, address, age, and occupation
  - Living environment (Apartment, House with Yard, Farm)
  - Current household pets & history of animal companionship
  - Family members, agreement status, and daily pet care arrangements
- **State Machine Pipeline:**
  - `Pending` → `Under Review` → `Interview Required` → `Approved` → `Rejected` → `Completed`
- **Shelter Decisioning:** Authorized NGO and Admin portals feature 1-click status transitions with applicant notifications.

---

## 4. Explainable AI Pet Matching Engine
- **Input Parameters:**
  - Desired species & breed preference
  - Home type & living space
  - Adopter daily activity level & exercise willingness
  - Prior pet handling experience
  - Children & other pets in household
  - Typical hours spent away from home
- **Scoring & Transparency:**
  - Calculates weighted compatibility score (0-100%).
  - Shows clear dimensional breakdowns:
    - *Living Space Alignment*
    - *Energy & Activity Level Match*
    - *Experience Compatibility*
    - *Household Safety & Coexistence*
  - Generates human-readable explanations explaining why the pet is a fit.

---

## 5. Emergency Animal Rescue Module
- **Public Incident Reporting:**
  - Emergency categorization: `Injured`, `Abandoned`, `Accident`, `Abuse`, `Trapped`, `Stray in Distress`
  - Severity level: `Low`, `Medium`, `High`, `Critical`
  - Photo upload & pinpointed GPS / landmark coordinates
  - Reporter contact for rescuer follow-up
- **Rescuer Dispatch Dashboard:**
  - Real-time incident triage feed
  - 1-click volunteer claim & assignment
  - Status transitions: `Reported` → `Assigned` → `In Progress` → `Rescued` → `Treatment` → `Rehabilitating` → `Closed`
  - Rescue timeline notes & veterinary handoff logs

---

## 6. Community Lost & Found Geolocation Radar
- **Report Missing Pet:** Photos, microchip / collar tag info, last seen date/time, and map location.
- **Report Found Pet:** Sighting coordinates, physical condition, and temporary foster contact.
- **Interactive Leaflet Cartography:**
  - Color-coded map markers: Red (Lost) vs. Green (Found).
  - One-tap resolution triggers: *"I Found This Pet"* & *"This May Be My Pet"*.
  - Searchable by species, neighborhood, and date range.

---

## 7. PetCare AI Knowledge & Triage Assistant
- **Conversational Chatbot Interface:** Natural language interface for pet nutrition, puppy training, vaccination schedules, and first-aid instructions.
- **Local Rule & Knowledge Engine:** Fast, reliable responses without requiring paid cloud API keys.
- **Safety-First Design:**
  - Prominent red disclaimer indicating educational scope.
  - Automatic detection of critical distress keywords (*"blood"*, *"choking"*, *"poison"*, *"car hit"*) with immediate emergency rescue links and local vet hotline directory.

---

## 8. Digital Pet Health Passport & Preventive Care
- **Digital Health Record:**
  - Vaccination registry with date administered, batch numbers, and booster due dates.
  - Clinical treatments, recurring medications, known allergies, and vet visit summaries.
- **Automated Pet Care Reminders:**
  - Categories: Vaccination, Deworming, Medication, Grooming, Vet Appointment, Feeding.
  - Visual calendar timeline with due date countdown badges.

---

## 9. Veterinary & NGO Directories
- **Veterinarian Profiles:** Specializations, qualifications, clinic location, operating hours, and consultation booking.
- **Appointment Request Pipeline:**
  - Request appointment with preferred date, pet profile, and issue description.
  - Statuses: `Requested` → `Confirmed` → `Completed` → `Cancelled`.
- **NGO Shelter Portals:** Registered animal welfare trusts with verification badges, adoption stats, active campaigns, and volunteer recruitment.

---

## 10. Unified Communication & Notification Hub
- **Internal Messaging:** Secure communication between Adopter ↔ Shelter, User ↔ Vet, and Rescuer ↔ Volunteer.
- **Real-Time Notification Center:** Alerts for application status updates, rescue dispatches, vet confirmations, and lost pet sighting alerts.

---

## 11. Command Center Analytics (Admin & NGO)
- **Interactive Metric Cards:** Total adoptions, active rescues, registered volunteers, and shelter intake.
- **Data Visualizations (Recharts):**
  - Monthly Adoption vs Rescue Trends (Bar & Area charts)
  - Pet Species Distribution (Pie & Donut charts)
  - Rescue resolution turnaround rates
- **Administrative Moderation:** Centralized tables to inspect, edit, or delete any listing, user, or report.
