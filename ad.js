// Signup Functionality
function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const referralCode = document.getElementById('referralCode').value.trim();
    const isSuperuser = document.getElementById('isSuperuser')?.checked || false; // For admin signup

    if (username && password && email && phone) {
        const users = getUsers();
        const balances = getBalances();

        if (users[username]) {
            alert('Username already exists. Please choose another one.');
        } else {
            // Store user data
            users[username] = {
                password: btoa(password), // Hash password
                email,
                phone,
                referralCode,
                isSuperuser, // Superuser flag
            };
            balances[username] = { mined: 0, referral: 0 }; // Initialize balances

            // Reward referrer
            if (referralCode && users[referralCode]) {
                balances[referralCode].referral += 0.0900; // Reward referrer
                alert(`Referrer ${referralCode} rewarded with 0.0900`);
            }

            saveUsers(users);
            saveBalances(balances);

            alert('Signup successful! Redirecting to login.');
            window.location.href = "index.html";
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Superuser Check
function isSuperuser() {
    const loggedInUser = checkSession();
    const users = getUsers();
    return users[loggedInUser]?.isSuperuser || false;
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const users = getUsers();

    if (users[username] && users[username].password === btoa(password)) {
        // Save the logged-in user in localStorage
        localStorage.setItem('loggedInUser', username);

        if (users[username].isSuperuser) {
            alert('Superuser login successful! Redirecting to admin dashboard.');
            window.location.href = "admin.html";
        } else {
            alert('Login successful! Redirecting to dashboard.');
            window.location.href = "dashboard.html";
        }
    } else {
        alert('Invalid username or password.');
    }
}

function loadAdminDashboard() {
    const loggedInUser = checkSession();
    const users = getUsers();
    const balances = getBalances();

    // Ensure the user is a superuser
    if (!isSuperuser()) {
        alert('You are not authorized to access this page.');
        window.location.href = "index.html";
        return;
    }

    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear table

    // Populate table with all users
    for (const username in users) {
        const user = users[username];
        const balance = balances[username];
        const row = `
            <tr>
                <td>${username}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${balance.mined.toFixed(6)}</td>
                <td>${balance.referral.toFixed(6)}</td>
                <td>${user.referralCode || 'N/A'}</td>
            </tr>
        `;
        userTableBody.innerHTML += row;
    }
}

// Load admin dashboard data
if (document.getElementById('userTableBody')) {
    loadAdminDashboard();
}

// Initialize Admin Credentials (Run Once)
function initializeAdmin() {
    const adminData = {
        username: "admin",
        password: btoa("admin123"), // Simple hash for password
    };
    localStorage.setItem('admin', JSON.stringify(adminData));
}

// Call this function once manually to set up the admin credentials
initializeAdmin();
