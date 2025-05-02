document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
  
    const notificationForm = document.getElementById('notificationForm');
    const notificationFormData = document.getElementById('notificationFormData');
    const addNotificationBtn = document.getElementById('addNotificationBtn');
    const cancelNotificationBtn = document.getElementById('cancelNotificationBtn');
  
    if (addNotificationBtn) {
      addNotificationBtn.addEventListener('click', () => {
        notificationForm.style.display = 'block';
        notificationFormData.reset();
      });
    }
  
    if (cancelNotificationBtn) {
      cancelNotificationBtn.addEventListener('click', () => {
        notificationForm.style.display = 'none';
        notificationFormData.reset();
      });
    }
  
    if (notificationFormData) {
      notificationFormData.addEventListener('submit', async (e) => {
        e.preventDefault();
        const receiver_id = document.getElementById('receiver_id').value.trim();
        const message = document.getElementById('message').value.trim();
  
        if (!receiver_id || !message) {
          alert('Receiver ID and message are required.');
          return;
        }
  
        const notification = { receiver_id, message };
  
        try {
          const response = await fetch('http://localhost:5000/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification),
          });
          if (!response.ok) throw new Error('Failed to add notification');
          loadNotifications();
          notificationForm.style.display = 'none';
          notificationFormData.reset();
          alert('Notification added successfully!');
        } catch (error) {
          console.error('Error adding notification:', error);
          alert(error.message);
        }
      });
    }
  });
  
  async function loadNotifications() {
    const receiverId = 1; // Replace with actual user ID from auth
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/user/${receiverId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const notifications = await response.json();
      const list = document.getElementById('notificationList');
      list.innerHTML = '';
      notifications.forEach(notif => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${notif.message} 
          (Status: ${notif.status}, Time: ${notif.timestamp})
          ${notif.status === 'UNREAD' ? `<button onclick="markAsRead(${notif.notification_id})">Mark as Read</button>` : ''}
        `;
        list.appendChild(li);
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
      alert('Failed to load notifications. Please try again.');
    }
  }
  
  async function markAsRead(notificationId) {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      if (response.ok) {
        loadNotifications();
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert(error.message);
    }
  }