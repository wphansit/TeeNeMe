document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button');
    const status = document.getElementById('form-status');

    const formData = {
        name: form.name.value,
        phone: form.phone.value,
        message: form.message.value
    };

    btn.disabled = true;
    btn.textContent = 'กำลังส่งข้อมูล...';

    try {
        const response = await fetch('/.netlify/functions/line-notify', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            status.innerHTML = '<p style="color: green; margin-top: 20px;">ส่งข้อมูลสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุดครับ</p>';
            form.reset();
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        status.innerHTML = '<p style="color: red; margin-top: 20px;">เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อเราทาง LINE โดยตรง</p>';
    } finally {
        btn.disabled = false;
        btn.textContent = 'ส่งข้อมูลให้เราติดต่อกลับ';
    }
});
