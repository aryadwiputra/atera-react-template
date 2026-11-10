import { getProfile, saveProfile } from '@/lib/data/profile'
import type { Profile } from '@/lib/data/profile'

export interface ProfileService {
  get(): Profile
  save(profile: Profile): Profile
}

export const profileService: ProfileService = {
  get: getProfile,
  save: saveProfile,
}
