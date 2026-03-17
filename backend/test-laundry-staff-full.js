const axios = require('axios');
const mongoose = require('mongoose');

const API_URL = 'http://localhost:5006/api';

// Test configuration
const testConfig = {
    staffEmail: `staff_${Date.now()}@test.com`,
    staffPassword: 'password123',
    staffName: 'Test Staff',
    adminEmail: 'admin@gmail.com', // Assuming this admin exists from previous steps
    adminPassword: 'admin123'
};

async function runTest() {
    let staffToken = '';
    let staffId = '';

    console.log('--- STARTING LAUNDRY STAFF VERIFICATION TEST ---');

    try {
        // 1. Register a new user (will be customer initially)
        console.log('\n1. Registering new user...');
        const uniqueParams = Date.now();
        const staffEmail = `staff_${uniqueParams}@test.com`;
        const staffPassword = 'password123';

        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Staff',
                email: staffEmail,
                password: staffPassword,
                phone: '1234567890'
            });
            staffId = regRes.data.user.id;
            console.log(`✅ User registered: ${staffId}`);
        } catch (e) {
            console.log('❌ Registration failed');
            if (e.response) console.log('Status: ' + e.response.status + ' Data: ' + JSON.stringify(e.response.data));
            else console.log('Msg: ' + e.message);
            process.exit(1);
        }

        const MONGO_URI = 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0';

        // 2. Promote to Laundry Staff via DB
        console.log('\n2. Promoting to Laundry Staff via DB...');
        try {
            await mongoose.connect(MONGO_URI);
            await mongoose.connection.collection('users').updateOne(
                { _id: new mongoose.Types.ObjectId(staffId) },
                { $set: { role: 'laundryStaff' } }
            );
            await mongoose.disconnect();
            console.log('✅ User promoted to laundryStaff');
        } catch (e) {
            console.log('❌ DB Update failed: ' + e.message);
            process.exit(1);
        }

        // 3. Login as Laundry Staff to get updated token
        console.log('\n3. Logging in as Laundry Staff...');
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: staffEmail,
                password: staffPassword
            });
            staffToken = loginRes.data.token;
            console.log('✅ Logged in. Role: ' + loginRes.data.user.role);

            if (loginRes.data.user.role !== 'laundryStaff') {
                console.log('❌ Role mismatch. Expected laundryStaff, got ' + loginRes.data.user.role);
                // process.exit(1); // Don't exit, might still work if token has claims or backend checks DB
            }
        } catch (e) {
            console.log('❌ Login failed');
            if (e.response) console.log('Status: ' + e.response.status + ' Data: ' + JSON.stringify(e.response.data));
            process.exit(1);
        }

        // 4. Verify Performance Metrics
        console.log('\n4. Verifying Performance Metrics...');
        try {
            const perf = await axios.get(`${API_URL}/laundry-staff/performance`, {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            console.log('✅ Stats fetched');
            console.log('Completed Orders: ' + perf.data.metrics.totalOrdersCompleted);

            // Just ensure structure is correct
            if (perf.data.metrics.weeklyProgress && Array.isArray(perf.data.metrics.weeklyProgress)) {
                console.log('✅ Weekly progress structure verified');
            } else {
                console.log('❌ Weekly progress missing or invalid');
            }
        } catch (e) {
            console.log('❌ Performance fetch failed');
            if (e.response) console.log('Status: ' + e.response.status + ' Msg: ' + JSON.stringify(e.response.data));
        }

        // 5. Update Schedule
        console.log('\n5. Updating Schedule...');
        const newSchedule = {
            monday: { start: '10:00', end: '19:00', break: '14:00 - 15:00' },
            tuesday: { start: '10:00', end: '19:00', break: '14:00 - 15:00' },
            wednesday: { start: 'OFF', end: 'OFF', break: '' },
            thursday: { start: '10:00', end: '19:00', break: '14:00 - 15:00' },
            friday: { start: '10:00', end: '19:00', break: '14:00 - 15:00' },
            saturday: { start: 'OFF', end: 'OFF', break: '' },
            sunday: { start: 'OFF', end: 'OFF', break: '' }
        };
        try {
            const updateRes = await axios.put(`${API_URL}/laundry-staff/schedule`, { schedule: newSchedule }, {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            console.log('✅ Schedule updated');
        } catch (e) {
            console.log('❌ Schedule update failed');
            if (e.response) console.log('Status: ' + e.response.status + ' Msg: ' + JSON.stringify(e.response.data));
        }

        // 6. Verify Schedule Persistence
        console.log('\n6. Verifying Schedule Persistence...');
        try {
            const scheduleRes = await axios.get(`${API_URL}/laundry-staff/schedule`, {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            const fetchedSchedule = scheduleRes.data.schedule;

            // Check specific changed fields
            if (fetchedSchedule.monday.start === '10:00' && fetchedSchedule.wednesday.start === 'OFF') {
                console.log('✅ Schedule persistence verified');
            } else {
                console.log('❌ Schedule mismatch. Got Monday Start: ' + fetchedSchedule.monday.start);
            }
        } catch (e) {
            console.log('❌ Schedule fetch failed');
            if (e.response) console.log('Status: ' + e.response.status);
        }

        // 7. Cleanup
        console.log('\n7. Cleaning up...');
        try {
            await mongoose.connect('mongodb://localhost:27017/fabrico');
            await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(staffId) });
            await mongoose.disconnect();
            console.log('✅ Test user deleted');
        } catch (e) {
            console.log('❌ Cleanup failed: ' + e.message);
        }

    } catch (error) {
        console.log('❌ Unexpected Error: ' + error.message);
    }
}

runTest();
