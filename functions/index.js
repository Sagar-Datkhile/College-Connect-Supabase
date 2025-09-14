const { onCall, HttpsError } = require("firebase-functions/v2/https")
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore")
const { getAuth } = require("firebase-admin/auth")
const { getFirestore } = require("firebase-admin/firestore")
const { initializeApp } = require("firebase-admin/app")

// Initialize Firebase Admin
initializeApp()
const auth = getAuth()
const db = getFirestore()

// Cloud Function: Send notification when mentorship request is created
exports.onMentorshipRequestCreated = onDocumentCreated("mentorshipRequests/{requestId}", async (event) => {
  const requestData = event.data.data()
  const mentorId = requestData.mentorId

  try {
    // Get mentor's user document
    const mentorDoc = await db.collection("users").doc(mentorId).get()
    const mentorData = mentorDoc.data()

    if (mentorData && mentorData.notificationPreferences?.mentorshipRequests) {
      // Create notification document
      await db.collection("notifications").add({
        userId: mentorId,
        type: "mentorship_request",
        title: "New Mentorship Request",
        message: `You have received a new mentorship request from ${requestData.studentName}`,
        data: {
          requestId: event.params.requestId,
          studentId: requestData.studentId,
        },
        read: false,
        createdAt: new Date(),
      })
    }
  } catch (error) {
    console.error("Error sending mentorship notification:", error)
  }
})

// Cloud Function: Update user statistics when profile is updated
exports.onUserProfileUpdated = onDocumentUpdated("users/{userId}", async (event) => {
  const beforeData = event.data.before.data()
  const afterData = event.data.after.data()

  try {
    // Update platform statistics
    const statsRef = db.collection("platformStats").doc("general")

    // Check if verification status changed
    if (beforeData.verified !== afterData.verified && afterData.verified) {
      await statsRef.update({
        verifiedUsers: db.FieldValue.increment(1),
        updatedAt: new Date(),
      })
    }

    // Check if role changed
    if (beforeData.role !== afterData.role) {
      const roleStats = {}
      roleStats[`${beforeData.role}Count`] = db.FieldValue.increment(-1)
      roleStats[`${afterData.role}Count`] = db.FieldValue.increment(1)
      roleStats.updatedAt = new Date()

      await statsRef.update(roleStats)
    }
  } catch (error) {
    console.error("Error updating user statistics:", error)
  }
})

// Cloud Function: Verify user email domain
exports.verifyUserDomain = onCall(async (request) => {
  const { email, institutionDomain } = request.data

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated")
  }

  try {
    const emailDomain = email.split("@")[1]

    // Check if email domain matches institution domain
    if (emailDomain === institutionDomain) {
      // Update user verification status
      await db.collection("users").doc(request.auth.uid).update({
        verified: true,
        verificationMethod: "email_domain",
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })

      // Update Firebase Auth email verification
      await auth.updateUser(request.auth.uid, {
        emailVerified: true,
      })

      return { verified: true, message: "Email domain verified successfully" }
    } else {
      return { verified: false, message: "Email domain does not match institution" }
    }
  } catch (error) {
    console.error("Error verifying user domain:", error)
    throw new HttpsError("internal", "Error verifying user domain")
  }
})

// Cloud Function: Generate platform analytics
exports.generateAnalytics = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated")
  }

  try {
    // Check if user is admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get()
    const userData = userDoc.data()

    if (!userData || userData.role !== "admin") {
      throw new HttpsError("permission-denied", "Only admins can generate analytics")
    }

    // Generate analytics data
    const usersSnapshot = await db.collection("users").get()
    const mentorshipSnapshot = await db.collection("mentorshipRequests").get()
    const discussionsSnapshot = await db.collection("discussionRooms").get()

    const analytics = {
      totalUsers: usersSnapshot.size,
      verifiedUsers: usersSnapshot.docs.filter((doc) => doc.data().verified).length,
      studentCount: usersSnapshot.docs.filter((doc) => doc.data().role === "student").length,
      alumniCount: usersSnapshot.docs.filter((doc) => doc.data().role === "alumni").length,
      totalMentorshipRequests: mentorshipSnapshot.size,
      activeMentorships: mentorshipSnapshot.docs.filter((doc) => doc.data().status === "accepted").length,
      totalDiscussionRooms: discussionsSnapshot.size,
      generatedAt: new Date(),
    }

    // Store analytics
    await db.collection("analytics").doc("platform").set(analytics)

    return analytics
  } catch (error) {
    console.error("Error generating analytics:", error)
    throw new HttpsError("internal", "Error generating analytics")
  }
})
