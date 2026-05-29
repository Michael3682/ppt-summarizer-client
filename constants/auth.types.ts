export type LoginFormData = {
  email: string
  password: string
}

export type SignupFormData = {
  name: string
  email: string
  password: string
}

export type UpdateProfileData = {
  name: string
}

export type ChangePasswordData = {
  currentPassword: string
  newPassword: string
}
