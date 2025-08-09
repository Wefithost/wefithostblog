// Simple test to verify auth flow
const testAuthFlow = async () => {
	console.log('Testing auth flow...');

	// Test 1: Check if fetch-user endpoint exists
	try {
		const response = await fetch('/api/auth/fetch-user');
		console.log('Fetch user endpoint status:', response.status);
	} catch (error) {
		console.log('Fetch user endpoint error:', error.message);
	}

	// Test 2: Check if create-auth-cookie endpoint exists
	try {
		const response = await fetch('/api/auth/create-auth-cookie');
		console.log('Create auth cookie endpoint status:', response.status);
	} catch (error) {
		console.log('Create auth cookie endpoint error:', error.message);
	}

	// Test 3: Check if clear-cookies endpoint exists
	try {
		const response = await fetch('/api/auth/clear-cookies', { method: 'POST' });
		console.log('Clear cookies endpoint status:', response.status);
	} catch (error) {
		console.log('Clear cookies endpoint error:', error.message);
	}
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
	testAuthFlow();
}
