import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function SettingsForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        setName(data.name || '')
        setEmail(data.email || '')
      })
      .catch(() => {})
  }, [])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      if (res.ok) {
        toast.success('Profile updated')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSavingPassword(true)

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        setCurrentPassword('')
        setNewPassword('')
        toast.success('Password updated')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update password')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={savingProfile} className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-50">
            {savingProfile && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            Save profile
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
            <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
            <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={savingPassword} className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-50">
            {savingPassword && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            Update password
          </button>
        </div>
      </form>
    </div>
  )
}
