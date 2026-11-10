export interface Profile {
  fullName: string
  email: string
  jobTitle: string
  company: string
  location: string
}

const profileKey = 'atera_profile'

export const getProfile = (): Profile => {
  if (typeof localStorage === 'undefined') return defaultProfile()
  const stored = localStorage.getItem(profileKey)
  if (!stored) return defaultProfile()
  try {
    return { ...defaultProfile(), ...(JSON.parse(stored) as Partial<Profile>) }
  } catch {
    return defaultProfile()
  }
}

export const saveProfile = (profile: Profile): Profile => {
  localStorage.setItem(profileKey, JSON.stringify(profile))
  return profile
}

const defaultProfile = (): Profile => ({
  fullName: '',
  email: '',
  jobTitle: '',
  company: '',
  location: '',
})
