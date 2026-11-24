



import { httpClient } from './httpClient';
import type {
  ApiPostDto,
  ApiPostsResponseDto,
  EventItem,
  EventsPageResult,
  EventsQueryParams,
} from '../types/event.types';

const LOCATIONS = [
  'Київ, UNIT.City',
  'Львів, !FESTrepublic',
  'Онлайн (Zoom / YouTube Live)',
  'Чернівці, Культурний хаб',
  'Одеса, Impact Hub',
];

function mapPostDtoToEvent(dto: ApiPostDto): EventItem {
  const isOnline = dto.id % 3 === 0;
  const dayOffset = (dto.id % 28) + 1;
  const month = ((dto.id % 4) + 1).toString().padStart(2, '0');
  const price = dto.id % 4 === 0 ? 0 : ((dto.id % 5) + 1) * 150;
  const capacity = 50 + (dto.id % 6) * 25;

  return {
    id: dto.id,
    title: dto.title,
    description: dto.body,
    category: dto.tags?.[0] || 'general',
    date: `2027-${month}-${dayOffset.toString().padStart(2, '0')}`,
    location: isOnline ? 'Онлайн (Zoom)' : LOCATIONS[dto.id % LOCATIONS.length],
    format: isOnline ? 'online' : 'offline',
    price,
    capacity,
    attendeesCount: Math.min(capacity, (dto.reactions?.likes ?? 10) % capacity),
    organizerId: dto.userId || 1,
  };
}

function getSortParams(sort?: EventsQueryParams['sort']) {
  switch (sort) {
    case 'title-asc':
      return { sortBy: 'title', order: 'asc' };
    case 'title-desc':
      return { sortBy: 'title', order: 'desc' };
    case 'popular':
      return { sortBy: 'views', order: 'desc' };
    default:
      return {};
  }
}

export const eventRepository = {
  async getAll({
    page,
    limit,
    search = '',
    category = '',
    sort = 'default',
  }: EventsQueryParams): Promise<EventsPageResult> {
    const skip = (page - 1) * limit;
    const trimmedSearch = search.trim();
    const trimmedCategory = category.trim();
    const sortParams = getSortParams(sort);

    if (trimmedCategory && trimmedSearch) {
      const response = await httpClient.get<ApiPostsResponseDto>(
        `/posts/tag/${encodeURIComponent(trimmedCategory)}`,
        { params: { limit: 100, skip: 0, ...sortParams } }
      );

      const lowerSearch = trimmedSearch.toLowerCase();
      const matched = response.data.posts
        .map(mapPostDtoToEvent)
        .filter(
          (event) =>
            event.title.toLowerCase().includes(lowerSearch) ||
            event.description.toLowerCase().includes(lowerSearch)
        );

      return {
        events: matched.slice(skip, skip + limit),
        total: matched.length,
      };
    }

    if (trimmedCategory) {
      const response = await httpClient.get<ApiPostsResponseDto>(
        `/posts/tag/${encodeURIComponent(trimmedCategory)}`,
        { params: { limit, skip, ...sortParams } }
      );

      return {
        events: response.data.posts.map(mapPostDtoToEvent),
        total: response.data.total,
      };
    }

    if (trimmedSearch) {
      const response = await httpClient.get<ApiPostsResponseDto>('/posts/search', {
        params: { q: trimmedSearch, limit, skip, ...sortParams },
      });

      return {
        events: response.data.posts.map(mapPostDtoToEvent),
        total: response.data.total,
      };
    }

    const response = await httpClient.get<ApiPostsResponseDto>('/posts', {
      params: { limit, skip, ...sortParams },
    });

    return {
      events: response.data.posts.map(mapPostDtoToEvent),
      total: response.data.total,
    };
  },

  async getCategories(): Promise<string[]> {
    const response = await httpClient.get<string[]>('/posts/tag-list');
    return response.data.slice(0, 12);
  },

  async getById(id: number): Promise<EventItem> {
    const response = await httpClient.get<ApiPostDto>(`/posts/${id}`);
    return mapPostDtoToEvent(response.data);
  },

  async create(
    payload: Omit<EventItem, 'id' | 'attendeesCount' | 'organizerId'>
  ): Promise<EventItem> {
    const response = await httpClient.post<ApiPostDto>('/posts/add', {
      title: payload.title,
      body: payload.description,
      tags: [payload.category],
      userId: 1,
    });

    return {
      ...payload,
      id: response.data.id || Date.now(),
      attendeesCount: 1,
      organizerId: 1,
      isCustom: true,
    };
  },

  async update(id: number, updates: Partial<EventItem>): Promise<EventItem> {
    const response = await httpClient.put<ApiPostDto>(`/posts/${id}`, {
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { body: updates.description }),
      ...(updates.category !== undefined && { tags: [updates.category] }),
    });

    return {
      ...mapPostDtoToEvent(response.data),
      ...updates,
      id,
    };
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/posts/${id}`);
  },
};