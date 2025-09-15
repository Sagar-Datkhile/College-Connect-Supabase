// Simple authentication test script
// This can be run manually to test the authentication flow

console.log('Testing authentication configuration...');

// Test Firebase configuration
try {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('Firebase config check:');
  console.log('- API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing');
  console.log('- Auth Domain:', firebaseConfig.authDomain ? 'Present' : 'Missing');
  console.log('- Project ID:', firebaseConfig.projectId ? 'Present' : 'Missing');
  console.log('- Storage Bucket:', firebaseConfig.storageBucket ? 'Present' : 'Missing');
  
  const isConfigured = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;
  console.log('✅ Firebase is', isConfigured ? 'properly configured' : 'NOT configured (will use mock mode)');

} catch (error) {
  console.error('❌ Configuration error:', error.message);
}

console.log('\nTo test authentication:');
console.log('1. Navigate to http://localhost:3000');
console.log('2. Click "Sign Up" to create an account');
console.log('3. Try login with the created account');
console.log('4. Test admin access with email containing "admin"');
console.log('5. Test logout functionality');

export {};
