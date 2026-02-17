// Native fetch is available in Node 18+

async function testWhatsAppAPI() {
    console.log("🚀 Testing /api/whatsapp/send endpoint...");

    try {
        const response = await fetch('http://localhost:5000/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                phone: "1234567890"
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);

        if (response.status === 200 && data.success) {
            console.log("✅ Test PASSED: API returned success.");
        } else {
            console.error("❌ Test FAILED: API returned error.");
        }
    } catch (error) {
        console.error("❌ Test FAILED: Network error or server not running.", error.message);
    }
}

testWhatsAppAPI();
