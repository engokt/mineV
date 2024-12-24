// ---------------------------
// LocalStorage Utilities
// ---------------------------
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {}; // Return parsed object or empty object
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getBalances() {
    const balances = localStorage.getItem('balances');
    return balances ? JSON.parse(balances) : {}; // Return parsed object or empty object
}

function saveBalances(balances) {
    localStorage.setItem('balances', JSON.stringify(balances));
}

// ---------------------------
// Signup Functionality
// ---------------------------
function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const referralCode = document.getElementById('referralCode').value.trim();

    if (username && password && email && phone) {
        const users = getUsers();
        const balances = getBalances();

        if (users[username]) {
            alert('Username already exists. Please choose another one.');
        } else {
            // Store user data
            users[username] = {
                password: btoa(password), // Hash password using base64 encoding
                email,
                phone,
                referralCode,
            };
            balances[username] = { mined: 0, referral: 0 }; // Initialize balances

            // Reward referrer
            if (referralCode && users[referralCode]) {
                balances[referralCode].referral += 0.0900;
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

// ---------------------------
// Login Functionality
// ---------------------------
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const users = getUsers();

    if (users[username] && users[username].password === btoa(password)) {
        localStorage.setItem('loggedInUser', username);
        alert('Login successful! Redirecting to dashboard.');
        window.location.href = "dashboard.html";
    } else {
        alert('Invalid username or password.');
    }
}

// ---------------------------
// Session Management
// ---------------------------
function checkSession() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = "index.html";
    }
    return loggedInUser;
}

// ---------------------------
// Profile Initialization
// ---------------------------
if (document.getElementById('profileUsername')) {
    const user = checkSession();
    const users = getUsers();
    const balances = getBalances();

    if (user) {
        document.getElementById('profileUsername').innerText = user;
        document.getElementById('profileEmail').innerText = users[user].email;
        document.getElementById('profilePhone').innerText = users[user].phone;
        document.getElementById('minedBalance').innerText = balances[user].mined.toFixed(6);
        document.getElementById('referralBalance').innerText = balances[user].referral.toFixed(6);
    }
}

// ---------------------------
// Logout Functionality
// ---------------------------
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        alert('You have been logged out.');
        window.location.href = "index.html";
    });
}

// ---------------------------
// Mining Logic
// ---------------------------
function startMining() {
    const user = checkSession();
    const balances = getBalances();

    const miningRate = 0.000569;
    const miningIntervalTime = 3 * 60 * 1000; // 3 minutes
    const miningEndTime = Date.now() + 12 * 60 * 60 * 1000; // 12 hours

    document.getElementById('miningStatus').innerText = 'Mining in progress...';

    const miningInterval = setInterval(() => {
        if (Date.now() >= miningEndTime) {
            clearInterval(miningInterval);
            document.getElementById('miningStatus').innerText = 'Mining ended.';
            return;
        }

        balances[user].mined += miningRate;
        saveBalances(balances);
        document.getElementById('minedAmount').innerText = balances[user].mined.toFixed(6);
    }, miningIntervalTime);
}

// ---------------------------
// Initialize Dashboard Data
// ---------------------------
if (document.getElementById('minedAmount')) {
    const user = checkSession();
    const balances = getBalances();

    document.getElementById('minedAmount').innerText = balances[user].mined.toFixed(6);
    document.getElementById('referralBalance').innerText = balances[user].referral.toFixed(6);
}

// ---------------------------
// Referral Management
// ---------------------------
function generateReferralLink() {
    const user = checkSession();
    const referralLink = `${window.location.origin}/signup.html?referral=${user}`;
    document.getElementById('referralLink').value = referralLink;
}

function copyReferralLink() {
    const referralInput = document.getElementById('referralLink');
    referralInput.select();
    referralInput.setSelectionRange(0, 99999); // For mobile compatibility
    navigator.clipboard.writeText(referralInput.value)
        .then(() => alert('Referral link copied to clipboard!'))
        .catch(() => alert('Failed to copy referral link.'));
}

if (document.getElementById('referralLink')) {
    generateReferralLink();
}

function getReferralCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('referral');
}

const urlReferralCode = getReferralCodeFromURL();
if (urlReferralCode) {
    document.getElementById('referralCode').value = urlReferralCode;
}

// ---------------------------
// Admin Login and Logout
// ---------------------------
function adminLogin() {
    const adminUsername = document.getElementById('adminUsername').value.trim();
    const adminPassword = document.getElementById('adminPassword').value.trim();
    const adminData = JSON.parse(localStorage.getItem('admin'));

    if (adminData && adminData.username === adminUsername && adminData.password === btoa(adminPassword)) {
        localStorage.setItem('loggedInAdmin', adminUsername);
        alert('Admin login successful! Redirecting to admin dashboard.');
        window.location.href = "admin.html";
    } else {
        alert('Invalid admin username or password.');
    }
}

function adminLogout() {
    localStorage.removeItem('loggedInAdmin');
    alert('Admin logged out successfully.');
    window.location.href = "admin-login.html";
}

function deleteAccount() {
    const user = checkSession();
    const users = getUsers();
    const balances = getBalances();

    if (confirm(`Are you sure you want to delete your account ${user}?`)) {
        delete users[user];
        delete balances[user];
        saveUsers(users);
        saveBalances(balances);
        localStorage.removeItem('loggedInUser');
        alert('Account deleted successfully.');
        window.location.href = "index.html";
    }
}

if (document.getElementById('deleteAccountBtn')) {
    document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
}


    // Delete User
    function deleteUser(username) {
        if (confirm(`Are you sure you want to delete the account for ${username}? This action is irreversible.`)) {
          const users = JSON.parse(localStorage.getItem('users')) || {};
          const balances = JSON.parse(localStorage.getItem('balances')) || {};
          delete users[username];
          delete balances[username];
  
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('balances', JSON.stringify(balances));
          alert(`${username} has been deleted.`);
          fetchUsers(); // Refresh table
        }
      }


       // Display Welcome Message
    function displayWelcomeMessage() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (loggedInUser) {
          welcomeMessage.textContent = `Hello, ${loggedInUser}! Welcome to your dashboard.`;
        } else {
          welcomeMessage.textContent = `Hello, User!`;
        }
      }