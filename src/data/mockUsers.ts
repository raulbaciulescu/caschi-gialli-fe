export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  type: 'client' | 'cg' | 'customer';
  location?: { lat: number; lng: number };
  lat?: number; // Direct lat/lng to match backend format
  lng?: number;
  address?: string;
  phone?: string;
  services?: string[];
  radius?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: MockUser[] = [
  // Mock Clients (using 'customer' type to match backend)
  {
    id: '552',
    email: 'client1@gmail.com',
    password: 'password123',
    name: 'client1@gmail.com',
    type: 'customer',
    lat: 41.83375828633243,
    lng: 12.452319260073063,
    location: { lat: 41.83375828633243, lng: 12.452319260073063 },
    address: 'Via del Corso 123, Roma',
    phone: '+39 333 123 4567',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'client-2',
    email: 'giulia.bianchi@email.com',
    password: 'password123',
    name: 'Giulia Bianchi',
    type: 'customer',
    lat: 41.8919,
    lng: 12.5113,
    location: { lat: 41.8919, lng: 12.5113 },
    address: 'Via Nazionale 45, Roma',
    phone: '+39 333 234 5678',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z'
  },

  // Mock Caschi Gialle - Updated to match backend response format
  {
    id: '151',
    email: 'cg@gmail.com',
    password: 'password123',
    name: 'name',
    type: 'cg',
    lat: 41.887965758804484,
    lng: 12.487351610781843,
    location: { lat: 41.887965758804484, lng: 12.487351610781843 },
    address: 'Macinului Nr 1',
    phone: '023123',
    services: ['Electrical', 'Plumbing', 'Gardening', 'Cleaning', 'Carpentry'],
    radius: 10,
    description: 'Professional multi-service provider with expertise in electrical, plumbing, gardening, cleaning, and carpentry work.',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'cg-2',
    email: 'anna.verdi@email.com',
    password: 'password123',
    name: 'Anna Verdi',
    type: 'cg',
    lat: 41.8986,
    lng: 12.4768,
    location: { lat: 41.8986, lng: 12.4768 },
    address: 'Piazza Navona 12, Roma',
    phone: '+39 333 456 7890',
    services: ['Cleaning', 'Gardening'],
    radius: 20,
    description: 'Servizi di pulizia professionale e giardinaggio. Disponibile per case private e uffici.',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z'
  },
  {
    id: 'cg-3',
    email: 'marco.neri@email.com',
    password: 'password123',
    name: 'Marco Neri',
    type: 'cg',
    lat: 41.9073,
    lng: 12.4632,
    location: { lat: 41.9073, lng: 12.4632 },
    address: 'Via del Tritone 89, Roma',
    phone: '+39 333 567 8901',
    services: ['Carpentry', 'Painting'],
    radius: 12,
    description: 'Falegname e imbianchino esperto. Realizzo mobili su misura e ristrutturazioni.',
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-08T16:00:00Z'
  },
  {
    id: 'cg-4',
    email: 'sofia.russo@email.com',
    password: 'password123',
    name: 'Sofia Russo',
    type: 'cg',
    lat: 41.8955,
    lng: 12.4823,
    location: { lat: 41.8955, lng: 12.4823 },
    address: 'Via Appia 156, Roma',
    phone: '+39 333 678 9012',
    services: ['IT Support', 'Appliance Repair'],
    radius: 25,
    description: 'Tecnico informatico e riparazione elettrodomestici. Assistenza a domicilio 24/7.',
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z'
  },
  {
    id: 'cg-5',
    email: 'luca.ferrari@email.com',
    password: 'password123',
    name: 'Luca Ferrari',
    type: 'cg',
    lat: 41.9109,
    lng: 12.4818,
    location: { lat: 41.9109, lng: 12.4818 },
    address: 'Via Veneto 78, Roma',
    phone: '+39 333 345 6789',
    services: ['Plumbing', 'Electrical'],
    radius: 15,
    description: 'Idraulico ed elettricista con 15+ anni di esperienza. Specializzato in riparazioni domestiche e installazioni.',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  }
];

// Helper functions
export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const validateCredentials = (email: string, password: string): MockUser | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const emailExists = (email: string): boolean => {
  return !!findUserByEmail(email);
};

// Convert MockUser to User (remove password)
export const toUser = (mockUser: MockUser) => {
  const { password, ...user } = mockUser;
  return user;
};