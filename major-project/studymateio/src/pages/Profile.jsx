import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await updateProfile(formData)
      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Error updating profile')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  return (
    <section id="settings" className="view-section active">
      <header className="view-header">
        <div>
          <h2 className="view-title">Settings</h2>
          <p className="view-subtitle">Manage your account preferences and profile.</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-8" style={{ width: '100%' }}>
        {/* Header Section */}
        <div className="flex items-center justify-between glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-glass)', border: '2px solid var(--border-glass)' }}>
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <i className="ph ph-user text-2xl text-blue-600"></i>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.full_name || 'Your Profile'}
              </h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Details</h2>
            <p className="text-sm text-gray-500 mt-1">Update your personal information here.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 form-group">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2 input-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="form-input"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 input-group">
                <label htmlFor="avatar_url">Avatar URL</label>
                <input
                  type="url"
                  name="avatar_url"
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  )
}
