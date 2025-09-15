// Simple authentication test script
// This can be run manually to test the authentication flow

console.log('Testing Supabase authentication configuration...');

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase config check:');
  console.log('- URL:', supabaseUrl ? 'Present' : 'Missing');
  console.log('- ANON KEY:', supabaseAnonKey ? 'Present' : 'Missing');

  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
  console.log('✅ Supabase is', isConfigured ? 'properly configured' : 'NOT configured (app will use mock mode)');

} catch (error) {
  console.error('❌ Configuration error:', error.message);
}

console.log('\nTo test authentication:');
console.log('1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('2. Navigate to http://localhost:3000');
console.log('3. Sign up and then sign in');
console.log('4. Test logout functionality');

export {};
