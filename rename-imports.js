const fs = require('fs');
const files = [
    'components/RegisterPage.tsx',
    'components/PendingApproval.tsx',
    'components/LoginPage.tsx',
    'components/ContactForm.tsx',
    'components/dashboard/StudentRepository.tsx',
    'components/dashboard/StudentDetail.tsx',
    'components/dashboard/ActionCenter.tsx',
    'components/admin/AdminDashboard.tsx',
    'App.tsx'
];
files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/services\/mockDb/g, 'services/api');
        fs.writeFileSync(f, content);
        console.log(`Updated ${f}`);
    } else {
        console.log(`Not found: ${f}`);
    }
});
