export type AccountSex = 'female' | 'male' | 'other' | 'unspecified'

export interface SkinTag {
  label: string
  variant: 'accent' | 'neutral'
}

export interface AccountData {
  firstName: string
  lastName: string
  email: string
  sex: AccountSex
  avatarUrl: string | null
  memberSinceLabel: string
  streak: number
  photosCount: number
  notesCount: number
  treatmentProgressLabel: string
  skinTags: SkinTag[]
  notifyEnabled: boolean
  notifyTime: string | null
}

export async function exportAccountData() {
  const blob = await apiFetch<Blob>('/account/export', { responseType: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'skincare-planning-export.json'
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * "Mon compte" — real profile data and the actions that mutate it
 * (save, password change, avatar, notifications, export, deletion).
 */
export async function useAccount() {
  const { data: account, refresh } = await useAsyncData('account', () => apiFetch<AccountData>('/account'))

  async function updateProfile(payload: { first_name?: string; last_name?: string; sex?: string }) {
    account.value = await apiFetch<AccountData>('/account', { method: 'PATCH', body: payload })
  }

  async function updatePassword(payload: { current_password: string; password: string; password_confirmation: string }) {
    return apiFetch('/account/password', { method: 'POST', body: payload })
  }

  async function updateNotifications(payload: { notify_enabled: boolean; notify_time?: string | null }) {
    account.value = await apiFetch<AccountData>('/account/notifications', { method: 'POST', body: payload })
  }

  async function uploadAvatar(file: File) {
    const form = new FormData()
    form.append('avatar', file)
    const result = await apiFetch<{ avatarUrl: string }>('/account/avatar', { method: 'POST', body: form })
    if (account.value) account.value.avatarUrl = result.avatarUrl
    return result
  }

  async function deleteAccount() {
    return apiFetch('/account', { method: 'DELETE' })
  }

  return { account, refresh, updateProfile, updatePassword, updateNotifications, uploadAvatar, exportData: exportAccountData, deleteAccount }
}
