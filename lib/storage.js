import { storage } from "./firebase"

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  if (!storage) {
    console.warn("Firebase Storage not available - using mock URL")
    return `https://via.placeholder.com/150?text=${encodeURIComponent(file.name)}`
  }

  try {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
    const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading profile picture:", error)
    throw error
  }
}

// Upload verification documents
export const uploadVerificationDocument = async (userId, file) => {
  if (!storage) {
    console.warn("Firebase Storage not available - using mock URL")
    return `https://via.placeholder.com/300x200?text=${encodeURIComponent(file.name)}`
  }

  try {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
    const storageRef = ref(storage, `verification-documents/${userId}/${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading verification document:", error)
    throw error
  }
}

// Upload discussion room attachments
export const uploadDiscussionAttachment = async (roomId, userId, file) => {
  if (!storage) {
    console.warn("Firebase Storage not available - using mock URL")
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`
  }

  try {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
    const storageRef = ref(storage, `discussion-attachments/${roomId}/${userId}/${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading discussion attachment:", error)
    throw error
  }
}

// Delete file from storage
export const deleteFile = async (filePath) => {
  if (!storage) {
    console.warn("Firebase Storage not available - mock delete")
    return
  }

  try {
    const { ref, deleteObject } = await import("firebase/storage")
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

// Upload blog post images
export const uploadBlogImage = async (userId, file) => {
  if (!storage) {
    console.warn("Firebase Storage not available - using mock URL")
    return `https://via.placeholder.com/600x400?text=${encodeURIComponent(file.name)}`
  }

  try {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
    const storageRef = ref(storage, `blog-images/${userId}/${Date.now()}-${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading blog image:", error)
    throw error
  }
}
