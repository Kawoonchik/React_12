import { httpClient } from './httpClient';
import type { ApiUserDto, Organizer } from '../types/event.types';

function mapUserDtoToOrganizer(dto: ApiUserDto): Organizer {
  return {
    id: dto.id,
    fullName: `${dto.firstName} ${dto.lastName}`,
    email: dto.email,
    phone: dto.phone,
    avatarUrl: dto.image,
    organization: dto.company?.name || 'Independent Organizer',
    role: dto.company?.title || 'Event Coordinator',
    city: dto.address?.city || 'Київ',
  };
}

export const organizerRepository = {
  async getById(id: number): Promise<Organizer> {
    const response = await httpClient.get<ApiUserDto>(`/users/${id}`);
    return mapUserDtoToOrganizer(response.data);
  },
};