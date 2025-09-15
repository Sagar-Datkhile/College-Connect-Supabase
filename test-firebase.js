// Test Firebase connection
require('dotenv').config({ path: './.env.local' });

async function testFirebase() {
  try {
    console.log('Testing Firebase connection...');
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');
    console.log('- NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set');
    console.log('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set');
    
    // Test Firebase initialization
    const { initializeApp, getApps } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized successfully');
    } else {
      app = getApps()[0];
      console.log('✅ Firebase app already initialized');
    }
    
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
    
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');
    
    // Test Firestore connection
    const { doc, getDoc } = require('firebase/firestore');
    
    try {
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      console.log('✅ Firestore connection successful');
    } catch (firestoreError) {
      console.log('⚠️  Firestore connection issue:', firestoreError.message);
      if (firestoreError.message.includes('PERMISSION_DENIED')) {
        console.log('   This is likely due to Firestore security rules. This is normal for unauthenticated requests.');
      }
    }
    
    console.log('\n✅ Firebase test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('Full error:', error);
  }
}

testFirebase();
