//API DTO

export interface ApiPostDto {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface ApiPostsResponseDto {
  posts: ApiPostDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  company?: {
    name: string;
    title: string;
    department: string;
  };
  address?: {
    city: string;
  };
}

//дomain 

export type EventFormat = 'online' | 'offline';
export type EventSortOption = 'default' | 'title-asc' | 'title-desc' | 'popular';

export interface EventItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  format: EventFormat;
  price: number; 
  capacity: number;
  attendeesCount: number;
  organizerId: number;
  isCustom?: boolean;
}

export interface Organizer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  organization: string;
  role: string;
  city: string;
}

export interface EventsQueryParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  sort?: EventSortOption;
}

export interface EventsPageResult {
  events: EventItem[];
  total: number;
}

export interface EventRegistration {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketsCount: number;
  comment?: string;
  registeredAt: string;
}