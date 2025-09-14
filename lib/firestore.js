import { db } from "./firebase"

// Users collection operations
export const createUser = async (userData) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return "mock-id-" + Date.now()
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const usersCollection = collection(db, "users")
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const getUser = async (userId) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return null
  }

  try {
    const { doc, getDoc } = await import("firebase/firestore")
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

export const updateUser = async (userId, updates) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return
  }

  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = doc(db, "users", userId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Mentorship requests operations
export const createMentorshipRequest = async (requestData) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return "mock-request-" + Date.now()
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const mentorshipCollection = collection(db, "mentorshipRequests")
    const docRef = await addDoc(mentorshipCollection, {
      ...requestData,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating mentorship request:", error)
    throw error
  }
}

export const getMentorshipRequests = async (userId, type = "all") => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return []
  }

  try {
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
    const mentorshipCollection = collection(db, "mentorshipRequests")

    let q
    if (type === "sent") {
      q = query(mentorshipCollection, where("studentId", "==", userId), orderBy("createdAt", "desc"))
    } else if (type === "received") {
      q = query(mentorshipCollection, where("mentorId", "==", userId), orderBy("createdAt", "desc"))
    } else {
      q = query(mentorshipCollection, where("studentId", "==", userId), orderBy("createdAt", "desc"))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting mentorship requests:", error)
    throw error
  }
}

export const updateMentorshipRequest = async (requestId, updates) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return
  }

  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const docRef = doc(db, "mentorshipRequests", requestId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating mentorship request:", error)
    throw error
  }
}

// Discussion rooms operations
export const createDiscussionRoom = async (roomData) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return "mock-room-" + Date.now()
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const discussionRoomsCollection = collection(db, "discussionRooms")
    const docRef = await addDoc(discussionRoomsCollection, {
      ...roomData,
      memberCount: 1,
      lastActivity: serverTimestamp(),
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating discussion room:", error)
    throw error
  }
}

export const getDiscussionRooms = async () => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return []
  }

  try {
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const discussionRoomsCollection = collection(db, "discussionRooms")
    const q = query(discussionRoomsCollection, orderBy("lastActivity", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting discussion rooms:", error)
    throw error
  }
}

export const addMessage = async (roomId, messageData) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return "mock-message-" + Date.now()
  }

  try {
    const { collection, doc, addDoc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const messagesCollection = collection(db, "messages")
    const docRef = await addDoc(messagesCollection, {
      ...messageData,
      roomId,
      createdAt: serverTimestamp(),
    })

    // Update room's last activity
    const roomRef = doc(db, "discussionRooms", roomId)
    await updateDoc(roomRef, {
      lastActivity: serverTimestamp(),
      lastMessage: messageData.content,
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding message:", error)
    throw error
  }
}

export const getMessages = async (roomId) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return []
  }

  try {
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
    const messagesCollection = collection(db, "messages")
    const q = query(messagesCollection, where("roomId", "==", roomId), orderBy("createdAt", "asc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting messages:", error)
    throw error
  }
}

// Real-time listeners
export const subscribeToMessages = (roomId, callback) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return () => {}
  }

  try {
    const { collection, query, where, orderBy, onSnapshot } = require("firebase/firestore")
    const messagesCollection = collection(db, "messages")
    const q = query(messagesCollection, where("roomId", "==", roomId), orderBy("createdAt", "asc"))

    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(messages)
    })
  } catch (error) {
    console.error("Error subscribing to messages:", error)
    return () => {}
  }
}

export const subscribeToDiscussionRooms = (callback) => {
  if (!db) {
    console.warn("Firestore not available - using mock data")
    return () => {}
  }

  try {
    const { collection, query, orderBy, onSnapshot } = require("firebase/firestore")
    const discussionRoomsCollection = collection(db, "discussionRooms")
    const q = query(discussionRoomsCollection, orderBy("lastActivity", "desc"))

    return onSnapshot(q, (querySnapshot) => {
      const rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(rooms)
    })
  } catch (error) {
    console.error("Error subscribing to discussion rooms:", error)
    return () => {}
  }
}
