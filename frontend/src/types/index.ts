export type UserRole = 'adopter' | 'owner' | 'volunteer' | 'ngo' | 'vet' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string;
  city: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';
  breed: string;
  age: number;
  ageUnit: 'months' | 'years';
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  location: string;
  city: string;
  description: string;
  medicalInfo: string;
  vaccinated: boolean;
  sterilized: boolean;
  specialNeeds: boolean;
  specialNeedsDetails?: string;
  adoptionStatus: 'Available' | 'Pending' | 'Adopted';
  images: string[];
  personality: string[];
  activityLevel: 'Low' | 'Moderate' | 'High';
  goodWithKids: boolean;
  goodWithPets: boolean;
  careRequirements: string;
  fosterOrOwnerId: string;
  fosterOrOwnerType: 'User' | 'NGO';
  fosterOrOwnerName: string;
  fosterOrOwnerPhone: string;
  createdAt: string;
}

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Interview Required' | 'Approved' | 'Rejected' | 'Completed';

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAge: number;
  address: string;
  city: string;
  occupation: string;
  previousExperience: string;
  currentPets: string;
  homeType: 'Apartment' | 'Independent House' | 'Villa' | 'Farmhouse';
  familyMembersCount: number;
  reasonForAdoption: string;
  expectedCareArrangements: string;
  agreedToTerms: boolean;
  status: ApplicationStatus;
  reviewNotes?: string;
  reviewerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LostPet {
  id: string;
  type: 'Lost';
  petName: string;
  species: string;
  breed: string;
  gender: 'Male' | 'Female' | 'Unknown';
  age: string;
  lastSeenLocation: string;
  city: string;
  coordinates: Coordinates;
  dateTime: string;
  description: string;
  identifyingMarks: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: string[];
  status: 'Lost' | 'Reunited' | 'Resolved';
  reportedBy: string;
  createdAt: string;
}

export interface FoundPet {
  id: string;
  type: 'Found';
  species: string;
  approximateBreed: string;
  locationFound: string;
  city: string;
  coordinates: Coordinates;
  dateTime: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: string[];
  status: 'Found' | 'Reunited' | 'Transferred to Shelter';
  reportedBy: string;
  createdAt: string;
}

export type EmergencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RescueStatus = 'Reported' | 'Assigned' | 'Rescue in Progress' | 'Rescued' | 'Treatment' | 'Rehabilitating' | 'Closed';

export interface RescueNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface RescueCase {
  id: string;
  animalType: string;
  condition: 'Injured' | 'Abandoned' | 'Accident' | 'Abuse' | 'Stray Requiring Care' | 'Animal Trapped' | 'Other';
  emergencyLevel: EmergencyLevel;
  location: string;
  city: string;
  coordinates: Coordinates;
  description: string;
  images: string[];
  reporterName: string;
  reporterPhone: string;
  reporterId?: string;
  status: RescueStatus;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  notes: RescueNote[];
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  skills: string[];
  availability: 'Weekdays' | 'Weekends' | 'Full-time' | 'Emergency On-call';
  animalExperience: string;
  preferredRescueType: string;
  hoursContributed: number;
  activeCasesCount: number;
  badges: string[];
  rating: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface NGOEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface NGOAnnouncement {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface NGO {
  id: string;
  userId: string;
  organizationName: string;
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  description: string;
  logo: string;
  website?: string;
  totalRescues: number;
  totalAdoptions: number;
  activeVolunteers: number;
  verified: boolean;
  events: NGOEvent[];
  announcements: NGOAnnouncement[];
  createdAt: string;
}

export interface Veterinarian {
  id: string;
  userId: string;
  name: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  availabilityDays: string[];
  consultationFee: number;
  services: string[];
  rating: number;
  reviewsCount: number;
  avatar: string;
  verified: boolean;
  createdAt: string;
}

export type AppointmentStatus = 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  vetId: string;
  vetName: string;
  clinicName: string;
  userId: string;
  userName: string;
  userPhone: string;
  petName: string;
  petSpecies: string;
  petAge: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface VaccinationEntry {
  id: string;
  vaccineName: string;
  dateGiven: string;
  nextDueDate: string;
  administeredBy: string;
  batchNumber?: string;
}

export interface MedicalRecordEntry {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  vetName: string;
}

export interface MedicineEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

export interface PetHealthRecord {
  id: string;
  petId?: string;
  petName: string;
  ownerId: string;
  ownerName: string;
  species: string;
  breed: string;
  birthDate: string;
  gender: string;
  microchipNumber?: string;
  bloodGroup?: string;
  allergies: string[];
  medicalHistory: MedicalRecordEntry[];
  vaccinations: VaccinationEntry[];
  medicines: MedicineEntry[];
  nextAppointment?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReminderType = 'Vaccination' | 'Medication' | 'Grooming' | 'Vet Appointment' | 'Feeding' | 'Deworming' | 'Other';

export interface PetCareReminder {
  id: string;
  userId: string;
  petName: string;
  type: ReminderType;
  title: string;
  dueDate: string;
  time: string;
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'adoption' | 'rescue' | 'appointment' | 'lost_found' | 'reminder' | 'system' | 'message';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: ConversationParticipant[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface FactorScore {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface MatchResult {
  pet: Pet;
  compatibilityScore: number;
  summary: string;
  factors: FactorScore[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  disclaimer?: string;
  category?: string;
}
