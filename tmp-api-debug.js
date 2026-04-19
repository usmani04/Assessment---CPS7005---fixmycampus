import axios from 'axios';

async function main() {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@fixmycampus.com',
      password: 'admin123',
    });

    const token = login.data.token;
    console.log('Token length:', token?.length);

    const reportsRes = await axios.get('http://localhost:5000/api/reports/my-reports', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('My reports count:', reportsRes.data.length);
    if (reportsRes.data.length === 0) {
      console.log('No reports found for test user.');
      return;
    }

    const report = reportsRes.data[0];
    console.log('First report id:', report._id, 'title:', report.title);

    const updated = await axios.put(`http://localhost:5000/api/reports/${report._id}`, {
      title: report.title + ' TEST',
      category: report.category,
      location: report.location,
      description: report.description,
      priority: report.priority,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Updated title:', updated.data.title);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

main();
