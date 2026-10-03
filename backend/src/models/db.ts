import fs from 'fs';
import path from 'path';
import {
  User,
  Pet,
  AdoptionApplication,
  LostPet,
  FoundPet,
  RescueCase,
  Volunteer,
  NGO,
  Veterinarian,
  Appointment,
  PetHealthRecord,
  PetCareReminder,
  Notification,
  Conversation,
  Message,
  Favorite
} from './types';
import {
  initialUsers,
  initialPets,
  initialAdoptionApplications,
  initialLostPets,
  initialFoundPets,
  initialRescueCases,
  initialVolunteers,
  initialNGOs,
  initialVeterinarians,
  initialAppointments,
  initialPetHealthRecords,
  initialReminders,
  initialNotifications,
  initialConversations,
  initialMessages,
  initialFavorites
} from '../utils/seedData';
import { config } from '../config';

interface DatabaseSchema {
  users: User[];
  pets: Pet[];
  adoptions: AdoptionApplication[];
  lostPets: LostPet[];
  foundPets: FoundPet[];
  rescueCases: RescueCase[];
  volunteers: Volunteer[];
  ngos: NGO[];
  vets: Veterinarian[];
  appointments: Appointment[];
  healthRecords: PetHealthRecord[];
  reminders: PetCareReminder[];
  notifications: Notification[];
  conversations: Conversation[];
  messages: Message[];
  favorites: Favorite[];
}

class DatabaseStore {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    this.dbPath = path.join(config.dataDir, 'petconnect_db.json');
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      if (!fs.existsSync(config.dataDir)) {
        fs.mkdirSync(config.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure collections exist if schema evolved
        return {
          users: parsed.users || initialUsers,
          pets: parsed.pets || initialPets,
          adoptions: parsed.adoptions || initialAdoptionApplications,
          lostPets: parsed.lostPets || initialLostPets,
          foundPets: parsed.foundPets || initialFoundPets,
          rescueCases: parsed.rescueCases || initialRescueCases,
          volunteers: parsed.volunteers || initialVolunteers,
          ngos: parsed.ngos || initialNGOs,
          vets: parsed.vets || initialVeterinarians,
          appointments: parsed.appointments || initialAppointments,
          healthRecords: parsed.healthRecords || initialPetHealthRecords,
          reminders: parsed.reminders || initialReminders,
          notifications: parsed.notifications || initialNotifications,
          conversations: parsed.conversations || initialConversations,
          messages: parsed.messages || initialMessages,
          favorites: parsed.favorites || initialFavorites,
        };
      }
    } catch (err) {
      console.warn('Error reading persisted data file, initializing from fresh seed data...', err);
    }

    const defaultData: DatabaseSchema = {
      users: initialUsers,
      pets: initialPets,
      adoptions: initialAdoptionApplications,
      lostPets: initialLostPets,
      foundPets: initialFoundPets,
      rescueCases: initialRescueCases,
      volunteers: initialVolunteers,
      ngos: initialNGOs,
      vets: initialVeterinarians,
      appointments: initialAppointments,
      healthRecords: initialPetHealthRecords,
      reminders: initialReminders,
      notifications: initialNotifications,
      conversations: initialConversations,
      messages: initialMessages,
      favorites: initialFavorites,
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(config.dataDir)) {
        fs.mkdirSync(config.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save PetConnect database to disk:', err);
    }
  }

  public resetToSeedData() {
    this.data = {
      users: [...initialUsers],
      pets: [...initialPets],
      adoptions: [...initialAdoptionApplications],
      lostPets: [...initialLostPets],
      foundPets: [...initialFoundPets],
      rescueCases: [...initialRescueCases],
      volunteers: [...initialVolunteers],
      ngos: [...initialNGOs],
      vets: [...initialVeterinarians],
      appointments: [...initialAppointments],
      healthRecords: [...initialPetHealthRecords],
      reminders: [...initialReminders],
      notifications: [...initialNotifications],
      conversations: [...initialConversations],
      messages: [...initialMessages],
      favorites: [...initialFavorites],
    };
    this.saveData();
    return true;
  }

  // Generic collection helper creator
  private createCollection<T extends { id: string }>(key: keyof DatabaseSchema) {
    return {
      find: async (predicate?: (item: T) => boolean): Promise<T[]> => {
        const items = this.data[key] as unknown as T[];
        return predicate ? items.filter(predicate) : [...items];
      },
      findOne: async (predicate: (item: T) => boolean): Promise<T | undefined> => {
        const items = this.data[key] as unknown as T[];
        return items.find(predicate);
      },
      findById: async (id: string): Promise<T | undefined> => {
        const items = this.data[key] as unknown as T[];
        return items.find(item => item.id === id);
      },
      create: async (item: T): Promise<T> => {
        const items = this.data[key] as unknown as T[];
        items.unshift(item);
        this.saveData();
        return item;
      },
      update: async (id: string, updates: Partial<T>): Promise<T | undefined> => {
        const items = this.data[key] as unknown as T[];
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates };
        this.saveData();
        return items[index];
      },
      delete: async (id: string): Promise<boolean> => {
        const items = this.data[key] as unknown as T[];
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        this.saveData();
        return true;
      }
    };
  }

  public get users() { return this.createCollection<User>('users'); }
  public get pets() { return this.createCollection<Pet>('pets'); }
  public get adoptions() { return this.createCollection<AdoptionApplication>('adoptions'); }
  public get lostPets() { return this.createCollection<LostPet>('lostPets'); }
  public get foundPets() { return this.createCollection<FoundPet>('foundPets'); }
  public get rescueCases() { return this.createCollection<RescueCase>('rescueCases'); }
  public get volunteers() { return this.createCollection<Volunteer>('volunteers'); }
  public get ngos() { return this.createCollection<NGO>('ngos'); }
  public get vets() { return this.createCollection<Veterinarian>('vets'); }
  public get appointments() { return this.createCollection<Appointment>('appointments'); }
  public get healthRecords() { return this.createCollection<PetHealthRecord>('healthRecords'); }
  public get reminders() { return this.createCollection<PetCareReminder>('reminders'); }
  public get notifications() { return this.createCollection<Notification>('notifications'); }
  public get conversations() { return this.createCollection<Conversation>('conversations'); }
  public get messages() { return this.createCollection<Message>('messages'); }
  public get favorites() { return this.createCollection<Favorite>('favorites'); }
}

export const db = new DatabaseStore();
