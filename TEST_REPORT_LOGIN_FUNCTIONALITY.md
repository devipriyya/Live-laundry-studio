# Test Case 1: Login Functionality - Test Report

## Overview
This test suite validates the login functionality of the Fabrico Laundry Service application. The tests cover various scenarios including successful login, failed login attempts, and authentication token validation.

## Test Environment
- **Application**: Fabrico Laundry Service
- **Backend Server**: http://localhost:5000
- **API Endpoint**: /api/auth/login
- **Test Date**: November 8, 2025
- **Test Framework**: Node.js with Axios

## Test Cases Summary

| Test Case ID | Description | Expected Result | Actual Result | Status |
|--------------|-------------|-----------------|---------------|--------|
| TC001 | Successful Login with Valid Credentials | User can login and receive token | ✅ Passed | PASS |
| TC002 | Failed Login with Invalid Credentials | Returns 401 error | ✅ Passed | PASS |
| TC003 | Successful Authentication with Token | Token allows access to protected resources | ✅ Passed | PASS |
| TC004 | Failed Login with Missing Email | Returns 401 error | ✅ Passed | PASS |
| TC005 | Failed Login with Missing Password | Returns 401 error | ✅ Passed | PASS |

## Detailed Test Results

### Test 1: Successful Login with Valid Credentials
**Description**: Verify that a user can successfully log in with valid credentials.

**Test Data**:
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Results**:
- ✅ Status: 200 OK
- ✅ Token received: Yes
- ✅ User data received with correct properties:
  - ID: 68ce619df382852caa1abd3f
  - Name: Admin User
  - Email: admin@gmail.com
  - Role: admin

### Test 2: Failed Login with Invalid Credentials
**Description**: Verify that login fails with appropriate error when invalid credentials are provided.

**Test Data**:
```json
{
  "email": "invalid@example.com",
  "password": "wrongpassword"
}
```

**Results**:
- ✅ Status: 401 Unauthorized
- ✅ Error message: "Invalid credentials"

### Test 3: Successful Authentication with Token
**Description**: Verify that the token received from login can be used for authenticated requests.

**Process**:
1. Login with valid credentials
2. Use received token for authenticated request to /api/orders

**Results**:
- ✅ Status: 200 OK
- ✅ Orders retrieved successfully
- ✅ Order count: 20

### Test 4: Failed Login with Missing Email
**Description**: Verify that login fails when email is missing.

**Test Data**:
```json
{
  "password": "password123"
}
```

**Results**:
- ✅ Status: 401 Unauthorized
- ✅ Error message: "Invalid credentials"

### Test 5: Failed Login with Missing Password
**Description**: Verify that login fails when password is missing.

**Test Data**:
```json
{
  "email": "test@example.com"
}
```

**Results**:
- ✅ Status: 401 Unauthorized
- ✅ Error message: "Invalid credentials"

## Conclusion

All login functionality tests have passed successfully. The authentication system is working as expected:

1. ✅ Valid credentials allow successful login and token generation
2. ✅ Invalid credentials are properly rejected with appropriate error messages
3. ✅ Generated tokens can be used to access protected resources
4. ✅ Missing credentials are handled gracefully with error responses
5. ✅ The system maintains security by not revealing specific failure reasons

## Recommendations

1. **Security Enhancement**: Consider implementing rate limiting for login attempts to prevent brute force attacks.
2. **User Experience**: Provide more specific error messages for different failure scenarios (e.g., "Email not found" vs "Incorrect password") while maintaining security.
3. **Logging**: Add detailed logging for failed login attempts to monitor suspicious activities.

## Test Script

The test script is available at: `tests/login-functionality.test.js`

To run the test:
```bash
cd c:\Users\User\fabrico
node tests/login-functionality.test.js
```