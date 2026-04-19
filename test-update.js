import axios from 'axios';

async function testUpdate() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@fixmycampus.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    console.log('Login successful, token length:', token.length);

    const reportsRes = await axios.get('http://localhost:5000/api/reports/my-reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Found', reportsRes.data.length, 'reports');

    if (reportsRes.data.length === 0) {
      console.log('No reports to test with');
      return;
    }

    const report = reportsRes.data[0];
    console.log('Testing with report:', report._id, report.title);

    const updateData = {
      title: report.title + ' UPDATED',
      category: report.category,
      location: report.location,
      description: report.description,
      priority: report.priority,
      status: report.status
    };

    console.log('Sending update:', updateData);

    const updateRes = await axios.put(`http://localhost:5000/api/reports/${report._id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Update response:', updateRes.data);

    const verifyRes = await axios.get(`http://localhost:5000/api/reports/${report._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Verified updated report:', verifyRes.data.title);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testUpdate();